import { pgTable, text, timestamp, integer, jsonb, uuid } from 'drizzle-orm/pg-core'

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
