import axios from 'axios';

// System-wide in-flight request deduplication. Identical requests issued while one is already
// running (double clicks, several components, impatient retries on a laggy network) share one network call.
// Each caller still gets its own response/config, so interceptors and loaders behave per caller.

const MUTATING = new Set(['post', 'put', 'patch', 'delete']);
const IDEMPOTENCY_HEADER = 'X-Idempotency-Key';
const inFlight = new Map();

const stableStringify = value => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) return value.toString();
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value).sort().map(k => `${k}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return String(value);
};

const isPlainBody = body => body == null || typeof body === 'string' ||
  Array.isArray(body) || Object.getPrototypeOf(body) === Object.prototype;

const hash = text => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

const getHeader = (config, name) => {
  const headers = config.headers;
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get(name) || '';
  return headers[name] || headers[name.toLowerCase()] || '';
};

export const buildRequestKey = config => {
  const method = String(config.method || 'get').toLowerCase();
  if (config.dedupe === false || config.signal || config.cancelToken) return null;
  if (config.responseType === 'stream' || config.onUploadProgress || config.onDownloadProgress) return null;
  if (!isPlainBody(config.data)) return null;
  try {
    return [
      method,
      `${config.baseURL || ''}${config.url || ''}`,
      stableStringify(config.params),
      stableStringify(config.data),
      getHeader(config, 'Authorization'),
      config.responseType || '',
    ].join('|');
  } catch {
    return null;
  }
};

const cloneError = (error, config) => {
  if (!error || typeof error !== 'object') return error;
  const copy = Object.assign(Object.create(Object.getPrototypeOf(error)), error);
  copy.config = config;
  return copy;
};

export const dedupeRequestConfig = (config, instance) => {
  const method = String(config.method || 'get').toLowerCase();
  const key = config.dedupeKey || buildRequestKey(config);
  if (!key || config.allowDuplicate === true || config.__dedupeApplied) return config;
  config.__dedupeApplied = true;

  if (MUTATING.has(method)) {
    config.headers = config.headers || {};
    const stamp = hash(key);
    if (typeof config.headers.set === 'function') config.headers.set(IDEMPOTENCY_HEADER, stamp, false);
    else config.headers[IDEMPOTENCY_HEADER] = stamp;
  }

  const leader = inFlight.get(key);
  if (leader) {
    config.adapter = cfg => leader.shared.then(
      response => ({ ...response, config: cfg }),
      error => Promise.reject(cloneError(error, cfg)),
    );
    return config;
  }

  const baseAdapter = axios.getAdapter(config.adapter || instance.defaults.adapter || axios.defaults.adapter);
  // Registered now (not when the adapter runs) so requests issued in the same tick see the leader.
  let settle;
  const shared = new Promise((resolve, reject) => { settle = { resolve, reject }; });
  shared.catch(() => {});
  const entry = { shared };
  inFlight.set(key, entry);
  const release = () => {
    clearTimeout(guard);
    if (inFlight.get(key) === entry) inFlight.delete(key);
  };
  // If the leader never reaches the network (a later interceptor rejected it), don't leave followers hanging.
  const guard = setTimeout(() => {
    release();
    settle.reject(Object.assign(new Error('Request was not sent'), { code: 'ERR_DEDUPE_ABANDONED', config }));
  }, 120000);
  config.adapter = cfg => {
    // Followers receive the raw adapter result so each caller runs its own response transforms.
    const promise = Promise.resolve().then(() => baseAdapter(cfg));
    promise.then(
      response => { release(); settle.resolve({ ...response, config: undefined }); },
      error => { release(); settle.reject(error); },
    );
    return promise;
  };
  return config;
};

// For clients that attach their auth headers per call (no later interceptor needs to run first).
export const installRequestDedupe = instance => {
  instance.interceptors.request.use(config => dedupeRequestConfig(config, instance));
  return instance;
};

export const getInFlightRequestCount = () => inFlight.size;

const inFlightFetches = new Map();

// fetch() variant for the few raw fetch callers: identical in-flight POSTs share one network call.
export const dedupedFetch = (url, options = {}) => {
  const method = String(options.method || 'GET').toUpperCase();
  if (options.signal || (options.body != null && typeof options.body !== 'string')) return fetch(url, options);
  const key = `${method}|${url}|${options.body || ''}`;
  let entry = inFlightFetches.get(key);
  if (!entry) {
    const headers = { ...(options.headers || {}) };
    if (method !== 'GET' && method !== 'HEAD') headers[IDEMPOTENCY_HEADER] = hash(key);
    entry = fetch(url, { ...options, headers });
    inFlightFetches.set(key, entry);
    const release = () => inFlightFetches.delete(key);
    entry.then(release, release);
  }
  return entry.then(response => response.clone());
};
