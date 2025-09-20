// Lighthouse performance monitoring
// Tracks TBT, TTI, and other Core Web Vitals

interface PerformanceMetrics {
  tbt: number
  tti: number
  lcp: number
  fcp: number
  cls: number
  fid: number
}

export class LighthouseMonitor {
  private static instance: LighthouseMonitor
  private metrics: PerformanceMetrics = {
    tbt: 0,
    tti: 0,
    lcp: 0,
    fcp: 0,
    cls: 0,
    fid: 0
  }

  static getInstance(): LighthouseMonitor {
    if (!LighthouseMonitor.instance) {
      LighthouseMonitor.instance = new LighthouseMonitor()
    }
    return LighthouseMonitor.instance
  }

  init() {
    if (typeof window === 'undefined') return

    // Track Total Blocking Time (TBT)
    this.trackTBT()
    
    // Track Time to Interactive (TTI)
    this.trackTTI()
    
    // Track Core Web Vitals
    this.trackCoreWebVitals()
    
    // Track long tasks (Lighthouse recommendation)
    this.trackLongTasks()
  }

  private trackTBT() {
    let totalBlockingTime = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'longtask') {
          totalBlockingTime += entry.duration - 50 // TBT = duration - 50ms
        }
      }
      this.metrics.tbt = totalBlockingTime
    })

    observer.observe({ entryTypes: ['longtask'] })
  }

  private trackTTI() {
    // TTI is when the page is fully interactive
    const tti = performance.timing.domInteractive - performance.timing.navigationStart
    this.metrics.tti = tti
  }

  private trackCoreWebVitals() {
    // Track LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.lcp = lastEntry.startTime
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Track FCP
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
        }
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Track CLS
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.metrics.cls = clsValue
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Track FID
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
  }

  private trackLongTasks() {
    // Lighthouse recommendation: Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration}ms`, entry)
          
          // Report to analytics
          this.reportLongTask(entry.duration)
        }
      }
    })

    longTaskObserver.observe({ entryTypes: ['longtask'] })
  }

  private reportLongTask(duration: number) {
    // Report long tasks to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'long_task', {
        event_category: 'Performance',
        event_label: 'TBT',
        value: Math.round(duration)
      })
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Lighthouse recommendation: Report performance issues
  reportPerformanceIssues() {
    const issues = []
    
    if (this.metrics.tbt > 200) {
      issues.push(`TBT too high: ${this.metrics.tbt}ms (target: <200ms)`)
    }
    
    if (this.metrics.tti > 3800) {
      issues.push(`TTI too high: ${this.metrics.tti}ms (target: <3.8s)`)
    }
    
    if (this.metrics.lcp > 2500) {
      issues.push(`LCP too high: ${this.metrics.lcp}ms (target: <2.5s)`)
    }
    
    if (this.metrics.cls > 0.1) {
      issues.push(`CLS too high: ${this.metrics.cls} (target: <0.1)`)
    }

    if (issues.length > 0) {
      console.warn('Lighthouse Performance Issues:', issues)
    }

    return issues
  }
}

export const lighthouseMonitor = LighthouseMonitor.getInstance()
