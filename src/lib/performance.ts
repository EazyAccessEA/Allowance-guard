// Core Web Vitals Performance Monitoring
// Implements PuredgeOS performance standards and telemetry

// Type definitions for Performance API extensions
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime?: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart?: number;
}

interface EventTimingEntry extends PerformanceEntry {
  processingStart?: number;
  processingEnd?: number;
}

interface NavigatorConnection {
  effectiveType?: string;
  downlink?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NavigatorConnection;
}

interface WindowWithRollbar extends Window {
  rollbarClient?: {
    warning: (message: string, data: unknown) => void;
  };
}

export interface CoreWebVitals {
  lcp: number | null // Largest Contentful Paint (ms)
  inp: number | null // Interaction to Next Paint (ms) 
  cls: number | null // Cumulative Layout Shift
  fid: number | null // First Input Delay (ms) - legacy
  ttfb: number | null // Time to First Byte (ms)
}

export interface PerformanceMetrics {
  vitals: CoreWebVitals
  navigation: {
    loadTime: number
    domContentLoaded: number
    firstPaint: number
    firstContentfulPaint: number
  }
  resources: {
    totalSize: number
    resourceCount: number
    imageCount: number
    scriptCount: number
    stylesheetCount: number
  }
  userAgent: string
  connection: string
  timestamp: number
  pageUrl?: string
}

// Performance budgets based on PuredgeOS standards
export const PERFORMANCE_BUDGETS = {
  LCP: {
    good: 1800, // 1.8s
    poor: 2500  // 2.5s
  },
  INP: {
    good: 200,  // 200ms
    poor: 500   // 500ms
  },
  CLS: {
    good: 0.1,  // 0.1
    poor: 0.25  // 0.25
  },
  FID: {
    good: 50,   // 50ms
    poor: 100   // 100ms
  },
  TTFB: {
    good: 600,  // 600ms
    poor: 1000  // 1000ms
  }
} as const

// Performance monitoring class
class PerformanceMonitor {
  private vitals: CoreWebVitals = {
    lcp: null,
    inp: null,
    cls: null,
    fid: null,
    ttfb: null
  }

  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    if (this.isInitialized) return
    this.isInitialized = true

    // Measure Core Web Vitals
    this.measureLCP()
    this.measureINP()
    this.measureCLS()
    this.measureFID()
    this.measureTTFB()

    // Send metrics on page unload
    window.addEventListener('beforeunload', () => {
      this.sendMetrics()
    })

    // Send metrics after 5 seconds (for SPA navigation)
    setTimeout(() => {
      this.sendMetrics()
    }, 5000)
  }

  private measureLCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaintEntry
        
        if (lastEntry) {
          this.vitals.lcp = lastEntry.renderTime || lastEntry.startTime
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('Failed to measure LCP:', error)
    }
  }

  private measureINP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as EventTimingEntry
        
        if (lastEntry && lastEntry.processingStart && lastEntry.processingEnd) {
          this.vitals.inp = lastEntry.processingEnd - lastEntry.processingStart
        }
      })

      observer.observe({ entryTypes: ['event'] })
    } catch (error) {
      console.warn('Failed to measure INP:', error)
    }
  }

  private measureCLS() {
    if (!('PerformanceObserver' in window)) return

    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as LayoutShiftEntry
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0
          }
        }
        this.vitals.cls = clsValue
      })

      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('Failed to measure CLS:', error)
    }
  }

  private measureFID() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstEntry = entries[0] as FirstInputEntry
        
        if (firstEntry && firstEntry.processingStart) {
          this.vitals.fid = firstEntry.processingStart - firstEntry.startTime
        }
      })

      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('Failed to measure FID:', error)
    }
  }

  private measureTTFB() {
    if (!('performance' in window)) return

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        this.vitals.ttfb = navigation.responseStart - navigation.requestStart
      }
    } catch (error) {
      console.warn('Failed to measure TTFB:', error)
    }
  }

  private getNavigationMetrics() {
    if (!('performance' in window)) return null

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const firstPaint = paint.find(entry => entry.name === 'first-paint')
      const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')

      return {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: firstPaint ? firstPaint.startTime : 0,
        firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : 0
      }
    } catch (error) {
      console.warn('Failed to get navigation metrics:', error)
      return null
    }
  }

  private getResourceMetrics() {
    if (!('performance' in window)) return null

    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      let totalSize = 0
      let imageCount = 0
      let scriptCount = 0
      let stylesheetCount = 0

      resources.forEach(resource => {
        if (resource.transferSize) {
          totalSize += resource.transferSize
        }

        if (resource.name.includes('.js')) scriptCount++
        else if (resource.name.includes('.css')) stylesheetCount++
        else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(resource.name)) imageCount++
      })

      return {
        totalSize,
        resourceCount: resources.length,
        imageCount,
        scriptCount,
        stylesheetCount
      }
    } catch (error) {
      console.warn('Failed to get resource metrics:', error)
      return null
    }
  }

  private getConnectionInfo() {
    if (!('connection' in navigator)) return 'unknown'
    
    const connection = (navigator as NavigatorWithConnection).connection
    return connection ? `${connection.effectiveType}-${connection.downlink}Mbps` : 'unknown'
  }

  private async sendMetrics() {
    try {
      const navigation = this.getNavigationMetrics()
      const resources = this.getResourceMetrics()
      
      if (!navigation || !resources) return

      const metrics: PerformanceMetrics = {
        vitals: { ...this.vitals },
        navigation,
        resources,
        userAgent: navigator.userAgent,
        connection: this.getConnectionInfo(),
        timestamp: Date.now()
      }

      // Send to analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
        keepalive: true // Ensure request completes even if page unloads
      })

      // Log performance issues
      this.logPerformanceIssues(metrics)

    } catch (error) {
      console.warn('Failed to send performance metrics:', error)
    }
  }

  private logPerformanceIssues(metrics: PerformanceMetrics) {
    const issues: string[] = []

    // Check Core Web Vitals against budgets
    if (metrics.vitals.lcp && metrics.vitals.lcp > PERFORMANCE_BUDGETS.LCP.poor) {
      issues.push(`LCP: ${metrics.vitals.lcp}ms (budget: ${PERFORMANCE_BUDGETS.LCP.good}ms)`)
    }

    if (metrics.vitals.inp && metrics.vitals.inp > PERFORMANCE_BUDGETS.INP.poor) {
      issues.push(`INP: ${metrics.vitals.inp}ms (budget: ${PERFORMANCE_BUDGETS.INP.good}ms)`)
    }

    if (metrics.vitals.cls && metrics.vitals.cls > PERFORMANCE_BUDGETS.CLS.poor) {
      issues.push(`CLS: ${metrics.vitals.cls} (budget: ${PERFORMANCE_BUDGETS.CLS.good})`)
    }

    if (metrics.vitals.fid && metrics.vitals.fid > PERFORMANCE_BUDGETS.FID.poor) {
      issues.push(`FID: ${metrics.vitals.fid}ms (budget: ${PERFORMANCE_BUDGETS.FID.good}ms)`)
    }

    if (metrics.vitals.ttfb && metrics.vitals.ttfb > PERFORMANCE_BUDGETS.TTFB.poor) {
      issues.push(`TTFB: ${metrics.vitals.ttfb}ms (budget: ${PERFORMANCE_BUDGETS.TTFB.good}ms)`)
    }

    // Check bundle size
    if (metrics.resources.totalSize > 1000000) { // 1MB
      issues.push(`Bundle size: ${(metrics.resources.totalSize / 1024 / 1024).toFixed(2)}MB (budget: 1MB)`)
    }

    if (issues.length > 0) {
      console.warn('Performance issues detected:', issues)
      
      // Send to error monitoring
      if (typeof window !== 'undefined' && (window as WindowWithRollbar).rollbarClient) {
        (window as WindowWithRollbar).rollbarClient!.warning('Performance budget exceeded', {
          issues,
          metrics
        })
      }
    }
  }

  // Public method to get current vitals
  getVitals(): CoreWebVitals {
    return { ...this.vitals }
  }

  // Public method to force metrics collection
  collectMetrics(): PerformanceMetrics | null {
    const navigation = this.getNavigationMetrics()
    const resources = this.getResourceMetrics()
    
    if (!navigation || !resources) return null

    return {
      vitals: { ...this.vitals },
      navigation,
      resources,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      timestamp: Date.now()
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions
export function getPerformanceScore(vitals: CoreWebVitals): number {
  let score = 100

  // LCP scoring
  if (vitals.lcp) {
    if (vitals.lcp > PERFORMANCE_BUDGETS.LCP.poor) score -= 30
    else if (vitals.lcp > PERFORMANCE_BUDGETS.LCP.good) score -= 15
  }

  // INP scoring
  if (vitals.inp) {
    if (vitals.inp > PERFORMANCE_BUDGETS.INP.poor) score -= 30
    else if (vitals.inp > PERFORMANCE_BUDGETS.INP.good) score -= 15
  }

  // CLS scoring
  if (vitals.cls) {
    if (vitals.cls > PERFORMANCE_BUDGETS.CLS.poor) score -= 20
    else if (vitals.cls > PERFORMANCE_BUDGETS.CLS.good) score -= 10
  }

  // FID scoring (legacy)
  if (vitals.fid) {
    if (vitals.fid > PERFORMANCE_BUDGETS.FID.poor) score -= 20
    else if (vitals.fid > PERFORMANCE_BUDGETS.FID.good) score -= 10
  }

  return Math.max(0, score)
}

export function formatVitalValue(vital: string, value: number | null): string {
  if (value === null) return 'N/A'

  switch (vital) {
    case 'lcp':
    case 'inp':
    case 'fid':
    case 'ttfb':
      return `${Math.round(value)}ms`
    case 'cls':
      return value.toFixed(3)
    default:
      return value.toString()
  }
}