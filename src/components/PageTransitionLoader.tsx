'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading bar on route changes
    setIsLoading(true)
    
    // Hide loading bar after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-cobalt/20 z-50">
      <div className="h-full bg-gradient-to-r from-cobalt to-emerald animate-pulse" />
    </div>
  )
}

// Alternative: Progress bar that fills up
export function ProgressBarLoader({ progress = 0 }: { progress?: number }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-stone/20 z-50">
      <div 
        className="h-full bg-gradient-to-r from-cobalt to-emerald transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

// Fireart-style loading overlay
interface FireartLoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
}

export function FireartLoadingOverlay({ 
  isVisible, 
  message = 'Loading...', 
  progress 
}: FireartLoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white border border-stone/20 rounded-2xl p-8 shadow-medium text-center max-w-sm mx-4">
        <div className="w-16 h-16 bg-gradient-to-r from-cobalt to-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        
        <h3 className="text-lg font-medium text-ink mb-2">{message}</h3>
        
        {progress !== undefined && (
          <div className="w-full bg-stone/20 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-cobalt to-emerald h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <p className="text-sm text-text-tertiary">
          Please wait while we process your request...
        </p>
      </div>
    </div>
  )
}
