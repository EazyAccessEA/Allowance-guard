'use client'

import { useState, useEffect } from 'react'
import { performanceMonitor, getPerformanceScore, formatVitalValue, type CoreWebVitals } from '@/lib/performance'

interface PerformanceData {
  vitals: CoreWebVitals
  score: number
  timestamp: number
}

export default function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get initial performance data
    const vitals = performanceMonitor.getVitals()
    const score = getPerformanceScore(vitals)
    
    setPerformanceData({
      vitals,
      score,
      timestamp: Date.now()
    })

    // Update every 5 seconds
    const interval = setInterval(() => {
      const newVitals = performanceMonitor.getVitals()
      const newScore = getPerformanceScore(newVitals)
      
      setPerformanceData({
        vitals: newVitals,
        score: newScore,
        timestamp: Date.now()
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!performanceData) return null

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getVitalColor = (vital: string, value: number | null) => {
    if (value === null) return 'text-gray-500'
    
    switch (vital) {
      case 'lcp':
        return value <= 1800 ? 'text-green-600' : value <= 2500 ? 'text-yellow-600' : 'text-red-600'
      case 'inp':
        return value <= 200 ? 'text-green-600' : value <= 500 ? 'text-yellow-600' : 'text-red-600'
      case 'cls':
        return value <= 0.1 ? 'text-green-600' : value <= 0.25 ? 'text-yellow-600' : 'text-red-600'
      case 'fid':
        return value <= 50 ? 'text-green-600' : value <= 100 ? 'text-yellow-600' : 'text-red-600'
      case 'ttfb':
        return value <= 600 ? 'text-green-600' : value <= 1000 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Performance Dashboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Dashboard panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Overall Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Score</span>
              <span className={`text-2xl font-bold ${getScoreColor(performanceData.score)}`}>
                {performanceData.score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  performanceData.score >= 90 ? 'bg-green-500' : 
                  performanceData.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${performanceData.score}%` }}
              />
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Core Web Vitals</h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LCP</span>
                  <span className={getVitalColor('lcp', performanceData.vitals.lcp)}>
                    {formatVitalValue('lcp', performanceData.vitals.lcp)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">≤ 1.8s</div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">INP</span>
                  <span className={getVitalColor('inp', performanceData.vitals.inp)}>
                    {formatVitalValue('inp', performanceData.vitals.inp)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">≤ 200ms</div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CLS</span>
                  <span className={getVitalColor('cls', performanceData.vitals.cls)}>
                    {formatVitalValue('cls', performanceData.vitals.cls)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">≤ 0.1</div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FID</span>
                  <span className={getVitalColor('fid', performanceData.vitals.fid)}>
                    {formatVitalValue('fid', performanceData.vitals.fid)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">≤ 50ms</div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TTFB</span>
                  <span className={getVitalColor('ttfb', performanceData.vitals.ttfb)}>
                    {formatVitalValue('ttfb', performanceData.vitals.ttfb)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">≤ 600ms</div>
              </div>
            </div>
          </div>

          {/* Last updated */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Last updated: {new Date(performanceData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
