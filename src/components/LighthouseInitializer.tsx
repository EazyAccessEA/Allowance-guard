'use client'

import { useEffect } from 'react'
import { lighthouseMonitor } from '@/lib/lighthouseMonitor'

export const LighthouseInitializer = () => {
  useEffect(() => {
    // Initialize Lighthouse monitoring on client side
    lighthouseMonitor.init()
    
    // Report performance issues after page load
    const timer = setTimeout(() => {
      const issues = lighthouseMonitor.reportPerformanceIssues()
      if (issues.length > 0) {
        console.warn('Lighthouse Performance Issues Detected:', issues)
      }
    }, 5000) // Wait 5 seconds for metrics to stabilize

    return () => clearTimeout(timer)
  }, [])

  return null
}
