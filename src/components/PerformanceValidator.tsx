'use client'
import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
  inp: number | null
}

interface PerformanceValidatorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  showDebugInfo?: boolean
}

export default function PerformanceValidator({ 
  onMetricsUpdate, 
  showDebugInfo = false 
}: PerformanceValidatorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null
  })

  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Performance Observer is supported
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      setIsSupported(true)
      startPerformanceMonitoring()
    }
  }, [])

  const startPerformanceMonitoring = async () => {
    try {
      // Import web-vitals dynamically
      const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals')

      // LCP - Largest Contentful Paint
      onLCP((metric) => {
        setMetrics(prev => ({ ...prev, lcp: metric.value }))
        onMetricsUpdate?.({ ...metrics, lcp: metric.value })
        
        if (showDebugInfo) {
          console.log('LCP:', metric.value, 'ms')
        }
      })

      // FCP - First Contentful Paint
      onFCP((metric) => {
        setMetrics(prev => ({ ...prev, fcp: metric.value }))
        onMetricsUpdate?.({ ...metrics, fcp: metric.value })
        
        if (showDebugInfo) {
          console.log('FCP:', metric.value, 'ms')
        }
      })

      // CLS - Cumulative Layout Shift
      onCLS((metric) => {
        setMetrics(prev => ({ ...prev, cls: metric.value }))
        onMetricsUpdate?.({ ...metrics, cls: metric.value })
        
        if (showDebugInfo) {
          console.log('CLS:', metric.value)
        }
      })

      // TTFB - Time to First Byte
      onTTFB((metric) => {
        setMetrics(prev => ({ ...prev, ttfb: metric.value }))
        onMetricsUpdate?.({ ...metrics, ttfb: metric.value })
        
        if (showDebugInfo) {
          console.log('TTFB:', metric.value, 'ms')
        }
      })

      // INP - Interaction to Next Paint
      onINP((metric) => {
        setMetrics(prev => ({ ...prev, inp: metric.value }))
        onMetricsUpdate?.({ ...metrics, inp: metric.value })
        
        if (showDebugInfo) {
          console.log('INP:', metric.value, 'ms')
        }
      })

    } catch (error) {
      console.error('Performance monitoring failed:', error)
    }
  }

  const getPerformanceGrade = (metric: string, value: number | null): string => {
    if (value === null) return 'N/A'
    
    switch (metric) {
      case 'lcp':
        if (value <= 2500) return '🟢 Excellent'
        if (value <= 4000) return '🟡 Good'
        return '🔴 Needs Improvement'
      
      case 'fcp':
        if (value <= 1800) return '🟢 Excellent'
        if (value <= 3000) return '🟡 Good'
        return '🔴 Needs Improvement'
      
      case 'cls':
        if (value <= 0.1) return '🟢 Excellent'
        if (value <= 0.25) return '🟡 Good'
        return '🔴 Needs Improvement'
      
      case 'ttfb':
        if (value <= 800) return '🟢 Excellent'
        if (value <= 1800) return '🟡 Good'
        return '🔴 Needs Improvement'
      
      case 'inp':
        if (value <= 200) return '🟢 Excellent'
        if (value <= 500) return '🟡 Good'
        return '🔴 Needs Improvement'
      
      default:
        return 'N/A'
    }
  }

  const getOverallGrade = (): string => {
    const grades = [
      getPerformanceGrade('lcp', metrics.lcp),
      getPerformanceGrade('fcp', metrics.fcp),
      getPerformanceGrade('cls', metrics.cls),
      getPerformanceGrade('ttfb', metrics.ttfb),
      getPerformanceGrade('inp', metrics.inp)
    ]
    
    const excellentCount = grades.filter(grade => grade.includes('🟢')).length
    const goodCount = grades.filter(grade => grade.includes('🟡')).length
    
    if (excellentCount >= 4) return '🟢 Excellent Performance'
    if (excellentCount + goodCount >= 4) return '🟡 Good Performance'
    return '🔴 Needs Optimization'
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-sm z-50">
      <div className="mb-2">
        <h3 className="font-bold text-green-400">Performance Monitor</h3>
        <p className="text-xs text-gray-300">Real-time Core Web Vitals</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span>{metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Loading...'}</span>
        </div>
        <div className="flex justify-between">
          <span>FCP:</span>
          <span>{metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'Loading...'}</span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span>{metrics.cls ? metrics.cls.toFixed(3) : 'Loading...'}</span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span>{metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'Loading...'}</span>
        </div>
        <div className="flex justify-between">
          <span>INP:</span>
          <span>{metrics.inp ? `${Math.round(metrics.inp)}ms` : 'Loading...'}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Overall:</span>
          <span className="text-sm">{getOverallGrade()}</span>
        </div>
      </div>
    </div>
  )
}
