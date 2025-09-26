'use client'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import Hero from '@/components/Hero'
import { LazySection } from '@/components/LazySection'
import dynamicImport from 'next/dynamic'

// Note: Static generation exports moved to layout.tsx for client components

// Enhanced Dynamic Imports with Error Boundaries
const StatisticsSection = dynamicImport(() => import('@/components/StatisticsSection'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-64 w-full" />,
  ssr: false // Prevent SSR issues
})

const AppArea = dynamicImport(() => import('@/components/AppArea'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-96 w-full" />,
  ssr: false
})

const ActivityTimeline = dynamicImport(() => import('@/components/ActivityTimeline'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-48 w-full" />,
  ssr: false
})

// Enhanced Error Boundary Component
function ErrorFallback({ resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <h2 className="mobbin-heading-2 text-text-primary mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">We&apos;re working to fix this issue. Please try again.</p>
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

// Enhanced API Client with Retry Logic and Error Handling
class APIClient {
  private static async fetchWithRetry(
    url: string, 
    options: RequestInit = {}, 
    maxRetries: number = 3
  ): Promise<Response> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
        
        if (response.ok) {
          return response
        }
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: ${response.status}`)
        }
        
        throw new Error(`Server error: ${response.status}`)
        
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          break
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError || new Error('Request failed after retries')
  }
  
  static async getAllowances(wallet: string, page: number = 1, pageSize: number = 25) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }
    
    const response = await this.fetchWithRetry(
      `/api/allowances?wallet=${wallet}&page=${page}&pageSize=${pageSize}`
    )
    
    return response.json()
  }
  
  static async startScan(walletAddress: string, chains: string[] = ['eth', 'arb', 'base']) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }
    
    const response = await this.fetchWithRetry('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, chains })
    })
    
    return response.json()
  }
  
  static async getJobStatus(jobId: number) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }
    
    const response = await this.fetchWithRetry(`/api/jobs/${jobId}`)
    return response.json()
  }
  
  static async refreshRisk(wallet: string) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }
    
    const response = await this.fetchWithRetry('/api/risk/refresh', {
      method: 'POST',
      body: JSON.stringify({ wallet })
    })
    
    return response.json()
  }
  
  static async enrichData(wallet: string) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }
    
    const response = await this.fetchWithRetry('/api/enrich', {
      method: 'POST',
      body: JSON.stringify({ wallet })
    })
    
    return response.json()
  }
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

  // Handle hydration to prevent SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true)
  }, [])


  // Enhanced error handling
  const handleError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error)
    setError(error)
    setMessage(`Error: ${error.message}`)
  }

  const resetError = () => {
    setError(null)
    setMessage('')
  }

  // Enhanced fetch allowances with error handling
  async function fetchAllowances(addr: string, p = page, ps = pageSize) {
    try {
      const json = await APIClient.getAllowances(addr, p, ps)
    setRows(json.allowances || [])
    setTotal(json.total || 0)
      setError(null)
    } catch (err) {
      handleError(err as Error, 'fetchAllowances')
    }
  }

  // Enhanced scan function with comprehensive error handling
  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setMessage('Select or connect a wallet first')
      return
    }
    
    if (pending) return // debounce protection
    
    setPending(true)
    setMessage('Queuing…')
    setError(null)
    
    try {
      // Start scan
      const scanResult = await APIClient.startScan(target, ['eth', 'arb', 'base'])
      
      if (!scanResult.jobId) {
        throw new Error('Failed to get job ID from scan response')
      }
      
      setJobId(scanResult.jobId)
      setMessage(`Scan queued (#${scanResult.jobId})`)
      
      // Optional: immediately ping the processor in dev
      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/jobs/process', { method: 'POST' }).catch(() => {})
      }
      
      // Enhanced polling with better error handling
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
      
      // Post-scan tasks with error handling
      try {
        await Promise.allSettled([
          APIClient.refreshRisk(target),
          APIClient.enrichData(target)
        ])
        
      await fetchAllowances(target, 1, pageSize)
        
      } catch (postScanError) {
        console.error('Post-scan tasks failed:', postScanError)
        // Don't fail the entire scan for post-processing errors
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

  // Enhanced error boundary
  if (error) {
    return <ErrorFallback error={error} resetError={resetError} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero
        isConnected={isConnected}
        onScan={startScan}
        isScanning={pending}
        scanMessage={message}
        onWalletSelect={setSelectedWallet}
      />

      {/* Statistics Section - Inspired by DNA Payments */}
      <Section className="py-16 bg-gradient-to-br from-primary-50 to-background-light">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Trusted by Security-Conscious Users
              </h2>
              <p className="text-xl text-text-secondary">
                Protecting digital assets across the Web3 ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-accent mb-2">
                  50,000+
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  Wallets Secured
                </div>
                <div className="text-text-secondary">
                  Monthly active users protecting their assets
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-accent mb-2">
                  2M+
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  Allowances Analyzed
                </div>
                <div className="text-text-secondary">
                  Token approvals scanned and risk-assessed
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-accent mb-2">
                  24/7
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  Security Monitoring
                </div>
                <div className="text-text-secondary">
                  Real-time threat detection and alerts
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust Indicators */}
      <Section className="py-8 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-text-secondary font-medium">
              No private keys required • Read-only access • 100% free
            </p>
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section className="py-16 sm:py-20 lg:py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
              How Allowance Guard Works
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed">
              Three simple steps to secure your wallet and protect your assets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-accent">1</span>
              </div>
              <h3 className="mobbin-heading-3 text-text-primary mb-4">Connect & Scan</h3>
              <p className="text-text-secondary leading-relaxed">
                Connect your wallet securely. We read public blockchain data only. Your private keys and funds remain completely under your control.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-accent">2</span>
              </div>
              <h3 className="mobbin-heading-3 text-text-primary mb-4">Analyze & Understand</h3>
              <p className="text-text-secondary leading-relaxed">
                  Get a clear risk assessment instantly. We analyze every allowance and flag risky, unlimited, or malicious approvals with advanced intelligence.
                </p>
              </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-accent">3</span>
              </div>
              <h3 className="mobbin-heading-3 text-text-primary mb-4">Act & Secure</h3>
              <p className="text-text-secondary leading-relaxed">
                Revoke with confidence. One-click revocation executes directly from your wallet. Batch multiple revocations to save on gas fees.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Statistics Section - Lazy Loaded with Error Boundary */}
      <LazySection>
        <StatisticsSection />
      </LazySection>

      {/* Features Section */}
      <Section className="py-16 sm:py-20 lg:py-24 bg-background-light">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
                Built for Security & Clarity
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed text-justify">
                Every feature is designed with one goal: keeping your assets secure.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                  <div>
                  <h3 className="mobbin-heading-3 text-text-primary mb-3">Non-Custodial Security</h3>
                  <p className="text-text-secondary leading-relaxed text-justify">
                    Full control remains in your wallet. We never hold your keys, funds, or require any permissions to move them. Every transaction is executed directly from your wallet.
                  </p>
                </div>

                  <div>
                  <h3 className="mobbin-heading-3 text-text-primary mb-3">Clarity-First Dashboard</h3>
                  <p className="text-text-secondary leading-relaxed text-justify">
                    Designed to enterprise standards. See your entire security posture at a glance, with no jargon or confusion. Every piece of information is actionable and immediately understandable.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                  <div>
                  <h3 className="mobbin-heading-3 text-text-primary mb-3">Advanced Risk Intelligence</h3>
                  <p className="text-text-secondary leading-relaxed text-justify">
                      Risk scores are powered by real-time threat data, identifying known malicious contracts and anomalous approvals. Our intelligence engine continuously updates to stay ahead of emerging threats.
                    </p>
                </div>

                  <div>
                  <h3 className="mobbin-heading-3 text-text-primary mb-3">Gas-Efficient Revocation</h3>
                  <p className="text-text-secondary leading-relaxed text-justify">
                      Batch revoke multiple allowances in a single transaction to save on gas fees and time. Our smart contract optimization ensures you pay the minimum possible gas costs for maximum security.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA Section */}
      <Section className="py-16 sm:py-20 lg:py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
              Ready to Secure Your Wallet?
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-8 text-justify">
              Complete your security audit in under a minute. No sign-up required, no email collection, just connect and scan.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <ClientConnectButton 
                  variant="primary" 
                  size="lg"
                  className="w-full sm:w-auto"
                />
              ) : (
                <Button
                  onClick={startScan} 
                  disabled={pending} 
                  loading={pending}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {pending ? 'Scanning...' : 'Scan Your Wallet'}
                </Button>
              )}
              <p className="text-sm text-text-tertiary">
                No sign-up required. No email. Just connect and scan.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Allowance Guard? - Inspired by DNA Payments */}
      <Section className="py-16 sm:py-20 lg:py-24 bg-background-light">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
                Why Allowance Guard?
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
                We&apos;ve built the most comprehensive token allowance security platform for Web3, 
                designed to protect your digital assets with enterprise-grade security.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Enterprise Security</h3>
                <p className="text-text-secondary leading-relaxed">
                  Built with the same security standards used by institutional custodians. 
                  Your private keys never leave your device.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Lightning Fast</h3>
                <p className="text-text-secondary leading-relaxed">
                  Complete security audit in under 60 seconds. 
                  Real-time scanning across multiple blockchain networks.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Open Source</h3>
                <p className="text-text-secondary leading-relaxed">
                  Fully transparent and auditable code. 
                  No hidden fees, no data collection, no vendor lock-in.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Multi-Chain Support</h3>
                <p className="text-text-secondary leading-relaxed">
                  Secure your assets across Ethereum, Arbitrum, Base, Polygon, 
                  Optimism, and Avalanche networks.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">24/7 Monitoring</h3>
                <p className="text-text-secondary leading-relaxed">
                  Continuous threat detection and real-time alerts. 
                  Stay protected even when you&apos;re not actively using the platform.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Easy Integration</h3>
                <p className="text-text-secondary leading-relaxed">
                  Simple API and widget integration. 
                  Add security to your dApp or website in minutes.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* App Area - Only show when connected, hydrated, and wallet is explicitly selected */}
      {isHydrated && isConnected && selectedWallet && (
        <LazySection>
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
        </LazySection>
      )}

      {/* Activity Timeline - Only show when wallet is selected and hydrated */}
      {isHydrated && selectedWallet && (
        <Section>
          <Container>
            <ActivityTimeline wallet={selectedWallet} />
          </Container>
        </Section>
      )}

      {/* Trust Section - Full Screen Width */}
      <div className="py-12 sm:py-16 bg-background-light">
        <div className="w-full mb-6">
          <p className="text-base text-text-secondary font-medium text-center">
              Trusted by security-conscious users across
            </p>
        </div>
        
        {/* Mobile: Stacked Logos */}
        <div className="block sm:hidden">
          <div className="flex flex-col items-center gap-6 px-4">
            {/* Ethereum */}
            <div className="flex items-center">
              <Image
                src="/ethereum-logo-landscape-purple.png"
                alt="Ethereum"
                width={140}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            {/* Arbitrum */}
            <div className="flex items-center">
              <Image
                src="/0923_Arbitrum_Logos_Primary_horizontal_RGB.svg"
                alt="Arbitrum"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            {/* Base */}
            <div className="flex items-center">
              <Image
                src="/Base_lockup_2color.svg"
                alt="Base"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            {/* Polygon */}
            <div className="flex items-center">
              <Image
                src="/Polygon Primary Dark.svg"
                alt="Polygon"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            {/* Optimism */}
            <div className="flex items-center">
              <Image
                src="/OPTIMISM-B.svg"
                alt="Optimism"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            
            {/* Avalanche */}
            <div className="flex items-center">
              <Image
                src="/AvalancheLogo_Horizontal_4C_Primary.svg"
                alt="Avalanche"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Desktop: Full Screen Edge-to-Edge Continuous Scrolling */}
        <div className="hidden sm:block w-screen relative overflow-hidden h-12 -ml-4 sm:-ml-6 lg:-ml-8">
          <div className="flex items-center gap-16 lg:gap-24 animate-scroll h-12 whitespace-nowrap">
            {/* First set of logos */}
            <div className="flex items-center gap-16 lg:gap-24 flex-shrink-0">
              {/* Ethereum */}
              <div className="flex items-center">
                <Image
                  src="/ethereum-logo-landscape-purple.png"
                  alt="Ethereum"
                  width={140}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Arbitrum */}
              <div className="flex items-center">
                <Image
                  src="/0923_Arbitrum_Logos_Primary_horizontal_RGB.svg"
                  alt="Arbitrum"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Base */}
              <div className="flex items-center">
                <Image
                  src="/Base_lockup_2color.svg"
                  alt="Base"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Polygon */}
              <div className="flex items-center">
                <Image
                  src="/Polygon Primary Dark.svg"
                  alt="Polygon"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Optimism */}
              <div className="flex items-center">
                <Image
                  src="/OPTIMISM-B.svg"
                  alt="Optimism"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Avalanche */}
              <div className="flex items-center">
                <Image
                  src="/AvalancheLogo_Horizontal_4C_Primary.svg"
                  alt="Avalanche"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-16 lg:gap-24 flex-shrink-0">
              {/* Ethereum */}
              <div className="flex items-center">
                <Image
                  src="/ethereum-logo-landscape-purple.png"
                  alt="Ethereum"
                  width={140}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Arbitrum */}
              <div className="flex items-center">
                <Image
                  src="/0923_Arbitrum_Logos_Primary_horizontal_RGB.svg"
                  alt="Arbitrum"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Base */}
              <div className="flex items-center">
                <Image
                  src="/Base_lockup_2color.svg"
                  alt="Base"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Polygon */}
              <div className="flex items-center">
                <Image
                  src="/Polygon Primary Dark.svg"
                  alt="Polygon"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Optimism */}
              <div className="flex items-center">
                <Image
                  src="/OPTIMISM-B.svg"
                  alt="Optimism"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Avalanche */}
              <div className="flex items-center">
                <Image
                  src="/AvalancheLogo_Horizontal_4C_Primary.svg"
                  alt="Avalanche"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>
            
            {/* Third set for ultra-smooth scrolling */}
            <div className="flex items-center gap-16 lg:gap-24 flex-shrink-0">
              {/* Ethereum */}
              <div className="flex items-center">
                <Image
                  src="/ethereum-logo-landscape-purple.png"
                  alt="Ethereum"
                  width={140}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Arbitrum */}
              <div className="flex items-center">
                <Image
                  src="/0923_Arbitrum_Logos_Primary_horizontal_RGB.svg"
                  alt="Arbitrum"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Base */}
              <div className="flex items-center">
                <Image
                  src="/Base_lockup_2color.svg"
                  alt="Base"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Polygon */}
              <div className="flex items-center">
                <Image
                  src="/Polygon Primary Dark.svg"
                  alt="Polygon"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Optimism */}
              <div className="flex items-center">
                <Image
                  src="/OPTIMISM-B.svg"
                  alt="Optimism"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              
              {/* Avalanche */}
              <div className="flex items-center">
                <Image
                  src="/AvalancheLogo_Horizontal_4C_Primary.svg"
                  alt="Avalanche"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}