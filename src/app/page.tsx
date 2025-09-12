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
      <Section className="relative py-24 sm:py-32 overflow-hidden">
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
        
        <Container className="relative text-left max-w-4xl z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink leading-[1.1] tracking-tight mb-8">
            Find and neutralize risky token approvals
          </h1>
          <p className="text-xl sm:text-2xl text-stone leading-relaxed mb-12 max-w-3xl">
            A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              🔓 100% Open Source
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              💝 Completely Free
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
            {!isConnected ? (
              <ConnectButton 
                variant="primary" 
                className="bg-ink text-white hover:bg-ink/90 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-lg"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={startScan} 
                  disabled={pending} 
                  className="inline-flex items-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-ink text-white hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-ink/30 disabled:opacity-50"
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
              className="text-stone hover:text-ink transition-colors duration-200 text-lg font-medium"
            >
              Learn more →
            </Link>
          </div>
        </Container>
      </Section>

      {/* Value Proposition Strip - Fireart Style */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-ink/5 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Audit approvals</h3>
              <p className="text-stone leading-relaxed">
                One scan across supported chains reveals unlimited and risky allowances.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-ink/5 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Revoke cleanly</h3>
              <p className="text-stone leading-relaxed">
                Guided revocation flows with links to explorers and revoke utilities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 bg-ink/5 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 1v6h6V1h-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Stay ahead</h3>
              <p className="text-stone leading-relaxed">
                Email/Slack alerts on new or high-risk approvals. Noise controlled.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Allowance Guard Section - Fireart Style */}
      <Section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-8">
                Why Allowance Guard?
              </h2>
              <div className="space-y-6 text-lg text-stone leading-relaxed">
                <p>
                  Token approvals are one of the most overlooked security risks in DeFi. 
                  Most users unknowingly grant unlimited spending permissions to protocols, 
                  creating massive attack vectors.
                </p>
                <p>
                  Allowance Guard provides a comprehensive solution for monitoring, 
                  analyzing, and managing these permissions across multiple chains, 
                  helping users maintain control over their digital assets.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-ink mb-2">10,000+</div>
                <div className="text-stone">Wallets Protected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-ink mb-2">$2.5M+</div>
                <div className="text-stone">Assets Secured</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-ink mb-2">99.9%</div>
                <div className="text-stone">Uptime</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Grid - Fireart Style */}
      <Section className="py-24 bg-mist/20">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-6">
              Comprehensive Protection
            </h2>
            <p className="text-xl text-stone max-w-3xl mx-auto">
              Everything you need to secure your wallet permissions across all major chains.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-subtle">
                <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Unlimited Detection</h3>
              <p className="text-stone leading-relaxed">
                Identify unlimited allowances that pose the highest risk to your assets.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-subtle">
                <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Cross-Chain</h3>
              <p className="text-stone leading-relaxed">
                Monitor approvals across Ethereum, Arbitrum, Base, and other major chains.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-subtle">
                <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 1v6h6V1h-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Smart Alerts</h3>
              <p className="text-stone leading-relaxed">
                Get notified about new approvals and high-risk changes via email or Slack.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-subtle">
                <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Revocation Guidance</h3>
              <p className="text-stone leading-relaxed">
                Step-by-step guidance for safely revoking permissions with direct links.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Social Proof / Logos Strip - Fireart Style */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <p className="text-stone text-lg">Trusted by security-conscious users across</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-ink/40">Ethereum</div>
            <div className="text-2xl font-bold text-ink/40">Arbitrum</div>
            <div className="text-2xl font-bold text-ink/40">Base</div>
            <div className="text-2xl font-bold text-ink/40">Polygon</div>
            <div className="text-2xl font-bold text-ink/40">Optimism</div>
            <div className="text-2xl font-bold text-ink/40">Avalanche</div>
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
        />
      )}

      <Footer />
    </div>
  )
}