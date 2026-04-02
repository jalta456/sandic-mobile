/**
 * service-worker.js
 * PWA Service Worker - يجعل التطبيق يعمل بدون إنترنت
 */

const CACHE_NAME = 'sandic-v2.0';
const FICHIERS_A_CACHER = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/theme/tokens.css',
    '/src/theme/main.css',
    '/src/data/mockData.js',
    '/src/components/uiComponents.js',
    '/src/screens/renderers.js',
    '/src/utils/helpers.js',
    '/src/utils/whatsapputilsupdated.js',
    '/src/utils/receiptutilsupdated.js',
    '/src/utils/fundutilsupdated.js',
    '/src/utils/reminderutilsupdated.js',
    '/script.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Installation — mise en cache des fichiers essentiels
self.addEventListener('install', evenement => {
    console.log('🔧 Service Worker: Installation');
    evenement.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Mise en cache des fichiers...');
                return cache.addAll(FICHIERS_A_CACHER.map(url => {
                    return new Request(url, { cache: 'reload' });
                })).catch(err => {
                    console.warn('⚠️ Certains fichiers n\'ont pas pu être mis en cache:', err);
                });
            })
    );
    self.skipWaiting();
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', evenement => {
    console.log('✅ Service Worker: Actif');
    evenement.waitUntil(
        caches.keys().then(nomsCaches => {
            return Promise.all(
                nomsCaches
                    .filter(nom => nom !== CACHE_NAME)
                    .map(nom => {
                        console.log(`🗑️ Suppression ancien cache: ${nom}`);
                        return caches.delete(nom);
                    })
            );
        })
    );
    self.clients.claim();
});

// Interception des requêtes — Cache First (priorité au cache)
self.addEventListener('fetch', evenement => {
    // Ignorer les requêtes non-GET et les URL externes
    if (evenement.request.method !== 'GET') return;
    if (!evenement.request.url.startsWith(self.location.origin)) return;

    evenement.respondWith(
        caches.match(evenement.request)
            .then(reponseCache => {
                if (reponseCache) {
                    return reponseCache; // Servir depuis le cache
                }
                // Sinon, aller chercher sur le réseau
                return fetch(evenement.request).then(reponseReseau => {
                    // Mettre en cache la nouvelle ressource
                    if (reponseReseau && reponseReseau.status === 200) {
                        const cloneReponse = reponseReseau.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(evenement.request, cloneReponse);
                        });
                    }
                    return reponseReseau;
                });
            })
            .catch(() => {
                // Mode hors ligne
                if (evenement.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Gestion des messages depuis l'app
self.addEventListener('message', evenement => {
    if (evenement.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
