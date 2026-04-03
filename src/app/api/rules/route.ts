import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { getUserRules, createRule, updateRule, deleteRule, getRuleExecutions } from '@/lib/rule-engine'
import type { RuleCondition } from '@/lib/rule-engine'
import { secureLogger } from '@/lib/secure-logger'

/**
 * GET /api/rules
 * List all rules for the current user.
 */
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // Feature gate: automatedRules requires Sentinel
  const access = await checkFeature(Number(session.user_id), 'automatedRules')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Automated rules require the Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const rules = await getUserRules(Number(session.user_id))
  return NextResponse.json({ rules })
}

/**
 * POST /api/rules
 * Create a new revocation rule.
 */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(Number(session.user_id), 'automatedRules')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Automated rules require the Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const { name, description, wallets, chains, conditions, action, maxExecutionsPerDay } = body

  // Validate
  if (!name || typeof name !== 'string' || name.length < 1) {
    return NextResponse.json({ error: 'Rule name is required' }, { status: 400 })
  }

  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    return NextResponse.json({ error: 'At least one condition is required' }, { status: 400 })
  }

  // Validate conditions
  const validFields = ['is_unlimited', 'risk_score', 'amount', 'standard', 'chain_id', 'spender_address', 'risk_flags']
  const validOps = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'not_contains']
  for (const c of conditions as RuleCondition[]) {
    if (!validFields.includes(c.field)) {
      return NextResponse.json({ error: `Invalid condition field: ${c.field}` }, { status: 400 })
    }
    if (!validOps.includes(c.op)) {
      return NextResponse.json({ error: `Invalid condition operator: ${c.op}` }, { status: 400 })
    }
  }

  const validActions = ['auto_revoke', 'alert_only', 'queue_revoke']
  if (action && !validActions.includes(action)) {
    return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 })
  }

  try {
    const rule = await createRule(Number(session.user_id), {
      name,
      description,
      wallets,
      chains,
      conditions,
      action,
      maxExecutionsPerDay,
    })

    return NextResponse.json({ rule }, { status: 201 })
  } catch (err) {
    secureLogger.error('Failed to create rule', { err })
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 })
  }
}

/**
 * PUT /api/rules
 * Update an existing rule.
 */
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(Number(session.user_id), 'automatedRules')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Automated rules require the Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const { ruleId, ...updates } = body

  if (!ruleId || typeof ruleId !== 'string') {
    return NextResponse.json({ error: 'ruleId is required' }, { status: 400 })
  }

  const rule = await updateRule(Number(session.user_id), ruleId, updates)
  if (!rule) {
    return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
  }

  return NextResponse.json({ rule })
}

/**
 * DELETE /api/rules
 * Delete a rule.
 */
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const ruleId = searchParams.get('id')
  if (!ruleId) {
    return NextResponse.json({ error: 'id parameter required' }, { status: 400 })
  }

  const deleted = await deleteRule(Number(session.user_id), ruleId)
  if (!deleted) {
    return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
