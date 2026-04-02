import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * Feature flags — A/B testing and gradual rollout foundation.
 * Uses consistent hashing (userId % 100 < rolloutPercentage) for deterministic assignment.
 */
export const featureFlags = pgTable('feature_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  rolloutPercentage: integer('rollout_percentage').notNull().default(0),
  targetPlans: jsonb('target_plans').default([]),
  enabled: boolean('enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  nameIdx: uniqueIndex('idx_feature_flags_name').on(t.name),
}))
