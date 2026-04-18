'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import MarketingWatermark from '@/components/MarketingWatermark'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <MarketingWatermark />
      {children}
    </ErrorBoundary>
  )
}
