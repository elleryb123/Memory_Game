// Service Worker for Memory Game PWA
const CACHE_NAME = 'memory-game-v2';
const urlsToCache = [
  '/Memory_Game/',
  '/Memory_Game/index.html',
  '/Memory_Game/script.js',
  '/Memory_Game/style.css',
  '/Memory_Game/manifest.json',
  '/Memory_Game/Images/Abra.png',
  '/Memory_Game/Images/bulbasaur.png',
  '/Memory_Game/Images/Caterpie.png',
  '/Memory_Game/Images/Charizard.png',
  '/Memory_Game/Images/Charmander.png',
  '/Memory_Game/Images/Flareon.png',
  '/Memory_Game/Images/Ivysaur.png',
  '/Memory_Game/Images/Jolteon.png',
  '/Memory_Game/Images/Lugia.png',
  '/Memory_Game/Images/Marill.png',
  '/Memory_Game/Images/Mew.png',
  '/Memory_Game/Images/Squirtle.png',
  '/Memory_Game/Images/Tepig.png',
  '/Memory_Game/Images/Totodile.png',
  '/Memory_Game/Images/Typhlosion.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache error:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(() => {
        // Return a offline message if needed
        console.log('Fetch failed; returning offline page');
      })
  );
});
