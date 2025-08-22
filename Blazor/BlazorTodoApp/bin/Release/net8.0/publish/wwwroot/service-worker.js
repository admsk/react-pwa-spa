// Nome do cache
const CACHE_NAME = 'my-pwa-cache-v1';

// Recursos para armazenar em cache
const urlsToCache = [
  '/',
];

// Instala o Service Worker e armazena recursos no cache
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cache criado!');
      return cache.addAll(urlsToCache);
    })
  );
});

// Gerencia requisições de rede, usando o cache primeiro
self.addEventListener('fetch', (event) => {
  console.log(`[Service Worker] Buscando recurso: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Atualiza o cache quando necessário
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Removendo cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
