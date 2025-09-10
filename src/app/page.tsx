'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { load, save } from '@/lib/storage'
import { Shield, Zap, Eye, Mail, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
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

  const targetWallet = selectedWallet || connectedAddress

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Hero Section */}
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
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
              Monitor and manage token approvals across all your wallets. 
              Protect your assets with real-time security monitoring.
            </p>
            
            {/* Primary Action */}
            <div className="mb-8 sm:mb-12">
              {!isConnected ? (
                <ConnectButton />
              ) : (
                <button 
                  onClick={startScan}
                  disabled={pending}
                  className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                >
                  {pending ? (
                    <>
                      <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Scan My Approvals
                    </>
                  )}
                </button>
              )}
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-gray-600">
              Simple steps to secure your wallet
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-gray-600 text-sm">Connect your wallet to start monitoring token approvals</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan Approvals</h3>
              <p className="text-gray-600 text-sm">Scan all your token approvals across multiple chains</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Alerts</h3>
              <p className="text-gray-600 text-sm">Receive email alerts for new risky approvals</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revoke Risky</h3>
              <p className="text-gray-600 text-sm">Revoke dangerous approvals with one click</p>
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