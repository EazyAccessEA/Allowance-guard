/**
 * Rule Engine — evaluates revocation rules against allowance data.
 *
 * Sentinel-tier feature. Processes rules defined by users and determines
 * which allowances match, then queues the appropriate action.
 */
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RuleCondition {
  field: 'is_unlimited' | 'risk_score' | 'amount' | 'standard' | 'chain_id' | 'spender_address' | 'risk_flags'
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'not_contains'
  value: string | number | boolean | string[]
}

export interface RevocationRule {
  id: string
  user_id: number
  name: string
  description: string | null
  enabled: boolean
  wallets: string[]
  chains: number[]
  conditions: RuleCondition[]
  action: 'auto_revoke' | 'alert_only' | 'queue_revoke'
  max_executions_per_day: number
  trigger_count: number
  last_triggered_at: string | null
}

export interface Allowance {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  risk_score: number
  risk_flags: string[]
  wallet_address: string
}

export interface RuleMatch {
  rule: RevocationRule
  allowance: Allowance
  matchedConditions: RuleCondition[]
}

// ---------------------------------------------------------------------------
// Condition evaluator
// ---------------------------------------------------------------------------

function evaluateCondition(condition: RuleCondition, allowance: Allowance): boolean {
  const fieldValue = getAllowanceField(allowance, condition.field)

  switch (condition.op) {
    case 'eq':
      return fieldValue === condition.value
    case 'neq':
      return fieldValue !== condition.value
    case 'gt':
      return typeof fieldValue === 'number' && typeof condition.value === 'number'
        ? fieldValue > condition.value
        : parseFloat(String(fieldValue)) > parseFloat(String(condition.value))
    case 'gte':
      return typeof fieldValue === 'number' && typeof condition.value === 'number'
        ? fieldValue >= condition.value
        : parseFloat(String(fieldValue)) >= parseFloat(String(condition.value))
    case 'lt':
      return typeof fieldValue === 'number' && typeof condition.value === 'number'
        ? fieldValue < condition.value
        : parseFloat(String(fieldValue)) < parseFloat(String(condition.value))
    case 'lte':
      return typeof fieldValue === 'number' && typeof condition.value === 'number'
        ? fieldValue <= condition.value
        : parseFloat(String(fieldValue)) <= parseFloat(String(condition.value))
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return Array.isArray(condition.value)
          ? condition.value.some(v => fieldValue.includes(v))
          : fieldValue.includes(String(condition.value))
      }
      return String(fieldValue).includes(String(condition.value))
    case 'not_contains':
      if (Array.isArray(fieldValue)) {
        return Array.isArray(condition.value)
          ? !condition.value.some(v => fieldValue.includes(v))
          : !fieldValue.includes(String(condition.value))
      }
      return !String(fieldValue).includes(String(condition.value))
    default:
      return false
  }
}

function getAllowanceField(
  allowance: Allowance,
  field: RuleCondition['field'],
): string | number | boolean | string[] {
  switch (field) {
    case 'is_unlimited': return allowance.is_unlimited
    case 'risk_score': return allowance.risk_score
    case 'amount': return allowance.amount
    case 'standard': return allowance.standard
    case 'chain_id': return allowance.chain_id
    case 'spender_address': return allowance.spender_address.toLowerCase()
    case 'risk_flags': return allowance.risk_flags ?? []
    default: return ''
  }
}

// ---------------------------------------------------------------------------
// Rule evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate all enabled rules for a user against their current allowances.
 * Returns matches where all conditions are met.
 */
export async function evaluateRules(userId: number): Promise<RuleMatch[]> {
  // Load enabled rules for this user
  const { rows: rules } = await pool.query(
    `SELECT * FROM revocation_rules WHERE user_id = $1 AND enabled = TRUE`,
    [userId],
  )

  if (rules.length === 0) return []

  // Load the user's monitored wallet allowances
  const { rows: wallets } = await pool.query(
    `SELECT wallet_address FROM monitored_wallets WHERE user_id = $1 AND enabled = TRUE`,
    [userId],
  )

  if (wallets.length === 0) return []

  const walletAddresses = wallets.map((w: { wallet_address: string }) => w.wallet_address.toLowerCase())

  const { rows: allowances } = await pool.query(
    `SELECT chain_id, token_address, spender_address, standard, allowance_type,
            amount, is_unlimited, risk_score, risk_flags, wallet_address
     FROM allowances
     WHERE wallet_address = ANY($1)`,
    [walletAddresses],
  )

  const matches: RuleMatch[] = []

  for (const rule of rules as RevocationRule[]) {
    const conditions = (rule.conditions as RuleCondition[]) ?? []
    if (conditions.length === 0) continue

    // Check daily execution limit
    if (rule.max_executions_per_day > 0) {
      const { rows: [{ count }] } = await pool.query(
        `SELECT COUNT(*)::int AS count FROM rule_executions
         WHERE rule_id = $1 AND created_at >= NOW() - INTERVAL '1 day'`,
        [rule.id],
      )
      if ((count as number) >= rule.max_executions_per_day) continue
    }

    // Filter allowances by rule scope
    const scopedAllowances = (allowances as Allowance[]).filter((a) => {
      // Check wallet scope
      if (rule.wallets.length > 0) {
        const ruleWallets = (rule.wallets as string[]).map(w => w.toLowerCase())
        if (!ruleWallets.includes(a.wallet_address.toLowerCase())) return false
      }

      // Check chain scope
      if (rule.chains.length > 0) {
        if (!rule.chains.includes(a.chain_id)) return false
      }

      return true
    })

    // Evaluate conditions against each allowance
    for (const allowance of scopedAllowances) {
      const matchedConditions = conditions.filter((c) => evaluateCondition(c, allowance))

      // All conditions must match (AND logic)
      if (matchedConditions.length === conditions.length) {
        matches.push({ rule, allowance, matchedConditions })
      }
    }
  }

  return matches
}

// ---------------------------------------------------------------------------
// Execute rule actions
// ---------------------------------------------------------------------------

export async function executeRuleMatches(matches: RuleMatch[]): Promise<void> {
  for (const { rule, allowance } of matches) {
    try {
      // Log the execution
      await pool.query(
        `INSERT INTO rule_executions (id, rule_id, user_id, wallet_address, chain_id, token_address, spender_address, action, success, details, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          rule.id,
          rule.user_id,
          allowance.wallet_address,
          allowance.chain_id,
          allowance.token_address,
          allowance.spender_address,
          rule.action,
          true,
          JSON.stringify({
            ruleName: rule.name,
            conditions: rule.conditions,
            amount: allowance.amount,
            isUnlimited: allowance.is_unlimited,
            riskScore: allowance.risk_score,
          }),
        ],
      )

      // Update rule trigger count
      await pool.query(
        `UPDATE revocation_rules SET trigger_count = trigger_count + 1, last_triggered_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [rule.id],
      )

      // For 'auto_revoke' action, the actual revocation needs to happen client-side
      // (we can't submit wallet transactions from the server).
      // Instead, we queue a revocation request that the client picks up.
      if (rule.action === 'auto_revoke' || rule.action === 'queue_revoke') {
        await pool.query(
          `INSERT INTO jobs (type, payload, status) VALUES ('auto_revoke', $1, 'pending')`,
          [JSON.stringify({
            wallet_address: allowance.wallet_address,
            chain_id: allowance.chain_id,
            token_address: allowance.token_address,
            spender_address: allowance.spender_address,
            standard: allowance.standard,
            rule_id: rule.id,
            rule_name: rule.name,
          })],
        )
      }

      secureLogger.info('Rule executed', {
        ruleId: rule.id,
        ruleName: rule.name,
        action: rule.action,
        wallet: allowance.wallet_address,
      })
    } catch (err) {
      secureLogger.error('Rule execution failed', { ruleId: rule.id, err })
    }
  }
}

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

export async function getUserRules(userId: number): Promise<RevocationRule[]> {
  const { rows } = await pool.query(
    `SELECT * FROM revocation_rules WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  )
  return rows as RevocationRule[]
}

export async function createRule(
  userId: number,
  data: {
    name: string
    description?: string
    wallets?: string[]
    chains?: number[]
    conditions: RuleCondition[]
    action?: string
    maxExecutionsPerDay?: number
  },
): Promise<RevocationRule> {
  const { rows } = await pool.query(
    `INSERT INTO revocation_rules (user_id, name, description, wallets, chains, conditions, action, max_executions_per_day)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      userId,
      data.name,
      data.description ?? null,
      JSON.stringify(data.wallets ?? []),
      JSON.stringify(data.chains ?? []),
      JSON.stringify(data.conditions),
      data.action ?? 'alert_only',
      data.maxExecutionsPerDay ?? 10,
    ],
  )
  return rows[0] as RevocationRule
}

export async function updateRule(
  userId: number,
  ruleId: string,
  data: Partial<{
    name: string
    description: string
    enabled: boolean
    wallets: string[]
    chains: number[]
    conditions: RuleCondition[]
    action: string
    maxExecutionsPerDay: number
  }>,
): Promise<RevocationRule | null> {
  const sets: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (data.name !== undefined) { sets.push(`name = $${idx++}`); params.push(data.name) }
  if (data.description !== undefined) { sets.push(`description = $${idx++}`); params.push(data.description) }
  if (data.enabled !== undefined) { sets.push(`enabled = $${idx++}`); params.push(data.enabled) }
  if (data.wallets !== undefined) { sets.push(`wallets = $${idx++}`); params.push(JSON.stringify(data.wallets)) }
  if (data.chains !== undefined) { sets.push(`chains = $${idx++}`); params.push(JSON.stringify(data.chains)) }
  if (data.conditions !== undefined) { sets.push(`conditions = $${idx++}`); params.push(JSON.stringify(data.conditions)) }
  if (data.action !== undefined) { sets.push(`action = $${idx++}`); params.push(data.action) }
  if (data.maxExecutionsPerDay !== undefined) { sets.push(`max_executions_per_day = $${idx++}`); params.push(data.maxExecutionsPerDay) }

  if (sets.length === 0) return null

  sets.push(`updated_at = NOW()`)
  params.push(ruleId, userId)

  const { rows } = await pool.query(
    `UPDATE revocation_rules SET ${sets.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
    params,
  )

  return (rows[0] as RevocationRule) ?? null
}

export async function deleteRule(userId: number, ruleId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM revocation_rules WHERE id = $1 AND user_id = $2`,
    [ruleId, userId],
  )
  return (rowCount ?? 0) > 0
}

export async function getRuleExecutions(
  ruleId: string,
  limit = 20,
): Promise<Array<Record<string, unknown>>> {
  const { rows } = await pool.query(
    `SELECT * FROM rule_executions WHERE rule_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [ruleId, limit],
  )
  return rows
}
