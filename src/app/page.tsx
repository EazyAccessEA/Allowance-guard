'use client'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import ConnectButton from '@/components/ConnectButton'
import Hero from '@/components/Hero'
import StatisticsSection from '@/components/StatisticsSection'
import AppArea from '@/components/AppArea'
import ActivityTimeline from '@/components/ActivityTimeline'

export default function HomePage() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
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

  async function fetchAllowances(addr: string, p = page, ps = pageSize) {
    const res = await fetch(`/api/allowances?wallet=${addr}&page=${p}&pageSize=${ps}`)
    const json = await res.json()
    setRows(json.allowances || [])
    setTotal(json.total || 0)
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setMessage('Select or connect a wallet first')
      return
    }
    if (pending) return // debounce protection
    setPending(true)
    setMessage('Queuing…')
    try {
      const res = await fetch('/api/scan', { 
        method:'POST', 
        headers:{'content-type':'application/json'}, 
        body: JSON.stringify({ walletAddress: target, chains: ['eth','arb','base'] }) 
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed to queue')
      
      setJobId(j.jobId)
      setMessage(`Scan queued (#${j.jobId})`)
      
      // Optional: immediately ping the processor in dev
      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/jobs/process', { method: 'POST' }).catch(()=>{})
      }
      
      // Poll job until done
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 3000))
        const s = await fetch(`/api/jobs/${j.jobId}`).then(r => r.json())
        if (s.status === 'succeeded') { 
          setMessage('Scan complete')
          break 
        }
        if (s.status === 'failed') { 
          setMessage(`Scan failed: ${s.error || ''}`)
          break 
        }
        setMessage(`Scanning… (attempt ${s.attempts})`)
      }
      
      // Post-scan tasks
      await fetch('/api/risk/refresh', { 
        method:'POST', 
        headers:{'content-type':'application/json'}, 
        body: JSON.stringify({ wallet: target }) 
      })
      await fetch('/api/enrich', { 
        method:'POST', 
        headers:{'content-type':'application/json'}, 
        body: JSON.stringify({ wallet: target }) 
      })
      await fetchAllowances(target, 1, pageSize)
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Scan failed to queue')
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

      {/* Statistics Section */}
      <StatisticsSection />

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
              <h3 className="text-xl font-semibold text-text-primary mb-4">Connect & Scan</h3>
              <p className="text-text-secondary leading-relaxed">
                Connect your wallet securely. We read public blockchain data only. Your private keys and funds remain completely under your control.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-info/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-semantic-info">2</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">Analyze & Understand</h3>
              <p className="text-text-secondary leading-relaxed">
                Get a clear risk assessment instantly. We analyze every allowance and flag risky, unlimited, or malicious approvals with advanced intelligence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-semantic-success">3</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">Act & Secure</h3>
              <p className="text-text-secondary leading-relaxed">
                Revoke with confidence. One-click revocation executes directly from your wallet. Batch multiple revocations to save on gas fees.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="py-16 sm:py-20 lg:py-24 bg-background-light">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
                Built for Security & Clarity
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed">
                Every feature is designed with one goal: keeping your assets secure.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Non-Custodial Security</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Full control remains in your wallet. We never hold your keys, funds, or require any permissions to move them. Every transaction is executed directly from your wallet.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-semantic-info/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Clarity-First Dashboard</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Designed to enterprise standards. See your entire security posture at a glance, with no jargon or confusion. Every piece of information is actionable and immediately understandable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-semantic-warning/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Advanced Risk Intelligence</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Risk scores are powered by real-time threat data, identifying known malicious contracts and anomalous approvals. Our intelligence engine continuously updates to stay ahead of emerging threats.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">Gas-Efficient Revocation</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Batch revoke multiple allowances in a single transaction to save on gas fees and time. Our smart contract optimization ensures you pay the minimum possible gas costs for maximum security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA Section */}
      <Section className="py-16 sm:py-20 lg:py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
              Ready to Secure Your Wallet?
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Complete your security audit in under a minute. No sign-up required, no email collection, just connect and scan.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <ConnectButton 
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

      {/* App Area - Only show when connected */}
      {isConnected && (
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
      )}

      {/* Activity Timeline - Only show when wallet is selected */}
      {selectedWallet && (
        <Section>
          <Container>
            <ActivityTimeline wallet={selectedWallet} />
          </Container>
        </Section>
      )}

      {/* Trust Section */}
      <Section className="py-12 sm:py-16 bg-background-light">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base text-text-secondary font-medium mb-6">
              Trusted by security-conscious users across
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
              <span className="text-lg text-text-secondary font-medium">Ethereum</span>
              <span className="text-lg text-text-secondary font-medium">Arbitrum</span>
              <span className="text-lg text-text-secondary font-medium">Base</span>
              <span className="text-lg text-text-secondary font-medium">Polygon</span>
              <span className="text-lg text-text-secondary font-medium">Optimism</span>
              <span className="text-lg text-text-secondary font-medium">Avalanche</span>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}