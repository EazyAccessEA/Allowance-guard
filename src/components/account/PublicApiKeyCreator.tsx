'use client'

/**
 * PublicApiKeyCreator — unified Ledger canon (ADR 0007).
 *
 * Issues browser-safe public API keys (`ag_pub_*`) for use with
 * `@allowance-guard/react` or any other client-side integration.
 *
 * Backed by `POST /api/keys/public` (see migration 027 + the auth
 * middleware for the enforcement story). The plaintext key is shown
 * exactly once and must be copied immediately.
 */

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Globe, Plus, Copy, Check, AlertTriangle, Trash2 } from 'lucide-react'

interface PublicKey {
  id: string
  name: string
  prefix: string
  keyType: 'secret' | 'public'
  allowedOrigins: string[] | null
  createdAt: string
  lastUsedAt?: string | null
}

interface CreateResult {
  key: string
  id: string
  prefix: string
}

export default function PublicApiKeyCreator() {
  const [keys, setKeys] = useState<PublicKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('Public (browser)')
  const [originsInput, setOriginsInput] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [justCreated, setJustCreated] = useState<CreateResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/keys')
      if (res.ok) {
        const json = (await res.json()) as { keys?: PublicKey[] }
        const all = json.keys ?? []
        setKeys(all.filter((k) => k.keyType === 'public'))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchKeys()
  }, [fetchKeys])

  const parsedOrigins = originsInput
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)

  async function handleCreate() {
    setCreating(true)
    setCreateError(null)
    try {
      const res = await fetch('/api/keys/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Public (browser)',
          allowedOrigins: parsedOrigins.length > 0 ? parsedOrigins : undefined,
        }),
      })
      const json = (await res.json()) as
        | { ok: true; key: string; id: string; prefix: string }
        | { error: string }
      if (!res.ok || !('ok' in json)) {
        setCreateError('error' in json ? json.error : 'Failed to create public key')
        return
      }
      setJustCreated({ key: json.key, id: json.id, prefix: json.prefix })
      setShowCreate(false)
      setName('Public (browser)')
      setOriginsInput('')
      await fetchKeys()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: string) {
    setRevokingId(id)
    try {
      await fetch(`/api/keys/${id}`, { method: 'DELETE' })
      await fetchKeys()
    } finally {
      setRevokingId(null)
    }
  }

  async function copyPlaintext() {
    if (!justCreated) return
    await navigator.clipboard.writeText(justCreated.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="paper-card p-6 sm:p-7">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
          <Globe className="h-4 w-4" />
          Public API keys
        </h2>
        {!showCreate && !justCreated && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreate(true)}
            ariaLabel="Create new public API key"
          >
            Create public key
          </Button>
        )}
      </div>
      <p className="font-plex text-xs text-ink-muted mt-2 mb-5">
        Browser-safe, read-only keys (<code className="font-mono text-[10px] text-amber-deep">ag_pub_*</code>). Use
        these with <code className="font-mono text-[10px] text-amber-deep">@allowance-guard/react</code> or any
        client-side integration. 500 calls/day, 30/min burst, GET requests only.
      </p>

      <div className="space-y-4">
        {/* One-time plaintext disclosure */}
        {justCreated && (
          <div className="border-l-2 border-amber-deep bg-paper-sub p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-deep flex-shrink-0 mt-0.5" />
              <div className="font-plex text-sm text-ink">
                <strong>Save this key now.</strong> It will not be shown again. Store it in your
                <code className="font-mono text-[10px] mx-1 text-amber-deep">.env.local</code> as
                <code className="font-mono text-[10px] mx-1 text-amber-deep">NEXT_PUBLIC_ALLOWANCE_GUARD_KEY</code>.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-xs break-all bg-paper text-ink px-3 py-2 border border-ink-rule">
                {justCreated.key}
              </code>
              <Button
                variant="primary"
                size="sm"
                leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                onClick={copyPlaintext}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setJustCreated(null)}>
              I&apos;ve saved it
            </Button>
          </div>
        )}

        {/* Create form */}
        {showCreate && !justCreated && (
          <div className="border border-ink-rule bg-paper-sub p-4 space-y-3">
            <label
              htmlFor="public-key-name"
              className="block font-plex text-sm font-medium text-ink"
            >
              Key name
            </label>
            <input
              id="public-key-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. example.com (production)"
              maxLength={100}
              className={cn(
                'w-full border border-ink-rule bg-paper px-3 py-2 font-plex text-sm',
                'text-ink placeholder:text-ink-whisper',
                'focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep',
              )}
            />

            <label
              htmlFor="public-key-origins"
              className="block font-plex text-sm font-medium text-ink"
            >
              Allowed origins{' '}
              <span className="font-plex text-xs text-ink-muted font-normal">
                (optional, one per line)
              </span>
            </label>
            <textarea
              id="public-key-origins"
              value={originsInput}
              onChange={(e) => setOriginsInput(e.target.value)}
              placeholder={'https://app.example.com\nhttps://staging.example.com'}
              rows={3}
              className={cn(
                'w-full border border-ink-rule bg-paper px-3 py-2 font-mono text-sm',
                'text-ink placeholder:text-ink-whisper',
                'focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep',
              )}
            />
            <p className="font-plex text-xs text-ink-muted">
              Leave blank to allow any origin. Adding origins locks the key to those domains —
              browsers from other origins will get a 403.
            </p>

            {createError && (
              <p className="font-plex text-xs text-crimson-paper flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {createError}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" loading={creating} onClick={handleCreate}>
                Create public key
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreate(false)
                  setCreateError(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* List */}
        {!loading && keys.length === 0 && !showCreate && !justCreated && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Globe className="h-8 w-8 text-ink-whisper mb-2" />
            <p className="font-plex text-sm font-medium text-ink">No public keys yet</p>
            <p className="font-plex text-xs text-ink-muted mt-1">
              Create one to embed AllowanceGuard in your dApp.
            </p>
          </div>
        )}

        {keys.length > 0 && (
          <ul className="divide-y divide-ink-rule" role="list">
            {keys.map((k) => (
              <li
                key={k.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="space-y-1 min-w-0">
                  <div className="font-plex text-sm font-medium text-ink truncate">{k.name}</div>
                  <code className="font-mono text-xs text-ink-muted bg-paper-sub border border-ink-rule px-1.5 py-0.5">
                    {k.prefix}****
                  </code>
                  {k.allowedOrigins && k.allowedOrigins.length > 0 && (
                    <div className="font-plex text-xs text-ink-whisper">
                      Origins: {k.allowedOrigins.join(', ')}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  loading={revokingId === k.id}
                  onClick={() => handleRevoke(k.id)}
                  className="text-ink-muted hover:text-crimson-paper"
                  ariaLabel={`Revoke key ${k.name}`}
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
