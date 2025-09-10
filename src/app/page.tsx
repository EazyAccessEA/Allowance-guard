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
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { save(ACTIVE_KEY, selectedWallet) }, [selectedWallet])

  // Auto-advance steps based on state
  useEffect(() => {
    if (isConnected && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [isConnected, currentStep])

  useEffect(() => {
    if (hasSavedWallet && currentStep === 3) {
      setCurrentStep(4)
    }
  }, [hasSavedWallet, currentStep])

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
        setCurrentStep(3)
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

  // Navigation helpers
  function goBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  function resetFlow() {
    setCurrentStep(1)
    setSelectedWallet(null)
    setRows([])
    setError(null)
    setSubMsg(null)
    setPending(false)
  }

  function goToStep(step: number) {
    setCurrentStep(step)
    setError(null)
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Interactive Tablet Demo */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Spotlight Effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                
                {/* Tablet Frame with Realistic Styling */}
                <div className="relative w-96 h-[500px] bg-gradient-to-b from-gray-800 to-black rounded-[2rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[1.5rem] overflow-hidden relative">
                    {/* Simple Clean Interface */}
                    <div className="p-6 h-full flex flex-col bg-gray-900">
                      {/* Simple Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Allowance Guard</h2>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AG</span>
                        </div>
                      </div>

                      {/* Simple Step Indicator */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                step === currentStep ? 'bg-blue-500' : 
                                step < currentStep ? 'bg-green-500' : 'bg-gray-600'
                              }`}
                            />
                          ))}
              </div>
            </div>

                      {/* Error Message */}
                      {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                          <p className="text-red-200 text-sm">{error}</p>
                          <button 
                            onClick={() => setError(null)}
                            className="text-red-300 hover:text-red-200 text-xs underline mt-1"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}

                      {/* Step 1 - Connect Wallet */}
                      {currentStep === 1 && !isConnected && (
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                          <div className="text-center">
                            <h3 className="text-white font-semibold mb-2">Connect your wallet</h3>
                            <p className="text-gray-400 text-sm">Connect your wallet to start monitoring token approvals</p>
                          </div>
                          
                          <ConnectButton />
                          
                          <div className="flex justify-center">
                            <button 
                              onClick={() => setCurrentStep(2)}
                              className="text-gray-400 hover:text-white text-sm underline"
                            >
                              Skip for now
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 2 - Run Scan */}
                      {currentStep === 2 && isConnected && !targetWallet && (
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                          <div className="text-center">
                            <h3 className="text-white font-semibold mb-2">Scan your approvals</h3>
                            <p className="text-gray-400 text-sm">Check all your token approvals across multiple chains</p>
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
                                Run scan
                              </>
                            )}
                          </button>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={goBack}
                              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                            >
                              Back
                            </button>
                            <button 
                              onClick={() => setCurrentStep(3)}
                              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 3 - Save Addresses */}
                      {currentStep === 3 && targetWallet && (
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

                      {/* Help Section */}
                      <div className="mt-auto pt-4 border-t border-gray-700">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs mb-2">Need help?</p>
                          <div className="flex gap-2 justify-center">
                            <a 
                              href="/docs" 
                              className="text-blue-400 hover:text-blue-300 text-xs underline"
                            >
                              Documentation
                            </a>
                            <span className="text-gray-600">•</span>
                            <a 
                              href="mailto:support@allowanceguard.com" 
                              className="text-blue-400 hover:text-blue-300 text-xs underline"
                            >
                              Contact Support
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 4 - Revoke Approvals */}
                      {currentStep === 4 && hasSavedWallet && rows.length > 0 && (
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
              
              <div className="flex justify-center">
                <a 
                  href="/docs" 
                  className="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-gray-500 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Docs
                </a>
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