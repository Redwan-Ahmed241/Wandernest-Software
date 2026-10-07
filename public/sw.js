// Retires the old app's service worker: browsers that installed it fetch this
// file on their next visit, which clears its caches and unregisters it.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const c of clients) c.navigate(c.url);
    })(),
  );
});
