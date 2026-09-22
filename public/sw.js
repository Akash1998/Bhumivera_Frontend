const CACHE_NAME = 'bhumivera-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.webp',
  '/favicon.ico'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor with absolute safety
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Absolute Filter Bypass: Administrative components, notifications, dashboard views, and backend APIs pass through directly
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/dashboard') ||
    url.pathname.includes('/notifications') ||
    event.request.method !== 'GET'
  ) {
    return; // Relinquish control back to browser's native network engine
  }

  // 2. Resilient Network-First cache strategy with graceful offline fallbacks
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic' &&
          !url.pathname.startsWith('/admin') &&
          !url.pathname.startsWith('/api')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If navigation elements fail when offline, default to index.html for client-side routing
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          // Fall back gracefully to an empty response object without throwing uncaught rejections
          return new Response('Network connection offline', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});
