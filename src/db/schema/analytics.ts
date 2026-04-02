import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

/**
 * Analytics events — funnel and usage tracking for business decisions.
 * Events: wallet_connected, scan_started, scan_completed, revoke_initiated,
 * revoke_completed, upgrade_clicked, checkout_started, checkout_completed,
 * trial_started, trial_converted, etc.
 */
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id'),
  sessionId: text('session_id'),
  eventName: text('event_name').notNull(),
  eventCategory: text('event_category').notNull().default('general'),
  properties: jsonb('properties').default({}),
  pageUrl: text('page_url'),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  /** Hashed IP for privacy-safe geo/fraud detection */
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('analytics_events_user_id_idx').on(t.userId),
  eventNameIdx: index('analytics_events_event_name_idx').on(t.eventName),
  categoryIdx: index('analytics_events_category_idx').on(t.eventCategory),
  createdIdx: index('analytics_events_created_at_idx').on(t.createdAt),
  nameCreatedIdx: index('analytics_events_name_created_idx').on(t.eventName, t.createdAt),
}))
