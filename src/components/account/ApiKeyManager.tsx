'use client'

/**
 * ApiKeyManager — unified Ledger canon (ADR 0007).
 *
 * Bypasses `ui/Card` while the primitive's Glass variants are being
 * stripped. Once Card is Ledger-clean this can migrate back to `<Card>`.
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  Plus,
  Trash2,
  Key,
  Clock,
  AlertTriangle,
  Copy,
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt?: string
}

interface ApiKeyManagerProps {
  keys: ApiKey[]
  onCreateKey: (name: string) => Promise<string | void>
  onRevokeKey: (id: string) => Promise<void>
  maxKeys?: number
}

export default function ApiKeyManager({
  keys,
  onCreateKey,
  onRevokeKey,
  maxKeys = 5,
}: ApiKeyManagerProps) {
  const [newKeyName, setNewKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null)
  const [revoking, setRevoking] = useState(false)
  // Plaintext key shown once after creation. Cleared when user dismisses.
  const [justCreatedKey, setJustCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCreate() {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      const key = await onCreateKey(newKeyName.trim())
      setNewKeyName('')
      setShowCreate(false)
      if (typeof key === 'string' && key) {
        setJustCreatedKey(key)
      }
    } finally {
      setCreating(false)
    }
  }

  function handleCopyKey() {
    if (!justCreatedKey) return
    navigator.clipboard.writeText(justCreatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRevoke(id: string) {
    setRevoking(true)
    try {
      await onRevokeKey(id)
    } finally {
      setRevoking(false)
      setRevokeConfirmId(null)
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const atLimit = keys.length >= maxKeys

  return (
    <div className="paper-card p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
          Secret API Keys
        </h2>
        {!showCreate && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            disabled={atLimit}
            onClick={() => setShowCreate(true)}
            ariaLabel="Create new API key"
          >
            Create New Key
          </Button>
        )}
      </div>
      {atLimit && (
        <p className="font-plex text-xs text-ink-muted mt-1 mb-4">
          Maximum of {maxKeys} keys reached.
        </p>
      )}

      <div className="space-y-4">
        {/* One-time plaintext disclosure after key creation.
            This is the only chance to copy the key — it is never stored. */}
        {justCreatedKey && (
          <div className="border-l-2 border-amber-deep bg-paper-sub p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-deep flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-plex text-sm font-semibold text-ink">
                  Your new API key — copy it now
                </p>
                <p className="font-plex text-xs text-ink-muted mt-1">
                  This is the only time you&rsquo;ll see the full key. Store it securely.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-xs text-ink bg-paper border border-ink-rule px-3 py-2 break-all">
                {justCreatedKey}
              </code>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Copy className="h-3 w-3" />}
                onClick={handleCopyKey}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setJustCreatedKey(null)}
            >
              I&rsquo;ve saved it — dismiss
            </Button>
          </div>
        )}

        {/* Create form */}
        {showCreate && (
          <div className="border border-ink-rule bg-paper-sub p-4 space-y-3">
            <label
              htmlFor="api-key-name"
              className="block font-plex text-sm font-medium text-ink"
            >
              Key Name
            </label>
            <input
              id="api-key-name"
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Production, Staging..."
              className={cn(
                'w-full border border-ink-rule bg-paper px-3 py-2 font-plex text-sm',
                'text-ink placeholder:text-ink-whisper',
                'focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep',
              )}
              maxLength={64}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
              }}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                loading={creating}
                disabled={!newKeyName.trim()}
                onClick={handleCreate}
              >
                Create
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreate(false)
                  setNewKeyName('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {keys.length === 0 && !showCreate && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Key className="h-10 w-10 text-ink-whisper mb-3" />
            <p className="font-plex text-sm font-medium text-ink">
              No API keys yet
            </p>
            <p className="font-plex text-xs text-ink-muted mt-1">
              Create a key to start using the AllowanceGuard API.
            </p>
          </div>
        )}

        {/* Key list */}
        {keys.length > 0 && (
          <ul className="divide-y divide-ink-rule" role="list">
            {keys.map((key) => (
              <li
                key={key.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-ink-whisper flex-shrink-0" />
                    <span className="font-plex text-sm font-medium text-ink truncate">
                      {key.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-ink-muted bg-paper-sub border border-ink-rule px-1.5 py-0.5">
                      {key.prefix}{'****'}
                    </code>
                    <button
                      type="button"
                      className="text-ink-whisper hover:text-ink transition-colors"
                      onClick={() => navigator.clipboard.writeText(key.prefix)}
                      aria-label={`Copy prefix for ${key.name}`}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 font-plex text-xs text-ink-whisper">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created {formatDate(key.createdAt)}
                    </span>
                    {key.lastUsedAt && (
                      <span>Last used {formatDate(key.lastUsedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Revoke */}
                <div className="flex-shrink-0">
                  {revokeConfirmId === key.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-plex text-xs text-crimson-paper flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Revoke?
                      </span>
                      <Button
                        variant="destructive"
                        size="xs"
                        loading={revoking}
                        onClick={() => handleRevoke(key.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setRevokeConfirmId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => setRevokeConfirmId(key.id)}
                      ariaLabel={`Revoke key ${key.name}`}
                      className="text-ink-muted hover:text-crimson-paper"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
