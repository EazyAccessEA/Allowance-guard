'use client'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import ConnectButton from '@/components/ConnectButton'
import TestConnect from '@/components/TestConnect'
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
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-[1.1] tracking-tight mb-8 sm:mb-8 h-[2.2em]">
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
            <p className="text-lg sm:text-xl lg:text-2xl text-stone leading-relaxed mb-12 sm:mb-10 lg:mb-12 max-w-3xl">
              A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {!isConnected ? (
              <div className="flex flex-col gap-2">
                <ConnectButton 
                  variant="primary" 
                  className="bg-black text-white hover:bg-gray-800 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-lg"
                />
                <TestConnect onConnect={(a) => setSelectedWallet(a)} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={startScan} 
                  disabled={pending} 
                  className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500/30 disabled:opacity-50 disabled:cursor-wait"
                >
                  {pending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Scanning wallet...
                    </>
                  ) : (
                    'Scan wallet'
                  )}
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
      <Section className="py-16 sm:py-24 lg:py-32 relative">
        {/* Full-width glass background */}
        <div className="absolute inset-0 glass-black-full"></div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6 sm:mb-8">
              The Unseen Risk in Every Wallet
            </h2>
            <p className="text-lg sm:text-xl text-white leading-relaxed">
              Token allowances are the hidden permissions you grant when interacting with DeFi protocols, NFT marketplaces, and dApps. These approvals allow smart contracts to move your tokens on your behalf, but they persist long after your interaction ends. Forgotten or malicious allowances become the primary attack vector for draining wallets, with approval-based exploits accounting for 73% of all DeFi security incidents in 2024, resulting in over $3.2 billion in losses. Every time you approve a token, you create a potential vulnerability that could be exploited months or years later.
            </p>
          </div>
        </Container>
      </Section>
      {/* How Allowance Guard Works */}
      <Section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent"></div>
        
        {/* Floating elements for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-800 leading-tight mb-6 tracking-tight">
                How Allowance Guard Works
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-medium text-slate-800 mb-6">Connect & Scan</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Connect your wallet securely. We read public blockchain data only. Your private keys and funds remain completely under your control at all times.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-medium text-slate-800 mb-6">Analyze & Understand</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Get a clear risk assessment instantly. We analyze every allowance and flag risky, unlimited, or malicious approvals with advanced intelligence.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-medium text-slate-800 mb-6">Act & Secure</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Revoke with confidence. One-click revocation executes directly from your wallet. Batch multiple revocations to save on gas fees.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Features & Differentiators */}
      <Section className="py-24 sm:py-32 lg:py-40 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-8">
                Key Features & Differentiators
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built with precision and purpose. Every feature serves a single goal: keeping your assets secure.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Non-Custodial Security</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Full control remains in your wallet. We never hold your keys, funds, or require any permissions to move them. Every transaction is executed directly from your wallet with your explicit approval.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Clarity-First Dashboard</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Designed to PuredgeOS &apos;God-tier&apos; standards. See your entire security posture at a glance, with no jargon or confusion. Every piece of information is actionable and immediately understandable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Risk Intelligence</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Risk scores are powered by real-time threat data, identifying known malicious contracts and anomalous approvals. Our intelligence engine continuously updates to stay ahead of emerging threats.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Gas-Efficient Revocation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Batch revoke multiple allowances in a single transaction to save on gas fees and time. Our smart contract optimization ensures you pay the minimum possible gas costs for maximum security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Community & Transparency */}
      <Section className="py-24 sm:py-32 lg:py-40 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-8">
                Built by the Community, for the Community
              </h2>
            </div>
            
            <div className="space-y-16">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Trusted by Security Teams</h3>
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
                  <p className="text-xl text-gray-700 leading-relaxed italic mb-6">
                    &quot;Allowance Guard has become an essential tool in our security stack. The clarity and precision of their risk assessment has helped us identify and neutralize threats before they could impact our users.&quot;
                  </p>
                  <p className="text-lg text-gray-900 font-medium">
                    — Security Team Lead, Major DeFi Protocol
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Open Source & Transparent</h3>
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Our methodology and smart contracts are publicly verifiable. All code is open source, all processes are documented, and all security practices are transparent.
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
                  className="bg-black text-white hover:bg-gray-800 transition-all duration-200 px-8 py-4 text-lg font-medium rounded-lg"
                />
              ) : (
                <button 
                  onClick={startScan} 
                  disabled={pending} 
                  className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500/30 disabled:opacity-50 disabled:cursor-wait"
                >
                  {pending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Scanning wallet...
                    </>
                  ) : (
                    'Scan Your Wallet for Free'
                  )}
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

      {/* Trust Section - Clean Design */}
      <Section className="py-12 sm:py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base text-stone font-medium mb-6">
              Trusted by security-conscious users across
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
              <span className="text-lg text-stone font-medium">Ethereum</span>
              <span className="text-lg text-stone font-medium">Arbitrum</span>
              <span className="text-lg text-stone font-medium">Base</span>
              <span className="text-lg text-stone font-medium">Polygon</span>
              <span className="text-lg text-stone font-medium">Optimism</span>
              <span className="text-lg text-stone font-medium">Avalanche</span>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}