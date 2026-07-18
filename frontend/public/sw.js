const STATIC_CACHE_NAME = "olofintel-static-v1";
const API_CACHE_NAME = "olofintel-api-v1";
const QUEUE_CACHE_NAME = "olofintel-queue-v1";

const INITIAL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// Install: Cache initial assets shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches and start dynamic operations
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE_NAME, API_CACHE_NAME, QUEUE_CACHE_NAME].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
  
  // Trigger background sync on startup
  e.waitUntil(syncPendingSubmissions());
});

// Background sync function: reads the offline queue and posts submissions when online
async function syncPendingSubmissions() {
  try {
    const queueCache = await caches.open(QUEUE_CACHE_NAME);
    const requests = await queueCache.keys();
    
    if (requests.length === 0) return;

    console.log(`[SW] Sincronização em segundo plano: A tentar enviar ${requests.length} submissões pendentes...`);

    for (const request of requests) {
      try {
        const cachedResponse = await queueCache.match(request);
        if (!cachedResponse) continue;

        const payload = await cachedResponse.json();

        // Send payload to real backend API
        const response = await fetch("/api/survey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success) {
            // Successfully submitted! Remove from the queue cache
            await queueCache.delete(request);
            console.log(`[SW] Submissão offline enviada e sincronizada com sucesso para: ${payload.organizationName || 'Sem Nome'}`);
          }
        }
      } catch (err) {
        console.error("[SW] Falha ao tentar sincronizar item, rede indisponível ainda:", err);
        // Stop processing further if network is still down
        break;
      }
    }
  } catch (err) {
    console.error("[SW] Erro na sincronização em segundo plano:", err);
  }
}

// Fetch Listener
self.addEventListener("fetch", (e) => {
  const requestUrl = new URL(e.request.url);

  // Skip chrome-extension or other non-http/https schemes
  if (!e.request.url.startsWith("http")) return;

  // Whenever a successful GET request goes through, trigger a sync run for background items
  if (e.request.method === "GET") {
    // If it's a GET to an API route (e.g. /api/survey/stats)
    if (requestUrl.pathname.includes("/api/")) {
      e.respondWith(
        fetch(e.request)
          .then((res) => {
            if (res.status === 200) {
              const resClone = res.clone();
              caches.open(API_CACHE_NAME).then((cache) => {
                cache.put(e.request, resClone);
              });
              // Fire sync asynchronously as we know we have internet!
              e.waitUntil(syncPendingSubmissions());
            }
            return res;
          })
          .catch(async () => {
            // Offline fallback for APIs
            console.log(`[SW] Servindo resposta offline em cache para API: ${requestUrl.pathname}`);
            const cachedRes = await caches.match(e.request);
            if (cachedRes) {
              return cachedRes;
            }
            // If no cache, return offline JSON
            return new Response(
              JSON.stringify({
                success: false,
                message: "Modo offline ativo. Não foi possível contactar o servidor OLO Fintel.",
                offline: true
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          })
      );
      return;
    }

    // It's a static asset (HTML, JS, CSS, images, fonts)
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        // Return from cache immediately if present, but also fetch and update cache in background
        const fetchPromise = fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(e.request, resClone);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn(`[SW] Falha ao carregar recurso estático da rede, usando cache para: ${requestUrl.pathname}`, err);
          });

        return cachedResponse || fetchPromise || caches.match("/");
      })
    );
    return;
  }

  // Handle POST requests - specifically /api/survey offline submission
  if (e.request.method === "POST" && requestUrl.pathname.endsWith("/api/survey")) {
    e.respondWith(
      fetch(e.request.clone())
        .then((res) => {
          // If response was ok, trigger sync of other items
          if (res.ok) {
            e.waitUntil(syncPendingSubmissions());
          }
          return res;
        })
        .catch(async () => {
          console.log("[SW] Utilizador offline detetado na submissão de questionário. A enfileirar dados...");

          try {
            // Read body payload from cloned request
            const bodyText = await e.request.clone().text();
            const payload = JSON.parse(bodyText);

            // Save payload in the queue cache using a synthetic GET URL
            const queueCache = await caches.open(QUEUE_CACHE_NAME);
            const syntheticUrl = `/offline-pending-survey/${Date.now()}`;
            await queueCache.put(
              new Request(syntheticUrl),
              new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json" } })
            );

            // Update stats programmatically in cache so the UI updates IMMEDIATELY offline!
            const apiCache = await caches.open(API_CACHE_NAME);
            const statsRequests = await apiCache.keys();
            // Find stats request
            const statsRequest = statsRequests.find(r => r.url.includes("/api/survey/stats"));
            
            let simulatedStats = {
              totalCount: 65,
              totalAverageRating: 4.88,
              sectorDistribution: { Agriculture: 25, Livestock: 15, Fisheries: 10, Commerce: 15 },
              provinceDistribution: { Huambo: 15, Luanda: 20, Benguela: 10, Huíla: 10, Outras: 10 },
              biggestChallenges: { Financing: 30, Inventory: 10, Clientes: 15, Production: 5, Reporting: 5 },
              recentResponses: []
            };

            if (statsRequest) {
              const cachedStatsRes = await apiCache.match(statsRequest);
              if (cachedStatsRes) {
                try {
                  const oldStats = await cachedStatsRes.json();
                  // Simulate addition of new survey response
                  const newCount = (oldStats.totalCount || 64) + 1;
                  const newSectDist = { ...(oldStats.sectorDistribution || {}) };
                  const sect = payload.sector || "Agriculture";
                  newSectDist[sect] = (newSectDist[sect] || 0) + 1;

                  const newProvDist = { ...(oldStats.provinceDistribution || {}) };
                  const prov = payload.province || "Luanda";
                  newProvDist[prov] = (newProvDist[prov] || 0) + 1;

                  const newChalDist = { ...(oldStats.biggestChallenges || {}) };
                  const chal = payload.biggestChallenge || "Financing";
                  newChalDist[chal] = (newChalDist[chal] || 0) + 1;

                  simulatedStats = {
                    ...oldStats,
                    totalCount: newCount,
                    sectorDistribution: newSectDist,
                    provinceDistribution: newProvDist,
                    biggestChallenges: newChalDist,
                    recentResponses: [
                      {
                        id: `offline-${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        persona: payload.persona || "Presidente de Cooperativa",
                        sector: sect,
                        province: prov,
                        biggestChallenge: chal,
                        organizationName: payload.organizationName || "PME/Cooperativa Local"
                      },
                      ...(oldStats.recentResponses || []).slice(0, 9)
                    ]
                  };

                  // Write the simulated stats back to API Cache
                  await apiCache.put(
                    statsRequest,
                    new Response(JSON.stringify(simulatedStats), { headers: { "Content-Type": "application/json" } })
                  );
                } catch (e) {
                  console.error("Falha ao simular actualização dos dados estatísticos", e);
                }
              }
            }

            // Return simulated success JSON to let the client proceed to the success state
            return new Response(
              JSON.stringify({
                success: true,
                offlineSaved: true,
                message: "Submissão guardada em cache de contingência! Será sincronizada automaticamente logo que tiver ligação à Internet.",
                data: simulatedStats
              }),
              { headers: { "Content-Type": "application/json" } }
            );

          } catch (err) {
            console.error("Erro ao processar contingência offline:", err);
            return new Response(
              JSON.stringify({
                success: false,
                message: "Falha na Contingência Offline do Service Worker."
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          }
        })
    );
  }
});
