// Keeps a copy of the deals page on the phone so it opens with a weak or no signal.
const C='deals-20261019170011';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','items.json']).catch(()=>{})))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const page=r.mode==='navigate'||r.url.endsWith('/')||r.url.endsWith('.html')||r.url.endsWith('items.json');
 if(page){e.respondWith(new Promise(res=>{let done=false;const t=setTimeout(()=>caches.match(r).then(m=>{if(m&&!done){done=true;res(m)}}),4000);
  fetch(r).then(n=>{caches.open(C).then(c=>c.put(r,n.clone()));if(!done){done=true;clearTimeout(t);res(n)}})
  .catch(()=>caches.match(r).then(m=>{if(!done){done=true;res(m||Response.error())}}))}));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(n=>{const k=n.clone();caches.open(C).then(c=>c.put(r,k));return n})))});
