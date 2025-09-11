'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'
import { useAccount } from 'wagmi'
import { useEffect, useState, useCallback } from 'react'
import { load, save } from '@/lib/storage'
import { Shield, Eye, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

const ACTIVE_KEY = 'ag.activeWallet'

export default function HomePage() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(() => load<string | null>(ACTIVE_KEY, null))
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
  const [pending, setPending] = useState(false)
  const [hasSavedWallet, setHasSavedWallet] = useState(false)
  const [email, setEmail] = useState('')
  const [riskOnly, setRiskOnly] = useState(true)
  const [subMsg, setSubMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Job and pagination state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  
  // Policy and Slack state
  const [policy, setPolicy] = useState<{
    min_risk_score: number
    unlimited_only: boolean
    include_spenders: string[]
    ignore_spenders: string[]
    include_tokens: string[]
    ignore_tokens: string[]
    chains: number[]
  } | null>(null)
  const [webhook, setWebhook] = useState('')
  const [slackMsg, setSlackMsg] = useState<string | null>(null)
  
  // Share state
  const [shareMsg, setShareMsg] = useState<string | null>(null)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [censorAddr, setCensorAddr] = useState(true)
  const [censorAmt, setCensorAmt] = useState(false)
  const [riskOnlyShare, setRiskOnlyShare] = useState(true)
  const [expireDays, setExpireDays] = useState<number | ''>('')

  useEffect(() => { save(ACTIVE_KEY, selectedWallet) }, [selectedWallet])

  async function fetchAllowances(addr: string, p = page, ps = pageSize) {
    const res = await fetch(`/api/allowances?wallet=${addr}&page=${p}&pageSize=${ps}`)
    const json = await res.json()
    setRows(json.allowances || [])
    setTotal(json.total || 0)
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setError('Please select or connect a wallet first')
      return
    }
    
    if (pending) return // debounce
    
    setPending(true)
    setError(null)
    setMessage('Queuing…')
    
    try {
      const res = await fetch('/api/scan', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ walletAddress: target, chains: ['eth','arb','base'] }) 
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to queue')
      
      setMessage(`Scan queued (#${json.jobId})`)
      
      // Optional: immediately ping the processor in dev
      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/jobs/process', { method: 'POST' }).catch(()=>{})
      }
      
      // Poll job until done
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 3000))
        const s = await fetch(`/api/jobs/${json.jobId}`).then(r => r.json())
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
      
      // post-scan tasks
      await fetch('/api/risk/refresh', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet: target })
      })
      
      await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet: target })
      })
      
      await fetchAllowances(target, page, pageSize)
      setSelectedWallet(target)
      
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      setError(`Network error: ${errorMessage}. Please check your connection and try again.`)
    } finally {
      setPending(false)
    }
  }

  async function subscribe() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setError('Please select or connect a wallet first')
      return
    }
    
    try {
    const res = await fetch('/api/alerts/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, wallet: target, riskOnly })
    })
    const ok = res.ok
    setSubMsg(ok ? 'Successfully subscribed to daily alerts' : 'Subscription failed')
    } catch (e) {
      setError(`Subscription failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }

  const loadPolicy = useCallback(async () => {
    const target = selectedWallet || connectedAddress
    if (!target) return
    const r = await fetch(`/api/policy?wallet=${target}`)
    const j = await r.json()
    setPolicy(j.policy ?? { min_risk_score:0, unlimited_only:false, include_spenders:[], ignore_spenders:[], include_tokens:[], ignore_tokens:[], chains:[] })
  }, [selectedWallet, connectedAddress])

  useEffect(() => { loadPolicy() }, [loadPolicy])

  async function savePolicy() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    const r = await fetch('/api/policy', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ wallet: target, ...policy })
    })
    setSlackMsg(r.ok ? 'Policy saved' : 'Failed to save policy')
  }

  async function addSlack() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    const r = await fetch('/api/slack/subscribe', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ wallet: target, webhookUrl: webhook, riskOnly: true })
    })
    setSlackMsg(r.ok ? 'Slack webhook added' : 'Failed to add webhook')
    if (r.ok) setWebhook('')
  }

  // Share helpers
  const shareUrl = shareToken ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/share/${shareToken}` : null

  async function generateShare() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    const r = await fetch('/api/share/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        wallet: target,
        censor_addresses: censorAddr,
        censor_amounts: censorAmt,
        risk_only: riskOnlyShare,
        expires_in_days: typeof expireDays === 'number' ? expireDays : null
      })
    })
    const j = await r.json()
    if (!r.ok) return setShareMsg(j.error || 'Failed to create link')
    setShareToken(j.token)
    setShareMsg('Share link created')
  }

  async function expireShareLink() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    const r = await fetch('/api/share/expire', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ wallet: target })
    })
    if (!r.ok) return setShareMsg('Failed to expire link')
    setShareToken(null)
    setShareMsg('Share link expired')
  }

  const targetWallet = selectedWallet || connectedAddress

  return (
    <div className="min-h-screen bg-platinum">
      {/* PureEdgeOS + Fireart Hero Section - Mobile First */}
      <section className="bg-platinum">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="text-center fireart-fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative fireart-bounce-subtle">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <h1 className="fireart-heading-1 mb-4 sm:mb-6">
              Allowance Guard
            </h1>
            
            {/* PureEdgeOS Clarity: What This Site Does - 3 Second Rule */}
            <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 mb-6 max-w-3xl mx-auto fireart-slide-up">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-cobalt-100 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-cobalt" />
                </div>
                <h2 className="fireart-heading-3 text-cobalt">Secure Your Crypto Wallet</h2>
              </div>
              <p className="fireart-body-large text-cobalt-700 text-center mb-4">
                <strong>Find and revoke dangerous token approvals</strong> that could drain your wallet
              </p>
              <p className="fireart-body text-charcoal text-center">
                Connect your wallet → Scan for risks → Revoke dangerous permissions
              </p>
            </div>

            {/* PureEdgeOS Clarity: Why This Matters - Problem Statement */}
            <div className="fireart-card bg-gradient-to-br from-red-50 to-red-100 border-red-200 mb-6 max-w-3xl mx-auto fireart-slide-up">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <AlertTriangle className="w-5 h-5 text-crimson" />
                </div>
                <h2 className="fireart-heading-3 text-crimson">$3.2B+ Stolen in 2024</h2>
              </div>
              <div className="fireart-body text-red-700 space-y-3">
                <p>
                  <strong>Token approvals are the #1 attack vector.</strong> Most users unknowingly grant 
                  <strong> unlimited approvals</strong> to dApps, allowing malicious contracts to drain 
                  entire token balances without additional permission.
                </p>
                <div className="bg-red-200 border-red-300 p-4 rounded-lg">
                  <p className="fireart-body text-red-800">
                    <strong>Average loss per victim: $47,000</strong>
                  </p>
                </div>
              </div>
            </div>
                  
            {/* PureEdgeOS Primary Action - Mobile First */}
            <div className="mb-8">
              <div className="space-y-4">
                {/* Step 1: Connect Wallet */}
                <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 max-w-sm mx-auto fireart-scale-in">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-cobalt-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-cobalt font-bold text-sm">1</span>
                    </div>
                    <h3 className="fireart-body font-medium text-cobalt mb-3">Connect Your Wallet</h3>
                    {!isConnected ? (
                      <ConnectButton />
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-emerald">
                        <div className="w-2 h-2 bg-emerald rounded-full"></div>
                        <span className="fireart-body text-emerald">Connected</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Scan for Risks */}
                <div className="fireart-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 max-w-sm mx-auto fireart-scale-in">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald font-bold text-sm">2</span>
                    </div>
                    <h3 className="fireart-body font-medium text-emerald mb-3">Scan for Risks</h3>
                    {!isConnected ? (
                      <p className="fireart-caption text-charcoal">Connect wallet first</p>
                    ) : (
                      <button 
                        onClick={startScan} 
                        disabled={pending}
                        className="fireart-button w-full"
                      >
                        {pending ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Scan Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step 3: Review & Revoke */}
                <div className="fireart-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 max-w-sm mx-auto fireart-scale-in">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-amber font-bold text-sm">3</span>
                    </div>
                    <h3 className="fireart-body font-medium text-amber mb-3">Review & Revoke</h3>
                    <p className="fireart-caption text-charcoal">
                      Review risky approvals and revoke dangerous permissions
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="fireart-caption text-charcoal">
                    🔒 We never store your private keys. Your wallet stays in your control.
                  </p>
                  {isConnected && (
                    <p className="fireart-caption text-charcoal">
                      Scans Ethereum, Arbitrum, and Base networks
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fireart-Style Error Display */}
            {error && (
              <div className="mb-8 fireart-card bg-gradient-to-br from-red-50 to-red-100 border-red-200 max-w-2xl mx-auto fireart-slide-up">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-crimson" />
                  </div>
                  <div className="flex-1">
                    <p className="fireart-body text-red-800">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="fireart-button-ghost text-crimson mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fireart-Style Message Display */}
            {message && (
              <div className="mb-8 fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 max-w-2xl mx-auto fireart-slide-up">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-cobalt-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Eye className="w-4 h-4 text-cobalt" />
                  </div>
                  <div className="flex-1">
                    <p className="fireart-body text-cobalt">{message}</p>
                    <button 
                      onClick={() => setMessage(null)}
                      className="fireart-button-ghost text-cobalt mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PureEdgeOS Trust Indicators - Mobile First */}
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="fireart-card text-center fireart-scale-in">
                <div className="fireart-heading-3 text-crimson mb-1">$3.2B+</div>
                <div className="fireart-caption">Stolen in 2024</div>
              </div>
              <div className="fireart-card text-center fireart-scale-in" style={{animationDelay: '0.1s'}}>
                <div className="fireart-heading-3 text-emerald mb-1">68K+</div>
                <div className="fireart-caption">Wallets Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PureEdgeOS Risk Categories - Mobile First */}
      <section className="bg-warm-gray">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center mb-8">
            <h2 className="fireart-heading-2 mb-4">
              Risk Categories
            </h2>
            <p className="fireart-body text-charcoal">
              We categorize approvals by risk level to help you decide what to revoke
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            <div className="fireart-card text-center fireart-slide-up">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-crimson font-bold text-xl">!</span>
              </div>
              <h3 className="fireart-heading-3 text-crimson mb-2">UNLIMITED</h3>
              <p className="fireart-body text-charcoal">Can drain your entire wallet</p>
            </div>
            <div className="fireart-card text-center fireart-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber font-bold text-xl">⚠</span>
              </div>
              <h3 className="fireart-heading-3 text-amber mb-2">HIGH RISK</h3>
              <p className="fireart-body text-charcoal">Large amounts or unknown contracts</p>
            </div>
            <div className="fireart-card text-center fireart-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald font-bold text-xl">✓</span>
              </div>
              <h3 className="fireart-heading-3 text-emerald mb-2">SAFE</h3>
              <p className="fireart-body text-charcoal">Small amounts from trusted sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application Section - Mobile First */}
      {isConnected && (
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
            <div className="text-center mb-6">
              <h2 className="fireart-heading-2 mb-3">
                Your Wallet Security
              </h2>
              <p className="fireart-body text-charcoal">
                Manage your token approvals and stay protected
              </p>
            </div>

            {/* Wallet Manager */}
            <div className="fireart-card bg-warm-gray mb-6">
              <h3 className="fireart-heading-3 mb-4">Wallet Addresses</h3>
              <WalletManager 
                selected={selectedWallet} 
                onSelect={setSelectedWallet}
                onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
              />
            </div>

            {/* Allowances Table */}
            {rows.length > 0 && (
              <div className="fireart-card overflow-hidden">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="fireart-heading-3">Token Approvals</h3>
                  <p className="fireart-caption mt-1">
                    Review and manage your active token approvals
                  </p>
                </div>
                <AllowanceTable 
                  data={rows} 
                  selectedWallet={selectedWallet}
                  connectedAddress={connectedAddress}
                  onRefresh={() => fetchAllowances(targetWallet || '')}
                />
                
                {/* Pagination Controls */}
                {selectedWallet && total > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={page <= 1} 
                        onClick={async () => { 
                          const p = page - 1
                          setPage(p)
                          if (selectedWallet) {
                            await fetchAllowances(selectedWallet, p, pageSize)
                          }
                        }}
                        className="fireart-button-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="fireart-caption">
                        Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                      </span>
                      <button 
                        disabled={page >= Math.ceil(total / pageSize)} 
                        onClick={async () => { 
                          const p = page + 1
                          setPage(p)
                          if (selectedWallet) {
                            await fetchAllowances(selectedWallet, p, pageSize)
                          }
                        }}
                        className="fireart-button-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <select
                      className="fireart-input w-auto"
                      value={pageSize}
                      onChange={async (e) => {
                        const ps = Number(e.target.value)
                        setPageSize(ps)
                        setPage(1)
                        if (selectedWallet) {
                          await fetchAllowances(selectedWallet, 1, ps)
                        }
                      }}
                    >
                      {[10, 25, 50, 100].map(n => (
                        <option key={n} value={n}>{n} per page</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Email Alerts */}
            {hasSavedWallet && (
              <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 mt-6">
                <h3 className="fireart-heading-3 mb-3">Email Alerts</h3>
                <p className="fireart-body text-charcoal mb-4">
                  Get notified when new approvals are detected on your wallets
                </p>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="fireart-input"
                    />
                  </div>
                    
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="riskOnly"
                      checked={riskOnly}
                      onChange={(e) => setRiskOnly(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="riskOnly" className="fireart-body text-charcoal">
                      Only alert for high-risk approvals
                    </label>
                  </div>
                  
                  <button
                    onClick={subscribe}
                    className="fireart-button"
                  >
                    Subscribe to Alerts
                  </button>
                  
                  {subMsg && (
                    <p className="fireart-body text-emerald">{subMsg}</p>
                  )}
                </div>
              </div>
            )}

            {/* Risk Policy */}
            {hasSavedWallet && (
              <div className="fireart-card bg-warm-gray mt-6">
                <h3 className="fireart-heading-3 mb-3">Risk Policy</h3>
                <p className="fireart-body text-charcoal mb-4">
                  Configure what counts as alert-worthy for your wallet
                </p>
                
                {policy && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <label className="fireart-body font-medium w-32">Min risk score</label>
                      <input 
                        className="fireart-input w-24" 
                        type="number"
                        value={policy.min_risk_score}
                        onChange={e=>setPolicy({...policy, min_risk_score: Number(e.target.value)})}
                      />
                    </div>
                    
                    <label className="fireart-body flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={policy.unlimited_only}
                        onChange={e=>setPolicy({...policy, unlimited_only: e.target.checked})}
                      />
                      Only alert on UNLIMITED approvals
                    </label>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="fireart-body font-medium mb-2">Include spenders (comma-separated)</div>
                        <input 
                          className="fireart-input"
                          value={(policy.include_spenders||[]).join(',')}
                          onChange={e=>setPolicy({...policy, include_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="fireart-body font-medium mb-2">Ignore spenders</div>
                        <input 
                          className="fireart-input"
                          value={(policy.ignore_spenders||[]).join(',')}
                          onChange={e=>setPolicy({...policy, ignore_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="fireart-body font-medium mb-2">Include tokens</div>
                        <input 
                          className="fireart-input"
                          value={(policy.include_tokens||[]).join(',')}
                          onChange={e=>setPolicy({...policy, include_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="fireart-body font-medium mb-2">Ignore tokens</div>
                        <input 
                          className="fireart-input"
                          value={(policy.ignore_tokens||[]).join(',')}
                          onChange={e=>setPolicy({...policy, ignore_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={savePolicy} 
                        className="fireart-button"
                      >
                        Save Policy
                      </button>
                      {slackMsg && <span className="fireart-body text-emerald">{slackMsg}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Slack Alerts */}
            {hasSavedWallet && (
              <div className="fireart-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 mt-6">
                <h3 className="fireart-heading-3 mb-3">Slack Alerts</h3>
                <p className="fireart-body text-charcoal mb-4">
                  Get daily digests in your Slack workspace
                </p>
                
                {/* Step-by-Step Instructions */}
                <div className="fireart-card bg-platinum mb-4">
                  <h4 className="fireart-heading-3 mb-4">How to Set Up Slack Webhook:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald font-bold text-xs">1</span>
                      </div>
                      <div>
                        <p className="fireart-body font-medium text-obsidian">Go to your Slack workspace</p>
                        <p className="fireart-caption text-charcoal">Open Slack in your browser or app</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald font-bold text-xs">2</span>
                      </div>
                      <div>
                        <p className="fireart-body font-medium text-obsidian">Create a new app</p>
                        <p className="fireart-caption text-charcoal">Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-cobalt underline">api.slack.com/apps</a> → &quot;Create New App&quot; → &quot;From scratch&quot;</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald font-bold text-xs">3</span>
                      </div>
                      <div>
                        <p className="fireart-body font-medium text-obsidian">Name your app</p>
                        <p className="fireart-caption text-charcoal">App name: &quot;Allowance Guard Alerts&quot;, select your workspace</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald font-bold text-xs">4</span>
                      </div>
                      <div>
                        <p className="fireart-body font-medium text-obsidian">Enable Incoming Webhooks</p>
                        <p className="fireart-caption text-charcoal">In your app settings → &quot;Incoming Webhooks&quot; → Toggle &quot;Activate Incoming Webhooks&quot; to ON</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald font-bold text-xs">5</span>
                      </div>
                      <div>
                        <p className="fireart-body font-medium text-obsidian">Add webhook to channel</p>
                        <p className="fireart-caption text-charcoal">Click &quot;Add New Webhook to Workspace&quot; → Choose a channel (e.g., #alerts) → &quot;Allow&quot;</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald font-bold text-xs">6</span>
                      </div>
                      <div>
                        <p className="fireart-body font-medium text-obsidian">Copy the webhook URL</p>
                        <p className="fireart-caption text-charcoal">Copy the webhook URL (starts with https://hooks.slack.com/services/) and paste it below</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Webhook Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block fireart-body font-medium text-obsidian mb-2">
                      Paste your Slack webhook URL here:
                    </label>
                    <input 
                      className="fireart-input"
                      placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                      value={webhook} 
                      onChange={e=>setWebhook(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={addSlack} 
                      className="fireart-button"
                    >
                      Add Webhook
                    </button>
                    {slackMsg && (
                      <span className="fireart-body text-emerald flex items-center">
                        {slackMsg}
                      </span>
                    )}
                  </div>
                  
                  <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 p-4">
                    <p className="fireart-caption text-cobalt">
                      <strong>💡 Tip:</strong> You can create multiple webhooks for different channels. 
                      Each webhook will receive alerts for this wallet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Public Share Link */}
            {hasSavedWallet && (
              <div className="fireart-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 mt-6">
                <h3 className="fireart-heading-3 mb-3">Public Share Link</h3>
                <p className="fireart-body text-charcoal mb-4">
                  Generate a read-only link to share your wallet&apos;s approval status with others
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <label className="fireart-body flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={censorAddr} 
                        onChange={e => setCensorAddr(e.target.checked)} 
                        className="rounded"
                      />
                      Censor addresses (0x1234…abcd)
                    </label>
                    <label className="fireart-body flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={censorAmt} 
                        onChange={e => setCensorAmt(e.target.checked)} 
                        className="rounded"
                      />
                      Hide amounts
                    </label>
                    <label className="fireart-body flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={riskOnlyShare} 
                        onChange={e => setRiskOnlyShare(e.target.checked)} 
                        className="rounded"
                      />
                      Risky only (UNLIMITED / STALE / risk&gt;0)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <span className="fireart-body w-32">Expire after (days)</span>
                      <input 
                        className="fireart-input w-20" 
                        type="number"
                        value={expireDays} 
                        onChange={e => setExpireDays(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Never"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={generateShare} 
                      className="fireart-button"
                    >
                      Generate / Rotate
                    </button>
                    <button 
                      onClick={expireShareLink} 
                      className="fireart-button-secondary"
                    >
                      Expire Link
                    </button>
                    {shareMsg && (
                      <span className="fireart-body text-charcoal flex items-center">
                        {shareMsg}
                      </span>
                    )}
                  </div>

                  {shareToken && (
                    <div className="mt-4">
                      <label className="block fireart-body font-medium text-obsidian mb-2">
                        Share URL:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          className="flex-1 fireart-input font-mono" 
                          readOnly 
                          value={shareUrl ?? ''} 
                        />
                        <button
                          onClick={async () => { 
                            await navigator.clipboard.writeText(shareUrl || '')
                            setShareMsg('URL copied to clipboard!')
                          }}
                          className="fireart-button"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 p-4">
                    <p className="fireart-caption text-cobalt">
                      <strong>🔒 Privacy:</strong> Share links are read-only and can be expired at any time. 
                      Addresses and amounts can be censored for privacy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PureEdgeOS CTA Section - Mobile First */}
      <section className="bg-obsidian text-platinum">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative fireart-bounce-subtle">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="fireart-heading-2 text-platinum mb-4">
            Ready to secure your wallet?
          </h2>
          <p className="fireart-body text-charcoal mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Allowance Guard to protect their assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/docs"
              className="fireart-button"
            >
              View Documentation
            </a>
            <a
              href="/faq"
              className="fireart-button-secondary text-platinum border-platinum hover:bg-platinum hover:text-obsidian"
            >
              FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}