// Service worker minimo: mette in cache l'app la prima volta che viene aperta,
// così le volte successive parte anche senza connessione (offline-first, come
// richiesto dal documento di progetto). Va aggiornata la versione della cache
// (CACHE_NAME) ogni volta che pubblichi una nuova versione del gioco, altrimenti
// i giocatori continueranno a vedere quella vecchia salvata in cache.
const CACHE_NAME = 'piccolo-regno-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
