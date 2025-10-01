'use client'

// Predictive Performance Provider
// Builds upon existing performance monitoring infrastructure

import { useEffect } from 'react'
import { usePredictivePerformance } from '@/hooks/usePredictivePerformance'

/**
 * Client-side component that initializes predictive performance optimization
 * This component should be added to the root layout to enable predictive features
 */
export default function PredictivePerformanceProvider() {
  const { recommendations, isLoading } = usePredictivePerformance()

  // Log predictive recommendations for debugging
  useEffect(() => {
    if (recommendations) {
      console.log('🎯 Predictive Performance Recommendations:', {
        preloadResources: recommendations.preloadResources,
        loadingStrategy: recommendations.loadingStrategy,
        timestamp: recommendations.timestamp
      })
    }
  }, [recommendations])

  // Show loading indicator in development
  if (process.env.NODE_ENV === 'development' && isLoading) {
    console.log('🔄 Loading predictive performance recommendations...')
  }

  // This component doesn't render anything visible
  // It only provides predictive performance optimization in the background
  return null
}
