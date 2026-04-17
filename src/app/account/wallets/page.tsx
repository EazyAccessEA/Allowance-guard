'use client'

/**
 * /account/wallets — saved-wallet address book. Unified Ledger canon.
 *
 * Authenticated. Lists, edits, and removes the user's saved wallets.
 * Manual add form for power users; the canonical add path is the
 * Save button on scan results (commit C4).
 *
 * Quota indicator surfaces "X of Y used" plus an upgrade link when
 * Free hits the cap. Pro/Sentinel show "X of unlimited".
 *
 * Canon: Ledger (ADR 0007). Post-audit structural fixes preserved —
 * no `primary-*` scale, no raw greys, header avatar `rounded-lg` not
 * `rounded-full`.
 */

import React, { useCallback, useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Wallet, Plus, Trash2, Pencil, Check, X, Copy } from 'lucide-react'

interface SavedWallet {
  id: string
  walletAddress: string
  label: string | null
  createdAt: string
}

interface QuotaInfo {
  used: number
  limit: number  // -1 = unlimited
  plan: 'free' | 'pro' | 'sentinel'
}

function shortAddress(addr: string): string {
  if (addr.length < 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<SavedWallet[] | null>(null)
  const [quota, setQuota] = useState<QuotaInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadWallets = useCallback(async () => {
    setError(null)
    try {
      const [wRes, qRes] = await Promise.all([
        fetch('/api/account/wallets', { credentials: 'include' }),
        fetch('/api/billing/manage', { credentials: 'include' }),
      ])
      if (wRes.status === 401) {
        window.location.href = '/login?redirect=/account/wallets'
        return
      }
      if (!wRes.ok) throw new Error('Failed to load wallets')
      const wJson = (await wRes.json()) as { wallets: SavedWallet[] }
      setWallets(wJson.wallets)

      if (qRes.ok) {
        const qJson = await qRes.json()
        setQuota({
          used: qJson.walletsUsed ?? wJson.wallets.length,
          limit: qJson.walletsLimit ?? 3,
          plan: qJson.plan ?? 'free',
        })
      } else {
        setQuota({ used: wJson.wallets.length, limit: 3, plan: 'free' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load wallets')
    }
  }, [])

  useEffect(() => {
    loadWallets()
  }, [loadWallets])

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (adding) return
    setAdding(true)
    setError(null)
    try {
      const res = await fetch('/api/account/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: newAddress.trim(), label: newLabel.trim() }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        upgradeUrl?: string
      }
      if (!res.ok) {
        if (res.status === 403 && data.upgradeUrl) {
          setError(`${data.error} — upgrade at ${data.upgradeUrl}`)
        } else {
          setError(data.error ?? `Error ${res.status}`)
        }
        return
      }
      setNewAddress('')
      setNewLabel('')
      await loadWallets()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this wallet from your address book? This does not affect the wallet on-chain.')) {
      return
    }
    try {
      const res = await fetch(`/api/account/wallets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Could not remove')
      await loadWallets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove wallet')
    }
  }

  async function handleSaveLabel(id: string) {
    try {
      const res = await fetch(`/api/account/wallets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: editLabel.trim() || null }),
      })
      if (!res.ok) throw new Error('Could not update')
      setEditingId(null)
      setEditLabel('')
      await loadWallets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update label')
    }
  }

  async function handleCopy(addr: string, id: string) {
    try {
      await navigator.clipboard.writeText(addr)
      setCopiedId(id)
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1500)
    } catch {
      // clipboard blocked — fall through silently
    }
  }

  const isUnlimited = quota?.limit === -1
  const atCap = quota && !isUnlimited && quota.used >= quota.limit

  return (
    <main className="min-h-screen paper grain">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-sub border border-ink-rule">
              <Wallet className="h-5 w-5 text-amber-deep" />
            </div>
            <div>
              <h1 className="font-display-tight text-2xl text-ink">Saved wallets</h1>
              <p className="font-plex text-sm text-ink-muted">
                Your address book. Saved wallets show up in your dashboard for one-click scans.
              </p>
            </div>
          </div>

          {/* Quota indicator */}
          {quota && (
            <div className="paper-card px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-plex text-sm font-medium text-ink">
                  {isUnlimited ? (
                    <>
                      {quota.used} saved <span className="text-ink-muted">— unlimited on {quota.plan === 'sentinel' ? 'Sentinel' : 'Pro'}</span>
                    </>
                  ) : (
                    <>
                      {quota.used} of {quota.limit} saved <span className="text-ink-muted">— Free plan</span>
                    </>
                  )}
                </p>
                {atCap && (
                  <p className="mt-1 font-plex text-xs text-amber-deep">
                    You&apos;ve reached the Free wallet limit.
                  </p>
                )}
              </div>
              {!isUnlimited && (
                <a
                  href="/pricing"
                  className="font-plex text-sm font-medium text-amber-deep hover:underline whitespace-nowrap"
                >
                  Upgrade to Pro →
                </a>
              )}
            </div>
          )}

          {/* Add form */}
          <form
            onSubmit={handleAdd}
            className="paper-card p-5 space-y-3"
            noValidate
          >
            <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Add a wallet</h2>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <input
                type="text"
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x… (40-hex-char Ethereum address)"
                pattern="0x[a-fA-F0-9]{40}"
                disabled={adding || atCap === true}
                className="w-full px-3 py-2 border border-ink-rule bg-paper font-mono text-sm text-ink placeholder:text-ink-whisper focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep disabled:opacity-50"
                aria-label="Wallet address"
              />
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label (optional)"
                maxLength={80}
                disabled={adding || atCap === true}
                className="w-full sm:w-48 px-3 py-2 border border-ink-rule bg-paper font-plex text-sm text-ink placeholder:text-ink-whisper focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep disabled:opacity-50"
                aria-label="Wallet label"
              />
            </div>
            <button
              type="submit"
              disabled={adding || atCap === true || !newAddress.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-oxblood text-cream font-plex text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-oxblood/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper transition-colors"
            >
              <Plus className="h-4 w-4" />
              {adding ? 'Saving…' : 'Save wallet'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div role="alert" className="border border-crimson-paper/40 bg-paper-sub px-4 py-3 font-plex text-sm text-crimson-paper">
              {error}
            </div>
          )}

          {/* List */}
          <div className="space-y-3">
            <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Your wallets</h2>
            {wallets === null ? (
              <p className="font-plex text-sm text-ink-muted">Loading…</p>
            ) : wallets.length === 0 ? (
              <div className="border border-dashed border-ink-rule bg-paper-sub p-8 text-center">
                <Wallet className="mx-auto h-8 w-8 text-ink-whisper" aria-hidden="true" />
                <p className="mt-3 font-plex text-sm text-ink">No saved wallets yet.</p>
                <p className="mt-1 font-plex text-xs text-ink-muted">
                  Scan a wallet from the <Link href="/#scan" className="text-amber-deep hover:underline">homepage scanner</Link> to save it, or add one above.
                </p>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-ink-rule paper-card p-0">
                {wallets.map((w) => (
                  <li key={w.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      {editingId === w.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Label"
                            maxLength={80}
                            autoFocus
                            className="flex-1 px-2 py-1 border border-ink-rule bg-paper-sub font-plex text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep"
                            aria-label="New label"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveLabel(w.id)}
                            className="p-1 text-amber-deep hover:bg-paper-sub rounded transition-colors"
                            aria-label="Save label"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingId(null); setEditLabel('') }}
                            className="p-1 text-ink-muted hover:bg-paper-sub rounded transition-colors"
                            aria-label="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-plex text-sm font-medium text-ink truncate">
                            {w.label || <span className="italic text-ink-muted">no label</span>}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <code className="font-mono text-ink-soft" title={w.walletAddress}>{shortAddress(w.walletAddress)}</code>
                            <button
                              type="button"
                              onClick={() => handleCopy(w.walletAddress, w.id)}
                              className="p-0.5 text-ink-whisper hover:text-ink rounded transition-colors"
                              aria-label="Copy address"
                            >
                              {copiedId === w.id ? (
                                <Check className="h-3 w-3 text-amber-deep" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <span className="text-ink-whisper" aria-hidden="true">·</span>
                            <span className="font-plex text-ink-whisper">saved {new Date(w.createdAt).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {editingId !== w.id && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditingId(w.id); setEditLabel(w.label ?? '') }}
                          className="p-2 text-ink-muted hover:text-ink hover:bg-paper-sub rounded transition-colors"
                          aria-label={`Edit label for ${w.walletAddress}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(w.id)}
                          className="p-2 text-ink-muted hover:text-crimson-paper hover:bg-paper-sub rounded transition-colors"
                          aria-label={`Remove ${w.walletAddress}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
