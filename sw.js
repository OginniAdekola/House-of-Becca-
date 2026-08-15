const C='hb-pos-v11',A=['./','./index.html','./style.css','./app.js','./manifest.json','./logo.jpg'];self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A))));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));

// Cache-bust: v6-add-item-fix

// Receipt print layout v8 cache refresh

// v9: print, save-PDF and share receipt actions

// v10: 120mm receipt cache update

// v11: add-new-product and delete-product management enabled
