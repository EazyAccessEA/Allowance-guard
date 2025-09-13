'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/ui/Container'
import { H1 } from '@/components/ui/Heading'

interface AllowanceData {
  chain_id: number
  token_address: string
  token_symbol?: string
  token_name?: string
  spender_address: string
  spender_label?: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  risk_score?: number
  risk_flags?: string[]
}

export default function ReportPage({ params }: { params: { wallet: string } }) {
  const [rows, setRows] = useState<AllowanceData[]>([])
  const [riskOnly, setRiskOnly] = useState(true)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const r = await fetch(`/api/allowances?wallet=${params.wallet}&riskOnly=${riskOnly}&page=1&pageSize=1000`)
      const j = await r.json()
      setRows(j.allowances || [])
    } catch (error) {
      console.error('Failed to load allowances:', error)
      setRows([])
    }
    setLoading(false)
  }

  useEffect(() => { 
    load() 
  }, [riskOnly, params.wallet])

  return (
    <main className="min-h-screen bg-white">
      <Container className="py-8">
        <div className="print:hidden mb-8">
          <H1 className="mb-2">Allowance Guard — Report</H1>
          <p className="text-stone text-sm">
            Wallet: <span className="font-mono text-ink">{params.wallet}</span>
          </p>
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={riskOnly} 
                onChange={e => setRiskOnly(e.target.checked)}
                className="rounded border-line"
              />
              Risky only (UNLIMITED / STALE / risk &gt; 0)
            </label>
            <button 
              onClick={() => window.print()} 
              className="rounded border border-cobalt text-cobalt px-4 py-2 text-sm hover:bg-cobalt hover:text-white transition-colors duration-200"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-stone">Loading allowances...</div>
        ) : (
          <>
            <div className="print:block hidden mb-4">
              <h1 className="text-2xl font-bold text-ink">Allowance Guard — Report</h1>
              <p className="text-sm text-stone mt-1">
                Wallet: <span className="font-mono">{params.wallet}</span>
              </p>
              <p className="text-sm text-stone">
                Generated: {new Date().toLocaleString()}
              </p>
              <p className="text-sm text-stone">
                Filter: {riskOnly ? 'Risky approvals only' : 'All approvals'}
              </p>
            </div>

            <section className="mt-6">
              <table className="w-full text-sm print:text-[11px] border-collapse">
                <thead className="text-left">
                  <tr className="border-b border-line">
                    <th className="pb-2 pr-4">Chain</th>
                    <th className="pb-2 pr-4">Token</th>
                    <th className="pb-2 pr-4">Spender</th>
                    <th className="pb-2 pr-4">Std</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2 pr-4">Amount</th>
                    <th className="pb-2">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone">
                        No allowances found
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={i} className="border-b border-line/50">
                        <td className="py-2 pr-4">{r.chain_id}</td>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {r.token_symbol || r.token_name || r.token_address}
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {r.spender_label || r.spender_address}
                        </td>
                        <td className="py-2 pr-4">{r.standard}</td>
                        <td className="py-2 pr-4">{r.allowance_type}</td>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {r.is_unlimited ? 'UNLIMITED' : r.amount}
                        </td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {r.is_unlimited && (
                              <span className="rounded bg-crimson/10 text-crimson px-2 py-0.5 text-xs">
                                UNLIMITED
                              </span>
                            )}
                            {r.risk_flags?.includes('STALE') && (
                              <span className="rounded bg-amber/10 text-amber px-2 py-0.5 text-xs">
                                STALE
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            <section className="print:block hidden mt-8 text-[10px] text-stone border-t border-line pt-4">
              <p>Generated {new Date().toLocaleString()} • www.allowanceguard.com</p>
              <p className="mt-1">Tip: Revoke UNLIMITED approvals first for better security.</p>
            </section>
          </>
        )}
      </Container>
    </main>
  )
}
