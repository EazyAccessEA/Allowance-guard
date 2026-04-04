import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * Local mirror of Stripe invoices.
 * Populated by webhook events (invoice.finalized, invoice.payment_succeeded, invoice.payment_failed).
 * Allows fast querying without hitting the Stripe API on every page load.
 */
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  stripeInvoiceId: text('stripe_invoice_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  /** minor units (cents/pence) */
  amountDue: integer('amount_due').notNull().default(0),
  /** minor units (cents/pence) */
  amountPaid: integer('amount_paid').notNull().default(0),
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull().default('draft'), // draft | open | paid | uncollectible | void
  /** Plan name at time of invoice (e.g. "pro", "sentinel", "api_developer") */
  plan: text('plan'),
  /** Billing period start */
  periodStart: timestamp('period_start', { withTimezone: true }),
  /** Billing period end */
  periodEnd: timestamp('period_end', { withTimezone: true }),
  /** Stripe-hosted invoice page URL */
  hostedInvoiceUrl: text('hosted_invoice_url'),
  /** Direct PDF download URL */
  invoicePdfUrl: text('invoice_pdf_url'),
  /** Invoice number from Stripe (e.g. "AG-0001") */
  invoiceNumber: text('invoice_number'),
  /** Human-readable description / memo */
  description: text('description'),
  /** Number of payment attempts */
  attemptCount: integer('attempt_count').notNull().default(0),
  /** When payment was made (null if unpaid) */
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('invoices_user_id_idx').on(t.userId),
  stripeInvoiceIdx: uniqueIndex('invoices_stripe_invoice_id_key').on(t.stripeInvoiceId),
  stripeCustIdx: index('invoices_stripe_customer_id_idx').on(t.stripeCustomerId),
  statusIdx: index('invoices_status_idx').on(t.status),
}))
