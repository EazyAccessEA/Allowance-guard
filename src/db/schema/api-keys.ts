import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  keyHash: text('key_hash').notNull(), // SHA-256 hash of the full key
  prefix: text('prefix').notNull(), // First 8 chars for identification (ag_live_xxxx...)
  name: text('name').notNull().default('Default'),
  plan: text('plan').notNull().default('api_free'), // api_free | api_developer | api_growth | api_enterprise
  rateLimit: integer('rate_limit').notNull().default(100), // calls per day
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('api_keys_user_id_idx').on(t.userId),
  keyHashIdx: index('api_keys_key_hash_idx').on(t.keyHash),
  prefixIdx: index('api_keys_prefix_idx').on(t.prefix),
}))
