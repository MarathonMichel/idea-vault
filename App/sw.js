const CACHE = 'idea-vault-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never cache GitHub API calls — those must always hit the network.
  if (url.hostname === 'api.github.com') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (e.request.method === 'GET' && res.ok) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
