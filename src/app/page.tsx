'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import AllowanceTable from '@/components/AllowanceTable'
import { HexButton } from '@/components/HexButton'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { load, save } from '@/lib/storage'
import { Shield, Zap, Eye, ArrowRight, Mail } from 'lucide-react'

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Reown Style */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Building the security layer for{' '}
                  <span className="text-secondary">token approvals</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Allowance Guard powers secure, user-friendly, insight-rich monitoring for 
                  growth-driven teams managing onchain token approvals - from DeFi protocols 
                  to enterprise security.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <HexButton size="lg" className="bg-primary hover:bg-primary/90 text-white border-primary">
                  Start Monitoring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </HexButton>
                <HexButton variant="ghost" size="lg" className="border-border hover:bg-surface">
                  View Documentation
                </HexButton>
              </div>
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="relative">
              <div className="bg-surface rounded-3xl p-8 border border-border">
                <div className="space-y-6">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground">Monitor token approvals across all your wallets</p>
                  </div>
                  
                  <div className="space-y-4">
                    <ConnectButton />
                    
                    {isConnected && (
                      <div className="space-y-3">
                        <WalletManager 
                          selected={selectedWallet} 
                          onSelect={setSelectedWallet}
                          onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
                        />
                        
                        <HexButton 
                          onClick={startScan} 
                          disabled={pending || !targetWallet}
                          className="w-full bg-secondary hover:bg-secondary/90 text-white border-secondary"
                        >
                          {pending ? 'Scanning...' : 'Scan Approvals'}
                          <Zap className="w-4 h-4 ml-2" />
                        </HexButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Essential security infrastructure
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitoring billions in token approvals annually. Powered by real-time blockchain 
              analysis, risk assessment, and automated alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 border border-border">
              <Eye className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Track all token approvals across multiple wallets and chains with instant updates.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 border border-border">
              <Shield className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Advanced algorithms identify unlimited approvals and stale permissions automatically.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 border border-border">
              <Zap className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-3">One-Click Revoke</h3>
              <p className="text-muted-foreground">
                Instantly revoke risky approvals with our streamlined interface and gas optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section - Redesigned */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to secure your token approvals
            </p>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-border">
            <OnboardingChecklist />
          </div>
        </div>
      </section>

      {/* Main Application Section */}
      {targetWallet && (
        <section className="py-20 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Your Token Approvals
                </h2>
                <p className="text-xl text-muted-foreground">
                  Monitor and manage approvals for: <span className="font-mono text-foreground">{targetWallet.slice(0, 10)}...</span>
                </p>
              </div>

              <div className="bg-background rounded-2xl p-8 border border-border">
                <AllowanceTable 
                  data={rows} 
                  onRefresh={() => targetWallet ? fetchAllowances(targetWallet) : Promise.resolve()}
                  selectedWallet={selectedWallet}
                  connectedAddress={connectedAddress}
                />
              </div>

              {/* Email Alerts Section */}
              <div className="bg-background rounded-2xl p-8 border border-border">
                <div className="space-y-6">
                  <div className="text-center">
                    <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Daily Email Alerts</h3>
                    <p className="text-muted-foreground">
                      Get notified about risky approvals and security updates
                    </p>
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-input border-2 border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none rounded-full"
                    />
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="riskOnly"
                        checked={riskOnly}
                        onChange={(e) => setRiskOnly(e.target.checked)}
                        className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
                      />
                      <label htmlFor="riskOnly" className="text-sm text-foreground">
                        Only send alerts when risky approvals are detected
                      </label>
                    </div>
                    
                    <HexButton
                      onClick={subscribe}
                      className="w-full bg-primary hover:bg-primary/90 text-white border-primary"
                      size="md"
                    >
                      Subscribe to Daily Alerts
                    </HexButton>
                    
                    {subMsg && (
                      <div className={`text-sm text-center ${subMsg.includes('Successfully') ? 'text-emerald' : 'text-crimson'}`}>
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

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Tokens Monitored</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-muted-foreground">Supported Chains</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">10K+</div>
              <div className="text-muted-foreground">Wallets Secured</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}