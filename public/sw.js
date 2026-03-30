/**
 * Allowance Guard Service Worker
 * 
 * Aggressive caching strategy for maximum performance:
 * - Cache-first for static assets
 * - Network-first for API calls
 * - Offline fallbacks for critical pages
 */

const CACHE_NAME = 'allowance-guard-v1.14.9'
const STATIC_CACHE = 'static-v1.14.9'
const API_CACHE = 'api-v1.14.9'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/blog',
  '/docs',
  '/features',
  '/settings',
  '/contact',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
]

// Static assets to cache aggressively
const STATIC_ASSETS = [
  '/_next/static/css/',
  '/_next/static/js/',
  '/_next/static/media/',
  '/images/',
  '/icons/',
  '/public/'
]

// API endpoints that can be cached
const CACHEABLE_APIS = [
  '/api/healthz',
  '/api/chains',
  '/api/networks/roadmap'
]

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Caching critical resources...')
      return cache.addAll(CRITICAL_RESOURCES)
    }).then(() => {
      console.log('✅ Critical resources cached')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('✅ Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  // API requests - Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }
  
  // Static assets - Cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request))
    return
  }
  
  // HTML pages - Network first with cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleHtmlRequest(request))
    return
  }
  
  // Default - Network first
  event.respondWith(fetch(request))
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Try network first
    const response = await fetch(request)
    
    // Cache successful responses for cacheable APIs
    if (response.ok && isCacheableApi(url.pathname)) {
      const cache = await caches.open(API_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('🌐 Network failed, trying cache for:', url.pathname)
    
    // Fallback to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline fallback for critical APIs
    if (url.pathname === '/api/healthz') {
      return new Response(JSON.stringify({
        status: 'offline',
        message: 'Service temporarily unavailable',
        timestamp: new Date().toISOString()
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    throw error
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('❌ Failed to fetch static asset:', request.url)
    throw error
  }
}

// Handle HTML requests with network-first strategy
async function handleHtmlRequest(request) {
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('🌐 Network failed, trying cache for HTML:', request.url)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html')
      if (offlineResponse) {
        return offlineResponse
      }
    }
    
    throw error
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  return STATIC_ASSETS.some(pattern => pathname.includes(pattern)) ||
         pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)$/)
}

// Check if API endpoint is cacheable
function isCacheableApi(pathname) {
  return CACHEABLE_APIS.some(pattern => pathname.startsWith(pattern))
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Handle background sync
async function doBackgroundSync() {
  console.log('🔄 Performing background sync...')
  
  // Sync any pending actions when back online
  try {
    const response = await fetch('/api/healthz')
    if (response.ok) {
      console.log('✅ Background sync completed')
    }
  } catch (error) {
    console.log('❌ Background sync failed:', error)
  }
}

// Push notifications for updates
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        tag: 'allowance-guard-update',
        requireInteraction: false,
        actions: [
          {
            action: 'open',
            title: 'Open Allowance Guard'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      })
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRIC') {
    // Forward performance metrics to main thread
    console.log('📊 Performance metric:', event.data.metric)
  }
})
