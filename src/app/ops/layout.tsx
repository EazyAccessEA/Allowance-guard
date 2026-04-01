'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
