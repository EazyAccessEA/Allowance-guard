'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import AllowanceTable from '@/components/AllowanceTable'
import { HexButton } from '@/components/HexButton'
import { HexCard } from '@/components/HexCard'
import { HexBadge } from '@/components/HexBadge'
import { HexBackground } from '@/components/HexBackground'
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
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ walletAddress: target, chains: ['eth','arb','base'] })
      })
      const json = await res.json()
      setMessage(json.message || 'Scan started')
      await fetch('/api/risk/refresh', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet: target })
      })
      // quick polling
      for (let i = 0; i < 5; i++) { await new Promise(r => setTimeout(r, 1200)); await fetchAllowances(target) }
      setHadScan(true)
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setPending(false)
    }
  }

  // mark revoke completion when rows lose risky items
  useEffect(() => {
    const anyRisky = rows.some(r => r.is_unlimited || (r.risk_flags || []).includes('STALE'))
    if (!anyRisky && rows.length) { setHadRevoke(true); save('ag.hadRevoke', true) }
  }, [rows])

  return (
    <HexBackground className="min-h-screen bg-ag-bg">
      {/* Header */}
      <header className="border-b-2 border-ag-line bg-ag-panel">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="hex-clip w-8 h-8 bg-ag-brand flex items-center justify-center">
                <span className="text-sm font-bold text-ag-bg">AG</span>
              </div>
              <h1 className="text-2xl font-bold text-ag-text">Allowance Guard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/docs" className="text-ag-muted hover:text-ag-text transition-colors">
                Docs
              </a>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-ag-text mb-4">
            Guard the allowances that guard your assets.
          </h2>
          <p className="text-lg text-ag-muted max-w-2xl mx-auto mb-8">
            Monitor token allowances across Ethereum, Arbitrum, and Base. 
            Find risky approvals and revoke them safely.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <HexButton size="lg" onClick={startScan} disabled={pending}>
              {pending ? 'Scanning...' : 'Start now'}
            </HexButton>
            <a href="/docs">
              <HexButton variant="ghost" size="lg">Read the docs</HexButton>
            </a>
          </div>
          
          {/* Credibility metrics */}
          <div className="flex justify-center gap-6">
            <HexBadge variant="brand" size="lg">
              <span className="font-mono">1,234</span> Allowances scanned
            </HexBadge>
            <HexBadge variant="warn" size="lg">
              <span className="font-mono">89</span> High-risk flagged
            </HexBadge>
            <HexBadge variant="info" size="lg">
              <span className="font-mono">567</span> Revoked
            </HexBadge>
          </div>
        </div>

        {/* Product Lanes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Risk & Revoke Lane */}
          <HexCard eyebrow="Risk & Revoke" eyebrowColor="warn">
            <h3 className="text-xl font-semibold text-ag-text mb-3">
              Find and revoke risky allowances
            </h3>
            <p className="text-ag-muted mb-4">
              Our indexer scans your wallet and flags unlimited allowances and stale permissions. 
              Revoke them safely with one click.
            </p>
            <div className="space-y-3">
              <HexButton 
                onClick={startScan}
                disabled={pending}
                className="w-full"
              >
                {pending ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin border-2 border-ag-bg border-t-transparent"></div>
                    <span>Scanning…</span>
                  </div>
                ) : (
                  'Scan wallet'
                )}
              </HexButton>
              {message && (
                <div className="text-sm text-ag-muted">
                  {message}
                </div>
              )}
            </div>
          </HexCard>

          {/* Alerts & Time Machine Lane */}
          <HexCard eyebrow="Alerts & Time Machine" eyebrowColor="info">
            <h3 className="text-xl font-semibold text-ag-text mb-3">
              Real-time alerts and simulation
            </h3>
            <p className="text-ag-muted mb-4">
              Get notified when new allowances are created. Use Time Machine to simulate 
              revoking allowances and see your risk score change.
            </p>
            <div className="space-y-3">
              <HexButton variant="info" className="w-full">
                Enable alerts
              </HexButton>
              <HexButton variant="ghost" className="w-full">
                Try Time Machine
              </HexButton>
            </div>
          </HexCard>
        </div>

        {/* Wallet Manager */}
        <HexCard eyebrow="Wallet Manager" eyebrowColor="brand" className="mb-8">
          <WalletManager
            selected={selectedWallet}
            onSelect={(a) => setSelectedWallet(a || null)}
            onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
          />
        </HexCard>

        {/* Allowances Table */}
        {selectedWallet && (
          <HexCard className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-ag-text">Allowances</h3>
                <p className="text-sm text-ag-muted">
                  Active wallet: <span className="font-mono text-ag-brand">{selectedWallet}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-ag-brand"></div>
                <span className="text-sm text-ag-muted">Connected</span>
              </div>
            </div>
            <AllowanceTable
              data={rows}
              onRefresh={async () => { if (selectedWallet) await fetchAllowances(selectedWallet) }}
              selectedWallet={selectedWallet}
              connectedAddress={connectedAddress}
            />
          </HexCard>
        )}

        {/* Onboarding Checklist */}
        <HexCard eyebrow="Getting Started" eyebrowColor="info">
          <OnboardingChecklist
            isConnected={isConnected}
            hadScan={hadScan}
            hasSavedWallet={hasSavedWallet}
            hadRevoke={hadRevoke}
          />
        </HexCard>
      </main>
    </HexBackground>
  )
}