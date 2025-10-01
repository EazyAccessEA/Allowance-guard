// Safe Error Handling with Feature Flag Protection
// These components can be safely deployed without breaking existing functionality

import { isFeatureEnabled } from '@/lib/feature-flags'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from './SafeButton'
import { useState } from 'react'

// Basic error boundary (always available)
export function BasicErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error, reset: () => void }>
}) {
  const [error, setError] = useState<Error | null>(null)
  
  if (error) {
    if (fallback) {
      const FallbackComponent = fallback
      return <FallbackComponent error={error} reset={() => setError(null)} />
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    )
  }
  
  return <>{children}</>
}

// Enhanced error boundary (feature-flagged)
export function EnhancedErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error, reset: () => void }>
}) {
  const [error, setError] = useState<Error | null>(null)
  const [errorContext] = useState<string>('')
  const contextualErrorsEnabled = isFeatureEnabled('contextualErrorHandling')
  
  if (!contextualErrorsEnabled) {
    return <BasicErrorBoundary fallback={fallback}>{children}</BasicErrorBoundary>
  }
  
  if (error) {
    if (fallback) {
      const FallbackComponent = fallback
      return <FallbackComponent error={error} reset={() => setError(null)} />
    }
    
    // Enhanced error UI with context
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50" />
            <AlertTriangle className="relative h-16 w-16 text-red-500 mx-auto" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          
          <p className="text-gray-600 mb-4">
            {errorContext || 'We encountered an unexpected error. Our team has been notified.'}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setError(null)}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => {
                const errorReport = {
                  error: error.message,
                  stack: error.stack,
                  url: window.location.href,
                  timestamp: new Date().toISOString(),
                  userAgent: navigator.userAgent
                }
                console.error('Error Report:', errorReport)
                // In production, send to error reporting service
              }}
              className="w-full text-xs"
            >
              <Bug className="h-3 w-3 mr-1" />
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

// Safe error wrapper that respects feature flags
export function SafeErrorWrapper({ 
  children, 
  error, 
  reset 
}: { 
  children: React.ReactNode
  error?: Error | null
  reset?: () => void
}) {
  if (!error) {
    return <>{children}</>
  }
  
  const contextualErrorsEnabled = isFeatureEnabled('contextualErrorHandling')
  
  if (!contextualErrorsEnabled) {
    // Basic error display
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error.message}</span>
        </div>
      </div>
    )
  }
  
  // Enhanced error display
  return (
    <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error occurred
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {error.message}
          </p>
          {reset && (
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={reset}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export the appropriate error boundary based on feature flags
export function ErrorBoundary(props: { children: React.ReactNode, fallback?: React.ComponentType<{ error: Error, reset: () => void }> }) {
  const contextualErrorsEnabled = isFeatureEnabled('contextualErrorHandling')
  
  if (contextualErrorsEnabled) {
    return <EnhancedErrorBoundary {...props} />
  }
  
  return <BasicErrorBoundary {...props} />
}
