import React from 'react'

interface SkeletonLoaderProps {
  lines?: number
  className?: string
  variant?: 'text' | 'card' | 'table' | 'button' | 'avatar'
  width?: 'full' | 'half' | 'quarter' | 'auto'
  height?: 'sm' | 'md' | 'lg'
}

export function SkeletonLoader({ 
  lines = 3, 
  className = '',
  variant = 'text',
  width = 'full',
  height = 'md'
}: SkeletonLoaderProps) {
  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
    auto: 'w-auto'
  }

  const heightClasses = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6'
  }

  if (variant === 'card') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-stone/20 rounded-lg p-6">
          <div className={`${heightClasses[height]} bg-stone/30 rounded mb-4 ${widthClasses[width]}`} />
          <div className={`${heightClasses[height]} bg-stone/30 rounded mb-2 w-3/4`} />
          <div className={`${heightClasses[height]} bg-stone/30 rounded w-1/2`} />
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={`animate-pulse ${className}`}>
        {Array.from({length: lines}).map((_, i) => (
          <div key={i} className="flex space-x-4 py-3 border-b border-stone/20">
            <div className={`${heightClasses[height]} bg-stone/30 rounded w-4`} />
            <div className={`${heightClasses[height]} bg-stone/30 rounded w-8`} />
            <div className={`${heightClasses[height]} bg-stone/30 rounded w-16`} />
            <div className={`${heightClasses[height]} bg-stone/30 rounded w-24`} />
            <div className={`${heightClasses[height]} bg-stone/30 rounded w-12`} />
            <div className={`${heightClasses[height]} bg-stone/30 rounded w-20`} />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`${heightClasses[height]} bg-stone/30 rounded-lg w-24`} />
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`${heightClasses[height]} ${heightClasses[height]} bg-stone/30 rounded-full`} />
      </div>
    )
  }

  // Default text variant
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({length: lines}).map((_, i) => (
        <div 
          key={i} 
          className={`${heightClasses[height]} bg-stone/30 rounded mb-2 ${widthClasses[width]}`}
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

// Fireart-specific skeleton components
export function FireartCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border border-stone/20 rounded-2xl p-8 shadow-subtle ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-stone/20 rounded-2xl mr-4" />
          <div className="flex-1">
            <div className="h-4 bg-stone/30 rounded mb-2 w-3/4" />
            <div className="h-3 bg-stone/20 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-stone/20 rounded w-full" />
          <div className="h-4 bg-stone/20 rounded w-5/6" />
          <div className="h-4 bg-stone/20 rounded w-4/6" />
        </div>
        <div className="mt-6 flex justify-end">
          <div className="h-10 bg-stone/20 rounded-lg w-24" />
        </div>
      </div>
    </div>
  )
}

export function FireartTableSkeleton({ rows = 5, className = '' }: { rows?: number, className?: string }) {
  return (
    <div className={`border-2 border-stone/20 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-stone/10 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-stone/30 rounded w-4" />
          <div className="h-4 bg-stone/30 rounded w-12" />
          <div className="h-4 bg-stone/30 rounded w-20" />
          <div className="h-4 bg-stone/30 rounded w-32" />
          <div className="h-4 bg-stone/30 rounded w-16" />
          <div className="h-4 bg-stone/30 rounded w-24" />
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-stone/20">
        {Array.from({length: rows}).map((_, i) => (
          <div key={i} className="p-4">
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 bg-stone/20 rounded w-4" />
              <div className="h-4 bg-stone/20 rounded w-8" />
              <div className="h-4 bg-stone/20 rounded w-16" />
              <div className="h-4 bg-stone/20 rounded w-24" />
              <div className="h-4 bg-stone/20 rounded w-12" />
              <div className="h-4 bg-stone/20 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  className?: string
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  message = 'Loading...',
  className = '' 
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="bg-white border border-stone/20 rounded-2xl p-8 shadow-medium text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-cobalt to-emerald rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-stone font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}
