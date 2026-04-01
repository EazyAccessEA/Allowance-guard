'use client'

import { CheckoutErrorBoundary } from '@/components/ErrorBoundary'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CheckoutErrorBoundary>{children}</CheckoutErrorBoundary>
}
