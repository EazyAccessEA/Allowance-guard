// Predictive Performance Hook
// Builds upon existing performance monitoring

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

interface PredictiveRecommendations {
  preloadResources: string[]
  loadingStrategy: {
    preloadImages: boolean
    preloadScripts: boolean
    preloadStyles: boolean
    cacheStrategy: 'aggressive' | 'conservative'
  }
  timestamp: string
}

interface PerformanceMetrics {
  vitals: {
    lcp?: number
    inp?: number
    cls?: number
    fid?: number
    ttfb?: number
  }
  navigation?: Record<string, unknown>
  resources?: Record<string, unknown>
  userAgent?: string
  pageUrl?: string
  userId?: string
  sessionDuration?: number
  connectionSpeed?: string
}

/**
 * Hook for predictive performance optimization
 * Builds upon existing performance monitoring infrastructure
 */
export function usePredictivePerformance() {
  const { address } = useAccount()
  const [recommendations, setRecommendations] = useState<PredictiveRecommendations | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionStart, setSessionStart] = useState<number>(Date.now())

  // Generate user ID from wallet address or create anonymous ID
  const userId = address || `anon_${Math.random().toString(36).substr(2, 9)}`

  // Track session duration
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStart
      reportPerformanceMetrics({
        userId,
        sessionDuration,
        pageUrl: window.location.pathname,
        vitals: {}
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [userId, sessionStart])

  // Get predictive recommendations for current page
  const getPredictiveRecommendations = useCallback(async (currentPage: string) => {
    if (!currentPage) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/analytics/performance?userId=${userId}&currentPage=${currentPage}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.predictive)
      }
    } catch (error) {
      console.warn('Failed to get predictive recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Report performance metrics
  const reportPerformanceMetrics = useCallback(async (metrics: PerformanceMetrics) => {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metrics,
          userAgent: navigator.userAgent,
          connectionSpeed: getConnectionSpeed(),
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.warn('Failed to report performance metrics:', error)
    }
  }, [])

  // Smart preloading based on recommendations
  const preloadResources = useCallback((resources: string[]) => {
    resources.forEach(resource => {
      if (resource.startsWith('/api/')) {
        // Preload API endpoints
        fetch(resource, { method: 'HEAD' }).catch(() => {})
      } else if (resource.startsWith('/')) {
        // Preload pages
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = resource
        document.head.appendChild(link)
      }
    })
  }, [])

  // Apply adaptive loading strategy
  const applyLoadingStrategy = useCallback((strategy: PredictiveRecommendations['loadingStrategy']) => {
    // Apply preloading based on strategy
    if (strategy.preloadImages) {
      // Preload critical images
      const criticalImages = document.querySelectorAll('img[data-critical]')
      criticalImages.forEach(img => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = (img as HTMLImageElement).src
        document.head.appendChild(link)
      })
    }

    if (strategy.preloadScripts) {
      // Preload critical scripts
      const criticalScripts = document.querySelectorAll('script[data-critical]')
      criticalScripts.forEach(script => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'script'
        link.href = (script as HTMLScriptElement).src
        document.head.appendChild(link)
      })
    }

    if (strategy.preloadStyles) {
      // Preload critical styles
      const criticalStyles = document.querySelectorAll('link[rel="stylesheet"][data-critical]')
      criticalStyles.forEach(style => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'style'
        link.href = (style as HTMLLinkElement).href
        document.head.appendChild(link)
      })
    }
  }, [])

  // Initialize predictive performance for current page
  useEffect(() => {
    const currentPage = window.location.pathname
    getPredictiveRecommendations(currentPage)
  }, [getPredictiveRecommendations])

  // Apply recommendations when they change
  useEffect(() => {
    if (recommendations) {
      preloadResources(recommendations.preloadResources)
      applyLoadingStrategy(recommendations.loadingStrategy)
    }
  }, [recommendations, preloadResources, applyLoadingStrategy])

  // Report Core Web Vitals
  useEffect(() => {
    const reportWebVitals = (metric: any) => {
      reportPerformanceMetrics({
        userId,
        vitals: {
          lcp: metric.name === 'LCP' ? metric.value : undefined,
          inp: metric.name === 'INP' ? metric.value : undefined,
          cls: metric.name === 'CLS' ? metric.value : undefined,
          fid: metric.name === 'FID' ? metric.value : undefined,
          ttfb: metric.name === 'TTFB' ? metric.value : undefined
        },
        pageUrl: window.location.pathname
      })
    }

    // Report vitals when they change
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(reportWebVitals)
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input', 'navigation'] })

    return () => observer.disconnect()
  }, [userId, reportPerformanceMetrics])

  return {
    recommendations,
    isLoading,
    getPredictiveRecommendations,
    reportPerformanceMetrics
  }
}

// Helper function to detect connection speed
function getConnectionSpeed(): string {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  
  if (!connection) return 'medium'
  
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return 'slow'
  if (connection.effectiveType === '4g' || connection.effectiveType === '5g') return 'fast'
  
  return 'medium'
}
