'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none' // Always check for updates
          })

          console.log('🔧 Service Worker registered:', registration.scope)

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  console.log('🔄 New content available, please refresh')
                  
                  // Show update notification
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              console.log('📦 Cache updated:', event.data.cacheName)
            }
            if (event.data && event.data.type === 'BUILD_CHANGED') {
              console.log('🔨 Build changed, reloading...')
              window.location.reload()
            }
          })

          // Handle controller changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed')
            window.location.reload()
          })

        } catch (error) {
          console.error('❌ Service Worker registration failed:', error)
        }
      }

      registerSW()
    }
  }, [])

  return null
}
