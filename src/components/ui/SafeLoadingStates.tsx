// Safe Loading States with Feature Flag Protection
// These components can be safely deployed without breaking existing functionality

import { isFeatureEnabled } from '@/lib/feature-flags'
import { cn } from '@/lib/utils'

// Basic skeleton (always available)
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Enhanced skeleton (feature-flagged)
export function EnhancedSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const enhancedLoadingEnabled = isFeatureEnabled('sophisticatedLoadingStates')
  
  if (!enhancedLoadingEnabled) {
    return <Skeleton className={className} {...props} />
  }
  
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted",
        "bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
        className
      )}
      {...props}
    />
  )
}

// Allowance table skeleton with feature flag protection
export function AllowanceTableSkeleton() {
  const enhancedLoadingEnabled = isFeatureEnabled('sophisticatedLoadingStates')
  
  if (!enhancedLoadingEnabled) {
    // Fallback to basic skeleton
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    )
  }
  
  // Enhanced skeleton with better animations
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <EnhancedSkeleton className="h-4 w-4 rounded-full" />
          <div className="flex-1 space-y-2">
            <EnhancedSkeleton className="h-4 w-[200px]" />
            <EnhancedSkeleton className="h-3 w-[150px]" />
          </div>
          <EnhancedSkeleton className="h-4 w-[100px]" />
          <EnhancedSkeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  )
}

// Safe loading wrapper that respects feature flags
export function SafeLoadingWrapper({ 
  children, 
  loading, 
  fallback 
}: { 
  children: React.ReactNode
  loading: boolean
  fallback?: React.ReactNode 
}) {
  if (!loading) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  return <AllowanceTableSkeleton />
}

// CSS for shimmer animation (only loaded if feature enabled)
export const shimmerCSS = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`
