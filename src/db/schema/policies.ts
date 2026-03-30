import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

/**
 * Revocation rules — user-defined conditions that automatically trigger
 * revocations when met. Sentinel-tier feature.
 *
 * Rule conditions are stored as JSON and evaluated by the rule engine.
 * Example conditions:
 *   { "field": "is_unlimited", "op": "eq", "value": true }
 *   { "field": "risk_score", "op": "gt", "value": 70 }
 *   { "field": "standard", "op": "eq", "value": "ERC20" }
 *   { "field": "amount", "op": "gt", "value": "1000000000000000000" }
 */
export const revocationRules = pgTable('revocation_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  /** Human-readable rule name */
  name: text('name').notNull(),
  /** Description of what this rule does */
  description: text('description'),
  /** Whether this rule is active */
  enabled: boolean('enabled').notNull().default(true),
  /** Wallet addresses this rule applies to (empty = all monitored wallets) */
  wallets: jsonb('wallets').default([]),
  /** Chain IDs this rule applies to (empty = all chains) */
  chains: jsonb('chains').default([]),
  /** Conditions — array of condition objects, all must match (AND logic) */
  conditions: jsonb('conditions').notNull().default([]),
  /** Action to take: 'auto_revoke' | 'alert_only' | 'queue_revoke' */
  action: text('action').notNull().default('alert_only'),
  /** Max executions per day (0 = unlimited) */
  maxExecutionsPerDay: integer('max_executions_per_day').notNull().default(10),
  /** How many times this rule has been triggered total */
  triggerCount: integer('trigger_count').notNull().default(0),
  /** Last time this rule was triggered */
  lastTriggeredAt: timestamp('last_triggered_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('revocation_rules_user_id_idx').on(t.userId),
  enabledIdx: index('revocation_rules_enabled_idx').on(t.enabled),
}))

/**
 * Rule execution log — tracks each time a rule fires.
 */
export const ruleExecutions = pgTable('rule_executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  ruleId: uuid('rule_id').notNull(),
  userId: integer('user_id').notNull(),
  walletAddress: text('wallet_address').notNull(),
  chainId: integer('chain_id').notNull(),
  tokenAddress: text('token_address').notNull(),
  spenderAddress: text('spender_address').notNull(),
  /** What the rule decided to do */
  action: text('action').notNull(), // auto_revoke | alert_only | queue_revoke
  /** Was the action successfully executed? */
  success: boolean('success'),
  /** Details about the execution */
  details: jsonb('details').default({}),
  /** If auto_revoke, the tx hash */
  txHash: text('tx_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  ruleIdx: index('rule_executions_rule_id_idx').on(t.ruleId),
  userIdx: index('rule_executions_user_id_idx').on(t.userId),
  createdIdx: index('rule_executions_created_at_idx').on(t.createdAt),
}))
