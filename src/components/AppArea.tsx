import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'

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
}

export default function AppArea({
  isConnected, selectedWallet, setSelectedWallet, rows, total, page, pageSize, onPage, onPageSize, onRefresh, connectedAddress
}: AppAreaProps) {
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
