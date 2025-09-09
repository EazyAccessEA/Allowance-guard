'use client'

import Image from 'next/image'
import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import AllowanceTable from '@/components/AllowanceTable'
import { HexButton } from '@/components/HexButton'
import { HexBadge } from '@/components/HexBadge'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { load, save } from '@/lib/storage'

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
  const [message, setMessage] = useState<string | null>(null)
  const [hadScan, setHadScan] = useState(false)
  const [hadRevoke, setHadRevoke] = useState(() => load<boolean>('ag.hadRevoke', false))
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
    setPending(true); setMessage(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: target })
      })
      const json = await res.json()
      if (json.ok) {
        setMessage('Scan completed successfully')
        setHadScan(true)
        await fetchAllowances(target)
        // Auto-refresh risk data after scan
        try {
          await fetch('/api/risk/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet: target })
          })
        } catch (e) {
          console.warn('Risk refresh failed:', e)
        }
      } else {
        setMessage('Scan failed: ' + (json.error || 'Unknown error'))
      }
    } catch (e: unknown) {
      setMessage('Scan failed: ' + (e instanceof Error ? e.message : 'Unknown error'))
    } finally {
      setPending(false)
    }
  }

  async function subscribe() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    if (!email) return alert('Please enter an email address')
    
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, wallet: target, riskOnly })
      })
      const json = await res.json()
      if (json.ok) {
        setSubMsg('Successfully subscribed to daily alerts')
        setEmail('')
      } else {
        setSubMsg(`Subscription failed: ${json.error}`)
      }
    } catch (e: unknown) {
      setSubMsg(`Subscription failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-text">
      {/* PuredgeOS Enterprise Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-text">Allowance Guard</h1>
                <p className="text-sm text-muted">Enterprise Security Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/docs" className="text-muted hover:text-text transition-colors duration-200">
                  Documentation
                </a>
                <a href="https://github.com/EazyAccessEA/Allowance-guard" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors duration-200">
                  GitHub
                </a>
                <a href="https://discord.gg/allowanceguard" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors duration-200">
                  Support
                </a>
              </nav>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* PuredgeOS Dashboard Layout */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Status Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald' : 'bg-crimson'}`}></div>
                <span className="text-sm text-muted">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {selectedWallet && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted">Active Wallet:</span>
                  <span className="font-mono text-sm text-text bg-surface px-2 py-1 border border-border">
                    {selectedWallet.slice(0, 6)}...{selectedWallet.slice(-4)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <HexBadge variant="info" size="sm">
                {rows.length} Allowances
              </HexBadge>
              {rows.filter(r => r.risk_score > 0).length > 0 && (
                <HexBadge variant="warn" size="sm">
                  {rows.filter(r => r.risk_score > 0).length} Risk Flags
                </HexBadge>
              )}
            </div>
          </div>
        </div>

        {/* Getting Started Section - Top Priority */}
        <div className="mb-6 md:mb-8">
          <div className="bg-surface border border-border p-4 md:p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-text">Getting Started</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm text-muted">Follow these steps</span>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 md:space-x-6 pb-4 animate-scroll">
                  <OnboardingChecklist
                    isConnected={isConnected}
                    hadScan={hadScan}
                    hasSavedWallet={hasSavedWallet}
                    hadRevoke={hadRevoke}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Wallet Management Card */}
            <div className="bg-surface border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-heading font-semibold text-text">Wallet Management</h2>
                <div className="w-2 h-2 bg-emerald rounded-full"></div>
              </div>
              <WalletManager
                selected={selectedWallet}
                onSelect={(a) => setSelectedWallet(a || null)}
                onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
              />
            </div>

            {/* Quick Actions Card */}
            <div className="bg-surface border border-border p-4 md:p-6">
              <h2 className="text-base md:text-lg font-heading font-semibold text-text mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <HexButton 
                  onClick={startScan} 
                  disabled={pending || !selectedWallet}
                  className="w-full justify-center"
                >
                  {pending ? 'Scanning...' : 'Scan Allowances'}
                </HexButton>
                
                {message && (
                  <div className={`p-3 text-sm border ${
                    message.includes('success') 
                      ? 'bg-emerald/10 border-emerald text-emerald' 
                      : 'bg-crimson/10 border-crimson text-crimson'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* Email Alerts Subscription */}
            <div className="bg-surface border border-border p-4 md:p-6">
              <h2 className="text-base md:text-lg font-heading font-semibold text-text mb-4">Daily Email Alerts</h2>
              <div className="space-y-4">
                <div>
                  <input
                    className="w-full rounded-full border border-border bg-input px-4 py-3 text-sm text-text placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="riskOnly"
                    checked={riskOnly}
                    onChange={(e) => setRiskOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="riskOnly" className="text-sm text-text">
                    Only send alerts when risky approvals are detected
                  </label>
                </div>
                <button
                  onClick={subscribe}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Subscribe to Daily Alerts
                </button>
                {subMsg && (
                  <div className={`text-sm ${subMsg.includes('Successfully') ? 'text-emerald' : 'text-crimson'}`}>
                    {subMsg}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Data Display */}
          <div className="lg:col-span-2">
            {selectedWallet ? (
              <div className="bg-surface border border-border p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 space-y-2 sm:space-y-0">
                  <div>
                    <h2 className="text-lg md:text-xl font-heading font-semibold text-text">Allowance Dashboard</h2>
                    <p className="text-muted mt-1 text-sm md:text-base">
                      Monitor and manage token allowances for enhanced security
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald rounded-full"></div>
                    <span className="text-sm text-muted">Live Data</span>
                  </div>
                </div>
                
                <AllowanceTable
                  data={rows}
                  onRefresh={async () => { if (selectedWallet) await fetchAllowances(selectedWallet) }}
                  selectedWallet={selectedWallet}
                  connectedAddress={connectedAddress}
                />
              </div>
            ) : (
              <div className="bg-surface border border-border p-12 text-center">
                <div className="w-16 h-16 bg-muted/20 border border-border mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-heading font-semibold text-text mb-2">No Wallet Selected</h3>
                <p className="text-muted mb-6">
                  Connect your wallet or select a saved wallet to begin monitoring allowances
                </p>
                <div className="flex justify-center space-x-3">
                  <ConnectButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PuredgeOS Enterprise Footer */}
      <footer className="border-t border-border bg-surface mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/AG_Logo2.png"
                    alt="Allowance Guard Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-text">Allowance Guard</h3>
                  <p className="text-sm text-muted">Enterprise Security Platform</p>
                </div>
              </div>
              <p className="text-muted text-sm max-w-md">
                Professional-grade token allowance monitoring and risk management for 
                enterprise security teams and individual users.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-text mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/docs" className="text-muted hover:text-text transition-colors">Documentation</a></li>
                <li><a href="/docs#features" className="text-muted hover:text-text transition-colors">Features</a></li>
                <li><a href="/docs#api" className="text-muted hover:text-text transition-colors">API Reference</a></li>
                <li><a href="/docs#security" className="text-muted hover:text-text transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-text mb-3">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/EazyAccessEA/Allowance-guard" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors">GitHub</a></li>
                <li><a href="https://discord.gg/allowanceguard" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors">Discord</a></li>
                <li><a href="https://twitter.com/allowanceguard" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors">Twitter</a></li>
                <li><a href="mailto:support@allowanceguard.com" className="text-muted hover:text-text transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted">
              © 2024 Allowance Guard. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-sm text-muted hover:text-text transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-sm text-muted hover:text-text transition-colors">Terms of Service</a>
              <a href="/security" className="text-sm text-muted hover:text-text transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}