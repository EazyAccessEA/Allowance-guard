'use client'
import { useState } from 'react'
import { useRevoke } from '@/hooks/useRevoke'

type Row = {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: string
}

export default function AllowanceTable({
  data,
  onRefresh
}: {
  data: Row[]
  onRefresh: () => Promise<void>
}) {
  const { revoke } = useRevoke()
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function handleRevoke(row: Row) {
    setErr(null)
    const key = `${row.chain_id}-${row.token_address}-${row.spender_address}`
    setBusy(key)
    try {
      await revoke(row)
      // Optimistic: ask parent to refresh after success
      await onRefresh()
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Revoke failed')
    } finally {
      setBusy(null)
    }
  }

  if (!data?.length) return <div className="text-sm text-gray-600">No allowances found.</div>

  return (
    <div className="mt-4 overflow-x-auto">
      {err && <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr>
            <th>Chain</th>
            <th>Token</th>
            <th>Spender</th>
            <th>Std</th>
            <th>Type</th>
            <th>Amount</th>
            <th>∞</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => {
            const key = `${r.chain_id}-${r.token_address}-${r.spender_address}`
            const isBusy = busy === key
            return (
              <tr key={i} className="border-t">
                <td>{r.chain_id}</td>
                <td className="font-mono">{r.token_address}</td>
                <td className="font-mono">{r.spender_address}</td>
                <td>{r.standard}</td>
                <td>{r.allowance_type}</td>
                <td className="font-mono">{r.amount}</td>
                <td>{r.is_unlimited ? 'yes' : ''}</td>
                <td>
                  <button
                    onClick={() => handleRevoke(r)}
                    disabled={isBusy}
                    className="rounded-md border px-3 py-1 text-xs"
                  >
                    {isBusy ? 'Revoking…' : 'Revoke'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
