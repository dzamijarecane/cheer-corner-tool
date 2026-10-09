// Offline cache, loaded by OneSignalSDKWorker.js (the registered service worker).
// Lets the site be installed as an app and keep working offline.
// Pages are fetched fresh from the network when online (so updates show up right away)
// and served from the cache when offline. Built files under assets/ never change
// (their names carry a hash), so they are served from the cache first.
const CACHE = "recane-v2";
const scope = self.registration.scope;
const PRECACHE = ["./", "prayer-times/", "site.webmanifest", "icon-192.png", "favicon.svg"].map((p) => new URL(p, scope).href);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// A copy of a response that is not marked as redirected (Safari refuses to show a
// redirected response for a page load, e.g. /events -> /events/).
async function unredirected(response) {
  if (!response.redirected) return response;
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    // Always ask the server whether the page changed. Otherwise a page kept in the browser's
    // HTTP cache (up to 10 minutes on GitHub Pages) can outlive a new deploy and point at
    // script files that no longer exist, which shows "Stranica se nije učitala".
    const response = await unredirected(await fetch(request.url, { cache: "no-cache", credentials: "same-origin" }));
    if (response.ok) cache.put(request.url, response.clone());
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) || (await cache.match(new URL("./", scope).href)) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  return cached || fresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") event.respondWith(networkFirst(request));
  else if (url.pathname.includes("/assets/")) event.respondWith(cacheFirst(request));
  else event.respondWith(staleWhileRevalidate(request));
});
