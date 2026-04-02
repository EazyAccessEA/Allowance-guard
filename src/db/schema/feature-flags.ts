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
 * Feature flags — runtime toggles for A/B testing, gradual rollouts,
 * and pricing experiments.
 *
 * Uses consistent hashing (userId % 100 < rolloutPercentage) for
 * deterministic assignment so the same user always sees the same variant.
 */
export const featureFlags = pgTable('feature_flags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  enabled: boolean('enabled').notNull().default(false),
  /** 0–100: percentage of users who see this flag as enabled */
  rolloutPercentage: integer('rollout_percentage').notNull().default(0),
  /** Target plans — empty array means all plans. e.g. ["pro", "sentinel"] */
  targetPlans: jsonb('target_plans').default([]),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  nameUniq: uniqueIndex('feature_flags_name_key').on(t.name),
  enabledIdx: index('feature_flags_enabled_idx').on(t.enabled),
}))
