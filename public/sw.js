const CACHE = 'math-practice-v1';
const APP_SHELL = ['/', '/settings', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const putInCache = async (request, response) => {
  if (response.ok && response.type === 'basic') {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  return cached ?? putInCache(request, await fetch(request));
};

const networkFirst = async (request, isNavigation) => {
  try {
    return await putInCache(isNavigation ? new URL(request.url).pathname : request, await fetch(request));
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: isNavigation });
    if (cached) return cached;
    if (isNavigation) {
      const shell = await caches.match('/');
      if (shell) return shell;
    }
    throw error;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || request.headers.has('RSC')) return;

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request, request.mode === 'navigate'));
});
