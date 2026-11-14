/*
  Svuotafrigo — funzionamento offline (licenza MIT).
  Tiene una copia dell'app sul telefono. Quando c'è rete prende sempre la versione
  più recente; senza rete usa la copia. Le richieste a Google non vengono mai salvate.
  Per forzare l'aggiornamento della copia basta cambiare il numero in CACHE.
*/
const CACHE = "svuotafrigo-v1";
const SHELL = ["./", "./index.html", "./icon.png", "./icon-512.png", "./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Prima la rete (massimo 4 secondi), poi la copia salvata. */
async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error("lenta")), 4000))
    ]);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") return cache.match("./index.html");
    throw err;
  }
}

/* Caratteri tipografici: la copia salvata subito, aggiornata in sottofondo. */
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const fresh = fetch(req).then((res) => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await fresh) || Response.error();
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname === "generativelanguage.googleapis.com") return;   // mai in copia
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") { e.respondWith(staleWhileRevalidate(req)); return; }
  if (url.origin === self.location.origin) e.respondWith(networkFirst(req));
});
