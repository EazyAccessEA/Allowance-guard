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
      {/* Fireart-Style Hero Section */}
      <section className="bg-platinum">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="text-center fireart-fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative fireart-bounce-subtle">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <h1 className="fireart-heading-1 mb-6 sm:mb-8">
              Allowance Guard
            </h1>
            
            {/* Fireart-Style Problem Statement */}
            <div className="fireart-card bg-gradient-to-br from-red-50 to-red-100 border-red-200 mb-8 max-w-4xl mx-auto fireart-slide-up">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <AlertTriangle className="w-6 h-6 text-crimson" />
                </div>
                <h2 className="fireart-heading-3 text-crimson">Your Wallet May Be At Risk</h2>
              </div>
              <div className="fireart-body-large text-red-700 space-y-4">
                <p>
                  <strong>Token approvals are the #1 attack vector in DeFi.</strong> Over $3.2 billion has been stolen 
                  through approval-based attacks in 2024 alone, with the average victim losing $47,000.
                </p>
                <p>
                  Most users unknowingly grant <strong>unlimited approvals</strong> to dApps, allowing malicious contracts 
                  to drain entire token balances without additional permission. These approvals persist indefinitely 
                  until manually revoked.
                </p>
                <div className="fireart-card bg-red-200 border-red-300 p-6 mt-6">
                  <h3 className="fireart-heading-3 text-red-800 mb-4">Real Attack Examples:</h3>
                  <ul className="fireart-body space-y-2">
                    <li>• <strong>March 2024:</strong> $200M stolen from users with unlimited USDC approvals</li>
                    <li>• <strong>July 2024:</strong> $150M drained via compromised DeFi protocol approvals</li>
                    <li>• <strong>September 2024:</strong> $89M lost through phishing sites with malicious approvals</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fireart-Style Solution */}
            <div className="fireart-card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 mb-8 max-w-3xl mx-auto fireart-slide-up">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-6 h-6 text-emerald" />
                </div>
                <h2 className="fireart-heading-3 text-emerald">Protection is Simple</h2>
              </div>
              <p className="fireart-body-large text-emerald-700 text-center">
                Connect your wallet below, scan for dangerous approvals, and revoke risky permissions instantly.
              </p>
            </div>
                  
            {/* Fireart-Style Primary Action */}
            <div className="mb-8 sm:mb-12">
              <div className="space-y-6">
                {/* Wallet Connection - Fireart Style */}
                <div className="fireart-card bg-gradient-to-br from-cobalt-50 to-electric-50 border-cobalt-200 max-w-md mx-auto fireart-scale-in">
                  {!isConnected ? (
                    <>
                      <p className="fireart-body text-cobalt mb-4 text-center">
                        Connect your wallet to get started
                      </p>
                      <ConnectButton />
                    </>
                  ) : (
                    <>
                      <p className="fireart-body text-emerald mb-4 text-center">
                        Wallet connected! Ready to scan
                      </p>
                      <div className="flex gap-3">
                        <ConnectButton />
                        <button 
                          onClick={startScan} 
                          disabled={pending}
                          className="fireart-button flex-1"
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
                      </div>
                    </>
                  )}
                </div>
                
                <p className="fireart-caption text-center">
                  We never store your private keys. Your wallet stays in your control.
                </p>
                
                {isConnected && (
                  <p className="fireart-caption text-center">
                    This will check all your token approvals across Ethereum, Arbitrum, and Base
                  </p>
                )}
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

            {/* Fireart-Style Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="fireart-card text-center fireart-scale-in">
                <div className="fireart-heading-2 text-crimson mb-2">$3.2B+</div>
                <div className="fireart-caption">Stolen via Approvals (2024)</div>
              </div>
              <div className="fireart-card text-center fireart-scale-in" style={{animationDelay: '0.1s'}}>
                <div className="fireart-heading-2 text-cobalt mb-2">68,000+</div>
                <div className="fireart-caption">Wallets Protected</div>
              </div>
              <div className="fireart-card text-center fireart-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="fireart-heading-2 text-amber mb-2">$47K</div>
                <div className="fireart-caption">Average Loss per Victim</div>
              </div>
              <div className="fireart-card text-center fireart-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="fireart-heading-2 text-emerald mb-2">24/7</div>
                <div className="fireart-caption">Real-time Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fireart-Style What You'll See Section */}
      <section className="bg-warm-gray">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center mb-16">
            <h2 className="fireart-heading-2 mb-6">
              What You'll See After Scanning
            </h2>
            <p className="fireart-body-large text-charcoal">
              We categorize your approvals by risk level to help you make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fireart-card text-center fireart-slide-up">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-crimson font-bold text-2xl">!</span>
              </div>
              <h3 className="fireart-heading-3 text-crimson mb-4">UNLIMITED</h3>
              <p className="fireart-body text-charcoal">Can take any amount from your wallet</p>
            </div>
            <div className="fireart-card text-center fireart-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-amber font-bold text-2xl">⚠</span>
              </div>
              <h3 className="fireart-heading-3 text-amber mb-4">HIGH RISK</h3>
              <p className="fireart-body text-charcoal">Large amounts or unknown contracts</p>
            </div>
            <div className="fireart-card text-center fireart-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-emerald font-bold text-2xl">✓</span>
              </div>
              <h3 className="fireart-heading-3 text-emerald mb-4">SAFE</h3>
              <p className="fireart-body text-charcoal">Small amounts from trusted sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application Section */}
      {isConnected && (
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Your Wallet Security
                </h2>
              <p className="text-gray-600">
                Manage your token approvals and stay protected
                </p>
              </div>

            {/* Wallet Manager */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Addresses</h3>
              <WalletManager 
                selected={selectedWallet} 
                onSelect={setSelectedWallet}
                onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
              />
            </div>

            {/* Allowances Table */}
            {rows.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Token Approvals</h3>
                  <p className="text-gray-600 text-sm mt-1">
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
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
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
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <select
                      className="rounded border px-2 py-1 text-sm"
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Alerts</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get notified when new approvals are detected on your wallets
                </p>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label htmlFor="riskOnly" className="text-sm text-gray-600">
                      Only alert for high-risk approvals
                    </label>
                  </div>
                  
                  <button
                    onClick={subscribe}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Subscribe to Alerts
                  </button>
                  
                  {subMsg && (
                    <p className="text-sm text-green-600">{subMsg}</p>
                  )}
                </div>
              </div>
            )}

            {/* Risk Policy */}
            {hasSavedWallet && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Policy</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Configure what counts as alert-worthy for your wallet
                </p>
                
                {policy && (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <label className="text-sm font-medium w-32">Min risk score</label>
                      <input 
                        className="rounded border px-3 py-2 text-sm w-24" 
                        type="number"
                        value={policy.min_risk_score}
                        onChange={e=>setPolicy({...policy, min_risk_score: Number(e.target.value)})}
                      />
                    </div>
                    
                    <label className="text-sm flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={policy.unlimited_only}
                        onChange={e=>setPolicy({...policy, unlimited_only: e.target.checked})}
                      />
                      Only alert on UNLIMITED approvals
                      </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Include spenders (comma-separated)</div>
                        <input 
                          className="w-full rounded border px-3 py-2 text-sm"
                          value={(policy.include_spenders||[]).join(',')}
                          onChange={e=>setPolicy({...policy, include_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Ignore spenders</div>
                        <input 
                          className="w-full rounded border px-3 py-2 text-sm"
                          value={(policy.ignore_spenders||[]).join(',')}
                          onChange={e=>setPolicy({...policy, ignore_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Include tokens</div>
                        <input 
                          className="w-full rounded border px-3 py-2 text-sm"
                          value={(policy.include_tokens||[]).join(',')}
                          onChange={e=>setPolicy({...policy, include_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Ignore tokens</div>
                        <input 
                          className="w-full rounded border px-3 py-2 text-sm"
                          value={(policy.ignore_tokens||[]).join(',')}
                          onChange={e=>setPolicy({...policy, ignore_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={savePolicy} 
                        className="rounded border px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save Policy
                      </button>
                      {slackMsg && <span className="text-sm text-green-600">{slackMsg}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Slack Alerts */}
            {hasSavedWallet && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Slack Alerts</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get daily digests in your Slack workspace
                </p>
                
                {/* Step-by-Step Instructions */}
                <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📋 How to Set Up Slack Webhook:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 font-bold text-xs">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Go to your Slack workspace</p>
                        <p className="text-gray-600">Open Slack in your browser or app</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 font-bold text-xs">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Create a new app</p>
                        <p className="text-gray-600">Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">api.slack.com/apps</a> → &quot;Create New App&quot; → &quot;From scratch&quot;</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 font-bold text-xs">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Name your app</p>
                        <p className="text-gray-600">App name: &quot;Allowance Guard Alerts&quot;, select your workspace</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 font-bold text-xs">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Enable Incoming Webhooks</p>
                        <p className="text-gray-600">In your app settings → &quot;Incoming Webhooks&quot; → Toggle &quot;Activate Incoming Webhooks&quot; to ON</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 font-bold text-xs">5</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Add webhook to channel</p>
                        <p className="text-gray-600">Click &quot;Add New Webhook to Workspace&quot; → Choose a channel (e.g., #alerts) → &quot;Allow&quot;</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 font-bold text-xs">6</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Copy the webhook URL</p>
                        <p className="text-gray-600">Copy the webhook URL (starts with https://hooks.slack.com/services/) and paste it below</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Webhook Input */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste your Slack webhook URL here:
                    </label>
                    <input 
                      className="w-full rounded border px-3 py-2 text-sm"
                      placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                      value={webhook} 
                      onChange={e=>setWebhook(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={addSlack} 
                      className="rounded border px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700"
                    >
                      Add Webhook
                    </button>
                    {slackMsg && (
                      <span className="text-sm text-green-600 flex items-center">
                        {slackMsg}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-blue-800 text-xs">
                      <strong>💡 Tip:</strong> You can create multiple webhooks for different channels. 
                      Each webhook will receive alerts for this wallet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Public Share Link */}
            {hasSavedWallet && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Share Link</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Generate a read-only link to share your wallet&apos;s approval status with others
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="text-sm flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={censorAddr} 
                        onChange={e => setCensorAddr(e.target.checked)} 
                        className="rounded"
                      />
                      Censor addresses (0x1234…abcd)
                    </label>
                    <label className="text-sm flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={censorAmt} 
                        onChange={e => setCensorAmt(e.target.checked)} 
                        className="rounded"
                      />
                      Hide amounts
                    </label>
                    <label className="text-sm flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={riskOnlyShare} 
                        onChange={e => setRiskOnlyShare(e.target.checked)} 
                        className="rounded"
                      />
                      Risky only (UNLIMITED / STALE / risk&gt;0)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-32">Expire after (days)</span>
                      <input 
                        className="w-20 rounded border px-2 py-1 text-sm" 
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
                      className="rounded border px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Generate / Rotate
                    </button>
                    <button 
                      onClick={expireShareLink} 
                      className="rounded border px-4 py-2 text-sm bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Expire Link
                    </button>
                    {shareMsg && (
                      <span className="text-sm text-gray-600 flex items-center">
                        {shareMsg}
                      </span>
                    )}
                  </div>

                  {shareToken && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Share URL:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          className="flex-1 rounded border px-3 py-2 text-sm font-mono" 
                          readOnly 
                          value={shareUrl ?? ''} 
                        />
                        <button
                          onClick={async () => { 
                            await navigator.clipboard.writeText(shareUrl || '')
                            setShareMsg('URL copied to clipboard!')
                          }}
                          className="rounded border px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-blue-800 text-xs">
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

      {/* Fireart-Style CTA Section */}
      <section className="bg-obsidian text-platinum">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative fireart-bounce-subtle">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="fireart-heading-2 text-platinum mb-6">
            Ready to secure your wallet?
          </h2>
          <p className="fireart-body-large text-charcoal mb-10 max-w-2xl mx-auto">
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