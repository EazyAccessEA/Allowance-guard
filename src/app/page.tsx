'use client'

import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import FeaturesPreview from '@/components/FeaturesPreview'
import CTABand from '@/components/CTABand'
import SampleScanDemo from '@/components/SampleScanDemo'
import ChainLogoCarousel from '@/components/ChainLogoCarousel'
import { LazySection } from '@/components/LazySection'
import { WalletErrorBoundary, RpcErrorBoundary } from '@/components/ErrorBoundary'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { useDashboard } from '@/hooks/useDashboard'
import dynamicImport from 'next/dynamic'

const StatisticsSection = dynamicImport(() => import('@/components/StatisticsSection'), {
  loading: () => <div className="animate-pulse bg-paper-sub h-64 w-full" />,
  ssr: false,
})

const AppArea = dynamicImport(() => import('@/components/AppArea'), {
  loading: () => <div className="animate-pulse bg-paper-sub h-96 w-full" />,
  ssr: false,
})

const ActivityTimeline = dynamicImport(() => import('@/components/ActivityTimeline'), {
  loading: () => <div className="animate-pulse bg-paper-sub h-48 w-full" />,
  ssr: false,
})

function ErrorFallback({ resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <h2 className="font-fraunces-display italic text-3xl text-ink mb-4">Something went wrong</h2>
        <p className="font-plex text-ink-muted mb-6">
          An unexpected error occurred. Try refreshing, or contact support if it persists.
        </p>
        <button
          onClick={resetError}
          className="bg-ink text-paper px-6 py-2 font-plex font-semibold hover:bg-amber-deep transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

/**
 * Homepage — conversion flow for the Scared Retail persona.
 *
 * Order:
 *  1. Hero (plain-English threat + AddressInput above the fold)
 *  2. Threat (loss aversion: forgotten approvals drain wallets)
 *  3. SampleScanDemo (recognition: here's what a scan looks like)
 *  4. HowItWorks (clarity: three steps, plain copy)
 *  5. FeaturesPreview (differentiation)
 *  6. CTABand (now your turn — single dark inverse moment)
 *  7. ChainLogoCarousel (trust closing bookend)
 *  8. AppArea (inline when wallet selected/connected)
 *
 * Cuts vs v1: Testimonials section removed entirely (no fakes).
 * Will be reinstated when real testimonials exist.
 */
export default function HomePage() {
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

  if (error) {
    return <ErrorFallback error={error} resetError={resetError} />
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* 1 — Hero */}
      <div className="relative z-20">
        <WalletErrorBoundary>
          <Hero
            isConnected={isConnected}
            onScan={startScan}
            isScanning={pending}
            scanMessage={message}
            onWalletSelect={setSelectedWallet}
          />
        </WalletErrorBoundary>
      </div>

      {/* 2 — The threat (loss aversion early) */}
      <LazySection>
        <StatisticsSection />
      </LazySection>

      {/* 3 — Sample scan (recognition + reciprocity) */}
      <SampleScanDemo />

      {/* 4 — How it works */}
      <HowItWorks />

      {/* 5 — Features */}
      <FeaturesPreview />

      {/* 6 — CTA (the single dark moment) */}
      <CTABand isConnected={isConnected} onScan={startScan} isScanning={pending} />

      {/* 7 — Chain coverage trust bookend */}
      <ChainLogoCarousel />

      {/* Inline dashboard when a wallet is selected (paste OR connect) */}
      {isHydrated && selectedWallet && (
        <RpcErrorBoundary>
          <LazySection>
            <div id="security-dashboard" className="scroll-mt-20" data-testid="security-dashboard">
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
                canRevoke={isConnected}
                loading={pending}
              />
            </div>
          </LazySection>
        </RpcErrorBoundary>
      )}

      {/* Activity timeline */}
      {isHydrated && selectedWallet && (
        <Section>
          <Container>
            <ActivityTimeline wallet={selectedWallet} />
          </Container>
        </Section>
      )}
    </div>
  )
}
