// Kill-switch Service Worker
// This SW immediately takes control, clears ALL caches, and unregisters itself.
// Any browser with the old caching SW will pick this up on its next update check
// (within 24 hours or on next navigation), fixing the stale cache problem permanently.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.registration.unregister())
  );
});
