const C='otc-v1',A=['./','index.html','icon-192.png','icon-512.png'];
const db=()=>new Promise((r,j)=>{const q=indexedDB.open('otc',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)});
const get=async k=>{try{const d=await db();return await new Promise(r=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})}catch(e){return null}};
async function man(){
 const b=await get('iconPng'),v=b?'?v='+(await get('iconV')):'';
 const icons=b?[{src:'icon-custom.png'+v,sizes:'512x512',type:'image/png',purpose:'any'},{src:'icon-custom.png'+v,sizes:'512x512',type:'image/png',purpose:'maskable'}]
 :[{src:'icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}];
 return new Response(JSON.stringify({name:'OTC Terminal',short_name:'OTC Terminal',start_url:'./',scope:'./',display:'standalone',background_color:'#050b1f',theme_color:'#050b1f',icons}),{headers:{'content-type':'application/manifest+json'}});
}
async function ico(){const b=await get('iconPng');return b?new Response(b,{headers:{'content-type':'image/png'}}):fetch('icon-512.png')}
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==location.origin||e.request.method!=='GET')return;
 if(u.pathname.endsWith('/manifest.webmanifest'))return e.respondWith(man());
 if(u.pathname.endsWith('/icon-custom.png'))return e.respondWith(ico());
 e.respondWith(caches.match(e.request).then(h=>{
  const f=fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>h);
  return h||f}));
});
