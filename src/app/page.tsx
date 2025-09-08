'use client'

import ConnectButton from '@/components/ConnectButton'
import AllowanceTable from '@/components/AllowanceTable'
import { useAccount } from 'wagmi'
import { useState } from 'react'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [rows, setRows] = useState<{
    chain_id: number
    token_address: string
    spender_address: string
    standard: string
    allowance_type: string
    amount: string
    is_unlimited: boolean
    last_seen_block: string
  }[]>([])

  async function fetchAllowances(addr: string) {
    const res = await fetch(`/api/allowances?wallet=${addr}`)
    const json = await res.json()
    setRows(json.allowances || [])
  }

  async function refreshAfterRevoke() {
    if (address) await fetchAllowances(address)
  }

  async function startScan() {
    if (!address) return
    setPending(true)
    setMessage(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, chains: ['eth','arb','base'] })
      })
      const json = await res.json()
      setMessage(json.message || 'Scan started')

      // quick polling burst
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 1500))
        await fetchAllowances(address)
      }
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Allowance Guard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Connect your wallet to scan allowances on Ethereum, Arbitrum, and Base.
      </p>

      <div className="mt-6">
        <ConnectButton />
      </div>

      {isConnected && (
        <section className="mt-6 space-y-3">
          <div className="text-sm">
            Connected: <span className="font-mono">{address}</span>
          </div>
          <button
            onClick={startScan}
            disabled={pending}
            className="rounded-md border px-4 py-2 text-sm"
          >
            {pending ? 'Starting…' : 'Start Allowance Scan'}
          </button>
          {message && <div className="text-sm text-gray-700">{message}</div>}
          {rows && <AllowanceTable data={rows} onRefresh={refreshAfterRevoke} />}
        </section>
      )}
    </main>
  )
}
