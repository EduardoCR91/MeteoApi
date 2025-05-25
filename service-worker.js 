const CACHE_NAME = "meteoapi-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/styleInfo.css",
  "/js/app.js",
  "/js/busqueda.js",
  "/js/config.js",
  "/js/favoritos.js",
  "/js/filtrar.js",
  "/js/informacion.js",
  "/js/menu.js",
  "/js/navegacion.js",
  "/js/registro.js",
  "/js/weather.js",
  "/clima.jpg",
  "/storm.png",
  "/videos/despejado.mp4",
  "/videos/lluvia ligera.mp4",
  "/videos/lluvia.mp4",
  "/videos/niebla.mp4",
  "/videos/nieve.mp4",
  "/videos/nublado.mp4",
  "/videos/parcialmente nublado.mp4",
  "/videos/soleado.mp4"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});