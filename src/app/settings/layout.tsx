'use client'

import { WalletErrorBoundary } from '@/components/ErrorBoundary'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WalletErrorBoundary>{children}</WalletErrorBoundary>
}
