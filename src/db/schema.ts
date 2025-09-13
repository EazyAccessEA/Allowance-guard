import { pgTable, text, timestamp, integer, jsonb, uuid, bigserial, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const donations = pgTable('donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  stripeSessionId: text('stripe_session_id').notNull().unique(),
  stripeEventId: text('stripe_event_id').notNull(),
  amountTotal: integer('amount_total').notNull(),
  currency: text('currency').notNull().default('gbp'),
  email: text('email'),
  payerName: text('payer_name'),
  paymentStatus: text('payment_status').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const coinbaseDonations = pgTable('coinbase_donations', {
  id:            bigserial('id', { mode: 'number' }).primaryKey(),
  chargeCode:    text('charge_code').notNull(),
  lastEventId:   text('last_event_id'),
  status:        text('status').notNull(),
  hostedUrl:     text('hosted_url'),
  localAmount:   integer('local_amount').notNull(),
  localCurrency: text('local_currency').notNull(),
  email:         text('email'),
  metadata:      jsonb('metadata'),
  createdAt:     timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:     timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  createdAtIdx: index('coinbase_donations_created_at_idx').on(t.createdAt),
  statusIdx:    index('coinbase_donations_status_idx').on(t.status),
  uniqCode:     uniqueIndex('coinbase_donations_charge_code_key').on(t.chargeCode),
}))
