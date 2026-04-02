'use client'

import { useState, useEffect, useCallback } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Flag,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Save,
  X,
} from 'lucide-react'

interface FeatureFlag {
  id: string
  name: string
  description: string | null
  enabled: boolean
  rolloutPercentage: number
  targetPlans: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)

  // Create form state
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newRollout, setNewRollout] = useState(0)
  const [newPlans, setNewPlans] = useState('')

  const fetchFlags = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/flags')
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setFlags(json.flags)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flags')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFlags()
  }, [fetchFlags])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || undefined,
          enabled: false,
          rolloutPercentage: newRollout,
          targetPlans: newPlans ? newPlans.split(',').map((p) => p.trim()) : [],
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create flag')
      }
      setShowCreate(false)
      setNewName('')
      setNewDescription('')
      setNewRollout(0)
      setNewPlans('')
      await fetchFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create flag')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (flag: FeatureFlag) => {
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: flag.id, enabled: !flag.enabled }),
      })
      if (!res.ok) throw new Error('Failed to toggle')
      await fetchFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle flag')
    }
  }

  const handleUpdateRollout = async (flag: FeatureFlag, rolloutPercentage: number) => {
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: flag.id, rolloutPercentage }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update flag')
    }
  }

  const handleDelete = async (flag: FeatureFlag) => {
    if (!confirm(`Delete flag "${flag.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/flags?id=${flag.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete flag')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Section className="py-8">
        <Container>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-text mb-2">Feature Flags</h1>
              <p className="text-neutral-text">Manage runtime feature toggles and A/B tests</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchFlags}
                className="p-2 border border-neutral-borders rounded-lg hover:bg-background-primary/50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-neutral-text" />
              </button>
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Flag
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-semantic-danger/10 border border-semantic-danger/20 rounded-lg text-semantic-danger text-sm">
              {error}
              <button onClick={() => setError(null)} className="ml-2 underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Create Form */}
          {showCreate && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Feature Flag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-text mb-1">
                        Flag Name (snake_case)
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. new_pricing_page"
                        pattern="[a-z0-9_]+"
                        required
                        className="w-full px-3 py-2 border border-neutral-borders rounded-lg bg-background-primary text-neutral-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-text mb-1">
                        Rollout Percentage
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={newRollout}
                        onChange={(e) => setNewRollout(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-borders rounded-lg bg-background-primary text-neutral-text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="What does this flag control?"
                      className="w-full px-3 py-2 border border-neutral-borders rounded-lg bg-background-primary text-neutral-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-text mb-1">
                      Target Plans (comma-separated, empty = all)
                    </label>
                    <input
                      type="text"
                      value={newPlans}
                      onChange={(e) => setNewPlans(e.target.value)}
                      placeholder="e.g. pro, sentinel"
                      className="w-full px-3 py-2 border border-neutral-borders rounded-lg bg-background-primary text-neutral-text"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={creating || !newName.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {creating ? 'Creating...' : 'Create Flag'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="flex items-center gap-2 px-4 py-2 border border-neutral-borders rounded-lg hover:bg-background-primary/50 transition-colors text-neutral-text"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Flags List */}
          {flags.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Flag className="w-12 h-12 text-neutral-text mx-auto mb-4 opacity-40" />
                <p className="text-neutral-text">No feature flags configured yet</p>
                <p className="text-sm text-neutral-text mt-1">
                  Create your first flag to start A/B testing
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {flags.map((flag) => (
                <Card key={flag.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => handleToggle(flag)}
                            title={flag.enabled ? 'Disable' : 'Enable'}
                          >
                            {flag.enabled ? (
                              <ToggleRight className="w-8 h-8 text-semantic-success" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-neutral-text opacity-40" />
                            )}
                          </button>
                          <h3 className="text-lg font-semibold font-mono text-neutral-text">
                            {flag.name}
                          </h3>
                          <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                            {flag.enabled ? 'ACTIVE' : 'DISABLED'}
                          </Badge>
                        </div>
                        {flag.description && (
                          <p className="text-sm text-neutral-text mb-3 ml-11">
                            {flag.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 ml-11 text-sm text-neutral-text">
                          <div className="flex items-center gap-2">
                            <span>Rollout:</span>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={flag.rolloutPercentage}
                              onChange={(e) =>
                                handleUpdateRollout(flag, Number(e.target.value))
                              }
                              className="w-24 accent-primary-accent"
                            />
                            <span className="font-mono font-semibold">
                              {flag.rolloutPercentage}%
                            </span>
                          </div>
                          {flag.targetPlans.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>Plans:</span>
                              {flag.targetPlans.map((p) => (
                                <Badge key={p} variant="secondary">
                                  {p}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <span className="text-xs opacity-60">
                            Updated {new Date(flag.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(flag)}
                        className="p-2 text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-colors"
                        title="Delete flag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}
