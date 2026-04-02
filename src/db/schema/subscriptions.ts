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

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  plan: text('plan').notNull().default('free'), // free | pro | sentinel
  status: text('status').notNull().default('active'), // active | past_due | canceled | trialing | incomplete
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  reEngagementEmailSent: boolean('re_engagement_email_sent').notNull().default(false),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  userIdx: index('subscriptions_user_id_idx').on(t.userId),
  stripeSubIdx: uniqueIndex('subscriptions_stripe_subscription_id_key').on(t.stripeSubscriptionId),
  stripeCustIdx: index('subscriptions_stripe_customer_id_idx').on(t.stripeCustomerId),
  statusIdx: index('subscriptions_status_idx').on(t.status),
}))
