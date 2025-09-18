'use client'

// Official Rollbar React Provider
// Documentation: https://docs.rollbar.com/docs/react

import { Provider, ErrorBoundary } from '@rollbar/react'
import { rollbarClientConfig } from '@/lib/rollbar-config'

interface RollbarProviderProps {
  children: React.ReactNode
}

export default function RollbarProvider({ children }: RollbarProviderProps) {
  // Only initialize Rollbar if we have a valid access token
  const isConfigured = process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN && 
    process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN !== 'YOUR_CLIENT_ACCESS_TOKEN_HERE'

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
