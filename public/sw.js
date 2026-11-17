const CACHE_VERSION = "stationbike-v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png"
];

// Instalación: precarga de recursos base
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

// Activación: limpieza de cachés antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Intercepción de peticiones (Fetch)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo interceptar peticiones HTTP/HTTPS (ignorar esquemas como chrome-extension)
  if (!request.url.startsWith("http")) return;

  // 1. Manejo de peticiones a la API
  if (request.url.includes("/api/")) {
    if (request.method === "GET") {
      // Estrategia Network-first con fallback a caché para consultas GET
      event.respondWith(
        fetch(request)
          .then((res) => {
            if (res && res.status === 200) {
              const clone = res.clone();
              caches.open(API_CACHE).then((cache) => cache.put(request, clone));
            }
            return res;
          })
          .catch(() => caches.match(request))
      );
    } else {
      // Las mutaciones (POST, PUT, DELETE) siempre van a red
      event.respondWith(fetch(request));
    }
    return;
  }

  // 2. Manejo de recursos estáticos y navegación de la interfaz
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Si el recurso se obtuvo exitosamente, guardarlo en caché estática dinámica
          if (
            response &&
            response.status === 200 &&
            request.method === "GET" &&
            response.type === "basic"
          ) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Si falla la red y es una navegación HTML, mostrar página offline
          if (request.mode === "navigate") {
            const offlinePage = await caches.match(OFFLINE_URL);
            if (offlinePage) return offlinePage;
          }
          return new Response("Recurso no disponible sin conexión", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        });
    })
  );
});
