// Service worker: existe para que Chrome / Samsung Internet consideren la web "instalable"
// (uno de sus requisitos es tener un SW con un manejador de "fetch"), y para que la app
// funcione también sin conexión una vez instalada.
//
// Estrategia "network-first": en cada petición intenta traer siempre la versión más
// reciente del servidor y actualiza la caché con ella; solo si no hay conexión (modo
// offline) recurre a la última copia guardada. Así los cambios se ven de inmediato sin
// tener que borrar el historial o la caché del navegador.
const CACHE_NAME = 'monitor-urgencias-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
