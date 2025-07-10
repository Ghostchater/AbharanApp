const CACHE_NAME = "abharan-gallery-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/gallery.html",
  "/editor.html",
  "/login.html",
  "/manifest.json",
  "/css/style.css",
  "/js/index.js",
  "/js/gallery.js",
  "/js/editor.js",
  "/js/idb.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
