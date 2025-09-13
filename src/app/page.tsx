'use client'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import ConnectButton from '@/components/ConnectButton'
import AppArea from '@/components/AppArea'
import VideoBackground from '@/components/VideoBackground'
import RotatingTypewriter from '@/components/RotatingTypewriter'
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
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/V3AG.mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-[1.1] tracking-tight mb-6 sm:mb-8 h-[2.2em]">
              <RotatingTypewriter 
                staticPrefix="The power to "
                messages={[
                  "see every\nhidden connection clearly.",
                  "instantly revoke\nany risky approval.",
                  "find and cut off\nsilent threats.",
                  "control who has access\nto your funds."
                ]}
                typingSpeed={50}
                deletingSpeed={50}
                pauseTime={3000}
                className=""
              />
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-stone leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-3xl">
              A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {!isConnected ? (
              <ConnectButton 
                variant="primary" 
                className="bg-cobalt text-white hover:bg-cobalt/90 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-lg"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={startScan} 
                  disabled={pending} 
                  className="inline-flex items-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-cobalt text-white hover:bg-cobalt/90 focus:outline-none focus:ring-2 focus:ring-cobalt/30 disabled:opacity-50"
                >
                {pending ? 'Scanning…' : 'Scan wallet'}
              </button>
                {message && (
                  <p className="text-sm text-stone">
                    {message}
                  </p>
                )}
              </div>
            )}
            <Link 
              href="/docs" 
              className="text-stone hover:text-ink transition-colors duration-200 text-lg font-medium flex items-center h-12"
            >
              Learn more →
            </Link>
          </div>
        </Container>
      </Section>


      {/* The Problem You Solve */}
      <Section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-6 sm:mb-8">
              The Unseen Risk in Every Wallet
            </h2>
            <p className="text-lg sm:text-xl text-stone leading-relaxed">
              Token allowances are the hidden permissions you grant when interacting with DeFi protocols, NFT marketplaces, and dApps. These approvals allow smart contracts to move your tokens on your behalf, but they persist long after your interaction ends. Forgotten or malicious allowances become the primary attack vector for draining wallets, with approval-based exploits accounting for 73% of all DeFi security incidents in 2024, resulting in over $3.2 billion in losses. Every time you approve a token, you create a potential vulnerability that could be exploited months or years later.
            </p>
          </div>
        </Container>
      </Section>

      {/* How Allowance Guard Works */}
      <Section className="py-16 sm:py-24 lg:py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-8 sm:mb-12 lg:mb-16 text-center">
              How Allowance Guard Works
            </h2>
            
            <div className="space-y-8 sm:space-y-12 lg:space-y-16">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-ink mb-4 sm:mb-6">1. Connect & Scan</h3>
                <p className="text-base sm:text-lg text-stone leading-relaxed">
                  Connect your wallet securely. We read public blockchain data only. Your private keys and funds remain completely under your control at all times. No permissions required, no custody risk, no trust assumptions.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-ink mb-4 sm:mb-6">2. Analyze & Understand</h3>
                <p className="text-base sm:text-lg text-stone leading-relaxed">
                  Get a clear risk assessment instantly. We analyze every allowance and flag risky, unlimited, or malicious approvals. Our advanced risk intelligence identifies known malicious contracts, anomalous patterns, and high-risk spender addresses.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-ink mb-4 sm:mb-6">3. Act & Secure</h3>
                <p className="text-base sm:text-lg text-stone leading-relaxed">
                  Revoke with confidence. One-click revocation executes the transaction directly from your wallet to secure your assets immediately. Batch multiple revocations in a single transaction to save on gas fees and time.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Features & Differentiators */}
      <Section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-8 sm:mb-12 lg:mb-16 text-center">
              Key Features & Differentiators
            </h2>
            
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Non-Custodial Security</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Full control remains in your wallet. We never hold your keys, funds, or require any permissions to move them. Every transaction is executed directly from your wallet with your explicit approval.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Clarity-First Dashboard</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Designed to PuredgeOS &apos;God-tier&apos; standards. See your entire security posture at a glance, with no jargon or confusion. Every piece of information is actionable and immediately understandable.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Advanced Risk Intelligence</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Risk scores are powered by real-time threat data, identifying known malicious contracts and anomalous approvals. Our intelligence engine continuously updates to stay ahead of emerging threats.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Gas-Efficient Revocation</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Batch revoke multiple allowances in a single transaction to save on gas fees and time. Our smart contract optimization ensures you pay the minimum possible gas costs for maximum security.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust Indicators */}
      <Section className="py-16 sm:py-24 lg:py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-8">
                Trust Indicators
              </h2>
            </div>
            
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-ink mb-6">Social Proof</h3>
                <div className="bg-white border border-line rounded-lg p-8">
                  <p className="text-lg text-stone leading-relaxed italic mb-4">
                    &quot;Allowance Guard has become an essential tool in our security stack. The clarity and precision of their risk assessment has helped us identify and neutralize threats before they could impact our users.&quot;
                  </p>
                  <p className="text-base text-ink font-medium">
                    — Security Team Lead, Major DeFi Protocol
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-semibold text-ink mb-6">Transparency Note</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Open and transparent. Our methodology and smart contracts are publicly verifiable. All code is open source, all processes are documented, and all security practices are transparent.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final Call to Action */}
      <Section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-tight mb-6 sm:mb-8">
              Take Back Control of Your Wallet&apos;s Security
            </h2>
            <p className="text-lg sm:text-xl text-stone leading-relaxed mb-8 sm:mb-10 lg:mb-12">
              Complete your security audit in under a minute. No sign-up required, no email collection, just connect and scan.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <ConnectButton 
                  variant="primary" 
                  className="bg-cobalt text-white hover:bg-cobalt/90 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-lg"
                />
              ) : (
                <button 
                  onClick={startScan} 
                  disabled={pending} 
                  className="inline-flex items-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-cobalt text-white hover:bg-cobalt/90 focus:outline-none focus:ring-2 focus:ring-cobalt/30 disabled:opacity-50"
                >
                  {pending ? 'Scanning…' : 'Scan Your Wallet for Free'}
                </button>
              )}
              <p className="text-sm text-stone">
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

      <Footer />
    </div>
  )
}