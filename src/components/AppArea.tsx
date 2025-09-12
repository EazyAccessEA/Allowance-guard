import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'
import { useState, useEffect } from 'react'

interface AppAreaProps {
  isConnected: boolean
  selectedWallet: string | null
  setSelectedWallet: (wallet: string | null) => void
  rows: {
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
  }[]
  total: number
  page: number
  pageSize: number
  onPage: (page: number) => void
  onPageSize: (pageSize: number) => void
  onRefresh: () => Promise<void>
  connectedAddress: string | undefined
  canRevoke?: boolean
}

export default function AppArea({
  isConnected, selectedWallet, setSelectedWallet, rows, total, page, pageSize, onPage, onPageSize, onRefresh, connectedAddress, canRevoke = true
}: AppAreaProps) {
  const [monitorOn, setMonitorOn] = useState<boolean | null>(null)
  const [monitorFreq, setMonitorFreq] = useState(720)

  async function loadMonitor() {
    const target = selectedWallet || connectedAddress
    if (!target) return
    const r = await fetch(`/api/monitor?wallet=${target}`)
    const j = await r.json()
    if (j.monitor) { setMonitorOn(j.monitor.enabled); setMonitorFreq(j.monitor.freq_minutes) }
  }
  useEffect(() => { loadMonitor() }, [selectedWallet, connectedAddress])

  async function saveMonitor() {
    const target = selectedWallet || connectedAddress
    if (!target) return alert('Select or connect a wallet first')
    await fetch('/api/monitor', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ wallet: target, enabled: monitorOn ?? true, freq_minutes: monitorFreq })
    })
  }

  if (!isConnected) return null
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 space-y-8">
            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-3">Wallets</h3>
              <p className="text-base text-stone mb-4">Manage addresses you want to scan and monitor.</p>
              <WalletManager
                selected={selectedWallet}
                onSelect={setSelectedWallet}
                onSavedChange={() => {}}
              />
            </div>

            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-3">Monitoring</h3>
              <div className="space-y-3">
                <label className="text-sm flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={!!monitorOn} 
                    onChange={e=>setMonitorOn(e.target.checked)} 
                    className="rounded border-line"
                  />
                  Enable auto-rescan & drift alerts
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Every</span>
                  <input 
                    type="number" 
                    className="w-20 rounded border border-line px-2 py-1 text-sm" 
                    value={monitorFreq} 
                    onChange={e=>setMonitorFreq(Number(e.target.value||720))} 
                  />
                  <span className="text-sm">minutes</span>
                </div>
                <button 
                  onClick={saveMonitor} 
                  className="rounded border border-line px-3 py-2 text-sm hover:bg-mist transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-3">Tips</h3>
              <p className="text-base text-stone">
                Unlimited approvals are the #1 drain vector. Revoke them first.
              </p>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-8">
            <div className="border border-line rounded-md">
              <div className="px-6 py-4 border-b border-line">
                <h3 className="text-lg text-ink">Approvals</h3>
                <p className="text-base text-stone">Review, then revoke in your preferred explorer/tool.</p>
              </div>
              <AllowanceTable
                data={rows}
                selectedWallet={selectedWallet}
                connectedAddress={connectedAddress}
                onRefresh={onRefresh}
                canRevoke={canRevoke}
              />
              {/* Pagination */}
              {total > 0 && (
                <div className="px-6 py-4 border-t border-line flex items-center justify-between">
                  <div className="text-base text-stone">
                    Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onPage(page - 1)} disabled={page <= 1} className="text-ink/70 hover:text-ink text-base focus:outline-none focus:ring-2 focus:ring-ink/30 rounded">Prev</button>
                    <button onClick={() => onPage(page + 1)} disabled={page >= Math.ceil(total / pageSize)} className="text-ink/70 hover:text-ink text-base focus:outline-none focus:ring-2 focus:ring-ink/30 rounded">Next</button>
                    <select
                      value={pageSize}
                      onChange={(e) => onPageSize(Number(e.target.value))}
                      className="border border-line rounded px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-ink/30"
                    >
                      {[10,25,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </Container>
    </Section>
  )
}
