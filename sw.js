// Offline-Unterstützung: App-Dateien zwischenspeichern. Bei Änderungen VERSION erhöhen.
const VERSION = "moosi-1";
const FILES = ["./", "index.html", "style.css", "app.js", "config.js", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "impressum.html", "datenschutz.html"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // Gumroad nie cachen
  // Netz zuerst, damit Updates sofort ankommen; offline aus dem Speicher
  e.respondWith(fetch(e.request).then((r) => {
    const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
});
