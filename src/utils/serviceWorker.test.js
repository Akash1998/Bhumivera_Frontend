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
});
