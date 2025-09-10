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

  useEffect(() => { save(ACTIVE_KEY, selectedWallet) }, [selectedWallet])

  async function fetchAllowances(addr: string) {
    const res = await fetch(`/api/allowances?wallet=${addr}`)
    const json = await res.json()
    setRows(json.allowances || [])
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setError('Please select or connect a wallet first')
      return
    }
    
    setPending(true)
    setError(null)
    
    try {
      const res = await fetch('/api/scan', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ wallet: target }) 
      })
      
      const json = await res.json()
      if (json.ok) {
        await fetchAllowances(target)
        setSelectedWallet(target)
      } else {
        setError(`Scan failed: ${json.error || 'Unknown error'}. Please check your wallet address and try again.`)
      }
    } catch (e) {
      setError(`Network error: ${e instanceof Error ? e.message : 'Unknown error'}. Please check your connection and try again.`)
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

  const targetWallet = selectedWallet || connectedAddress

  return (
    <div className="min-h-screen bg-white">
      {/* Clear Action-Oriented Hero Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Allowance Guard
            </h1>
            
            {/* Clear Problem Statement */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                <h2 className="text-xl font-semibold text-red-800">Your Wallet May Be At Risk</h2>
              </div>
              <p className="text-red-700 text-sm sm:text-base">
                Token approvals can drain your wallet. Many users have <strong>unlimited approvals</strong> 
                that allow any amount to be taken without your permission.
              </p>
            </div>

            {/* Clear Solution */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-green-800">Protection is Simple</h2>
              </div>
              <p className="text-green-700 text-sm sm:text-base text-center">
                Connect your wallet below, scan for dangerous approvals, and revoke risky permissions instantly.
              </p>
            </div>
            
            {/* Primary Action - Always Visible */}
            <div className="mb-8 sm:mb-12">
              <div className="space-y-4">
                {/* Wallet Connection - Always Visible */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  {!isConnected ? (
                    <>
                      <p className="text-blue-800 text-sm font-medium mb-3">
                        🔗 Connect your wallet to get started
                      </p>
                      <ConnectButton />
                    </>
                  ) : (
                    <>
                      <p className="text-green-800 text-sm font-medium mb-3">
                        ✅ Wallet connected! Ready to scan
                      </p>
                      <div className="flex gap-2">
                        <ConnectButton />
                        <button 
                          onClick={startScan}
                          disabled={pending}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          {pending ? (
                            <>
                              <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Scan Now
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <p className="text-gray-500 text-xs text-center">
                  We never store your private keys. Your wallet stays in your control.
                </p>
                
                {isConnected && (
                  <p className="text-gray-500 text-xs text-center">
                    This will check all your token approvals across Ethereum, Arbitrum, and Base
                  </p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-800 text-sm">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Wallets Protected</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">$2M+</div>
                <div className="text-sm text-gray-600">Assets Secured</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You&apos;ll See Section */}
      <section className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What You&apos;ll See After Scanning
            </h2>
            <p className="text-gray-600">
              We categorize your approvals by risk level to help you make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">!</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UNLIMITED</h3>
              <p className="text-gray-600 text-sm">Can take any amount from your wallet</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 font-bold text-xl">⚠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HIGH RISK</h3>
              <p className="text-gray-600 text-sm">Large amounts or unknown contracts</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SAFE</h3>
              <p className="text-gray-600 text-sm">Small amounts from trusted sources</p>
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 relative">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to secure your wallet?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Allowance Guard to protect their assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/docs"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View Documentation
            </a>
            <a
              href="/faq"
              className="px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-500 text-white font-medium rounded-lg transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}