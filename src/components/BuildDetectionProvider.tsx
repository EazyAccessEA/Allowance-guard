'use client'

// Build Detection Provider
// Monitors build changes and ensures users get the latest version

import { useEffect } from 'react'
import { useBuildDetection } from '@/hooks/useBuildDetection'

/**
 * Client-side component that monitors build changes
 * This component should be added to the root layout to enable build detection
 */
export default function BuildDetectionProvider() {
  const buildDetection = useBuildDetection()

  // Log build detection status
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔨 Build Detection Active:', {
        currentBuildId: buildDetection.currentBuildId,
        isChecking: buildDetection.isChecking,
        lastCheck: buildDetection.lastCheck
      })
    }
  }, [buildDetection.currentBuildId, buildDetection.isChecking, buildDetection.lastCheck])

  // Development helper functions (simplified)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Add global functions for debugging
      (window as any).buildInfo = {
        currentBuildId: buildDetection.currentBuildId,
        isChecking: buildDetection.isChecking,
        lastCheck: buildDetection.lastCheck
      }
    }
  }, [buildDetection.currentBuildId, buildDetection.isChecking, buildDetection.lastCheck])

  // This component doesn't render anything visible
  // It only provides build detection in the background
  return null
}
