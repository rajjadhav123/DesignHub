const BUILD_ID = "crug1cENrfs3Jq7ZPKwBi";
const STATIC_CACHE = "designhub-static-" + BUILD_ID;
const RUNTIME_CACHE = "designhub-runtime-" + BUILD_ID;
const PRECACHE_URLS = [
  "/",
  "/_next/static/chunks/00jxodp6y70ef.js",
  "/_next/static/chunks/00y1nik91hmkl.js",
  "/_next/static/chunks/043o8z81rpqfy.js",
  "/_next/static/chunks/07v6fz58k-txe.js",
  "/_next/static/chunks/09ur8lkom0kej.js",
  "/_next/static/chunks/0_axttrxjgya2.js",
  "/_next/static/chunks/0aq1b_17yg8rr.js",
  "/_next/static/chunks/0cc0o59_oyeum.js",
  "/_next/static/chunks/0ce0mroeuytfc.js",
  "/_next/static/chunks/0cz1d0mv5g_q7.js",
  "/_next/static/chunks/0h6gizwji15nj.js",
  "/_next/static/chunks/0ijil50mq-zmp.js",
  "/_next/static/chunks/0iqh29_hcro5b.js",
  "/_next/static/chunks/0jvb720jyoyed.js",
  "/_next/static/chunks/0mxv_yhrcy20r.js",
  "/_next/static/chunks/0nukrs9-tl5jx.js",
  "/_next/static/chunks/0p3cz_78kr-ov.js",
  "/_next/static/chunks/0pdvndw3ysobn.js",
  "/_next/static/chunks/0qch5xju7l6_0.js",
  "/_next/static/chunks/0qecnf4n12abu.js",
  "/_next/static/chunks/0rt4ftckn8h9p.js",
  "/_next/static/chunks/0tkxo4pm_yzqv.js",
  "/_next/static/chunks/0ud58g7pneuaw.js",
  "/_next/static/chunks/0usdfz8ei-cpd.js",
  "/_next/static/chunks/0uypo7ues1rdj.js",
  "/_next/static/chunks/0v_tkbf5dp7s7.js",
  "/_next/static/chunks/0y4gdpfz5_ew_.js",
  "/_next/static/chunks/11ljpwwixmixd.js",
  "/_next/static/chunks/12ibh-u1ewvul.js",
  "/_next/static/chunks/15av4bertc-w2.js",
  "/_next/static/chunks/17309-v4drc55.css",
  "/_next/static/chunks/17c30jif5aqch.js",
  "/_next/static/chunks/1ahaopame7d3i.js",
  "/_next/static/chunks/1dbax2ky-fzvb.js",
  "/_next/static/chunks/1douoe9lztlds.js",
  "/_next/static/chunks/1e22fjdy1iczv.js",
  "/_next/static/chunks/1g_1kn9jwg5bt.js",
  "/_next/static/chunks/1gtbf72fpvd9l.js",
  "/_next/static/chunks/1i3uavd_pwnft.js",
  "/_next/static/chunks/1s0ddbijkrusb.js",
  "/_next/static/chunks/1t-1e_pk_bi9z.js",
  "/_next/static/chunks/1ts249h1ifzy_.js",
  "/_next/static/chunks/1w7g3k-bq1zl8.js",
  "/_next/static/chunks/1wbunw_zkat8f.js",
  "/_next/static/chunks/1x25vgwghedx8.js",
  "/_next/static/chunks/1xpyfh0f-l9zd.js",
  "/_next/static/chunks/22n8y_k-kgnrh.js",
  "/_next/static/chunks/23rh-jpd3f5_4.js",
  "/_next/static/chunks/26k7se2iadb9g.js",
  "/_next/static/chunks/2_0z_werqrgn_.js",
  "/_next/static/chunks/2b-q4084bc002.js",
  "/_next/static/chunks/2cyac-r3397gt.js",
  "/_next/static/chunks/2d905jwa_i3ao.js",
  "/_next/static/chunks/2d9xp900lxxju.js",
  "/_next/static/chunks/2e8444xgd8lev.js",
  "/_next/static/chunks/2g_v5ae5b1kma.js",
  "/_next/static/chunks/2npf21rx9dzpz.js",
  "/_next/static/chunks/2nt1uhh33z5ct.js",
  "/_next/static/chunks/2olnza03feqx9.js",
  "/_next/static/chunks/2rsym_hdrsaoe.js",
  "/_next/static/chunks/2rz0rmequzx6e.js",
  "/_next/static/chunks/2sxxi9hskt06u.js",
  "/_next/static/chunks/2u392_6i93w8k.js",
  "/_next/static/chunks/2v56lodj1n2cc.js",
  "/_next/static/chunks/2vfavh709vqy5.js",
  "/_next/static/chunks/2vjwreui0n4pn.js",
  "/_next/static/chunks/2vu6wad38vmo2.js",
  "/_next/static/chunks/2wbqu8vbb6zwo.js",
  "/_next/static/chunks/2xuccpejcnjq9.js",
  "/_next/static/chunks/2ypo45laomafm.js",
  "/_next/static/chunks/2yycpk0sb52lh.js",
  "/_next/static/chunks/2z6gdymt9vs_r.js",
  "/_next/static/chunks/3-g7jmn5up3wd.js",
  "/_next/static/chunks/36pyozzf7u06v.js",
  "/_next/static/chunks/37wvkl8r10dqw.js",
  "/_next/static/chunks/38djrjywbd91d.js",
  "/_next/static/chunks/3_5lbbta_bqt8.js",
  "/_next/static/chunks/3b_y1ta0slg-m.js",
  "/_next/static/chunks/3cg-et-8t6ssm.js",
  "/_next/static/chunks/3e-rxjoo_y-ub.js",
  "/_next/static/chunks/3eru_m8itxqaq.js",
  "/_next/static/chunks/3f9hhp6tz5u21.js",
  "/_next/static/chunks/3k90f3neydiwe.js",
  "/_next/static/chunks/3lamjcabh9kn2.js",
  "/_next/static/chunks/3m-8et6rj50ud.js",
  "/_next/static/chunks/3mpc13dmvz6mg.js",
  "/_next/static/chunks/3rjydhu8hksmn.js",
  "/_next/static/chunks/3s1gwvoi1xc5t.js",
  "/_next/static/chunks/3shur83jf0me4.js",
  "/_next/static/chunks/3txlswyk-mwg2.js",
  "/_next/static/chunks/3uqtonb4aer_n.js",
  "/_next/static/chunks/3ux4cn6qg98br.js",
  "/_next/static/chunks/3vj_2iw40ug9r.js",
  "/_next/static/chunks/3vnvwsvg03g9b.js",
  "/_next/static/chunks/3w1hg2b9vtwo7.js",
  "/_next/static/chunks/3x5jioav4h-69.js",
  "/_next/static/chunks/3xulhi4281se-.js",
  "/_next/static/chunks/43suusgp8dqvj.js",
  "/_next/static/chunks/turbopack-2f80zoicn2in5.js",
  "/_next/static/crug1cENrfs3Jq7ZPKwBi/_buildManifest.js",
  "/_next/static/crug1cENrfs3Jq7ZPKwBi/_clientMiddlewareManifest.js",
  "/_next/static/crug1cENrfs3Jq7ZPKwBi/_ssgManifest.js",
  "/_next/static/media/0c89a48fa5027cee-s.p.2cyn07wtgehh0.woff2",
  "/_next/static/media/1bffadaabf893a1e-s.3-6t-g6q0vh0a.woff2",
  "/_next/static/media/28868e710e86be81-s.2eksvhm1z0jwa.woff2",
  "/_next/static/media/2bbe8d2671613f1f-s.0k62hbripvv8p.woff2",
  "/_next/static/media/2c55a0e60120577a-s.0-dom-5bn10r2.woff2",
  "/_next/static/media/32687112bd2dd8db-s.1gepa_7fcx9fm.woff2",
  "/_next/static/media/5476f68d60460930-s.2uwcyprjm3xu3.woff2",
  "/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2",
  "/_next/static/media/9c72aa0f40e4eef8-s.1y4-pdgsjb-pw.woff2",
  "/_next/static/media/ad66f9afd8947f86-s.3lvt2whj97whp.woff2",
  "/_next/static/media/icon.2c8dh05s9jkf8.svg",
  "/accessibility",
  "/backgrounds",
  "/brand",
  "/brand-dna",
  "/colors",
  "/effects",
  "/export",
  "/guidelines",
  "/icon-192.png",
  "/icon-512.png",
  "/icon.svg",
  "/icons",
  "/logo",
  "/manifest.webmanifest",
  "/mockups",
  "/og.png",
  "/projects",
  "/robots.txt",
  "/sitemap.xml",
  "/social",
  "/svg",
  "/typography",
];
const ICONIFY_HOSTS = new Set(["api.iconify.design", "api.simplesvg.com", "api.unisvg.com"]);
const isCacheable = (response) => response.ok || response.type === "opaque";

async function put(cacheName, request, response) {
  if (!isCacheable(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await put(RUNTIME_CACHE, request, response);
  return response;
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => put(RUNTIME_CACHE, request, response).then(() => response))
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    await put(RUNTIME_CACHE, request, response);
    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true })) || Response.error();
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "reload" });
            if (response.ok) await cache.put(url, response);
          } catch {}
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("designhub-") && key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.hostname === "fonts.googleapis.com") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (url.hostname === "fonts.gstatic.com") {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (ICONIFY_HOSTS.has(url.hostname)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || PRECACHE_URLS.includes(url.pathname))
    event.respondWith(cacheFirst(request));
});
