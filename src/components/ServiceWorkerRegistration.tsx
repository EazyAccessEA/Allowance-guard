'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    // UNREGISTER any existing service worker. The old SW cached API
    // responses (including 500 errors), served stale security data,
    // and crashed on install when cache.addAll failed. A wallet
    // security scanner must NEVER serve cached blockchain data —
    // stale "no risks" could mask real risks. There is no offline
    // use case (you can't scan a blockchain without internet).
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister()
      }
    })

    // Also clear the old SW caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name)
        }
      })
    }
  }, [])

  return null
}
