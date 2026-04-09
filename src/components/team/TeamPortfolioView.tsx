'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Wallet,
  Shield,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WalletSummary {
  wallet_address: string
  total_allowances: number
  unlimited_count: number
  high_risk_count: number
  risk_score: number
  chains: number[]
  last_scan: string | null
}

interface TeamPortfolioViewProps {
  teamId: number
}

// ---------------------------------------------------------------------------
// Chain display helpers
// ---------------------------------------------------------------------------

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  8453: 'Base',
  137: 'Polygon',
  10: 'Optimism',
  43114: 'Avalanche',
}

function riskColor(score: number) {
  if (score >= 70) return 'danger' as const
  if (score >= 40) return 'warning' as const
  return 'success' as const
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TeamPortfolioView({ teamId }: TeamPortfolioViewProps) {
  const [wallets, setWallets] = useState<WalletSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null)
  const [walletAllowances, setWalletAllowances] = useState<Record<string, Record<string, unknown>[]>>({})

  const loadWallets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/teams/portfolio?teamId=${teamId}`)
      const data = await res.json()
      setWallets(data.wallets ?? [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [teamId])

  useEffect(() => { loadWallets() }, [loadWallets])

  const toggleWallet = async (address: string) => {
    if (expandedWallet === address) {
      setExpandedWallet(null)
      return
    }
    setExpandedWallet(address)

    // Load allowances for this wallet if not cached
    if (!walletAllowances[address]) {
      const res = await fetch(`/api/teams/portfolio/allowances?teamId=${teamId}&wallet=${address}`)
      const data = await res.json()
      setWalletAllowances((prev) => ({ ...prev, [address]: data.allowances ?? [] }))
    }
  }

  const totalRisk = wallets.length > 0
    ? Math.round(wallets.reduce((sum, w) => sum + w.risk_score, 0) / wallets.length)
    : 0

  const totalAllowances = wallets.reduce((sum, w) => sum + w.total_allowances, 0)
  const totalUnlimited = wallets.reduce((sum, w) => sum + w.unlimited_count, 0)

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{wallets.length}</div>
            <div className="text-xs text-ink-muted">Tracked Wallets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalAllowances}</div>
            <div className="text-xs text-ink-muted">Total Approvals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-deep">{totalUnlimited}</div>
            <div className="text-xs text-ink-muted">Unlimited Approvals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Badge variant={riskColor(totalRisk)} className="text-lg px-3 py-1">
              {totalRisk}/100
            </Badge>
            <div className="text-xs text-ink-muted mt-1">Avg Risk Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Team Wallets
            </CardTitle>
            <Button onClick={loadWallets} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && wallets.length === 0 ? (
            <div className="text-sm text-ink-muted">Loading portfolio...</div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-8 h-8 text-ink-whisper mx-auto mb-2" />
              <p className="text-sm text-ink-muted">No wallets in this team yet</p>
              <p className="text-xs text-ink-whisper mt-1">Add wallets to start monitoring the team portfolio.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((w) => (
                <div key={w.wallet_address} className="border border-ink-rule rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleWallet(w.wallet_address)}
                    className="w-full flex items-center justify-between p-4 hover:bg-paper-sub transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Shield className={`w-5 h-5 flex-shrink-0 ${
                        w.risk_score >= 70 ? 'text-red-800' :
                        w.risk_score >= 40 ? 'text-amber-deep' : 'text-green-800'
                      }`} />
                      <div className="min-w-0">
                        <div className="text-sm font-mono text-ink truncate">
                          {w.wallet_address.slice(0, 6)}...{w.wallet_address.slice(-4)}
                        </div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {w.chains.map((c) => (
                            <span key={c} className="text-xs text-ink-whisper">
                              {CHAIN_NAMES[c] ?? `Chain ${c}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{w.total_allowances} approvals</div>
                        {w.unlimited_count > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-deep">
                            <AlertTriangle className="w-3 h-3" />
                            {w.unlimited_count} unlimited
                          </div>
                        )}
                      </div>
                      <Badge variant={riskColor(w.risk_score)}>{w.risk_score}</Badge>
                      {expandedWallet === w.wallet_address
                        ? <ChevronUp className="w-4 h-4 text-ink-whisper" />
                        : <ChevronDown className="w-4 h-4 text-ink-whisper" />}
                    </div>
                  </button>

                  {/* Expanded allowances */}
                  {expandedWallet === w.wallet_address && (
                    <div className="border-t border-ink-rule bg-paper-sub p-4">
                      {!walletAllowances[w.wallet_address] ? (
                        <div className="text-sm text-ink-muted">Loading allowances...</div>
                      ) : walletAllowances[w.wallet_address].length === 0 ? (
                        <div className="text-sm text-ink-muted">No active allowances</div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-5 gap-2 text-xs font-medium text-ink-whisper px-2">
                            <div>Token</div>
                            <div>Spender</div>
                            <div>Chain</div>
                            <div>Amount</div>
                            <div>Risk</div>
                          </div>
                          {(walletAllowances[w.wallet_address]).slice(0, 20).map((a, idx) => (
                            <div key={idx} className="grid grid-cols-5 gap-2 text-xs p-2 rounded bg-paper">
                              <div className="font-mono truncate" title={a.token_address as string}>
                                {(a.token_symbol as string) ?? (a.token_address as string)?.slice(0, 10)}
                              </div>
                              <div className="font-mono truncate" title={a.spender_address as string}>
                                {(a.spender_label as string) ?? (a.spender_address as string)?.slice(0, 10)}
                              </div>
                              <div>{CHAIN_NAMES[a.chain_id as number] ?? a.chain_id}</div>
                              <div>
                                {a.is_unlimited
                                  ? <Badge variant="danger">Unlimited</Badge>
                                  : <span className="font-mono">{String(a.amount).slice(0, 12)}</span>}
                              </div>
                              <div>
                                {typeof a.risk_score === 'number' && (
                                  <Badge variant={riskColor(a.risk_score as number)}>{a.risk_score}</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                          {walletAllowances[w.wallet_address].length > 20 && (
                            <div className="text-xs text-ink-whisper text-center pt-2">
                              +{walletAllowances[w.wallet_address].length - 20} more allowances
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-3 flex justify-end">
                        <a
                          href={`/?wallet=${w.wallet_address}`}
                          className="text-xs text-primary-accent hover:underline flex items-center gap-1"
                        >
                          Full scan <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
