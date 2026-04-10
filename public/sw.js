// Self-uninstalling service worker.
// The old SW cached API responses (including errors), served stale
// security data, and crashed installs. This stub replaces it, clears
// all caches, and unregisters itself on the next page load.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((n) => caches.delete(n))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  )
})
