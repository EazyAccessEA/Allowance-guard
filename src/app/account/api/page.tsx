'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
      onClick={copy}
      className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-amber-deep transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-semantic-success-700" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
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
    <Section size="sm" background="muted">
      <Container size="lg">
        <div className="space-y-8">
          {/* Back link */}
          <a
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-amber-deep transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </a>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">API Dashboard</h1>
              <p className="text-sm text-ink-muted mt-1">
                Manage your API keys and monitor usage.
              </p>
            </div>
            {usage && <PlanBadge plan={usage.plan} />}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-800">
              {error}
              <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
            </div>
          )}

          {/* New key secret display */}
          {newKeySecret && (
            <Card className="border-semantic-success-300 bg-semantic-success-50 dark:bg-semantic-success-900/20">
              <CardContent className="py-4">
                <p className="text-sm font-semibold text-semantic-success-700 dark:text-semantic-success-300 mb-2">
                  API Key Created! Copy it now — it won&apos;t be shown again.
                </p>
                <div className="flex items-center gap-3 bg-paper-sub rounded-md px-3 py-2 border">
                  <code className="flex-1 text-sm font-mono text-ink break-all">
                    {newKeySecret}
                  </code>
                  <CopyButton text={newKeySecret} />
                </div>
                <button
                  onClick={() => setNewKeySecret(null)}
                  className="mt-2 text-xs text-ink-muted underline"
                >
                  Dismiss
                </button>
              </CardContent>
            </Card>
          )}

          {/* Usage Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="py-5">
                {loadingUsage ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-2/3" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-ink-muted">Calls Today</p>
                    <p className="text-2xl font-bold text-ink mt-1">
                      {usage?.apiCallsToday.toLocaleString() ?? 0}
                      <span className="text-sm font-normal text-ink-muted ml-1">
                        / {usage?.apiCallsLimit === -1 ? '∞' : usage?.apiCallsLimit.toLocaleString()}
                      </span>
                    </p>
                    {usage && usage.apiCallsLimit > 0 && (
                      <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            todayPct > 85 ? 'bg-semantic-error-500' : todayPct > 60 ? 'bg-semantic-warning-500' : 'bg-semantic-success-500'
                          )}
                          style={{ width: `${Math.min(todayPct, 100)}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                {loadingUsage ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-2/3" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-ink-muted">Calls This Month</p>
                    <p className="text-2xl font-bold text-ink mt-1">
                      {usage?.apiCallsThisMonth.toLocaleString() ?? 0}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                {loadingUsage ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-2/3" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-ink-muted">Rate Limit</p>
                    <p className="text-2xl font-bold text-ink mt-1">
                      {usage?.rateLimitPerMinute === -1
                        ? 'Unlimited'
                        : `${usage?.rateLimitPerMinute ?? 10}/min`}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <Button onClick={() => setShowCreate(true)} variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showCreate && (
                <div className="mb-6 p-4 border border-ink-rule rounded-lg space-y-3">
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
                  <Key className="h-10 w-10 text-neutral-300 dark:text-secondary-600 mx-auto mb-3" />
                  <p className="text-sm text-ink-muted mb-2">No API keys yet.</p>
                  <p className="text-xs text-ink-muted">
                    Create a key to start using the AllowanceGuard API.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-primary">
                  {keys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-ink">{key.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <code className="text-xs font-mono text-ink-muted">
                            {key.prefix}...
                          </code>
                          <CopyButton text={key.prefix} />
                          <span className="text-xs text-ink-muted">
                            Created {new Date(key.createdAt).toLocaleDateString()}
                          </span>
                          {key.lastUsedAt && (
                            <span className="text-xs text-ink-muted">
                              Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRevoke(key.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-800 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upgrade path */}
          {usage && usage.plan !== 'sentinel' && (
            <Card className="border-primary-200 dark:border-primary-800">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-ink">Need more API calls?</h3>
                    <p className="text-sm text-ink-muted mt-1">
                      Upgrade your plan for higher rate limits and more features.
                    </p>
                  </div>
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-ink shadow-sm hover:bg-primary-800 transition-colors"
                  >
                    View Plans
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </Section>
  )
}
