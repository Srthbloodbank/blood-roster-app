/* Service worker สำหรับ "เวรแพทย์ออกหน่วย" (PWA)
   กลยุทธ์:
   - app shell (index.html, manifest, icons) precache ไว้
   - คำขอ navigate: network-first แล้ว fallback เป็น cache (ได้เวอร์ชันใหม่เสมอเมื่อออนไลน์ แต่ยังเปิดได้เมื่อออฟไลน์)
   - static same-origin: stale-while-revalidate
   - cross-origin (Google Fonts): cache-first
   หมายเหตุ: การเรียก backend ผ่าน google.script.run ไม่ผ่าน fetch จึงไม่ถูก SW แคช */
const VERSION = 'v1';
const CACHE = 'blood-roster-' + VERSION;
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon.ico'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(SHELL).catch(function () { /* ข้ามไฟล์ที่โหลดไม่ได้ */ });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // คำขอเปิดหน้า (navigation) -> network-first
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (r) { return r || caches.match('./'); });
      })
    );
    return;
  }

  // ทรัพยากรภายในโดเมนเดียวกัน -> stale-while-revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        var net = fetch(req).then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return cached; });
        return cached || net;
      })
    );
    return;
  }

  // cross-origin (เช่น Google Fonts) -> cache-first
  e.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return cached; });
    })
  );
});
