'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    const reportMetrics = (metrics: PerformanceMetrics) => {
      // Send to your analytics service
      console.log('Performance metrics:', metrics)
      
      // Example: Send to your API
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metrics,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }).catch(err => console.error('Failed to report metrics:', err))
    }

    // Monitor Core Web Vitals (basic implementation)
    // Note: For production, consider installing web-vitals package
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Basic performance monitoring without external dependencies
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            reportMetrics({ lcp: entry.startTime })
          } else if (entry.entryType === 'first-input') {
            reportMetrics({ fid: (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime })
          } else if (entry.entryType === 'layout-shift') {
            reportMetrics({ cls: (entry as PerformanceEntry & { value: number }).value })
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
      } catch {
        // Fallback for browsers that don't support all entry types
        console.log('Performance monitoring partially available')
      }
    }

    // Monitor 500 errors
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        
        if (response.status === 500) {
          console.error('500 error detected:', args[0])
          
          // Report 500 error
          fetch('/api/analytics/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: '500_error',
              url: args[0],
              status: response.status,
              timestamp: Date.now(),
              userAgent: navigator.userAgent
            })
          }).catch(err => console.error('Failed to report 500 error:', err))
        }
        
        return response
      } catch (error) {
        console.error('Fetch error:', error)
        throw error
      }
    }

    // Monitor unhandled errors
    window.addEventListener('error', (event) => {
      console.error('Unhandled error:', event.error)
      
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'unhandled_error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      }).catch(err => console.error('Failed to report unhandled error:', err))
    })

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'unhandled_rejection',
          reason: event.reason?.toString(),
          stack: event.reason?.stack,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        })
      }).catch(err => console.error('Failed to report unhandled rejection:', err))
    })

  }, [])

  return null // This component doesn't render anything
}

export default PerformanceMonitor
