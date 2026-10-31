/* Service worker สำหรับ "เบิกของออกหน่วย" (PWA) — cache app shell */
const VERSION = 'v1';
const CACHE = 'supply-bb-' + VERSION;
const SHELL = ['./', './index.html', './manifest.json', './garuda.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(SHELL).catch(function () {});
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); }); return res;
    }).catch(function () { return caches.match('./index.html').then(function (r) { return r || caches.match('./'); }); }));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return cached; });
      return cached || net;
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function (cached) {
    return cached || fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res;
    }).catch(function () { return cached; });
  }));
});
