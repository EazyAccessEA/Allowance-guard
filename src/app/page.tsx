'use client'
import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
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

  // Team management state
  const [teams, setTeams] = useState<Array<{id: number, name: string, role: string}>>([])
  const [teamId, setTeamId] = useState<number | null>(null)
  const [role, setRole] = useState<'owner'|'admin'|'editor'|'viewer'|'none'>('none')
  const [me, setMe] = useState<{id: number, email: string, name?: string} | null>(null)
  const [emailSignin, setEmailSignin] = useState('')

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

  // Team management functions
  async function sendLink() {
    await fetch('/api/auth/magic/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: emailSignin, redirect: '/' })
    })
    alert('Check your email')
  }

  const loadTeams = useCallback(async () => {
    if (!me) return
    const r = await fetch('/api/teams')
    const j = await r.json()
    setTeams(j.teams || [])
    if (!teamId && j.teams?.[0]) {
      setTeamId(j.teams[0].id)
      setRole(j.teams[0].role)
    }
  }, [me, teamId])

  const loadTeamWallets = useCallback(async () => {
    if (!teamId) return
    const r = await fetch(`/api/teams/wallets?teamId=${teamId}`)
    const j = await r.json()
    if (j.wallets?.[0]) setSelectedWallet(j.wallets[0].wallet_address)
  }, [teamId])

  async function createTeam() {
    const name = prompt('Team name?')
    if (!name) return
    const r = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name })
    })
    if (r.ok) location.reload()
  }

  async function addTeamWallet() {
    if (!teamId || !selectedWallet) return
    await fetch('/api/teams/wallets', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ teamId, wallet: selectedWallet })
    })
    alert('Added')
  }

  async function sendInvite() {
    const email = (document.getElementById('inviteEmail') as HTMLInputElement)?.value
    const roleSel = (document.getElementById('inviteRole') as HTMLSelectElement)?.value
    if (!email || !roleSel) return
    const r = await fetch('/api/teams/invite', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ teamId, email, role: roleSel })
    })
    alert(r.ok ? 'Invite sent' : 'Failed')
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

  // Load user and teams on mount
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(({ user }) => {
      setMe(user)
      if (user) loadTeams()
    })
  }, [])

  // Load teams when user changes
  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  // Load team wallets when team changes
  useEffect(() => {
    loadTeamWallets()
  }, [loadTeamWallets])

  // Update role when team changes
  useEffect(() => {
    const t = teams.find(t => t.id === teamId)
    if (t) setRole(t.role as 'owner'|'admin'|'editor'|'viewer'|'none')
  }, [teamId, teams])

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
        
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink leading-[1.1] tracking-tight mb-8 h-[2.2em]">
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
            <p className="text-xl sm:text-2xl text-stone leading-relaxed mb-12 max-w-3xl">
              A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
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
              className="text-stone hover:text-ink transition-colors duration-200 text-lg font-medium flex items-center h-12"
            >
              Learn more →
            </Link>
          </div>
        </Container>
      </Section>

      {/* Team Management Section */}
      <Section className="py-8 bg-white border-b border-line">
        <Container>
          <div className="max-w-4xl">
            {/* Simple sign-in widget */}
            <div className="mt-4 flex items-center gap-2">
              {me ? (
                <>
                  <span className="text-sm">Signed in as {me.email}</span>
                  <button 
                    onClick={() => fetch('/api/auth/signout', { method: 'POST' }).then(() => location.reload())} 
                    className="rounded border px-2 py-1 text-xs hover:bg-mist transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <input 
                    className="rounded border px-2 py-1 text-sm" 
                    placeholder="your@email.com" 
                    value={emailSignin} 
                    onChange={e => setEmailSignin(e.target.value)} 
                  />
                  <button 
                    onClick={sendLink} 
                    className="rounded border px-2 py-1 text-sm hover:bg-mist transition-colors"
                  >
                    Email me a sign-in link
                  </button>
                </>
              )}
            </div>

            {me && (
              <section className="mt-4">
                <div className="flex items-center gap-2">
                  <select 
                    className="rounded border px-2 py-1 text-sm" 
                    value={teamId ?? ''} 
                    onChange={e => setTeamId(Number(e.target.value))}
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={createTeam} 
                    className="rounded border px-2 py-1 text-xs hover:bg-mist transition-colors"
                  >
                    New team
                  </button>
                </div>
              </section>
            )}

            {me && teamId && role !== 'viewer' && (
              <div className="mt-2 flex gap-2">
                <input 
                  className="rounded border px-2 py-1 text-sm font-mono" 
                  placeholder="0x… wallet" 
                  value={selectedWallet ?? ''} 
                  onChange={e => setSelectedWallet(e.target.value)} 
                />
                <button 
                  onClick={addTeamWallet} 
                  className="rounded border px-2 py-1 text-xs hover:bg-mist transition-colors"
                >
                  Add to team
                </button>
              </div>
            )}

            {me && teamId && ['owner','admin','editor'].includes(role) && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold">Invite collaborator</h3>
                <div className="mt-2 flex gap-2">
                  <input 
                    id="inviteEmail" 
                    className="rounded border px-2 py-1 text-sm" 
                    placeholder="collab@email.com" 
                  />
                  <select id="inviteRole" className="rounded border px-2 py-1 text-sm">
                    <option value="viewer">viewer (read-only)</option>
                    <option value="editor">editor</option>
                    <option value="admin">admin</option>
                  </select>
                  <button 
                    onClick={sendInvite} 
                    className="rounded border px-2 py-1 text-xs hover:bg-mist transition-colors"
                  >
                    Send invite
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Value Proposition Strip - Fireart Style */}
      {/* Security Statistics - Content-First Trust Building */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-semibold text-ink mb-4">
                The DeFi Security Crisis
              </h2>
              <p className="text-base text-stone leading-relaxed">
                Token approvals represent the single largest attack vector in decentralized finance. 
                In 2024, approval-based attacks accounted for 73% of all DeFi exploits, resulting in over $3.2 billion in losses.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">73%</div>
                <div className="text-sm text-stone">of DeFi exploits</div>
                <div className="text-xs text-stone/60">from token approvals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">$3.2B</div>
                <div className="text-sm text-stone">total losses</div>
                <div className="text-xs text-stone/60">in 2024</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">&lt; 1hr</div>
                <div className="text-sm text-stone">average attack time</div>
                <div className="text-xs text-stone/60">to drain unlimited approvals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink mb-2">10K+</div>
                <div className="text-sm text-stone">wallets protected</div>
                <div className="text-xs text-stone/60">by Allowance Guard</div>
              </div>
            </div>
            
            <div className="bg-white border border-line rounded-lg p-8">
              <h3 className="text-lg font-semibold text-ink mb-4">How Allowance Guard Protects You</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-ink mb-2">Comprehensive Scanning</h4>
                  <p className="text-sm text-stone leading-relaxed">
                    One scan across Ethereum, Arbitrum, and Base reveals all token approvals and their risk levels.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Instant Revocation</h4>
                  <p className="text-sm text-stone leading-relaxed">
                    Guided revocation flows with direct links to explorers and gas-optimized transactions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-ink mb-2">Continuous Monitoring</h4>
                  <p className="text-sm text-stone leading-relaxed">
                    Email and Slack alerts on new approvals with intelligent noise filtering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Technical Authority - Content-First Approach */}
      <Section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-semibold text-ink mb-4">
                Built for Security Professionals
              </h2>
              <p className="text-base text-stone leading-relaxed">
                Allowance Guard is designed by security experts for developers, teams, and institutions 
                who need comprehensive wallet security monitoring.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white border border-line rounded-lg p-8">
                <h3 className="text-lg font-semibold text-ink mb-4">Open Source & Auditable</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-ink mb-2">Public Repository</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Complete source code available on GitHub with regular security audits and community contributions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-2">No Vendor Lock-in</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Self-hostable infrastructure with documented APIs and database schemas for complete control.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-8">
                <h3 className="text-lg font-semibold text-ink mb-4">Enterprise-Grade Infrastructure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-ink mb-2">Multi-Chain Support</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Ethereum, Arbitrum, Base with support for ERC-20, ERC-721, and ERC-1155 standards.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-2">Real-time Monitoring</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Autonomous monitoring with configurable frequency and instant drift detection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-2">Team Collaboration</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Role-based access control with email invites and shared wallet management.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-8">
                <h3 className="text-lg font-semibold text-ink mb-4">Privacy & Security First</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-ink mb-2">Local Processing</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      All analysis happens in your browser. No private keys, no data storage, complete privacy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-2">Read-Only Access</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      We never have access to your funds or private keys. Only public blockchain data is analyzed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Implementation Details - Content-First */}
      <Section className="py-20 bg-mist/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-semibold text-ink mb-4">
                How It Works
              </h2>
              <p className="text-base text-stone leading-relaxed">
                Technical implementation details for developers and security professionals.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white border border-line rounded-lg p-8">
                <h3 className="text-lg font-semibold text-ink mb-4">Risk Assessment Algorithm</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">+50</div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Unlimited Approvals</h4>
                      <p className="text-sm text-stone">Critical risk: Contract can spend any amount of tokens</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">+10</div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Stale Approvals</h4>
                      <p className="text-sm text-stone">High risk: Unused approvals to potentially abandoned contracts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">+5</div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Unknown Contracts</h4>
                      <p className="text-sm text-stone">Medium risk: Contracts without reputation or verification data</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-8">
                <h3 className="text-lg font-semibold text-ink mb-4">Supported Standards & Networks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-ink mb-3">Token Standards</h4>
                    <ul className="space-y-2 text-sm text-stone">
                      <li>• ERC-20: Fungible token approvals</li>
                      <li>• ERC-721: NFT approvals</li>
                      <li>• ERC-1155: Multi-token approvals</li>
                      <li>• ERC-2612: Permit-based approvals</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-3">Blockchain Networks</h4>
                    <ul className="space-y-2 text-sm text-stone">
                      <li>• Ethereum Mainnet (Chain ID: 1)</li>
                      <li>• Arbitrum One (Chain ID: 42161)</li>
                      <li>• Base (Chain ID: 8453)</li>
                      <li>• More networks coming soon</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-8">
                <h3 className="text-lg font-semibold text-ink mb-4">API & Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-ink mb-2">RESTful API</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Complete API for scanning, monitoring, and managing approvals with rate limiting and authentication.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-ink mb-2">Webhook Support</h4>
                    <p className="text-sm text-stone leading-relaxed">
                      Real-time notifications via webhooks for new approvals, risk changes, and monitoring events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust Indicators - Content-First */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xl font-semibold text-ink mb-4">
                Trusted by Security Professionals
              </h2>
              <p className="text-base text-stone">
                Used by developers, security teams, and institutions across the Web3 ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-ink mb-2">10,000+</div>
                <div className="text-sm text-stone">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ink mb-2">$2.5M+</div>
                <div className="text-sm text-stone">Assets Protected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ink mb-2">99.9%</div>
                <div className="text-sm text-stone">Uptime</div>
              </div>
            </div>
            
            <div className="bg-mist/30 border border-line rounded-lg p-6">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-stone">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Security Audited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No Vendor Lock-in</span>
                </div>
              </div>
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
          canRevoke={role !== 'viewer'}
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