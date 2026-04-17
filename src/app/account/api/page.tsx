'use client'

/**
 * API Dashboard — unified Ledger canon (ADR 0007).
 */

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import PlanBadge from '@/components/PlanBadge'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Key,
  Copy,
  Check,
  ArrowRight,
  Trash2,
  Plus,
  Loader2,
} from 'lucide-react'
import type { ConsumerPlan } from '@/lib/plans'

interface ApiKey {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt?: string
}

interface ApiUsageData {
  plan: ConsumerPlan
  apiCallsToday: number
  apiCallsLimit: number
  apiCallsThisMonth: number
  rateLimitPerMinute: number
  dailyHistory: { date: string; count: number }[]
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 font-plex text-xs text-ink-muted hover:text-amber-deep transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-semantic-success-700" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function UsageStatCard({
  label,
  children,
  loading,
}: {
  label: string
  children: React.ReactNode
  loading: boolean
}) {
  return (
    <div className="paper-card p-5">
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-paper-deep w-1/2" />
          <div className="h-8 bg-paper-deep w-2/3" />
        </div>
      ) : (
        <>
          <p className="font-plex text-xs text-ink-muted">{label}</p>
          {children}
        </>
      )}
    </div>
  )
}

export default function ApiDashboardPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [usage, setUsage] = useState<ApiUsageData | null>(null)
  const [loadingKeys, setLoadingKeys] = useState(true)
  const [loadingUsage, setLoadingUsage] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/keys')
      if (res.ok) {
        const json = await res.json()
        setKeys(json.keys ?? json ?? [])
      }
    } catch {
      // Keep existing state
    } finally {
      setLoadingKeys(false)
    }
  }, [])

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/account/usage')
      if (res.ok) {
        const json = await res.json()
        setUsage({
          plan: json.plan ?? 'free',
          apiCallsToday: json.usage?.apiCallsToday ?? 0,
          apiCallsLimit: json.limits?.maxApiCallsPerDay ?? 50,
          apiCallsThisMonth: json.dailyApiCalls?.reduce((s: number, d: { count: number }) => s + d.count, 0) ?? 0,
          rateLimitPerMinute: json.limits?.burstPerMinute ?? 10,
          dailyHistory: json.dailyApiCalls ?? [],
        })
      }
    } catch {
      // Keep null
    } finally {
      setLoadingUsage(false)
    }
  }, [])

  useEffect(() => {
    fetchKeys()
    fetchUsage()
  }, [fetchKeys, fetchUsage])

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Failed to create key')
        return
      }
      const json = await res.json()
      if (json.key) {
        setNewKeySecret(json.key)
      }
      setNewKeyName('')
      setShowCreate(false)
      await fetchKeys()
    } catch {
      setError('Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchKeys()
      }
    } catch {
      setError('Failed to revoke key')
    }
  }

  const todayPct = usage
    ? usage.apiCallsLimit > 0
      ? Math.round((usage.apiCallsToday / usage.apiCallsLimit) * 100)
      : 0
    : 0

  return (
    <main className="min-h-screen paper grain">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          {/* Back link */}
          <a
            href="/account"
            className="inline-flex items-center gap-1.5 font-plex text-sm text-ink-muted hover:text-amber-deep transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </a>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display-tight text-2xl text-ink">API Dashboard</h1>
              <p className="font-plex text-sm text-ink-muted mt-1">
                Manage your API keys and monitor usage.
              </p>
            </div>
            {usage && <PlanBadge plan={usage.plan} />}
          </div>

          {error && (
            <div className="border border-crimson-paper/40 bg-paper-sub px-4 py-3 font-plex text-sm text-crimson-paper">
              {error}
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-2 underline hover:text-ink transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* New key secret display */}
          {newKeySecret && (
            <div className="paper-card border-l-2 border-amber-deep p-4">
              <p className="font-plex text-sm font-semibold text-ink mb-2">
                API Key Created — copy it now, it won&apos;t be shown again.
              </p>
              <div className="flex items-center gap-3 bg-paper border border-ink-rule px-3 py-2">
                <code className="flex-1 font-mono text-sm text-ink break-all">
                  {newKeySecret}
                </code>
                <CopyButton text={newKeySecret} />
              </div>
              <button
                type="button"
                onClick={() => setNewKeySecret(null)}
                className="mt-2 font-plex text-xs text-ink-muted underline hover:text-ink transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Usage Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UsageStatCard label="Calls Today" loading={loadingUsage}>
              <p className="font-display-tight text-2xl text-ink mt-1">
                {usage?.apiCallsToday.toLocaleString() ?? 0}
                <span className="font-plex text-sm font-normal text-ink-muted ml-1">
                  / {usage?.apiCallsLimit === -1 ? '∞' : usage?.apiCallsLimit.toLocaleString()}
                </span>
              </p>
              {usage && usage.apiCallsLimit > 0 && (
                <div className="mt-2 h-1.5 w-full overflow-hidden bg-paper-deep border border-ink-rule">
                  <div
                    className={cn(
                      'h-full transition-all',
                      todayPct > 85
                        ? 'bg-semantic-error-500'
                        : todayPct > 60
                          ? 'bg-semantic-warning-500'
                          : 'bg-semantic-success-600',
                    )}
                    style={{ width: `${Math.min(todayPct, 100)}%` }}
                  />
                </div>
              )}
            </UsageStatCard>
            <UsageStatCard label="Calls This Month" loading={loadingUsage}>
              <p className="font-display-tight text-2xl text-ink mt-1">
                {usage?.apiCallsThisMonth.toLocaleString() ?? 0}
              </p>
            </UsageStatCard>
            <UsageStatCard label="Rate Limit" loading={loadingUsage}>
              <p className="font-display-tight text-2xl text-ink mt-1">
                {usage?.rateLimitPerMinute === -1
                  ? 'Unlimited'
                  : `${usage?.rateLimitPerMinute ?? 10}/min`}
              </p>
            </UsageStatCard>
          </div>

          {/* API Keys */}
          <div className="paper-card p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
                <Key className="h-4 w-4" />
                API Keys
              </h2>
              <Button
                onClick={() => setShowCreate(true)}
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Key
              </Button>
            </div>

            {showCreate && (
              <div className="mb-6 p-4 border border-ink-rule bg-paper-sub space-y-3">
                <Input
                  label="Key Name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production, Staging"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreate} variant="primary" size="sm" loading={creating}>
                    Create
                  </Button>
                  <Button onClick={() => setShowCreate(false)} variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {loadingKeys ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-amber-deep" />
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center py-8">
                <Key className="h-10 w-10 text-ink-whisper mx-auto mb-3" />
                <p className="font-plex text-sm text-ink-muted mb-2">No API keys yet.</p>
                <p className="font-plex text-xs text-ink-whisper">
                  Create a key to start using the AllowanceGuard API.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-ink-rule">
                {keys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="font-plex text-sm font-medium text-ink">{key.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <code className="font-mono text-xs text-ink-muted">
                          {key.prefix}...
                        </code>
                        <CopyButton text={key.prefix} />
                        <span className="font-plex text-xs text-ink-whisper">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                        {key.lastUsedAt && (
                          <span className="font-plex text-xs text-ink-whisper">
                            Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRevoke(key.id)}
                      variant="ghost"
                      size="sm"
                      className="text-ink-muted hover:text-crimson-paper"
                      ariaLabel={`Revoke key ${key.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upgrade path */}
          {usage && usage.plan !== 'sentinel' && (
            <div className="paper-card border-l-2 border-amber-deep p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display-tight text-lg text-ink">Need more API calls?</h3>
                  <p className="font-plex text-sm text-ink-muted mt-1">
                    Upgrade your plan for higher rate limits and more features.
                  </p>
                </div>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-oxblood px-4 py-2 font-plex text-sm font-semibold text-cream hover:bg-oxblood/90 transition-colors"
                >
                  View Plans
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
