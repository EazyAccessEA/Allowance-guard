'use client'

import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
// Icons imported as needed in individual components

// Enhanced skeleton components with mobile optimization
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded-lg w-64 mb-2" />
        <div className="h-4 bg-neutral-100 rounded w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 bg-neutral-100 rounded w-16 mb-2" />
                  <div className="h-6 bg-neutral-200 rounded w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-5 bg-paper-deep rounded w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-paper-deep rounded w-full" />
                  <div className="h-4 bg-paper-deep rounded w-3/4" />
                  <div className="h-4 bg-paper-deep rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-paper-deep rounded w-48 mb-2" />
                <div className="h-4 bg-paper-deep rounded w-64" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-10 bg-paper-deep rounded-lg mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-paper-deep rounded-lg" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized table skeleton
export function MobileTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-paper-deep rounded-full" />
                <div>
                  <div className="h-4 bg-paper-deep rounded w-20 mb-1" />
                  <div className="h-3 bg-paper-deep rounded w-16" />
                </div>
              </div>
              <div className="h-6 bg-paper-deep rounded w-16" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="h-3 bg-paper-deep rounded w-12 mb-1" />
                <div className="h-4 bg-paper-deep rounded w-24" />
              </div>
              <div>
                <div className="h-3 bg-paper-deep rounded w-16 mb-1" />
                <div className="h-4 bg-paper-deep rounded w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Enhanced loading overlay with mobile support
interface EnhancedLoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  progress?: number
  showProgress?: boolean
  className?: string
}

export function EnhancedLoadingOverlay({ 
  isLoading, 
  children, 
  message = 'Loading...',
  progress,
  showProgress = false,
  className = '' 
}: EnhancedLoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-paper/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-paper-sub border border-secondary-borders rounded-lg p-6 shadow-large text-center max-w-sm mx-4">
          <div className="w-12 h-12 bg-paper-sub border border-ink-rule rounded-full flex items-center justify-center mx-auto mb-4">
            <LoadingSpinner size="lg" color="cobalt" variant="hex" />
          </div>
          <p className="text-ink-muted font-medium mb-2">{message}</p>
          {showProgress && progress !== undefined && (
            <div className="w-full bg-paper-deep rounded-full h-2 mb-2">
              <div 
                className="bg-amber-deep h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
          {showProgress && progress !== undefined && (
            <p className="text-sm text-ink-muted">{Math.round(progress)}%</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized button loading state
interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

export function LoadingButton({ 
  loading, 
  children, 
  loadingText = 'Loading...',
  className = '',
  variant = 'primary',
  size = 'default',
  disabled = false,
  onClick
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${variant === 'primary' ? 'bg-amber-deep text-paper hover:bg-amber-deep/90' : ''}
        ${variant === 'secondary' ? 'bg-paper-sub text-ink-muted border border-ink-rule hover:bg-paper-sub/80' : ''}
        ${variant === 'ghost' ? 'hover:bg-paper-sub hover:text-ink-muted' : ''}
        ${size === 'sm' ? 'h-9 px-3' : size === 'lg' ? 'h-11 px-8' : 'h-10 px-4 py-2'}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center">
          <LoadingSpinner size="sm" color="white" className="mr-2" />
          <span className="hidden sm:inline">{loadingText}</span>
          <span className="sm:hidden">...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

// Mobile-optimized stats cards with loading states
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  loading?: boolean
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  loading = false,
  trend,
  trendValue,
  className = '' 
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-paper-deep rounded-lg" />
            <div className="flex-1">
              <div className="h-3 bg-paper-deep rounded w-16 mb-2" />
              <div className="h-6 bg-paper-deep rounded w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`paper-card hover:shadow-md transition-all duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-paper-sub rounded-lg flex items-center justify-center border border-ink-rule">
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-1">{title}</p>
            <div className="flex items-center gap-3">
              <p className="font-display-tight text-2xl text-ink">{value}</p>
              {trend && trendValue && (
                <Badge
                  variant={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'secondary'}
                  size="sm"
                >
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mobile-optimized action buttons with loading states
export function ActionButtonsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-9 bg-paper-deep rounded-md w-20" />
        </div>
      ))}
    </div>
  )
}

// Mobile-optimized pagination skeleton
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="animate-pulse">
        <div className="h-4 bg-paper-deep rounded w-24" />
      </div>
      <div className="flex items-center gap-3">
        <div className="animate-pulse">
          <div className="h-9 bg-paper-deep rounded-md w-16" />
        </div>
        <div className="animate-pulse">
          <div className="h-9 bg-paper-deep rounded-md w-16" />
        </div>
        <div className="animate-pulse">
          <div className="h-9 bg-paper-deep rounded-md w-20" />
        </div>
      </div>
    </div>
  )
}
