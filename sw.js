/* Projeto Aster - service worker: site instalavel e Biblia offline. Pagina: rede primeiro, cache de reserva. */
var V = 'aster-v1', BIB = 'aster-biblia-v1';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(['offline.html', 'biblia.html', 'js/biblia-local.js', 'data/biblia/index.json'].map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V && k !== BIB; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.indexOf('/data/biblia/') === 0 && !/index\.json$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then(function (hit) {
      return hit || fetch(r).then(function (resp) {
        if (resp.ok) { var c = resp.clone(); caches.open(BIB).then(function (ca) { ca.put(r, c); }); }
        return resp;
      });
    }));
    return;
  }
  e.respondWith(fetch(r).then(function (resp) {
    if (resp.ok) { var c = resp.clone(); caches.open(V).then(function (ca) { ca.put(r, c); }); }
    return resp;
  }).catch(function () {
    return caches.match(r).then(function (hit) {
      return hit || (r.mode === 'navigate' ? caches.match('offline.html') : Response.error());
    });
  }));
});
