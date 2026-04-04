'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { CHAIN_NAMES } from '@/config/chains'
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  Clock,
  RefreshCw,
} from 'lucide-react'

type Permit2AllowanceRow = {
  chainId: number
  token: string
  spender: string
  spenderLabel: string | null
  amount: string
  isUnlimited: boolean
  expiration: number
  expirationDate: string | null
  nonce: number
  isExpired: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

type Permit2ScanResult = {
  wallet: string
  chainIds: number[]
  permit2Allowances: Permit2AllowanceRow[]
  totalCount: number
  activeCount: number
  hasPermit2Risk: boolean
}

interface Permit2PanelProps {
  walletAddress: string | null
  connectedAddress: string | undefined
}

const riskColors: Record<string, string> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
}

const riskLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export default function Permit2Panel({ walletAddress }: Permit2PanelProps) {
  const [data, setData] = useState<Permit2ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function scan() {
    if (!walletAddress) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/allowances/permit2?wallet=${walletAddress}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to scan')
      }
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (walletAddress) scan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress])

  if (!walletAddress) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary-accent" />
            Permit2 Approvals
          </CardTitle>
          <Button
            onClick={scan}
            size="sm"
            variant="ghost"
            disabled={loading}
            loading={loading}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Rescan
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Warning banner */}
        {data && data.hasPermit2Risk && (
          <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />} className="mb-4">
            <div className="font-medium">Active Permit2 Approvals Detected</div>
            <p className="text-sm mt-1">
              You have active Permit2 approvals that standard token revocation won&apos;t remove.
              These grant dApps permission to move your tokens through Uniswap&apos;s Permit2 contract.
            </p>
          </Alert>
        )}

        {error && (
          <Alert variant="danger" icon={<AlertTriangle className="h-4 w-4" />} className="mb-4">
            {error}
          </Alert>
        )}

        {loading && !data && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-background-light dark:bg-secondary-800 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {data && data.permit2Allowances.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-10 h-10 text-semantic-success mx-auto mb-3" />
            <p className="text-text-secondary dark:text-secondary-400">
              No Permit2 approvals found. Your wallet is clean.
            </p>
          </div>
        )}

        {data && data.permit2Allowances.length > 0 && (
          <>
            {/* Summary */}
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-text-secondary dark:text-secondary-400">
                Total: <strong className="text-text-primary dark:text-secondary-100">{data.totalCount}</strong>
              </span>
              <span className="text-text-secondary dark:text-secondary-400">
                Active: <strong className="text-text-primary dark:text-secondary-100">{data.activeCount}</strong>
              </span>
            </div>

            {/* Table */}
            <div className="border border-border-primary dark:border-secondary-700 rounded-xl overflow-hidden bg-white dark:bg-secondary-900/60 backdrop-blur-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table" aria-label="Permit2 allowances">
                  <caption className="sr-only">Permit2 token approval allowances</caption>
                  <thead className="bg-background-secondary/80 dark:bg-secondary-800/80 border-b border-border-primary dark:border-secondary-700">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary dark:text-secondary-400 text-xs uppercase tracking-wider">Chain</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary dark:text-secondary-400 text-xs uppercase tracking-wider">Token</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary dark:text-secondary-400 text-xs uppercase tracking-wider">Spender</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary dark:text-secondary-400 text-xs uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary dark:text-secondary-400 text-xs uppercase tracking-wider">Expires</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary dark:text-secondary-400 text-xs uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary dark:divide-secondary-800">
                    {data.permit2Allowances.map((a, i) => (
                      <tr
                        key={`${a.chainId}-${a.token}-${a.spender}-${i}`}
                        className={`transition-colors duration-100 hover:bg-background-secondary/50 dark:hover:bg-secondary-800/40 ${
                          a.isExpired ? 'opacity-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {CHAIN_NAMES[a.chainId] || `Chain ${a.chainId}`}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-text-primary dark:text-secondary-200">
                            {a.token.slice(0, 6)}...{a.token.slice(-4)}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-text-primary dark:text-secondary-100">
                              {a.spenderLabel || 'Unknown'}
                            </span>
                            <span className="font-mono text-xs text-text-tertiary dark:text-secondary-500">
                              {a.spender.slice(0, 6)}...{a.spender.slice(-4)}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {a.isUnlimited ? (
                            <Badge variant="danger" className="text-xs">
                              &infin; Unlimited
                            </Badge>
                          ) : (
                            <span className="font-mono text-xs text-text-primary dark:text-secondary-200">
                              {a.amount}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {a.isExpired ? (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Expired
                            </Badge>
                          ) : a.expirationDate ? (
                            <span className="text-xs text-text-secondary dark:text-secondary-400">
                              {new Date(a.expirationDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <Badge variant="warning" className="text-xs">
                              No Expiry
                            </Badge>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <Badge
                            variant={riskColors[a.riskLevel] as 'success' | 'warning' | 'danger'}
                            className="text-xs flex items-center gap-1 w-fit"
                          >
                            {a.riskLevel === 'critical' && <AlertTriangle className="w-3 h-3" />}
                            {riskLabels[a.riskLevel]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info note about Permit2 revocation */}
            <p className="text-xs text-text-tertiary dark:text-secondary-500 mt-3">
              To revoke a Permit2 approval, set the allowance to 0 on the Permit2 contract.
              This is separate from revoking standard ERC-20 approvals.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
