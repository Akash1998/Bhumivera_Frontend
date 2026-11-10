const SILENT_URL = /^\/(support\/chat|notifications|recommendations|analytics|logs)(\/|$)/;

const pending = new Map();
const listeners = new Set();
let snapshot = { total: 0, mutations: 0, oldestMs: 0, label: '' };
let nextId = 1;
let ticker = null;

const compute = () => {
  const now = Date.now();
  let total = 0;
  let mutations = 0;
  let oldest = 0;
  let label = '';
  for (const [id, entry] of pending) {
    if (now - entry.startedAt > 90000) {
      pending.delete(id);
      continue;
    }
    total += 1;
    const age = now - entry.startedAt;
    if (entry.mutation) {
      mutations += 1;
      label = entry.label || label;
    }
    if (age > oldest) oldest = age;
  }
  const next = { total, mutations, oldestMs: Math.floor(oldest / 250) * 250, label };
  if (
    next.total !== snapshot.total ||
    next.mutations !== snapshot.mutations ||
    next.oldestMs !== snapshot.oldestMs ||
    next.label !== snapshot.label
  ) {
    snapshot = next;
    listeners.forEach(listener => listener());
  }
};

const syncTicker = () => {
  if (pending.size && !ticker) ticker = setInterval(compute, 250);
  if (!pending.size && ticker) {
    clearInterval(ticker);
    ticker = null;
  }
};

export const isTrackedRequest = config => {
  if (!config || config.silent === true) return false;
  return !SILENT_URL.test(String(config.url || ''));
};

export const beginRequest = (config, mutation, label) => {
  if (!isTrackedRequest(config) || config.__activityId) return;
  config.__activityId = nextId++;
  pending.set(config.__activityId, { startedAt: Date.now(), mutation, label });
  syncTicker();
  compute();
};

export const endRequest = config => {
  if (!config?.__activityId) return;
  pending.delete(config.__activityId);
  config.__activityId = 0;
  syncTicker();
  compute();
};

export const subscribeActivity = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getActivitySnapshot = () => snapshot;
