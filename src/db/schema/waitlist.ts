import { pgTable, uuid, text, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core'

export const waitlistSubscribers = pgTable('waitlist_subscribers', {
  id:           uuid('id').defaultRandom().primaryKey(),
  email:        text('email').notNull(),
  interest:     text('interest').notNull().default('general'),
  referrer:     text('referrer'),
  confirmed:    boolean('confirmed').notNull().default(false),
  unsubscribed: boolean('unsubscribed').notNull().default(false),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  emailInterestUniq: uniqueIndex('waitlist_email_interest_uniq').on(t.email, t.interest),
  createdAtIdx:      index('waitlist_created_at_idx').on(t.createdAt),
}))
