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
 * Analytics events — funnel tracking for business decisions.
 * Tracks key user actions like scans, revokes, upgrades, and checkouts.
 */
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id'),
  sessionId: text('session_id'),
  eventName: text('event_name').notNull(),
  metadata: jsonb('metadata').default({}),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('idx_analytics_events_user_id').on(t.userId),
  eventIdx: index('idx_analytics_events_event_name').on(t.eventName),
  createdIdx: index('idx_analytics_events_created_at').on(t.createdAt),
  userEventIdx: index('idx_analytics_events_user_event').on(t.userId, t.eventName, t.createdAt),
}))
