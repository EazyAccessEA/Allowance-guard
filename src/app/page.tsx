'use client'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import ConnectButton from '@/components/ConnectButton'
import ValueStrip from '@/components/ValueStrip'
import RiskExplainer from '@/components/RiskExplainer'
import AppArea from '@/components/AppArea'

export default function HomePage() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState(0)
  const [pending, setPending] = useState(false)

  async function fetchAllowances(addr: string, p = page, ps = pageSize) {
    const res = await fetch(`/api/allowances?wallet=${addr}&page=${p}&pageSize=${ps}`)
    const json = await res.json()
    setRows(json.allowances || [])
    setTotal(json.total || 0)
  }

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target || pending) return
    setPending(true)
    try {
      const res = await fetch('/api/scan', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ walletAddress: target, chains: ['eth','arb','base'] }) })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed to queue')
      // poll simplified or rely on job webhooks; then:
      await fetchAllowances(target, 1, pageSize)
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
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      {/* Hero */}
      <Section>
        <Container className="text-center">
          <H1 className="mb-6">Find and neutralize risky token approvals</H1>
          <p className="mx-auto max-w-reading text-lg text-stone mb-10">
            A quiet dashboard to review, revoke, and monitor wallet permissions across chains.
          </p>
          <div className="flex items-center justify-center gap-3">
            {!isConnected ? (
              <ConnectButton variant="primary" />
            ) : (
              <button onClick={startScan} disabled={pending} className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-ink text-white hover:opacity-90 focus:ring-ink/30 disabled:opacity-50">
                {pending ? 'Scanning…' : 'Scan wallet'}
              </button>
            )}
            <a href="/docs" className="text-ink/70 text-sm hover:text-ink focus:outline-none focus:ring-2 focus:ring-ink/30 rounded">Learn more</a>
          </div>
        </Container>
      </Section>
      <div className="border-t border-line" />

      {/* Value Strip */}
      <ValueStrip />

      {/* Risk Explainer */}
      <RiskExplainer />

      {/* App Area */}
      {isConnected && (
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
      )}

      <Footer />
    </div>
  )
}