'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield, Users, AlertTriangle, FileText, Copy, Lock } from 'lucide-react'

interface SafeInfo {
  address: string
  isSafe: boolean
  chainId: number
  owners: string[]
  threshold: number
  nonce: number
  version: string | null
}

interface SafeAllowance {
  chainId: number
  tokenAddress: string
  spenderAddress: string
  tokenSymbol: string | null
  spenderLabel: string | null
  amount: string
  isUnlimited: boolean
  riskScore: number
}

interface SafeData {
  isSafe: boolean
  safeInfo: SafeInfo | null
  allowances: SafeAllowance[]
  summary: { totalAllowances: number; highRisk: number; unlimited: number }
}

interface SafeDashboardProps {
  safeAddress: string
  chainId: number
  userTier?: 'free' | 'pro' | 'sentinel'
}

export default function SafeDashboard({ safeAddress, chainId, userTier = 'free' }: SafeDashboardProps) {
  const [data, setData] = useState<SafeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedAllowances, setSelectedAllowances] = useState<Set<string>>(new Set())
  const [proposalMarkdown, setProposalMarkdown] = useState<string | null>(null)

  const isSentinel = userTier === 'sentinel'

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/safe?address=${safeAddress}&chainId=${chainId}`)
      if (res.ok) setData(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [safeAddress, chainId])

  useEffect(() => {
    if (safeAddress && isSentinel) fetchData()
  }, [safeAddress, isSentinel, fetchData])

  const toggleAllowance = (key: string) => {
    setSelectedAllowances((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleBatchRevoke = async () => {
    if (selectedAllowances.size === 0 || !data) return

    const selected = data.allowances.filter((a) =>
      selectedAllowances.has(`${a.tokenAddress}:${a.spenderAddress}`),
    )

    const res = await fetch('/api/safe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'batch-revoke',
        safeAddress,
        chainId,
        allowanceIds: selected.map((a) => ({
          tokenAddress: a.tokenAddress,
          spenderAddress: a.spenderAddress,
          tokenSymbol: a.tokenSymbol || undefined,
        })),
      }),
    })

    if (res.ok) {
      const result = await res.json()
      alert(`${result.totalTxs} revoke transaction(s) built. Submit them via your Safe wallet interface.`)
    }
  }

  const handleGovernanceProposal = async () => {
    if (selectedAllowances.size === 0 || !data) return

    const selected = data.allowances.filter((a) =>
      selectedAllowances.has(`${a.tokenAddress}:${a.spenderAddress}`),
    )

    const res = await fetch('/api/safe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'governance-proposal',
        safeAddress,
        chainId,
        allowanceIds: selected.map((a) => ({
          tokenAddress: a.tokenAddress,
          spenderAddress: a.spenderAddress,
          tokenSymbol: a.tokenSymbol || undefined,
          spenderLabel: a.spenderLabel || undefined,
        })),
      }),
    })

    if (res.ok) {
      const result = await res.json()
      setProposalMarkdown(result.proposal.description)
    }
  }

  if (!isSentinel) {
    return (
      <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-8 text-center">
        <Lock className="mx-auto h-10 w-10 text-text-tertiary dark:text-secondary-500 mb-3" />
        <h3 className="text-lg font-semibold text-text-primary dark:text-secondary-100 mb-2">
          Multi-Sig Dashboard
        </h3>
        <p className="text-sm text-text-secondary dark:text-secondary-400 mb-4">
          Safe (Gnosis Safe) integration, multi-sig batch revocations, and governance proposal templates are available on the Sentinel tier.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Upgrade to Sentinel
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-neutral-200 dark:bg-secondary-800 rounded-xl" />
        <div className="h-64 bg-neutral-200 dark:bg-secondary-800 rounded-xl" />
      </div>
    )
  }

  if (!data) return null

  if (!data.isSafe) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          This address does not appear to be a Safe (Gnosis Safe) multi-sig wallet on chain {chainId}.
        </p>
      </div>
    )
  }

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <div className="space-y-6">
      {/* Safe Info Card */}
      {data.safeInfo && (
        <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-text-primary dark:text-secondary-100">
              Safe Multi-Sig
            </h3>
            {data.safeInfo.version && (
              <span className="text-xs font-mono text-text-tertiary dark:text-secondary-500">
                v{data.safeInfo.version}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-text-tertiary dark:text-secondary-500 mb-1">Threshold</p>
              <p className="text-xl font-bold text-text-primary dark:text-secondary-100">
                {data.safeInfo.threshold}/{data.safeInfo.owners.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary dark:text-secondary-500 mb-1">Owners</p>
              <p className="text-xl font-bold text-text-primary dark:text-secondary-100">
                {data.safeInfo.owners.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary dark:text-secondary-500 mb-1">Allowances</p>
              <p className="text-xl font-bold text-text-primary dark:text-secondary-100">
                {data.summary.totalAllowances}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary dark:text-secondary-500 mb-1">High Risk</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {data.summary.highRisk}
              </p>
            </div>
          </div>

          {/* Owners list */}
          <div className="mt-4 pt-4 border-t border-border-primary dark:border-secondary-700">
            <p className="text-xs text-text-tertiary dark:text-secondary-500 mb-2 flex items-center gap-1">
              <Users className="h-3 w-3" /> Owners
            </p>
            <div className="flex flex-wrap gap-2">
              {data.safeInfo.owners.map((owner) => (
                <span
                  key={owner}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-secondary-700 text-text-secondary dark:text-secondary-300 rounded"
                >
                  {truncate(owner)}
                  <button
                    onClick={() => navigator.clipboard.writeText(owner)}
                    className="text-text-tertiary hover:text-text-primary dark:hover:text-secondary-200"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Allowances Table with selection */}
      {data.allowances.length > 0 && (
        <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border-primary dark:border-secondary-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary dark:text-secondary-100">
              Token Approvals ({data.allowances.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleBatchRevoke}
                disabled={selectedAllowances.size === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Shield className="h-3 w-3" />
                Batch Revoke ({selectedAllowances.size})
              </button>
              <button
                onClick={handleGovernanceProposal}
                disabled={selectedAllowances.size === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="h-3 w-3" />
                Create Proposal
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-neutral-50 dark:bg-secondary-800">
                <tr>
                  <th className="px-4 py-2 text-left w-8">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAllowances(
                            new Set(data.allowances.map((a) => `${a.tokenAddress}:${a.spenderAddress}`)),
                          )
                        } else {
                          setSelectedAllowances(new Set())
                        }
                      }}
                      checked={selectedAllowances.size === data.allowances.length && data.allowances.length > 0}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-tertiary dark:text-secondary-500">Token</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-tertiary dark:text-secondary-500">Spender</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-tertiary dark:text-secondary-500">Amount</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-text-tertiary dark:text-secondary-500">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary dark:divide-secondary-700">
                {data.allowances.map((a) => {
                  const key = `${a.tokenAddress}:${a.spenderAddress}`
                  const riskColor =
                    a.riskScore >= 70 ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : a.riskScore >= 40 ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                        : 'text-text-secondary dark:text-secondary-400 bg-neutral-50 dark:bg-secondary-700'

                  return (
                    <tr key={key} className="hover:bg-neutral-50 dark:hover:bg-secondary-700/50">
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedAllowances.has(key)}
                          onChange={() => toggleAllowance(key)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-medium text-text-primary dark:text-secondary-200">
                        {a.tokenSymbol || truncate(a.tokenAddress)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-text-secondary dark:text-secondary-400">
                        {a.spenderLabel || truncate(a.spenderAddress)}
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        {a.isUnlimited ? (
                          <span className="text-red-600 dark:text-red-400 font-medium">Unlimited</span>
                        ) : (
                          <span className="text-text-secondary dark:text-secondary-400 font-mono">
                            {a.amount.length > 12 ? a.amount.slice(0, 12) + '...' : a.amount}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${riskColor}`}>
                          {a.riskScore}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Governance Proposal Output */}
      {proposalMarkdown && (
        <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary dark:text-secondary-100 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generated Governance Proposal
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(proposalMarkdown)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-200 border border-border-primary dark:border-secondary-600 rounded"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <pre className="text-xs font-mono text-text-secondary dark:text-secondary-400 bg-neutral-50 dark:bg-secondary-800 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {proposalMarkdown}
          </pre>
        </div>
      )}
    </div>
  )
}
