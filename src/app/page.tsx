'use client'
import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Hero from '@/components/Hero'
import TrustStats from '@/components/TrustStats'
import HowItWorks from '@/components/HowItWorks'
import FeaturesPreview from '@/components/FeaturesPreview'
import CTABand from '@/components/CTABand'
import Testimonials from '@/components/Testimonials'
import ChainLogoCarousel from '@/components/ChainLogoCarousel'
import { LazySection } from '@/components/LazySection'
import { WalletErrorBoundary, RpcErrorBoundary } from '@/components/ErrorBoundary'
import { APIClient } from '@/lib/api-client'
import dynamicImport from 'next/dynamic'

// Dynamic imports for heavy components
const StatisticsSection = dynamicImport(() => import('@/components/StatisticsSection'), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-secondary-700 rounded h-64 w-full" />,
  ssr: false
})

const AppArea = dynamicImport(() => import('@/components/AppArea'), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-secondary-700 rounded h-96 w-full" />,
  ssr: false
})

const ActivityTimeline = dynamicImport(() => import('@/components/ActivityTimeline'), {
  loading: () => <div className="animate-pulse bg-neutral-200 dark:bg-secondary-700 rounded h-48 w-full" />,
  ssr: false
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
  const { address: connectedAddress, isConnected } = useAccount()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [rows, setRows] = useState<{
    chain_id: number
    token_address: string
    spender_address: string
    standard: string
    allowance_type: string
    amount: string
    is_unlimited: boolean
    last_seen_block: string
    risk_score: number
    risk_flags: string[]
  }[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState(0)
  const [pending, setPending] = useState(false)
  const [, setJobId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const fetchAllowances = useCallback(async (addr: string, p = page, ps = pageSize) => {
    try {
      const json = await APIClient.getAllowances(addr, p, ps)
      setRows(json.allowances || [])
      setTotal(json.total || 0)
      setError(null)
    } catch (err) {
      handleError(err as Error, 'fetchAllowances')
    }
  }, [page, pageSize])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isConnected && connectedAddress && !selectedWallet) {
      setSelectedWallet(connectedAddress)
    }
  }, [isConnected, connectedAddress, selectedWallet])

  useEffect(() => {
    if (selectedWallet && isHydrated) {
      fetchAllowances(selectedWallet)
    }
  }, [selectedWallet, isHydrated, fetchAllowances])

  // Auto-scroll to Security Dashboard when wallet connects
  useEffect(() => {
    if (isConnected && selectedWallet && isHydrated) {
      const scrollToDashboard = () => {
        const el = document.getElementById('security-dashboard')
        if (el) {
          el.classList.add('animate-pulse')
          const rect = el.getBoundingClientRect()
          window.scrollTo({
            top: rect.top + window.pageYOffset - 80,
            behavior: 'smooth'
          })
          setTimeout(() => el.classList.remove('animate-pulse'), 1000)
          return true
        }
        return false
      }

      const tryScroll = (attempt = 1) => {
        if (scrollToDashboard()) return
        if (attempt < 5) {
          setTimeout(() => tryScroll(attempt + 1), attempt * 500)
        }
      }

      setTimeout(() => tryScroll(), 100)
    }
  }, [isConnected, selectedWallet, isHydrated])

  const handleError = (err: Error, context: string) => {
    console.error(`Error in ${context}:`, err)
    setError(err)
    setMessage(`Error: ${err.message}`)
  }

  const resetError = () => {
    setError(null)
    setMessage('')
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setMessage('Select or connect a wallet first')
      return
    }
    if (pending) return

    setPending(true)
    setMessage('Queuing…')
    setError(null)

    try {
      const scanResult = await APIClient.startScan(target, ['eth', 'arb', 'base'])

      if (!scanResult.jobId) {
        throw new Error('Failed to get job ID from scan response')
      }

      setJobId(scanResult.jobId)
      setMessage(`Scan queued (#${scanResult.jobId})`)

      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/jobs/process', { method: 'POST' }).catch(() => {})
      }

      let attempts = 0
      const maxAttempts = 40

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000))
        attempts++

        try {
          const status = await APIClient.getJobStatus(scanResult.jobId)

          if (status.status === 'succeeded') {
            setMessage('Scan complete')
            break
          }

          if (status.status === 'failed') {
            throw new Error(`Scan failed: ${status.error || 'Unknown error'}`)
          }

          setMessage(`Scanning… (attempt ${status.attempts || attempts})`)
        } catch (pollError) {
          console.error('Polling error:', pollError)
          if (attempts >= maxAttempts) {
            throw new Error('Scan timed out - please try again')
          }
        }
      }

      try {
        await Promise.allSettled([
          APIClient.refreshRisk(target),
          APIClient.enrichData(target)
        ])
        await fetchAllowances(target, 1, pageSize)
      } catch (postScanError) {
        console.error('Post-scan tasks failed:', postScanError)
      }
    } catch (err) {
      handleError(err as Error, 'startScan')
    } finally {
      setPending(false)
    }
  }

  const handlePage = async (newPage: number) => {
    setPage(newPage)
    if (selectedWallet) {
      await fetchAllowances(selectedWallet, newPage, pageSize)
    }
  }

  const handlePageSize = async (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    if (selectedWallet) {
      await fetchAllowances(selectedWallet, 1, newPageSize)
    }
  }

  const handleRefresh = async () => {
    if (selectedWallet) {
      await fetchAllowances(selectedWallet, page, pageSize)
    }
  }

  if (error) {
    return <ErrorFallback error={error} resetError={resetError} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0E1A]">
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

      {/* Trust Statistics */}
      <TrustStats />

      {/* How It Works */}
      <HowItWorks />

      {/* Statistics — lazy loaded */}
      <LazySection>
        <StatisticsSection />
      </LazySection>

      {/* Features */}
      <FeaturesPreview />

      {/* CTA */}
      <CTABand
        isConnected={isConnected}
        onScan={startScan}
        isScanning={pending}
      />

      {/* Testimonials */}
      <Testimonials />

      {/* Security Dashboard — visible when wallet connected */}
      {isHydrated && isConnected && selectedWallet && (
        <RpcErrorBoundary>
          <LazySection>
            <div
              id="security-dashboard"
              className="scroll-mt-20"
              data-testid="security-dashboard"
            >
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

      {/* Chain Logo Carousel */}
      <ChainLogoCarousel />
    </div>
  )
}
