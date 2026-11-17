import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const serviceWorkerSource = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');

describe('service worker registration navigation', () => {
  it('fetches /register without writing it to the offline shell cache', async () => {
    const listeners = {};
    const cache = { put: vi.fn(), addAll: vi.fn() };
    const fetch = vi.fn(async () => ({ ok: true, type: 'basic' }));
    const open = vi.fn(async () => cache);
    runInNewContext(serviceWorkerSource, {
      self: {
        location: { origin: 'https://store.test' },
        addEventListener: (type, listener) => { listeners[type] = listener; },
      },
      caches: { open, match: vi.fn(async () => null) },
      fetch,
      URL,
    });

    const event = {
      request: { method: 'GET', mode: 'navigate', url: 'https://store.test/register?email=test@example.com' },
      respondWith: promise => { event.response = promise; },
    };
    listeners.fetch(event);
    await event.response;

    expect(fetch).toHaveBeenCalledWith(event.request, { cache: 'no-store' });
    expect(open).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });

  it('clears only Bhumivera-owned offline caches on request', async () => {
    const listeners = {};
    const deleted = [];
    const postMessage = vi.fn();
    runInNewContext(serviceWorkerSource, {
      self: {
        location: { origin: 'https://store.test' },
        addEventListener: (type, listener) => { listeners[type] = listener; },
      },
      caches: {
        open: vi.fn(),
        match: vi.fn(),
        keys: vi.fn(async () => ['bhumivera-offline-shell-v8', 'other-app-cache']),
        delete: vi.fn(async name => {
          deleted.push(name);
          return true;
        }),
      },
      fetch: vi.fn(),
      URL,
    });

    const event = {
      data: { type: 'CLEAR_APP_CACHE' },
      ports: [{ postMessage }],
      waitUntil: promise => { event.result = promise; },
    };
    listeners.message(event);
    await event.result;

    expect(deleted).toEqual(['bhumivera-offline-shell-v8']);
    expect(postMessage).toHaveBeenCalledWith({
      type: 'APP_CACHE_CLEARED',
      deletedCacheCount: 1,
    });
  });
});
