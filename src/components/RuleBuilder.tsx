'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import {
  Shield,
  Plus,
  Trash2,
  Play,
  Pause,
  Settings,
  AlertTriangle,
  Zap,
  Bell,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RuleCondition {
  field: string
  op: string
  value: string | number | boolean
}

interface RevocationRule {
  id: string
  name: string
  description: string | null
  enabled: boolean
  wallets: string[]
  chains: number[]
  conditions: RuleCondition[]
  action: string
  max_executions_per_day: number
  trigger_count: number
  last_triggered_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONDITION_FIELDS = [
  { value: 'is_unlimited', label: 'Unlimited Approval', type: 'boolean' },
  { value: 'risk_score', label: 'Risk Score', type: 'number' },
  { value: 'amount', label: 'Amount', type: 'number' },
  { value: 'standard', label: 'Token Standard', type: 'select', options: ['ERC20', 'ERC721', 'ERC1155'] },
  { value: 'chain_id', label: 'Chain ID', type: 'number' },
  { value: 'risk_flags', label: 'Risk Flags', type: 'text' },
]

const OPERATORS: Record<string, Array<{ value: string; label: string }>> = {
  boolean: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
  ],
  number: [
    { value: 'eq', label: '=' },
    { value: 'neq', label: '≠' },
    { value: 'gt', label: '>' },
    { value: 'gte', label: '≥' },
    { value: 'lt', label: '<' },
    { value: 'lte', label: '≤' },
  ],
  text: [
    { value: 'eq', label: 'equals' },
    { value: 'neq', label: 'not equals' },
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
  ],
  select: [
    { value: 'eq', label: 'is' },
    { value: 'neq', label: 'is not' },
  ],
}

const ACTIONS = [
  { value: 'alert_only', label: 'Alert Only', icon: Bell, description: 'Send notification when conditions match' },
  { value: 'queue_revoke', label: 'Queue Revocation', icon: Clock, description: 'Queue for manual approval before executing' },
  { value: 'auto_revoke', label: 'Auto Revoke', icon: Zap, description: 'Automatically revoke matching approvals' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RuleBuilder() {
  const [rules, setRules] = useState<RevocationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  // New rule form state
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newConditions, setNewConditions] = useState<RuleCondition[]>([
    { field: 'is_unlimited', op: 'eq', value: true },
  ])
  const [newAction, setNewAction] = useState('alert_only')
  const [newMaxExec, setNewMaxExec] = useState(10)
  const [saving, setSaving] = useState(false)

  const loadRules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rules')
      const json = await res.json()
      if (res.ok) {
        setRules(json.rules ?? [])
        setError(null)
      } else {
        setError(json.error ?? 'Failed to load rules')
      }
    } catch {
      setError('Failed to load rules')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRules() }, [loadRules])

  async function handleCreate() {
    if (!newName.trim()) { setError('Rule name is required'); return }
    if (newConditions.length === 0) { setError('At least one condition is required'); return }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || undefined,
          conditions: newConditions,
          action: newAction,
          maxExecutionsPerDay: newMaxExec,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setRules(prev => [json.rule, ...prev])
        setCreating(false)
        resetForm()
      } else {
        setError(json.error ?? 'Failed to create rule')
      }
    } catch {
      setError('Failed to create rule')
    } finally {
      setSaving(false)
    }
  }

  async function toggleRule(ruleId: string, enabled: boolean) {
    await fetch('/api/rules', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ruleId, enabled }),
    })
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled } : r))
  }

  async function handleDelete(ruleId: string) {
    await fetch(`/api/rules?id=${ruleId}`, { method: 'DELETE' })
    setRules(prev => prev.filter(r => r.id !== ruleId))
  }

  function resetForm() {
    setNewName('')
    setNewDescription('')
    setNewConditions([{ field: 'is_unlimited', op: 'eq', value: true }])
    setNewAction('alert_only')
    setNewMaxExec(10)
  }

  function addCondition() {
    setNewConditions(prev => [...prev, { field: 'risk_score', op: 'gt', value: 70 }])
  }

  function removeCondition(index: number) {
    setNewConditions(prev => prev.filter((_, i) => i !== index))
  }

  function updateCondition(index: number, updates: Partial<RuleCondition>) {
    setNewConditions(prev =>
      prev.map((c, i) => i === index ? { ...c, ...updates } : c),
    )
  }

  const getFieldType = (field: string) =>
    CONDITION_FIELDS.find(f => f.value === field)?.type ?? 'text'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-accent" />
            Automated Revocation Rules
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Define conditions that automatically trigger revocations or alerts.
          </p>
        </div>
        <Button
          onClick={() => { setCreating(!creating); setError(null) }}
          variant={creating ? 'secondary' : 'primary'}
          size="sm"
        >
          {creating ? 'Cancel' : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              New Rule
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" icon={<AlertTriangle className="w-4 h-4" />}>
          {error}
        </Alert>
      )}

      {/* Create Rule Form */}
      {creating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Rule Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g., Revoke unlimited approvals"
              />
              <Input
                label="Description (optional)"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="What this rule does..."
              />
            </div>

            {/* Conditions */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Conditions (all must match)
              </label>
              <div className="space-y-2">
                {newConditions.map((cond, idx) => {
                  const fieldType = getFieldType(cond.field)
                  const fieldDef = CONDITION_FIELDS.find(f => f.value === cond.field)

                  return (
                    <div key={idx} className="flex items-center gap-2 flex-wrap">
                      {idx > 0 && (
                        <span className="text-xs font-medium text-text-tertiary px-2">AND</span>
                      )}
                      <select
                        value={cond.field}
                        onChange={e => {
                          const newField = e.target.value
                          const newType = getFieldType(newField)
                          const defaultValue = newType === 'boolean' ? true : newType === 'number' ? 0 : ''
                          updateCondition(idx, { field: newField, op: 'eq', value: defaultValue })
                        }}
                        className="border border-border-primary rounded-md px-3 py-1.5 text-sm bg-background-primary"
                      >
                        {CONDITION_FIELDS.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>

                      <select
                        value={cond.op}
                        onChange={e => updateCondition(idx, { op: e.target.value })}
                        className="border border-border-primary rounded-md px-3 py-1.5 text-sm bg-background-primary"
                      >
                        {(OPERATORS[fieldType] ?? OPERATORS.text).map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>

                      {fieldType === 'boolean' ? (
                        <select
                          value={String(cond.value)}
                          onChange={e => updateCondition(idx, { value: e.target.value === 'true' })}
                          className="border border-border-primary rounded-md px-3 py-1.5 text-sm bg-background-primary"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : fieldType === 'select' && fieldDef && 'options' in fieldDef ? (
                        <select
                          value={String(cond.value)}
                          onChange={e => updateCondition(idx, { value: e.target.value })}
                          className="border border-border-primary rounded-md px-3 py-1.5 text-sm bg-background-primary"
                        >
                          {(fieldDef.options as string[]).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={fieldType === 'number' ? 'number' : 'text'}
                          value={String(cond.value)}
                          onChange={e => updateCondition(idx, {
                            value: fieldType === 'number' ? Number(e.target.value) : e.target.value,
                          })}
                          inputSize="sm"
                          className="w-32"
                        />
                      )}

                      {newConditions.length > 1 && (
                        <Button
                          onClick={() => removeCondition(idx)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
              <Button onClick={addCondition} variant="ghost" size="sm" className="mt-2">
                <Plus className="w-3 h-3 mr-1" /> Add Condition
              </Button>
            </div>

            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Action</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ACTIONS.map(({ value, label, icon: Icon, description }) => (
                  <button
                    key={value}
                    onClick={() => setNewAction(value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      newAction === value
                        ? 'border-primary-accent bg-primary-50 ring-1 ring-primary-accent'
                        : 'border-border-primary hover:border-primary-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                      {newAction === value && <Check className="w-3 h-3 text-primary-accent ml-auto" />}
                    </div>
                    <p className="text-xs text-text-secondary">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Max executions */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-text-primary">Max executions/day:</label>
              <Input
                type="number"
                value={newMaxExec}
                onChange={e => setNewMaxExec(Number(e.target.value) || 10)}
                inputSize="sm"
                className="w-20"
              />
            </div>

            {/* Auto revoke warning */}
            {newAction === 'auto_revoke' && (
              <Alert variant="warning" icon={<AlertTriangle className="w-4 h-4" />}>
                <span className="font-medium">Auto-revoke</span> will queue revocation transactions
                automatically. You&apos;ll still need to approve them in your wallet.
              </Alert>
            )}

            {/* Submit */}
            <div className="flex gap-2 justify-end pt-2 border-t border-border-primary">
              <Button onClick={() => { setCreating(false); resetForm() }} variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleCreate} variant="primary" loading={saving}>
                Create Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      {loading ? (
        <div className="text-sm text-text-secondary">Loading rules...</div>
      ) : rules.length === 0 && !creating ? (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No automated rules configured</p>
            <p className="text-xs text-text-tertiary mt-1">
              Create rules to automatically monitor and act on risky approvals.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => {
            const isExpanded = expandedRule === rule.id
            const ActionIcon = ACTIONS.find(a => a.value === rule.action)?.icon ?? Bell

            return (
              <Card key={rule.id}>
                <div
                  className="px-4 py-3 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                >
                  <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{rule.name}</span>
                      <Badge variant={rule.enabled ? 'success' : 'secondary'}>
                        {rule.enabled ? 'Active' : 'Paused'}
                      </Badge>
                      <Badge variant="secondary">
                        <ActionIcon className="w-3 h-3 mr-1 inline" />
                        {ACTIONS.find(a => a.value === rule.action)?.label}
                      </Badge>
                    </div>
                    {rule.description && (
                      <p className="text-xs text-text-secondary truncate mt-0.5">{rule.description}</p>
                    )}
                  </div>
                  <div className="text-xs text-text-tertiary mr-2">
                    {rule.trigger_count} triggers
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>

                {isExpanded && (
                  <CardContent className="border-t border-border-primary pt-3 space-y-3">
                    {/* Conditions */}
                    <div>
                      <label className="text-xs font-medium text-text-secondary">Conditions</label>
                      <div className="mt-1 space-y-1">
                        {(rule.conditions as RuleCondition[]).map((c, i) => (
                          <div key={i} className="text-sm flex items-center gap-1">
                            {i > 0 && <span className="text-xs text-text-tertiary">AND</span>}
                            <Badge variant="secondary">
                              {CONDITION_FIELDS.find(f => f.value === c.field)?.label ?? c.field}
                            </Badge>
                            <span className="text-text-secondary">{c.op}</span>
                            <span className="font-mono">{String(c.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xs text-text-secondary">Triggered</div>
                        <div className="text-lg font-bold">{rule.trigger_count}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">Max/Day</div>
                        <div className="text-lg font-bold">{rule.max_executions_per_day}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">Last Triggered</div>
                        <div className="text-sm">
                          {rule.last_triggered_at
                            ? new Date(rule.last_triggered_at).toLocaleDateString()
                            : 'Never'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-2 border-t border-border-primary">
                      <Button
                        onClick={(e) => { e.stopPropagation(); toggleRule(rule.id, !rule.enabled) }}
                        variant="ghost"
                        size="sm"
                      >
                        {rule.enabled ? (
                          <><Pause className="w-3 h-3 mr-1" /> Pause</>
                        ) : (
                          <><Play className="w-3 h-3 mr-1" /> Enable</>
                        )}
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleDelete(rule.id) }}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
