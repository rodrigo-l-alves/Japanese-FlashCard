// App shell cache. v13 moves kanji used by N5 vocabulary from the N4 deck into the N5 deck.
var CACHE_NAME = "n5-flashcards-v13";
var ASSETS = [
  "./", "./index.html", "./css/style.css?v=13", "./js/data.js?v=13", "./js/storage.js",
  "./js/srs.js", "./js/audio.js", "./js/romanji.js", "./js/writing.js?v=13", "./js/app.js?v=13",
  "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"
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