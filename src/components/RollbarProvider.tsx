'use client'

// Official Rollbar React Provider
// Documentation: https://docs.rollbar.com/docs/react

import { Provider, ErrorBoundary } from '@rollbar/react'
import { rollbarClientConfig } from '@/lib/rollbar-config'

interface RollbarProviderProps {
  children: React.ReactNode
}

export default function RollbarProvider({ children }: RollbarProviderProps) {
  // Temporarily disable Rollbar to fix console errors
  // TODO: Configure valid Rollbar access token
  const isConfigured = false

  if (!isConfigured) {
    // Return children without Rollbar provider if not configured
    return <>{children}</>
  }

  return (
    <Provider config={rollbarClientConfig}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Provider>
  )
}
