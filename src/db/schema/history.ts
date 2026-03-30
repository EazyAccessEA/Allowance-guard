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
 * Wallet events — historical snapshots of allowance state changes.
 * Powers the "Time Machine" feature for Pro+ users.
 *
 * Each row captures a single event: approval granted, amount changed,
 * approval revoked, or risk score change. Together they form a full
 * timeline of a wallet's approval history.
 */
export const walletEvents = pgTable('wallet_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').notNull(),
  chainId: integer('chain_id').notNull(),
  tokenAddress: text('token_address').notNull(),
  spenderAddress: text('spender_address').notNull(),
  /** Event type */
  eventType: text('event_type').notNull(), // approval_granted | approval_changed | approval_revoked | risk_changed
  /** Previous value (null for new approvals) */
  previousAmount: text('previous_amount'),
  /** New value (null for revocations) */
  newAmount: text('new_amount'),
  previousUnlimited: boolean('previous_unlimited'),
  newUnlimited: boolean('new_unlimited'),
  /** Risk scores at the time of this event */
  riskScore: integer('risk_score'),
  previousRiskScore: integer('previous_risk_score'),
  /** Block number where this was observed */
  blockNumber: text('block_number'),
  /** Transaction hash if this came from a user action (revoke) */
  txHash: text('tx_hash'),
  /** Additional context */
  metadata: jsonb('metadata').default({}),
  /** Labels for display (resolved at event creation time) */
  tokenSymbol: text('token_symbol'),
  spenderLabel: text('spender_label'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  walletIdx: index('wallet_events_wallet_address_idx').on(t.walletAddress),
  chainIdx: index('wallet_events_chain_id_idx').on(t.chainId),
  typeIdx: index('wallet_events_event_type_idx').on(t.eventType),
  createdIdx: index('wallet_events_created_at_idx').on(t.createdAt),
  walletCreatedIdx: index('wallet_events_wallet_created_idx').on(t.walletAddress, t.createdAt),
}))

/**
 * Risk snapshots — periodic snapshots of a wallet's aggregate risk state.
 * Taken after every scan for Time Machine "risk over time" charts.
 */
export const riskSnapshots = pgTable('risk_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').notNull(),
  /** Aggregate risk score (0-100) */
  riskScore: integer('risk_score').notNull(),
  /** Breakdown counts */
  totalAllowances: integer('total_allowances').notNull().default(0),
  unlimitedCount: integer('unlimited_count').notNull().default(0),
  highRiskCount: integer('high_risk_count').notNull().default(0),
  /** Per-chain breakdown */
  chainBreakdown: jsonb('chain_breakdown').default({}),
  /** When this snapshot was taken */
  snapshotAt: timestamp('snapshot_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  walletIdx: index('risk_snapshots_wallet_address_idx').on(t.walletAddress),
  snapshotIdx: index('risk_snapshots_snapshot_at_idx').on(t.snapshotAt),
  walletSnapshotIdx: index('risk_snapshots_wallet_snapshot_idx').on(t.walletAddress, t.snapshotAt),
}))
