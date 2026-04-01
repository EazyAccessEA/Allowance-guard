import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * Monitored wallets — one row per wallet being continuously monitored.
 * Linked to a user_id so we can enforce plan-based limits.
 */
export const monitoredWallets = pgTable('monitored_wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  walletAddress: text('wallet_address').notNull(),
  /** Chains to monitor (array of chain IDs). Empty = all enabled chains. */
  chains: jsonb('chains').default([]),
  enabled: boolean('enabled').notNull().default(true),
  /** Scan frequency in minutes (default 720 = 12h) */
  freqMinutes: integer('freq_minutes').notNull().default(720),
  /** When we last ran a scan for this wallet */
  lastScanAt: timestamp('last_scan_at', { withTimezone: true }),
  /** When we last detected a change */
  lastChangeAt: timestamp('last_change_at', { withTimezone: true }),
  /** Notification channels: { email?: bool, slack?: bool, telegram?: bool } */
  notifyChannels: jsonb('notify_channels').default({ email: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('monitored_wallets_user_id_idx').on(t.userId),
  walletIdx: index('monitored_wallets_wallet_address_idx').on(t.walletAddress),
  userWalletUniq: uniqueIndex('monitored_wallets_user_wallet_key').on(t.userId, t.walletAddress),
  enabledIdx: index('monitored_wallets_enabled_idx').on(t.enabled),
}))

/**
 * Monitoring events — emitted when a scan detects changes.
 * Used for the monitoring dashboard and alert history.
 */
export const monitoringEvents = pgTable('monitoring_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  monitorId: uuid('monitor_id').notNull(),
  walletAddress: text('wallet_address').notNull(),
  chainId: integer('chain_id').notNull(),
  eventType: text('event_type').notNull(), // new_approval | approval_changed | approval_removed | risk_increased
  /** Snapshot of the relevant allowance / change */
  payload: jsonb('payload').default({}),
  /** Was a notification sent? */
  notified: boolean('notified').notNull().default(false),
  /** Was the notification acknowledged by the user? */
  acknowledged: boolean('acknowledged').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  monitorIdx: index('monitoring_events_monitor_id_idx').on(t.monitorId),
  walletIdx: index('monitoring_events_wallet_address_idx').on(t.walletAddress),
  typeIdx: index('monitoring_events_event_type_idx').on(t.eventType),
  createdIdx: index('monitoring_events_created_at_idx').on(t.createdAt),
}))

/**
 * Monitoring snapshots — stores the last-seen state of allowances per wallet.
 * Used by change detection to compare current state against previous scan.
 */
export const monitoringSnapshots = pgTable('monitoring_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').notNull(),
  chainId: integer('chain_id').notNull(),
  tokenAddress: text('token_address').notNull(),
  spenderAddress: text('spender_address').notNull(),
  amount: text('amount').notNull().default('0'),
  isUnlimited: boolean('is_unlimited').notNull().default(false),
  riskScore: integer('risk_score').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  walletIdx: index('monitoring_snapshots_wallet_address_idx').on(t.walletAddress),
  walletChainIdx: index('monitoring_snapshots_wallet_chain_idx').on(t.walletAddress, t.chainId),
}))
