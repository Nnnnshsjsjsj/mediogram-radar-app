// Mediogram Lead Radar service worker.
// Strategy: always try the network for the feed JSON and for navigations so the
// app never shows stale leads; fall back to cache only when offline. Hashed
// build assets (js/css/fonts) are cache-first since their URLs change on deploy.
const CACHE = 'radar-v2'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  const isFeed = url.pathname.endsWith('/latest.json') || url.pathname.endsWith('/stats.json')
  const isNavigation = request.mode === 'navigate'

  if (isFeed || isNavigation) {
    // network-first
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(request, copy))
          return res
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./')))
    )
    return
  }

  // cache-first for everything else (assets, icons, fonts)
  event.respondWith(
    caches.match(request).then((cached) =>
      cached ||
      fetch(request).then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(request, copy))
        return res
      })
    )
  )
})
