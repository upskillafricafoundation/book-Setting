/* Book Typesetter service worker: offline use after the first visit.
   Bump V whenever you release a new version so old caches are cleared. */
const V="booktype-v1",CORE=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 const ext=/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(u.host);
 if(u.origin!==location.origin&&!ext)return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put("./index.html",c))}return x}).catch(()=>caches.match("./index.html")));return}
 e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(x=>{if(x.ok||x.type==="opaque")c.put(r,x.clone());return x}).catch(()=>hit);return hit||net})))});
