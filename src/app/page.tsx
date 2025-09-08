'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import AllowanceTable from '@/components/AllowanceTable'
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
    <div className="min-h-screen bg-gradient-to-br from-reown-blue-50 via-white to-reown-teal-50 dark:from-reown-gray-900 dark:via-reown-gray-800 dark:to-reown-gray-900">
      {/* Header */}
      <header className="border-b border-reown-gray-200 bg-white/80 backdrop-blur-sm dark:border-reown-gray-700 dark:bg-reown-gray-800/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-reown flex items-center justify-center">
                <span className="text-sm font-bold text-white">AG</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">Allowance Guard</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-reown-gray-900 dark:text-white mb-4">
            Monitor & Revoke Risky Approvals
          </h2>
          <p className="text-lg text-reown-gray-600 dark:text-reown-gray-300 max-w-2xl mx-auto">
            Secure your wallet by monitoring token allowances across Ethereum, Arbitrum, and Base networks. 
            Identify and revoke risky approvals with ease.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Scan Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-reown flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-reown-gray-900 dark:text-white">Scan Allowances</h3>
            </div>
            <p className="text-reown-gray-600 dark:text-reown-gray-300 mb-4">
              Scan your wallet to discover all token approvals across supported networks.
            </p>
            <button 
              onClick={startScan} 
              disabled={pending} 
              className="btn-primary w-full"
            >
              {pending ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Scanning…</span>
                </div>
              ) : (
                'Start Allowance Scan'
              )}
            </button>
            {message && (
              <div className="mt-3 p-3 rounded-lg bg-reown-blue-50 border border-reown-blue-200 text-sm text-reown-blue-700 dark:bg-reown-blue-900/20 dark:border-reown-blue-800 dark:text-reown-blue-300">
                {message}
              </div>
            )}
          </div>

          {/* Wallet Manager Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-reown-teal-500 to-reown-blue-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-reown-gray-900 dark:text-white">Wallet Manager</h3>
            </div>
            <WalletManager
              selected={selectedWallet}
              onSelect={(a) => setSelectedWallet(a || null)}
              onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
            />
          </div>
        </div>

        {/* Allowances Table */}
        {selectedWallet && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-reown-gray-900 dark:text-white">Allowances</h3>
                <p className="text-sm text-reown-gray-600 dark:text-reown-gray-300">
                  Active wallet: <span className="font-mono text-reown-blue-600 dark:text-reown-blue-400">{selectedWallet}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-reown-success-500"></div>
                <span className="text-sm text-reown-gray-600 dark:text-reown-gray-300">Connected</span>
              </div>
            </div>
            <AllowanceTable
              data={rows}
              onRefresh={async () => { if (selectedWallet) await fetchAllowances(selectedWallet) }}
              selectedWallet={selectedWallet}
              connectedAddress={connectedAddress}
            />
          </div>
        )}

        {/* Onboarding Checklist */}
        <div className="card">
          <OnboardingChecklist
            isConnected={isConnected}
            hadScan={hadScan}
            hasSavedWallet={hasSavedWallet}
            hadRevoke={hadRevoke}
          />
        </div>
      </main>
    </div>
  )
}
