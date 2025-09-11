'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import { useEffect, useState, useCallback } from 'react'
import { load, save } from '@/lib/storage'
import { AlertTriangle } from 'lucide-react'
import Image from 'next/image'

const ACTIVE_KEY = 'ag.activeWallet'

function Hero({ isConnected, onScan }: { isConnected: boolean; onScan: () => void }) {
  return (
    <Section className="bg-white">
      <Container className="text-center">
        <H1 className="mb-6">Find and neutralize risky token approvals</H1>
        <p className="mx-auto max-w-reading text-lg text-stone mb-10">
          A clear, quiet dashboard to review, revoke, and stay ahead of dangerous wallet permissions.
        </p>
        <div className="flex items-center justify-center gap-3">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <button
              onClick={onScan}
              className="rounded-md bg-ink text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Scan wallet
            </button>
          )}
          <a href="/docs" className="text-ink/70 text-sm hover:text-ink">Learn more</a>
        </div>
      </Container>
    </Section>
  )
}

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
    <div className="min-h-screen bg-white">
      <Hero isConnected={isConnected} onScan={startScan} />

      {/* Error/Message Display */}
      {error && (
        <section className="bg-white">
          <div className="max-w-wrap mx-auto px-4 py-8 sm:px-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800 font-medium mt-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {message && (
        <section className="bg-white">
          <div className="max-w-wrap mx-auto px-4 py-8 sm:px-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-blue-800 font-medium">{message}</p>
                  <button 
                    onClick={() => setMessage(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Risk Categories */}
      <section className="bg-mist">
        <div className="max-w-wrap mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              How We Protect You
            </h2>
            <p className="text-lg text-stone max-w-reading mx-auto">
              We categorize token approvals by risk level to help you make informed decisions
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-b border-line pb-6">
              <h3 className="text-lg font-medium text-ink mb-2">UNLIMITED</h3>
              <p className="text-stone">Can drain your entire wallet balance</p>
            </div>
            <div className="border-b border-line pb-6">
              <h3 className="text-lg font-medium text-ink mb-2">HIGH RISK</h3>
              <p className="text-stone">Large amounts or unknown contracts</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-ink mb-2">SAFE</h3>
              <p className="text-stone">Small amounts from trusted sources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application Section */}
      {isConnected && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Your Wallet Security
              </h2>
              <p className="text-lg text-gray-600">
                Manage your token approvals and stay protected
              </p>
            </div>

            {/* Wallet Manager */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Wallet Addresses</h3>
              <WalletManager 
                selected={selectedWallet} 
                onSelect={setSelectedWallet}
                onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
              />
            </div>

            {/* Allowances Table */}
            {rows.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="border-b border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900">Token Approvals</h3>
                  <p className="text-gray-600 mt-1">
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
                  <div className="border-t border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Alerts</h3>
                <p className="text-gray-600 mb-6">
                  Get notified when new approvals are detected on your wallets
                </p>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cobalt focus:border-cobalt"
                    />
                  </div>
                    
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="riskOnly"
                      checked={riskOnly}
                      onChange={(e) => setRiskOnly(e.target.checked)}
                      className="mr-3"
                    />
                    <label htmlFor="riskOnly" className="text-gray-700">
                      Only alert for high-risk approvals
                    </label>
                  </div>
                  
                  <button
                    onClick={subscribe}
                    className="bg-cobalt text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Subscribe to Alerts
                  </button>
                  
                  {subMsg && (
                    <p className="text-green-600 font-medium">{subMsg}</p>
                  )}
                </div>
              </div>
            )}

            {/* Risk Policy */}
            {hasSavedWallet && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Policy</h3>
                <p className="text-gray-600 mb-6">
                  Configure what counts as alert-worthy for your wallet
                </p>
                
                {policy && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <label className="text-gray-700 font-medium w-32">Min risk score</label>
                      <input 
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg" 
                        type="number"
                        value={policy?.min_risk_score || 0}
                        onChange={e=>policy && setPolicy({...policy, min_risk_score: Number(e.target.value)})}
                      />
                    </div>
                    
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={policy?.unlimited_only || false}
                        onChange={e=>policy && setPolicy({...policy, unlimited_only: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-gray-700">Only alert on UNLIMITED approvals</span>
                    </label>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-gray-700 font-medium mb-2">Include spenders (comma-separated)</div>
                        <input 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          value={(policy?.include_spenders||[]).join(',')}
                          onChange={e=>policy && setPolicy({...policy, include_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium mb-2">Ignore spenders</div>
                        <input 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          value={(policy?.ignore_spenders||[]).join(',')}
                          onChange={e=>policy && setPolicy({...policy, ignore_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium mb-2">Include tokens</div>
                        <input 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          value={(policy?.include_tokens||[]).join(',')}
                          onChange={e=>policy && setPolicy({...policy, include_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium mb-2">Ignore tokens</div>
                        <input 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          value={(policy?.ignore_tokens||[]).join(',')}
                          onChange={e=>policy && setPolicy({...policy, ignore_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={savePolicy} 
                        className="bg-cobalt text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Save Policy
                      </button>
                      {slackMsg && <span className="text-green-600 font-medium flex items-center">{slackMsg}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Slack Alerts */}
            {hasSavedWallet && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Slack Alerts</h3>
                <p className="text-gray-600 mb-6">
                  Get daily digests in your Slack workspace
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Slack webhook URL:
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cobalt focus:border-cobalt"
                      placeholder="https://hooks.slack.com/services/..."
                      value={webhook} 
                      onChange={e=>setWebhook(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={addSlack} 
                      className="bg-cobalt text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add Webhook
                    </button>
                    {slackMsg && (
                      <span className="text-green-600 font-medium flex items-center">
                        {slackMsg}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Create a webhook at <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="underline">api.slack.com/apps</a> → Create New App → Enable Incoming Webhooks → Add to channel
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Public Share Link */}
            {hasSavedWallet && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Public Share Link</h3>
                <p className="text-gray-600 mb-6">
                  Generate a read-only link to share your wallet&apos;s approval status with others
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={censorAddr} 
                        onChange={e => setCensorAddr(e.target.checked)} 
                        className="rounded"
                      />
                      <span className="text-gray-700">Censor addresses (0x1234…abcd)</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={censorAmt} 
                        onChange={e => setCensorAmt(e.target.checked)} 
                        className="rounded"
                      />
                      <span className="text-gray-700">Hide amounts</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={riskOnlyShare} 
                        onChange={e => setRiskOnlyShare(e.target.checked)} 
                        className="rounded"
                      />
                      <span className="text-gray-700">Risky only (UNLIMITED / STALE / risk&gt;0)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <span className="text-gray-700 w-32">Expire after (days)</span>
                      <input 
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg" 
                        type="number"
                        value={expireDays} 
                        onChange={e => setExpireDays(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Never"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={generateShare} 
                      className="bg-cobalt text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Generate / Rotate
                    </button>
                    <button 
                      onClick={expireShareLink} 
                      className="bg-white text-cobalt border border-cobalt px-6 py-3 rounded-lg font-medium hover:bg-cobalt hover:text-white transition-colors duration-200"
                    >
                      Expire Link
                    </button>
                    {shareMsg && (
                      <span className="text-gray-600 font-medium flex items-center">
                        {shareMsg}
                      </span>
                    )}
                  </div>

                  {shareToken && (
                    <div className="mt-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Share URL:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" 
                          readOnly 
                          value={shareUrl ?? ''} 
                        />
                        <button
                          onClick={async () => { 
                            await navigator.clipboard.writeText(shareUrl || '')
                            setShareMsg('URL copied to clipboard!')
                          }}
                          className="bg-cobalt text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Privacy:</strong> Share links are read-only and can be expired at any time. 
                      Addresses and amounts can be censored for privacy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to secure your wallet?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Allowance Guard to protect their assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/docs"
              className="bg-cobalt text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              View Documentation
            </a>
            <a
              href="/faq"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}