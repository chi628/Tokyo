// 離線快取：手冊本身、圖示，以及 Firebase 程式庫
const VERSION = 'tokyo-v1';
const FB = 'https://cdn.jsdelivr.net/npm/firebase@10.14.1/';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  FB + 'firebase-app-compat.js',
  FB + 'firebase-firestore-compat.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(new Request(u, { mode: u.startsWith('http') ? 'cors' : 'same-origin' })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 手冊頁面：先拿最新版，沒網路時用快取
  if (req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('/index.html'))) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // 同網站的圖示等、Firebase 程式庫：先用快取
  if (url.origin === location.origin || req.url.startsWith(FB)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
  // 其他（Firestore 連線、Google Maps）照常走網路
});
