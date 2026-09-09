import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(`${dir}/${e.name}`):`${dir}/${e.name}`))).flat();
const files=(await walk('dist')).filter(f=>!f.endsWith('.map')&&!f.endsWith('sw.js'));
const version=createHash('sha256');for(const f of files)version.update(await readFile(f));
version.update(await readFile(new URL(import.meta.url)));
const cache='ritmo-'+version.digest('hex').slice(0,12);
const manifest={id:'./',name:'Ritmo · Tu entrenamiento',short_name:'Ritmo',start_url:'./',scope:'./',display:'standalone',background_color:'#101612',theme_color:'#101612',icons:[{src:'icon.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]};
await writeFile('dist/manifest.webmanifest',JSON.stringify(manifest));
let html=await readFile('dist/index.html','utf8');html=html.replace('<html lang="en">','<html lang="es">').replace('</head>','<link rel="manifest" href="./manifest.webmanifest"><link rel="apple-touch-icon" href="./icon-512.png"><meta name="theme-color" content="#101612"><meta name="apple-mobile-web-app-capable" content="yes"></head>').replace('</body>',`<script>if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}</script></body>`);await writeFile('dist/index.html',html);
const assets=[...new Set(['./','./index.html','./manifest.webmanifest',...files.map(f=>'./'+f.slice(5))])];
await writeFile('dist/sw.js',`const CACHE=${JSON.stringify(cache)};const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ritmo-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
if(event.request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(cache=>cache.match('./index.html')).then(cached=>cached||fetch(event.request)));return;}
event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});`);
console.log('PWA lista: recursos locales precargados; las solicitudes a Supabase no se almacenan en la caché.');
