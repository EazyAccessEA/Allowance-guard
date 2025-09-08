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
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Allowance Guard</h1>
      <p className="text-sm text-gray-600 mt-2">Monitor & revoke risky approvals across Ethereum, Arbitrum, and Base.</p>

      <div className="mt-4 flex items-center gap-3">
        <ConnectButton />
        <button onClick={startScan} disabled={pending} className="rounded border px-4 py-2 text-sm">
          {pending ? 'Scanning…' : 'Start Allowance Scan'}
        </button>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>

      <WalletManager
        selected={selectedWallet}
        onSelect={(a) => setSelectedWallet(a || null)}
        onSavedChange={(list) => setHasSavedWallet(list.length > 0)}
      />

      {selectedWallet && (
        <section className="mt-6">
          <div className="text-sm">Active wallet: <span className="font-mono">{selectedWallet}</span></div>
          <AllowanceTable
            data={rows}
            onRefresh={async () => { if (selectedWallet) await fetchAllowances(selectedWallet) }}
            selectedWallet={selectedWallet}
            connectedAddress={connectedAddress}
          />
        </section>
      )}

      <OnboardingChecklist
        isConnected={isConnected}
        hadScan={hadScan}
        hasSavedWallet={hasSavedWallet}
        hadRevoke={hadRevoke}
      />
    </main>
  )
}
