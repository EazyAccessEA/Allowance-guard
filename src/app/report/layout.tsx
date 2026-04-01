'use client'

import { RpcErrorBoundary } from '@/components/ErrorBoundary'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RpcErrorBoundary>{children}</RpcErrorBoundary>
}
