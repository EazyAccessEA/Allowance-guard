import {
  pgTable,
  bigserial,
  integer,
  text,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'

export const usageRecords = pgTable('usage_records', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: integer('user_id'),
  apiKeyId: text('api_key_id'), // UUID string referencing api_keys.id
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull().default('GET'),
  responseStatus: integer('response_status'),
  durationMs: integer('duration_ms'),
  metadata: jsonb('metadata').default({}),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('usage_records_user_id_idx').on(t.userId),
  apiKeyIdx: index('usage_records_api_key_id_idx').on(t.apiKeyId),
  timestampIdx: index('usage_records_timestamp_idx').on(t.timestamp),
  endpointIdx: index('usage_records_endpoint_idx').on(t.endpoint),
}))
