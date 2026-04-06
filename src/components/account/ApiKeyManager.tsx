'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
  onCreateKey: (name: string) => Promise<void>
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

  async function handleCreate() {
    if (!newKeyName.trim()) return
    setCreating(true)
    try {
      await onCreateKey(newKeyName.trim())
      setNewKeyName('')
      setShowCreate(false)
    } finally {
      setCreating(false)
    }
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Keys</CardTitle>
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
          <p className="text-xs text-text-secondary mt-1">
            Maximum of {maxKeys} keys reached.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create form */}
        {showCreate && (
          <div className="rounded-lg border border-secondary-700 p-4 space-y-3">
            <label
              htmlFor="api-key-name"
              className="block text-sm font-medium text-text-primary"
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
                'w-full rounded-md border border-secondary-700 bg-background-primary px-3 py-2 text-sm',
                'text-text-primary placeholder:text-text-secondary',
                'focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2'
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
            <Key className="h-10 w-10 text-text-secondary mb-3" />
            <p className="text-sm font-medium text-text-primary">
              No API keys yet
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Create a key to start using the AllowanceGuard API.
            </p>
          </div>
        )}

        {/* Key list */}
        {keys.length > 0 && (
          <ul className="divide-y divide-border-primary" role="list">
            {keys.map((key) => (
              <li
                key={key.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-text-secondary flex-shrink-0" />
                    <span className="text-sm font-medium text-text-primary truncate">
                      {key.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-text-secondary bg-neutral-100 px-1.5 py-0.5 rounded">
                      {key.prefix}{'****'}
                    </code>
                    <button
                      className="text-text-secondary hover:text-text-primary"
                      onClick={() => navigator.clipboard.writeText(key.prefix)}
                      aria-label={`Copy prefix for ${key.name}`}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
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
                      <span className="text-xs text-semantic-error-500 flex items-center gap-1">
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
                      className="text-text-secondary hover:text-semantic-error-500"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
