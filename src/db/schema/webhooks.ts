import {
  pgTable,
  uuid,
  integer,
  bigint,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * Webhooks — user/team-scoped webhook endpoints for event notifications.
 * Sentinel-only feature for integrating AllowanceGuard events with external systems.
 */
export const webhooks = pgTable('webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  teamId: bigint('team_id', { mode: 'number' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  /** HMAC signing secret (SHA-256 hashed before storage) */
  secret: text('secret').notNull(),
  /** First 8 chars of hash for display identification */
  secretPrefix: text('secret_prefix'),
  /** Event types to subscribe to */
  events: jsonb('events').notNull().default([]),
  enabled: boolean('enabled').notNull().default(true),
  lastTriggeredAt: timestamp('last_triggered_at', { withTimezone: true }),
  failureCount: integer('failure_count').notNull().default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('webhooks_user_id_idx').on(t.userId),
  teamIdx: index('webhooks_team_id_idx').on(t.teamId),
  enabledIdx: index('webhooks_enabled_idx').on(t.enabled),
}))

/**
 * Webhook delivery log — tracks each delivery attempt for debugging and retry.
 */
export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  webhookId: uuid('webhook_id').notNull(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull().default({}),
  statusCode: integer('status_code'),
  responseBody: text('response_body'),
  success: boolean('success').notNull().default(false),
  attempt: integer('attempt').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  webhookIdx: index('webhook_deliveries_webhook_id_idx').on(t.webhookId),
  createdIdx: index('webhook_deliveries_created_at_idx').on(t.createdAt),
  eventTypeIdx: index('webhook_deliveries_event_type_idx').on(t.eventType),
}))

/**
 * Team activity log — per-member action tracking for compliance.
 */
export const teamActivity = pgTable('team_activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: bigint('team_id', { mode: 'number' }).notNull(),
  userId: integer('user_id').notNull(),
  action: text('action').notNull(),
  subject: text('subject'),
  details: jsonb('details').default({}),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  teamIdx: index('team_activity_team_id_idx').on(t.teamId),
  userIdx: index('team_activity_user_id_idx').on(t.userId),
  actionIdx: index('team_activity_action_idx').on(t.action),
  createdIdx: index('team_activity_created_at_idx').on(t.createdAt),
  teamCreatedIdx: index('team_activity_team_created_idx').on(t.teamId, t.createdAt),
}))

/**
 * Compliance export tracking — records of generated compliance reports.
 */
export const complianceExports = pgTable('compliance_exports', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  teamId: bigint('team_id', { mode: 'number' }),
  exportType: text('export_type').notNull(),
  format: text('format').notNull().default('json'),
  filters: jsonb('filters').default({}),
  rowCount: integer('row_count').notNull().default(0),
  fileSize: integer('file_size'),
  downloadToken: text('download_token').unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('compliance_exports_user_id_idx').on(t.userId),
  teamIdx: index('compliance_exports_team_id_idx').on(t.teamId),
  tokenIdx: index('compliance_exports_download_token_idx').on(t.downloadToken),
  createdIdx: index('compliance_exports_created_at_idx').on(t.createdAt),
}))
