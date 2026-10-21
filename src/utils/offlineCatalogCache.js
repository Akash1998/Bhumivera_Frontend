const DATABASE_NAME = 'bhumivera-offline-catalog';
const STORE_NAME = 'responses';
const MAX_ENTRIES = 20;
const MAX_RESPONSE_BYTES = 1024 * 1024;

const openDatabase = () => new Promise((resolve, reject) => {
  if (typeof indexedDB === 'undefined') {
    reject(new Error('IndexedDB is not available.'));
    return;
  }

  const request = indexedDB.open(DATABASE_NAME, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(STORE_NAME)) {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Could not open the offline catalog cache.'));
  request.onblocked = () => reject(new Error('The offline catalog cache is blocked by another tab.'));
});

export const getPublicCatalogCacheKey = config => {
  if (String(config?.method || 'get').toLowerCase() !== 'get' || config?.adminAuth) return null;

  const path = String(config.url || '').split('?')[0].replace(/^\/api(?=\/)/, '');
  if (!/^\/products\/active$/.test(path) &&
      !/^\/products\/slug\/[a-z0-9_-]+$/i.test(path) &&
      !/^\/products\/[a-z0-9_-]+$/i.test(path) &&
      !/^\/categories(?:\/[a-z0-9_-]+)?$/i.test(path)) {
    return null;
  }

  const params = new URLSearchParams();
  Object.entries(config.params || {}).sort(([left], [right]) => left.localeCompare(right)).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const isCacheablePublicCatalogResponse = (key, data) => {
  if (!key || !data || data.success === false) return false;
  if (key.startsWith('/products/active') || key.startsWith('/categories')) return true;

  const product = data.data || data.product || data;
  return Boolean(product && typeof product === 'object' && product.status === 'active');
};

export const savePublicCatalogResponse = async (key, data) => {
  if (!key) return;

  const serialized = JSON.stringify(data);
  if (new TextEncoder().encode(serialized).byteLength > MAX_RESPONSE_BYTES) {
    console.warn('[OFFLINE_CATALOG_CACHE] Skipped an oversized catalog response.');
    return;
  }

  const database = await openDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put({ key, data: JSON.parse(serialized), savedAt: Date.now() });

      const entriesRequest = store.getAll();
      entriesRequest.onsuccess = () => {
        const entries = entriesRequest.result.sort((left, right) => right.savedAt - left.savedAt);
        entries.slice(MAX_ENTRIES).forEach(entry => store.delete(entry.key));
      };
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error('Could not save the offline catalog response.'));
      transaction.onabort = () => reject(transaction.error || new Error('The offline catalog cache transaction was aborted.'));
    });
  } finally {
    database.close();
  }
};

export const readPublicCatalogResponse = async key => {
  if (!key) return null;

  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Could not read the offline catalog response.'));
      transaction.onabort = () => reject(transaction.error || new Error('The offline catalog read was aborted.'));
    });
  } finally {
    database.close();
  }
};
