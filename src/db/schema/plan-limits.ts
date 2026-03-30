import {
  pgTable,
  text,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'

/**
 * Database-backed plan limits configuration.
 *
 * This mirrors the in-code CONSUMER_PLAN_LIMITS from src/lib/plans.ts but
 * lives in the DB so operators can adjust limits without redeploying.
 * The application reads from plans.ts by default and falls back to this
 * table for runtime overrides.
 */
export const planLimits = pgTable('plan_limits', {
  plan: text('plan').primaryKey(), // free | pro | sentinel
  maxWallets: integer('max_wallets').notNull().default(3),
  maxChains: integer('max_chains').notNull().default(1),
  maxApiCallsDay: integer('max_api_calls_day').notNull().default(50),
  monitoringEnabled: boolean('monitoring_enabled').notNull().default(false),
  batchRevokeEnabled: boolean('batch_revoke_enabled').notNull().default(false),
  exportEnabled: boolean('export_enabled').notNull().default(false),
  alertsEnabled: boolean('alerts_enabled').notNull().default(false),
  teamEnabled: boolean('team_enabled').notNull().default(false),
  timeMachineEnabled: boolean('time_machine_enabled').notNull().default(false),
  automatedRulesEnabled: boolean('automated_rules_enabled').notNull().default(false),
  webhooksEnabled: boolean('webhooks_enabled').notNull().default(false),
  prioritySupportEnabled: boolean('priority_support_enabled').notNull().default(false),
  maxMonitoredWallets: integer('max_monitored_wallets').notNull().default(0),
})
