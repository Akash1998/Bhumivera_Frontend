const CACHE_PREFIX = 'bhumivera-offline-';
const CACHE_NAME = `${CACHE_PREFIX}shell-v6`;
const SHELL_URLS = ['/', '/index.html', '/manifest.json', '/logo.webp', '/favicon.ico', '/icon-192.png', '/icon-512.png', '/icon-maskable-512.png'];
const PRIVATE_PATHS = ['/api', '/admin', '/warehouse', '/warehouseadmin', '/admin-login'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    PRIVATE_PATHS.some(path => url.pathname === path || url.pathname.startsWith(`${path}/`))
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok && response.type === 'basic') {
          return caches.open(CACHE_NAME)
            .then(cache => cache.put('/index.html', response.clone()))
            .catch(error => console.error('[OFFLINE_SHELL_CACHE_WRITE_ERROR]', error))
            .then(() => response);
        }
        return response;
      }).catch(async () => {
        const cachedShell = await caches.match('/index.html');
        return cachedShell || new Response('Bhumivera is unavailable offline. Reconnect and try again.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })
    );
    return;
  }

  const isStaticAsset = url.pathname.startsWith('/assets/') ||
    SHELL_URLS.includes(url.pathname);
  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && response.type === 'basic') {
          return caches.open(CACHE_NAME)
            .then(cache => cache.put(request, response.clone()))
            .catch(error => console.error('[OFFLINE_ASSET_CACHE_WRITE_ERROR]', error))
            .then(() => response);
        }
        return response;
      });
    })
  );
});
