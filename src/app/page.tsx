'use client'

import Hero from '@/components/Hero'
// TrustStats removed — redundant with hero stats bar and trust dots
import HowItWorks from '@/components/HowItWorks'
import FeaturesPreview from '@/components/FeaturesPreview'
import CTABand from '@/components/CTABand'
import Testimonials from '@/components/Testimonials'
import ChainLogoCarousel from '@/components/ChainLogoCarousel'
import { LazySection } from '@/components/LazySection'
import { WalletErrorBoundary, RpcErrorBoundary } from '@/components/ErrorBoundary'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { useDashboard } from '@/hooks/useDashboard'
import dynamicImport from 'next/dynamic'

const StatisticsSection = dynamicImport(() => import('@/components/StatisticsSection'), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-secondary-700 rounded h-64 w-full" />,
  ssr: false,
})

const AppArea = dynamicImport(() => import('@/components/AppArea'), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-secondary-700 rounded h-96 w-full" />,
  ssr: false,
})

const ActivityTimeline = dynamicImport(() => import('@/components/ActivityTimeline'), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-secondary-700 rounded h-48 w-full" />,
  ssr: false,
})

function ErrorFallback({ resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-background-primary dark:bg-secondary-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <h2 className="mobbin-heading-2 text-text-primary dark:text-secondary-100 mb-4">Something went wrong</h2>
        <p className="text-text-secondary dark:text-secondary-400 mb-6">We&apos;re working to fix this issue. Please try again.</p>
        <button
          onClick={resetError}
          className="bg-primary-700 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

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
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero */}
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

      {/* Marketing sections — dark-first, gradient transitions between each */}
      <HowItWorks />

      <LazySection>
        <StatisticsSection />
      </LazySection>

      <FeaturesPreview />
      <CTABand isConnected={isConnected} onScan={startScan} isScanning={pending} />
      <Testimonials />

      {/* Security Dashboard — inline when wallet connected */}
      {isHydrated && isConnected && selectedWallet && (
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
                canRevoke={true}
                loading={pending}
              />
            </div>
          </LazySection>
        </RpcErrorBoundary>
      )}

      {/* Activity Timeline */}
      {isHydrated && selectedWallet && (
        <Section>
          <Container>
            <ActivityTimeline wallet={selectedWallet} />
          </Container>
        </Section>
      )}

      {/* Chain Logos */}
      <ChainLogoCarousel />
    </div>
  )
}
