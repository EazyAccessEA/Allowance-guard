'use client'

// Official Rollbar React Provider
// Documentation: https://docs.rollbar.com/docs/react

import { Provider, ErrorBoundary } from '@rollbar/react'
import { rollbarClientConfig } from '@/lib/rollbar-config'

interface RollbarProviderProps {
  children: React.ReactNode
}

export default function RollbarProvider({ children }: RollbarProviderProps) {
  // Check if Rollbar is properly configured
  const isConfigured = !!process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN

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
