'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  inp: number | null
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  reportToAnalytics?: boolean
}

export default function PerformanceMonitor({ 
  onMetricsUpdate, 
  reportToAnalytics = true 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    inp: null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Report Web Vitals to analytics
    const reportWebVitals = (metric: any) => {
      const { name, value, delta, id } = metric
      
      // Update local state
      setMetrics(prev => ({
        ...prev,
        [name.toLowerCase()]: value
      }))

      // Report to analytics if enabled
      if (reportToAnalytics && process.env.NODE_ENV === 'production') {
        // Send to performance API
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: name,
            value,
            delta,
            id,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        }).catch(error => {
          console.warn('Failed to report performance metric:', error)
        })
      }

      // Call custom handler
      onMetricsUpdate?.(metrics)
    }

    // Import and use web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
      getCLS(reportWebVitals)
      getFID(reportWebVitals)
      getFCP(reportWebVitals)
      getLCP(reportWebVitals)
      getTTFB(reportWebVitals)
      getINP(reportWebVitals)
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error)
    })

    // Monitor Core Web Vitals thresholds
    const checkPerformanceThresholds = () => {
      const { lcp, fid, cls, inp } = metrics
      
      // LCP should be under 2.5s
      if (lcp && lcp > 2500) {
        console.warn('⚠️ LCP is slow:', lcp + 'ms')
      }
      
      // FID should be under 100ms
      if (fid && fid > 100) {
        console.warn('⚠️ FID is slow:', fid + 'ms')
      }
      
      // CLS should be under 0.1
      if (cls && cls > 0.1) {
        console.warn('⚠️ CLS is high:', cls)
      }
      
      // INP should be under 200ms
      if (inp && inp > 200) {
        console.warn('⚠️ INP is slow:', inp + 'ms')
      }
    }

    // Check thresholds when metrics update
    if (Object.values(metrics).some(value => value !== null)) {
      checkPerformanceThresholds()
    }

  }, [metrics, onMetricsUpdate, reportToAnalytics])

  // Monitor resource loading performance
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('📊 Navigation timing:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            totalTime: navEntry.loadEventEnd - navEntry.fetchStart
          })
        }
      }
    })

    observer.observe({ entryTypes: ['navigation'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Monitor long tasks that could block the main thread
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn('🐌 Long task detected:', {
            duration: entry.duration + 'ms',
            startTime: entry.startTime
          })
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      // Long task API not supported in all browsers
      console.log('Long task API not supported')
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}

// Performance budget checker
export function checkPerformanceBudget(metrics: PerformanceMetrics): {
  passed: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  if (metrics.lcp && metrics.lcp > 2500) {
    issues.push(`LCP is ${metrics.lcp}ms (target: <2500ms)`)
  }
  
  if (metrics.fid && metrics.fid > 100) {
    issues.push(`FID is ${metrics.fid}ms (target: <100ms)`)
  }
  
  if (metrics.cls && metrics.cls > 0.1) {
    issues.push(`CLS is ${metrics.cls} (target: <0.1)`)
  }
  
  if (metrics.inp && metrics.inp > 200) {
    issues.push(`INP is ${metrics.inp}ms (target: <200ms)`)
  }
  
  return {
    passed: issues.length === 0,
    issues
  }
}