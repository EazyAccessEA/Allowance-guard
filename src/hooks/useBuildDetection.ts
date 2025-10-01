// Build Detection Hook
// Monitors build changes and handles cache invalidation

import { useState, useEffect, useCallback } from 'react'

interface BuildInfo {
  buildId: string
  version: string
  timestamp: string
  staticAssets: string[]
  apiEndpoints: string[]
}

interface BuildCheckResult {
  hasChanged: boolean
  newBuild?: BuildInfo
  message: string
}

/**
 * Hook for detecting build changes and handling cache invalidation
 */
export function useBuildDetection() {
  const [currentBuildId, setCurrentBuildId] = useState<string>('')
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  // Get current build ID from environment or generate one
  useEffect(() => {
    const buildId = process.env.NEXT_PUBLIC_BUILD_ID || `build-${Date.now()}`
    setCurrentBuildId(buildId)
  }, [])

  // Check for build changes
  const checkBuildChange = useCallback(async (): Promise<BuildCheckResult> => {
    if (!currentBuildId) {
      return { hasChanged: false, message: 'No build ID available' }
    }

    setIsChecking(true)
    try {
      const response = await fetch(`/api/build/check?buildId=${currentBuildId}`)
      const result = await response.json()
      
      setLastCheck(new Date())
      return result
    } catch (error) {
      console.warn('Failed to check build change:', error)
      return { hasChanged: false, message: 'Check failed' }
    } finally {
      setIsChecking(false)
    }
  }, [currentBuildId])

  // Handle build change detection
  const handleBuildChange = useCallback(async () => {
    const result = await checkBuildChange()
    
    if (result.hasChanged && result.newBuild) {
      console.log('🔨 Build change detected:', result.newBuild)
      
      // Notify service worker of build change
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'BUILD_CHANGED',
          newBuild: result.newBuild
        })
      }
      
      // Reload page to get new build
      window.location.reload()
    }
  }, [checkBuildChange])

  // Periodic build checking
  useEffect(() => {
    if (!currentBuildId) return

    // Check immediately
    handleBuildChange()

    // Set up periodic checking (every 5 minutes)
    const interval = setInterval(handleBuildChange, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [currentBuildId, handleBuildChange])

  // Manual build check
  const manualCheck = useCallback(async () => {
    const result = await checkBuildChange()
    
    if (result.hasChanged) {
      console.log('🔄 Manual build check: changes detected')
      handleBuildChange()
    } else {
      console.log('✅ Manual build check: no changes')
    }
    
    return result
  }, [checkBuildChange, handleBuildChange])

  // Force reload with cache busting
  const forceReload = useCallback(() => {
    console.log('🔄 Force reloading with cache busting...')
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName)
        })
      })
    }
    
    // Reload with cache busting
    window.location.reload()
  }, [])

  return {
    currentBuildId,
    isChecking,
    lastCheck,
    checkBuildChange: manualCheck,
    forceReload,
    handleBuildChange
  }
}
