'use client'

import ConnectButton from '@/components/ConnectButton'
import WalletManager from '@/components/WalletManager'
import AllowanceTable from '@/components/AllowanceTable'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { load, save } from '@/lib/storage'
import { AlertTriangle } from 'lucide-react'
import Image from 'next/image'

const ACTIVE_KEY = 'ag.activeWallet'

function Hero({ isConnected, onScan }: { isConnected: boolean; onScan: () => void }) {
  return (
    <Section className="bg-white">
      <Container className="text-center">
        <H1 className="mb-6">Find and neutralize risky token approvals</H1>
        <p className="mx-auto max-w-reading text-lg text-stone mb-10">
          A clear, quiet dashboard to review, revoke, and stay ahead of dangerous wallet permissions.
        </p>
        <div className="flex items-center justify-center gap-3">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <button
              onClick={onScan}
              className="rounded-md bg-ink text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Scan wallet
            </button>
          )}
          <a href="/docs" className="text-ink/70 text-sm hover:text-ink">Learn more</a>
        </div>
      </Container>
    </Section>
  )
}

function ValueStrip() {
  const items = [
    { title: 'Audit approvals', text: 'One scan across supported chains reveals unlimited and risky allowances.' },
    { title: 'Revoke cleanly', text: 'Guided revocation flows with links to explorers and revoke utilities.' },
    { title: 'Stay ahead', text: 'Email/Slack alerts on new or high-risk approvals. Noise controlled.' },
  ]
  return (
    <Section className="bg-mist">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((it) => (
            <div key={it.title}>
              <h3 className="text-xl text-ink mb-2">{it.title}</h3>
              <p className="text-stone">{it.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function RiskExplainer() {
  const rows = [
    { k: 'UNLIMITED', v: 'Contract can spend any amount. Revoke immediately.' },
    { k: 'HIGH RISK', v: 'Large amounts or unknown contracts. Review carefully.' },
    { k: 'SAFE', v: 'Small amounts from trusted sources. Monitor periodically.' },
  ]
  return (
    <Section className="bg-white">
      <Container>
        <h2 className="text-2xl text-ink mb-6">Risk model</h2>
        <div className="divide-y divide-line border border-line rounded-md">
          {rows.map((r, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-8">
              <div className="w-40 shrink-0 text-ink font-medium">{r.k}</div>
              <div className="text-stone">{r.v}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function AppArea({
  isConnected, selectedWallet, setSelectedWallet, rows, total, page, pageSize, onPage, onPageSize, onRefresh, connectedAddress
}: {
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
}) {
  if (!isConnected) return null
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 space-y-8">
            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-2">Wallets</h3>
              <p className="text-stone mb-4 text-sm">Manage addresses you want to scan and monitor.</p>
              <WalletManager
                selected={selectedWallet}
                onSelect={setSelectedWallet}
                onSavedChange={() => {}}
              />
            </div>

            <div className="border border-line rounded-md p-6">
              <h3 className="text-lg text-ink mb-2">Tips</h3>
              <p className="text-stone text-sm">
                Unlimited approvals are the #1 drain vector. Revoke them first.
              </p>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-8">
            <div className="border border-line rounded-md">
              <div className="px-6 py-4 border-b border-line">
                <h3 className="text-lg text-ink">Approvals</h3>
                <p className="text-stone text-sm">Review, then revoke in your preferred explorer/tool.</p>
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
                  <div className="text-sm text-stone">
                    Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onPage(page - 1)} disabled={page <= 1} className="text-ink/70 hover:text-ink text-sm">Prev</button>
                    <button onClick={() => onPage(page + 1)} disabled={page >= Math.ceil(total / pageSize)} className="text-ink/70 hover:text-ink text-sm">Next</button>
                    <select
                      value={pageSize}
                      onChange={(e) => onPageSize(Number(e.target.value))}
                      className="border border-line rounded px-2 py-1 text-sm"
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
  const [error, setError] = useState<string | null>(null)
  
  // Job and pagination state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  

  useEffect(() => { save(ACTIVE_KEY, selectedWallet) }, [selectedWallet])

  async function fetchAllowances(addr: string, p = page, ps = pageSize) {
    const res = await fetch(`/api/allowances?wallet=${addr}&page=${p}&pageSize=${ps}`)
    const json = await res.json()
    setRows(json.allowances || [])
    setTotal(json.total || 0)
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setError('Please select or connect a wallet first')
      return
    }
    
    if (pending) return // debounce
    
    setPending(true)
    setError(null)
    setMessage('Queuing…')
    
    try {
      const res = await fetch('/api/scan', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ walletAddress: target, chains: ['eth','arb','base'] }) 
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to queue')
      
      setMessage(`Scan queued (#${json.jobId})`)
      
      // Optional: immediately ping the processor in dev
      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/jobs/process', { method: 'POST' }).catch(()=>{})
      }
      
      // Poll job until done
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 3000))
        const s = await fetch(`/api/jobs/${json.jobId}`).then(r => r.json())
        if (s.status === 'succeeded') { 
          setMessage('Scan complete')
          break 
        }
        if (s.status === 'failed') { 
          setMessage(`Scan failed: ${s.error || ''}`)
          break 
        }
        setMessage(`Scanning… (attempt ${s.attempts})`)
      }
      
      // post-scan tasks
      await fetch('/api/risk/refresh', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet: target })
      })
      
      await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wallet: target })
      })
      
      await fetchAllowances(target, page, pageSize)
      setSelectedWallet(target)
      
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      setError(`Network error: ${errorMessage}. Please check your connection and try again.`)
    } finally {
      setPending(false)
    }
  }


  // Pagination handlers
  const handlePage = async (newPage: number) => {
    setPage(newPage)
    if (selectedWallet) {
      await fetchAllowances(selectedWallet, newPage, pageSize)
    }
  }

  const handlePageSize = async (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    if (selectedWallet) {
      await fetchAllowances(selectedWallet, 1, newPageSize)
    }
  }

  const handleRefresh = async () => {
    if (selectedWallet) {
      await fetchAllowances(selectedWallet, page, pageSize)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero isConnected={isConnected} onScan={startScan} />
      <div className="border-t border-line" />

      {/* Error/Message Display */}
      {error && (
        <section className="bg-white">
          <div className="max-w-wrap mx-auto px-4 py-8 sm:px-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800 font-medium mt-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {message && (
        <section className="bg-white">
          <div className="max-w-wrap mx-auto px-4 py-8 sm:px-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-blue-800 font-medium">{message}</p>
                  <button 
                    onClick={() => setMessage(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <ValueStrip />
      <RiskExplainer />

      <AppArea
        isConnected={isConnected}
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
        rows={rows}
        total={total}
        page={page}
        pageSize={pageSize}
        onPage={handlePage}
        onPageSize={handlePageSize}
        onRefresh={handleRefresh}
        connectedAddress={connectedAddress}
      />

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to secure your wallet?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Allowance Guard to protect their assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/docs"
              className="bg-cobalt text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              View Documentation
            </a>
            <a
              href="/faq"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}