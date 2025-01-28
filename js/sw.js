const CACHE_NAME = 'servicenow-experts-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/js/main.js',
  '/images/cool-background.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
}); 