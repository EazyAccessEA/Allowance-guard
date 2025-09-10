'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import AllowanceTable from '@/components/AllowanceTable'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { load, save } from '@/lib/storage'
import { Shield, Zap, Eye, Mail } from 'lucide-react'

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

  useEffect(() => { save(ACTIVE_KEY, selectedWallet) }, [selectedWallet])

  async function fetchAllowances(addr: string) {
    const res = await fetch(`/api/allowances?wallet=${addr}`)
    const json = await res.json()
    setRows(json.allowances || [])
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    setPending(true)
    try {
      const res = await fetch('/api/scan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wallet: target }) })
      const json = await res.json()
      if (json.ok) {
        await fetchAllowances(target)
      }
    } catch (e) {
      console.error('Scan error:', e)
    } finally {
      setPending(false)
    }
  }

  async function subscribe() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    const res = await fetch('/api/alerts/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, wallet: target, riskOnly })
    })
    const ok = res.ok
    setSubMsg(ok ? 'Successfully subscribed to daily alerts' : 'Subscription failed')
  }

  const targetWallet = selectedWallet || connectedAddress

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section - AppKit Style with Get Started Steps */}
      <section className="relative overflow-hidden bg-gray-900">
        {/* Curved Background Shapes - Reown Style */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-60 -left-60 w-[600px] h-[600px] bg-gradient-to-br from-gray-600/30 to-gray-800/20 rounded-full blur-3xl"></div>
          <div className="absolute top-10 -right-60 w-[700px] h-[700px] bg-gradient-to-bl from-gray-500/25 to-gray-700/15 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-60 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-gray-600/20 to-gray-800/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Interactive Phone Demo */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Spotlight Effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                
                {/* Phone Frame with Realistic Styling */}
                <div className="relative w-80 h-[600px] bg-gradient-to-b from-gray-800 to-black rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone Screen Content - Interactive Steps */}
                    <div className="p-6 h-full flex flex-col bg-gradient-to-b from-gray-900 to-black">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Allowance Guard</h2>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AG</span>
              </div>
            </div>

                      {/* Step 1 - Connect Wallet */}
                      {!isConnected && (
                        <div className="flex-1 space-y-4">
                          <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-white font-bold">1</span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Connect your wallet</h3>
                            <p className="text-gray-400 text-sm">Connect your wallet to start monitoring token approvals</p>
                  </div>
                  
                    <ConnectButton />
                    
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-white font-medium">Email</span>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                              </div>
                              <span className="text-white font-medium">Continue with Google</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 2 - Run Scan */}
                      {isConnected && !targetWallet && (
                        <div className="flex-1 space-y-4">
                          <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Wallet Connected!</h3>
                            <p className="text-gray-400 text-sm">Now let&apos;s scan your approvals</p>
                          </div>
                          
                          <button 
                            onClick={startScan}
                            disabled={pending}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                <Zap className="w-4 h-4" />
                                Run your first scan
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {/* Step 3 - Save Addresses */}
                      {targetWallet && (
                        <div className="flex-1 space-y-4">
                          <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Scan Complete!</h3>
                            <p className="text-gray-400 text-sm">Save this wallet for quick access</p>
                          </div>
                          
                      <div className="space-y-3">
                            <div className="p-3 bg-gray-800 rounded-lg">
                              <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
                              <p className="text-white font-mono text-sm">{targetWallet.slice(0, 10)}...{targetWallet.slice(-6)}</p>
                            </div>
                            
                        <WalletManager 
                          selected={selectedWallet} 
                          onSelect={setSelectedWallet}
                          onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
                        />
                          </div>
                        </div>
                      )}
                      
                      {/* Step 4 - Revoke Approvals */}
                      {hasSavedWallet && rows.length > 0 && (
                        <div className="flex-1 space-y-4">
                          <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-2">Ready to Secure!</h3>
                            <p className="text-gray-400 text-sm">Found {rows.length} approvals to review</p>
                          </div>
                          
                          <div className="space-y-2">
                            {rows.slice(0, 3).map((row, index) => (
                              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-white text-sm font-medium">Approval #{index + 1}</p>
                                    <p className="text-gray-400 text-xs">{row.is_unlimited ? 'Unlimited' : 'Limited'}</p>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs ${
                                    row.risk_score > 7 ? 'bg-red-600 text-white' : 
                                    row.risk_score > 4 ? 'bg-yellow-600 text-white' : 
                                    'bg-green-600 text-white'
                                  }`}>
                                    Risk: {row.risk_score}/10
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            Revoke Risky Approvals
                          </button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Get Started Steps */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                    Allowance Guard
                  </h1>
                  <p className="text-xl text-blue-400 font-medium">Security</p>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Secure, monitor, and manage token approvals across all your wallets. 
                  Everything from DeFi to enterprise security, built to protect millions 
                  and scale with real-time monitoring.
                </p>
              </div>
              
              {/* Four-Step Process */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 border transition-colors ${
                  !isConnected ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      !isConnected ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {!isConnected ? '1' : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Connect your wallet</h3>
                      <p className="text-gray-400 text-sm">Connect your wallet to start monitoring token approvals across all your addresses.</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-xl p-4 border transition-colors ${
                  isConnected && !targetWallet ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isConnected && !targetWallet ? 'bg-blue-600' : targetWallet ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {targetWallet ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg> : '2'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Run your first scan</h3>
                      <p className="text-gray-400 text-sm">Scan your wallet to discover all existing token approvals and identify potential risks.</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-xl p-4 border transition-colors ${
                  targetWallet && !hasSavedWallet ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      hasSavedWallet ? 'bg-green-600' : targetWallet ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {hasSavedWallet ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg> : '3'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Save wallet addresses</h3>
                      <p className="text-gray-400 text-sm">Save frequently used wallet addresses for quick access and monitoring.</p>
                    </div>
                  </div>
                </div>
                
                <div className={`rounded-xl p-4 border transition-colors ${
                  hasSavedWallet && rows.length > 0 ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      rows.length > 0 ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {rows.length > 0 ? '4' : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Revoke risky approvals</h3>
                      <p className="text-gray-400 text-sm">Bulk revoke unlimited or stale approvals to secure your tokens.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center">
                  Try it now
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-white font-medium rounded-lg transition-colors duration-200">
                  Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Reown Style */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Essential security infrastructure
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monitoring billions in token approvals annually. Powered by real-time blockchain 
              analysis, risk assessment, and automated alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-colors">
              <Eye className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Real-time Monitoring</h3>
              <p className="text-gray-300">
                Track all token approvals across multiple wallets and chains with instant updates.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-colors">
              <Shield className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Risk Assessment</h3>
              <p className="text-gray-300">
                Advanced algorithms identify unlimited approvals and stale permissions automatically.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-colors">
              <Zap className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">One-Click Revoke</h3>
              <p className="text-gray-300">
                Instantly revoke risky approvals with our streamlined interface and gas optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - Original Hero Content */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Building the security layer for{' '}
              <span className="text-blue-400">the financial internet</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Allowance Guard powers secure, user-friendly, insight-rich infrastructure for 
              growth-driven teams building onchain finance — from DeFi and payments to 
              enterprises and institutions.
            </p>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <OnboardingChecklist />
          </div>
        </div>
      </section>

      {/* Main Application Section - Reown Style */}
      {targetWallet && (
        <section className="py-20 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                  Your Token Approvals
                </h2>
                <p className="text-xl text-gray-300">
                  Monitor and manage approvals for: <span className="font-mono text-white">{targetWallet.slice(0, 10)}...</span>
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <AllowanceTable 
                  data={rows} 
                  onRefresh={() => targetWallet ? fetchAllowances(targetWallet) : Promise.resolve()}
                  selectedWallet={selectedWallet}
                  connectedAddress={connectedAddress}
                />
              </div>

              {/* Email Alerts Section */}
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="space-y-6">
                  <div className="text-center">
                    <Mail className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">Daily Email Alerts</h3>
                    <p className="text-gray-300">
                      Get notified about risky approvals and security updates
                    </p>
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none rounded-lg"
                    />
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="riskOnly"
                        checked={riskOnly}
                        onChange={(e) => setRiskOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="riskOnly" className="text-sm text-white">
                        Only send alerts when risky approvals are detected
                      </label>
                    </div>
                    
                    <button
                      onClick={subscribe}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Subscribe to Daily Alerts
                    </button>
                    
                    {subMsg && (
                      <div className={`text-sm text-center ${subMsg.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                        {subMsg}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section - Reown Style */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Tokens Monitored</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Supported Chains</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-300">Wallets Secured</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}