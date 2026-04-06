'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface Flag {
  id: string
  name: string
  description: string | null
  rollout_percentage: number
  target_plans: string[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New flag form
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newRollout, setNewRollout] = useState(0)
  const [creating, setCreating] = useState(false)

  const loadFlags = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/flags')
      if (!res.ok) throw new Error('Failed to load flags')
      const data = await res.json()
      setFlags(data.flags ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFlags()
  }, [loadFlags])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDesc || null,
          rollout_percentage: newRollout,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create flag')
      }
      setNewName('')
      setNewDesc('')
      setNewRollout(0)
      await loadFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setCreating(false)
    }
  }

  async function toggleFlag(flagId: string, enabled: boolean) {
    try {
      await fetch('/api/admin/flags', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: flagId, enabled }),
      })
      await loadFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  async function deleteFlag(flagId: string) {
    try {
      await fetch('/api/admin/flags', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: flagId }),
      })
      await loadFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading flags...</div>
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-text-primary">Feature Flags</h1>
      <p className="text-sm text-text-secondary">
        Manage feature flags for A/B testing and gradual rollouts. Uses consistent hashing for deterministic user assignment.
      </p>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Create new flag */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Create Flag</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Flag name (e.g. new_pricing_page)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="rounded-lg border border-secondary-700 bg-background-primary px-3 py-2 text-sm text-text-primary"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="rounded-lg border border-secondary-700 bg-background-primary px-3 py-2 text-sm text-text-primary"
          />
          <label className="flex items-center gap-1 text-sm text-text-secondary">
            Rollout %
            <input
              type="number"
              min={0}
              max={100}
              value={newRollout}
              onChange={(e) => setNewRollout(parseInt(e.target.value) || 0)}
              className="w-20 rounded-lg border border-secondary-700 bg-background-primary px-2 py-2 text-sm text-text-primary"
            />
          </label>
          <button
            type="submit"
            disabled={creating || !newName}
            className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
      </section>

      {/* Existing flags */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">
          Active Flags ({flags.length})
        </h2>
        {flags.length === 0 ? (
          <p className="text-sm text-text-secondary">No feature flags yet.</p>
        ) : (
          <div className="space-y-3">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between rounded-lg border border-secondary-700 bg-background-primary p-4"
              >
                <div>
                  <p className="font-medium text-text-primary">{flag.name}</p>
                  {flag.description && (
                    <p className="text-xs text-text-secondary">{flag.description}</p>
                  )}
                  <p className="mt-1 text-xs text-text-secondary">
                    Rollout: {flag.rollout_percentage}% &middot;{' '}
                    {flag.enabled ? (
                      <span className="text-green-600">Enabled</span>
                    ) : (
                      <span className="text-red-500">Disabled</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFlag(flag.id, !flag.enabled)}
                    className="rounded-lg border border-secondary-700 px-3 py-1 text-xs font-medium text-text-primary hover:bg-background-light"
                  >
                    {flag.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteFlag(flag.id)}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
