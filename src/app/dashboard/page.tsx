'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import { WalletErrorBoundary, RpcErrorBoundary } from '@/components/ErrorBoundary'
import { LazySection } from '@/components/LazySection'
import { useDashboard } from '@/hooks/useDashboard'
import dynamicImport from 'next/dynamic'

const AppArea = dynamicImport(() => import('@/components/AppArea'), {
  loading: () => <div className="animate-pulse bg-paper-sub rounded h-96 w-full" />,
  ssr: false,
})

const ActivityTimeline = dynamicImport(() => import('@/components/ActivityTimeline'), {
  loading: () => <div className="animate-pulse bg-paper-sub rounded h-48 w-full" />,
  ssr: false,
})

export default function DashboardPage() {
  const {
    connectedAddress,
    isConnected,
    selectedWallet,
    setSelectedWallet,
    isHydrated,
    rows,
    total,
    page,
    pageSize,
    pending,
    message,
    error,
    startScan,
    handlePage,
    handlePageSize,
    handleRefresh,
    resetError,
  } = useDashboard()

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-paper-deep flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <h2 className="text-2xl font-bold text-ink mb-4">
            Something went wrong
          </h2>
          <p className="text-ink-muted mb-6">
            {error.message}
          </p>
          <button
            onClick={resetError}
            className="bg-primary-700 text-ink px-6 py-2 rounded-lg hover:bg-primary-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Not connected — prompt to connect
  if (isHydrated && !isConnected) {
    return (
      <div className="min-h-screen bg-paper dark:bg-paper">
        <Section className="py-24">
          <Container>
            <div className="max-w-lg mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
                Security Dashboard
              </h1>
              <p className="text-lg text-ink-muted mb-8">
                Connect your wallet to view your token approvals, risk scores, and security posture.
              </p>
              <WalletErrorBoundary>
                <ClientConnectButton
                  variant="primary"
                  size="lg"
                  className="min-h-[44px] px-8 py-4 text-lg font-semibold"
                />
              </WalletErrorBoundary>
            </div>
          </Container>
        </Section>
      </div>
    )
  }

  // Connected but no wallet selected yet (brief loading state)
  if (!isHydrated || !selectedWallet) {
    return (
      <div className="min-h-screen bg-paper dark:bg-paper flex items-center justify-center">
        <div className="animate-pulse text-ink-muted">
          Loading dashboard…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper dark:bg-paper">
      {/* Scan bar */}
      <Section className="py-6 bg-paper-sub dark:bg-paper-deep border-b border-ink-rule">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">
                Security Dashboard
              </h1>
              {message && (
                <p className="text-sm text-ink-muted mt-1">
                  {message}
                </p>
              )}
            </div>
            <Button
              onClick={() => startScan()}
              disabled={pending}
              loading={pending}
              variant="primary"
              size="default"
              className="min-h-[44px]"
            >
              {pending ? 'Scanning…' : 'Scan Wallet'}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Main dashboard */}
      <RpcErrorBoundary>
        <LazySection>
          <div id="security-dashboard" data-testid="security-dashboard">
            <AppArea
              isConnected={isConnected}
              selectedWallet={selectedWallet}
              setSelectedWallet={setSelectedWallet}
              rows={rows}
              total={total}
              page={page}
              pageSize={pageSize}
              onPage={handlePage}
              onPageSize={handlePageSize}
              onRefresh={handleRefresh}
              connectedAddress={connectedAddress}
              canRevoke={true}
              loading={pending}
            />
          </div>
        </LazySection>
      </RpcErrorBoundary>

      {/* Activity Timeline */}
      <Section>
        <Container>
          <ActivityTimeline wallet={selectedWallet} />
        </Container>
      </Section>
    </div>
  )
}
