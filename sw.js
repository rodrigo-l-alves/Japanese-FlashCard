// App shell cache. v17 switches card ids from positional to content-based
// (data.js) and adds the matching one-time migration step (app.js).
//
// IMPORTANT: this ASSETS list is the service worker's own copy of every
// versioned <script>/<link> src in index.html. The two must always match
// exactly (same files, same "?v=" query strings) -- if they drift, this
// worker can go on serving a stale, differently-ordered data.js after
// index.html has already moved on to a newer one, which is exactly what
// caused ids (and saved progress) to scramble before. When you bump a
// version query string in index.html, bump it here too, in the same edit.
var CACHE_NAME = "n5-flashcards-v17";
var ASSETS = [
  "./", "./index.html", "./css/style.css?v=17", "./js/kanji-info.js?v=16", "./js/data.js?v=19", "./js/storage.js",
  "./js/srs.js", "./js/audio.js", "./js/romanji.js", "./js/writing.js?v=16", "./js/app.js?v=19",
  "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  var isAppCode = event.request.mode === "navigate" || /\.(?:js|css|html)$/.test(url.pathname);
  if (isAppCode) {
    event.respondWith(fetch(event.request).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      return response;
    }).catch(function () { return caches.match(event.request); }));
    return;
  }
  event.respondWith(caches.match(event.request).then(function (cached) {
    return cached || fetch(event.request).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      return response;
    });
  }));
});