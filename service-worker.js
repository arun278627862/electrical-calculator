/**
 * Service Worker for Electrical Engineering Calculator
 * Provides offline functionality, caching, and PWA features
 * 
 * Features:
 * - Offline caching of app resources
 * - Background sync for calculations
 * - Push notifications support
 * - App update handling
 * 
 * Author: AI Assistant
 * Version: 1.0.0
 */

const CACHE_NAME = 'electrical-calculator-v1.0.0';
const STATIC_CACHE_NAME = 'electrical-calculator-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'electrical-calculator-dynamic-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle different types of requests
    if (request.method === 'GET') {
        // Static files - serve from cache first
        if (isStaticFile(url.pathname)) {
            event.respondWith(serveFromCache(request, STATIC_CACHE_NAME));
        }
        // Dynamic content - network first, fallback to cache
        else if (isDynamicContent(url.pathname)) {
            event.respondWith(serveFromNetworkFirst(request));
        }
        // External resources - cache and serve
        else if (isExternalResource(url.href)) {
            event.respondWith(cacheAndServe(request));
        }
        // Default - network first
        else {
            event.respondWith(serveFromNetworkFirst(request));
        }
    }
});

// Background sync for calculations
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'calculation-sync') {
        event.waitUntil(syncCalculations());
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'New calculation result available',
            icon: '/data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
            badge: '/data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
            tag: 'electrical-calculator',
            data: data,
            actions: [
                {
                    action: 'view',
                    title: 'View Results'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification('Electrical Calculator', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_CALCULATION') {
        cacheCalculation(event.data.calculation);
    }
});

// ===== HELPER FUNCTIONS =====

// Check if file is static
function isStaticFile(pathname) {
    return STATIC_FILES.some(file => file.includes(pathname) || pathname === '/');
}

// Check if content is dynamic
function isDynamicContent(pathname) {
    return pathname.includes('/api/') || pathname.includes('/data/');
}

// Check if resource is external
function isExternalResource(url) {
    return url.includes('cdn.jsdelivr.net') || url.includes('fonts.googleapis.com');
}

// Serve from cache first
async function serveFromCache(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Error serving from cache:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

// Serve from network first, fallback to cache
async function serveFromNetworkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, serving from cache');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Content not available offline', { status: 503 });
    }
}

// Cache and serve external resources
async function cacheAndServe(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Error caching external resource:', error);
        return new Response('External resource not available', { status: 503 });
    }
}

// Cache calculation data
async function cacheCalculation(calculation) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const response = new Response(JSON.stringify(calculation), {
            headers: { 'Content-Type': 'application/json' }
        });
        
        const url = new URL('/api/calculations', self.location.origin);
        await cache.put(url, response);
        
        console.log('Service Worker: Calculation cached successfully');
    } catch (error) {
        console.error('Service Worker: Error caching calculation:', error);
    }
}

// Background sync calculations
async function syncCalculations() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const requests = await cache.keys();
        
        for (const request of requests) {
            if (request.url.includes('/api/calculations')) {
                const response = await cache.match(request);
                const calculation = await response.json();
                
                // Here you would typically send the calculation to a server
                console.log('Service Worker: Syncing calculation:', calculation);
                
                // Remove from cache after successful sync
                await cache.delete(request);
            }
        }
        
        console.log('Service Worker: Calculations synced successfully');
    } catch (error) {
        console.error('Service Worker: Error syncing calculations:', error);
    }
}

// ===== UTILITY FUNCTIONS =====

// Check if client is online
function isOnline() {
    return self.navigator.onLine;
}

// Get all clients
async function getAllClients() {
    return await clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
    });
}

// Send message to all clients
async function sendMessageToClients(message) {
    const clients = await getAllClients();
    clients.forEach(client => {
        client.postMessage(message);
    });
}

// ===== ERROR HANDLING =====

// Global error handler
self.addEventListener('error', (event) => {
    console.error('Service Worker: Global error:', event.error);
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled rejection:', event.reason);
});

// ===== PERFORMANCE OPTIMIZATION =====

// Preload critical resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js'
            ]);
        })
    );
});

// Clean up old caches periodically
setInterval(async () => {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name !== CACHE_NAME && 
            name !== STATIC_CACHE_NAME && 
            name !== DYNAMIC_CACHE_NAME
        );
        
        await Promise.all(
            oldCaches.map(name => caches.delete(name))
        );
        
        if (oldCaches.length > 0) {
            console.log('Service Worker: Cleaned up old caches:', oldCaches);
        }
    } catch (error) {
        console.error('Service Worker: Error cleaning up caches:', error);
    }
}, 24 * 60 * 60 * 1000); // Run once per day
