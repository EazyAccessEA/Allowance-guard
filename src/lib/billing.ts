import Stripe from 'stripe'
import { pool } from '@/lib/db'
import { apiLogger } from '@/lib/logger'
import type { ConsumerPlan } from '@/lib/plans'
import { getPlanDisplayName } from '@/lib/plans'

// ---------------------------------------------------------------------------
// Stripe client
// ---------------------------------------------------------------------------

// Lazy-initialise so the module can be imported without crashing when
// STRIPE_SECRET_KEY is absent (e.g. during Next.js build).
let _stripe: Stripe | null = null
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key, { apiVersion: '2025-08-27.basil' })
  }
  return _stripe
}

/** Lazy proxy so callers can use `stripe.customers.create(...)` as before */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver)
  },
})

// ---------------------------------------------------------------------------
// Custom invoice branding constants
// ---------------------------------------------------------------------------

const INVOICE_FOOTER = 'AllowanceGuard — Web3 wallet security. Core tool: free and open source. Always.\nhttps://www.allowanceguard.com | support@allowanceguard.com'

/**
 * Build custom_fields array for Stripe invoices.
 * Stripe allows up to 2 custom fields on invoices.
 */
function invoiceCustomFields(plan: string, userId: number): Stripe.Checkout.SessionCreateParams.InvoiceCreation.InvoiceData.CustomField[] {
  return [
    { name: 'Plan', value: getPlanDisplayName(plan as ConsumerPlan) },
    { name: 'Account ID', value: `AG-${userId}` },
  ]
}

// ---------------------------------------------------------------------------
// Customer management
// ---------------------------------------------------------------------------

/**
 * Create or retrieve a Stripe customer for the given user.
 * Stores the mapping in the subscriptions table when a new customer is created.
 */
export async function getOrCreateCustomer(userId: number, email: string): Promise<string> {
  // Check if user already has a Stripe customer
  const { rows } = await pool.query(
    `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1 LIMIT 1`,
    [userId],
  )

  if (rows[0]?.stripe_customer_id) {
    return rows[0].stripe_customer_id as string
  }

  // Create new Stripe customer with invoice branding defaults
  const customer = await stripe.customers.create({
    email,
    metadata: { ag_user_id: String(userId) },
    invoice_settings: {
      custom_fields: [
        { name: 'Account ID', value: `AG-${userId}` },
      ],
      footer: INVOICE_FOOTER,
    },
  })

  apiLogger.info('stripe.customer.created', { userId, customerId: customer.id })
  return customer.id
}

// ---------------------------------------------------------------------------
// Subscription management
// ---------------------------------------------------------------------------

export interface CreateSubscriptionOptions {
  userId: number
  email: string
  priceId: string
  plan: ConsumerPlan | string
  successUrl: string
  cancelUrl: string
  trialDays?: number
}

/**
 * Create a Stripe Checkout Session for a new subscription.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckoutSession(opts: CreateSubscriptionOptions): Promise<string> {
  const customerId = await getOrCreateCustomer(opts.userId, opts.email)

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    subscription_data: {
      metadata: {
        ag_user_id: String(opts.userId),
        ag_plan: opts.plan,
      },
    },
    metadata: {
      ag_user_id: String(opts.userId),
      ag_plan: opts.plan,
    },
    // Custom invoice branding — applied to every invoice generated from this subscription
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: `AllowanceGuard ${getPlanDisplayName(opts.plan as ConsumerPlan)} subscription`,
        custom_fields: invoiceCustomFields(opts.plan, opts.userId),
        footer: INVOICE_FOOTER,
        rendering_options: { amount_tax_display: 'include_inclusive_tax' },
      },
    },
  }

  if (opts.trialDays && opts.trialDays > 0) {
    sessionParams.subscription_data!.trial_period_days = opts.trialDays
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  apiLogger.info('stripe.checkout.created', {
    userId: opts.userId,
    sessionId: session.id,
    plan: opts.plan,
  })

  return session.url ?? ''
}

/**
 * Create a Stripe Customer Portal session so the user can manage
 * their subscription (upgrade, downgrade, cancel, update payment method).
 */
export async function createPortalSession(userId: number, returnUrl: string): Promise<string> {
  const { rows } = await pool.query(
    `SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1 AND status IN ('active','past_due','trialing') LIMIT 1`,
    [userId],
  )

  if (!rows[0]?.stripe_customer_id) {
    throw new Error('NO_ACTIVE_SUBSCRIPTION')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: rows[0].stripe_customer_id as string,
    return_url: returnUrl,
  })

  return session.url
}

// ---------------------------------------------------------------------------
// Subscription sync (called from webhook)
// ---------------------------------------------------------------------------

/**
 * Upsert a subscription record from a Stripe subscription object.
 * Called by the webhook handler whenever a subscription changes.
 */
export async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const userId = sub.metadata?.ag_user_id
  const plan = sub.metadata?.ag_plan ?? 'free'

  if (!userId) {
    apiLogger.warn('stripe.sync.missing_user_id', { subscriptionId: sub.id })
    return
  }

  await pool.query(
    `INSERT INTO subscriptions (id, user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_start, current_period_end, cancel_at_period_end, metadata, created_at, updated_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7), $8, $9, NOW(), NOW())
     ON CONFLICT (stripe_subscription_id) DO UPDATE SET
       plan = EXCLUDED.plan,
       status = EXCLUDED.status,
       current_period_start = EXCLUDED.current_period_start,
       current_period_end = EXCLUDED.current_period_end,
       cancel_at_period_end = EXCLUDED.cancel_at_period_end,
       metadata = EXCLUDED.metadata,
       updated_at = NOW()`,
    [
      parseInt(userId, 10),
      sub.customer as string,
      sub.id,
      plan,
      sub.status,
      sub.items.data[0]?.current_period_start ?? 0,
      sub.items.data[0]?.current_period_end ?? 0,
      sub.cancel_at_period_end,
      JSON.stringify(sub.metadata ?? {}),
    ],
  )

  apiLogger.info('stripe.subscription.synced', {
    userId,
    subscriptionId: sub.id,
    plan,
    status: sub.status,
  })
}

// ---------------------------------------------------------------------------
// Invoice persistence (called from webhook)
// ---------------------------------------------------------------------------

/**
 * Upsert an invoice record from a Stripe Invoice object.
 * Called by the webhook handler on invoice.finalized, invoice.payment_succeeded, invoice.payment_failed.
 */
export async function upsertInvoice(invoice: Stripe.Invoice): Promise<void> {
  // Resolve user_id from the customer's subscription metadata or from our DB
  let userId: number | null = null

  // Try to find user from subscriptions table via customer ID
  const { rows } = await pool.query(
    `SELECT user_id FROM subscriptions WHERE stripe_customer_id = $1 LIMIT 1`,
    [typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer as Stripe.Customer)?.id],
  )
  if (rows[0]?.user_id) {
    userId = rows[0].user_id as number
  }

  if (!userId) {
    apiLogger.warn('billing.invoice.upsert.no_user', { invoiceId: invoice.id })
    return
  }

  const customerId = typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer as Stripe.Customer)?.id ?? ''
  const rawSub = (invoice as unknown as Record<string, unknown>).subscription
  const subscriptionId = typeof rawSub === 'string'
    ? rawSub
    : (rawSub as Stripe.Subscription | null)?.id ?? null

  // Extract plan: try invoice line item metadata first, then fall back to subscription metadata
  let plan: string | null = null
  for (const line of invoice.lines?.data ?? []) {
    if (line.metadata?.ag_plan) {
      plan = line.metadata.ag_plan
      break
    }
  }
  if (!plan && rawSub) {
    // Fall back to subscription metadata stored in our DB
    const subId = typeof rawSub === 'string'
      ? rawSub
      : (rawSub as Stripe.Subscription)?.id
    if (subId) {
      const { rows: planRows } = await pool.query(
        `SELECT plan FROM subscriptions WHERE stripe_subscription_id = $1 LIMIT 1`,
        [subId],
      )
      if (planRows[0]?.plan) {
        plan = planRows[0].plan as string
      }
    }
  }

  // Convert timestamps: use null instead of 0 to avoid epoch date (1970-01-01)
  const periodStartTs = invoice.period_start && invoice.period_start > 0 ? invoice.period_start : null
  const periodEndTs = invoice.period_end && invoice.period_end > 0 ? invoice.period_end : null

  await pool.query(
    `INSERT INTO invoices (
       id, user_id, stripe_invoice_id, stripe_customer_id, stripe_subscription_id,
       amount_due, amount_paid, currency, status, plan,
       period_start, period_end, hosted_invoice_url, invoice_pdf_url,
       invoice_number, description, attempt_count, paid_at,
       created_at, updated_at
     ) VALUES (
       gen_random_uuid(), $1, $2, $3, $4,
       $5, $6, $7, $8, $9,
       ${periodStartTs ? 'to_timestamp($10)' : '$10::timestamptz'}, ${periodEndTs ? 'to_timestamp($11)' : '$11::timestamptz'},
       $12, $13,
       $14, $15, $16, $17,
       NOW(), NOW()
     )
     ON CONFLICT (stripe_invoice_id) DO UPDATE SET
       amount_due = EXCLUDED.amount_due,
       amount_paid = EXCLUDED.amount_paid,
       status = EXCLUDED.status,
       hosted_invoice_url = EXCLUDED.hosted_invoice_url,
       invoice_pdf_url = EXCLUDED.invoice_pdf_url,
       invoice_number = EXCLUDED.invoice_number,
       attempt_count = EXCLUDED.attempt_count,
       paid_at = EXCLUDED.paid_at,
       updated_at = NOW()`,
    [
      userId,
      invoice.id,
      customerId,
      subscriptionId,
      invoice.amount_due ?? 0,
      invoice.amount_paid ?? 0,
      invoice.currency ?? 'usd',
      invoice.status ?? 'draft',
      plan,
      periodStartTs,
      periodEndTs,
      invoice.hosted_invoice_url ?? null,
      invoice.invoice_pdf ?? null,
      invoice.number ?? null,
      invoice.description ?? null,
      invoice.attempt_count ?? 0,
      invoice.status === 'paid' ? new Date().toISOString() : null,
    ],
  )

  apiLogger.info('billing.invoice.upserted', {
    userId,
    invoiceId: invoice.id,
    status: invoice.status,
    amount: invoice.amount_paid,
  })
}

/**
 * Fetch invoices for a user from local DB, ordered by most recent first.
 */
export async function getUserInvoices(userId: number, limit = 50): Promise<InvoiceRecord[]> {
  const { rows } = await pool.query(
    `SELECT
       stripe_invoice_id, amount_due, amount_paid, currency, status, plan,
       period_start, period_end, hosted_invoice_url, invoice_pdf_url,
       invoice_number, description, attempt_count, paid_at, created_at
     FROM invoices
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  )

  return rows.map((r) => ({
    stripeInvoiceId: r.stripe_invoice_id as string,
    amountDue: r.amount_due as number,
    amountPaid: r.amount_paid as number,
    currency: r.currency as string,
    status: r.status as string,
    plan: r.plan as string | null,
    periodStart: r.period_start ? new Date(r.period_start as string).toISOString() : null,
    periodEnd: r.period_end ? new Date(r.period_end as string).toISOString() : null,
    hostedInvoiceUrl: r.hosted_invoice_url as string | null,
    invoicePdfUrl: r.invoice_pdf_url as string | null,
    invoiceNumber: r.invoice_number as string | null,
    description: r.description as string | null,
    attemptCount: r.attempt_count as number,
    paidAt: r.paid_at ? new Date(r.paid_at as string).toISOString() : null,
    createdAt: new Date(r.created_at as string).toISOString(),
  }))
}

export interface InvoiceRecord {
  stripeInvoiceId: string
  amountDue: number
  amountPaid: number
  currency: string
  status: string
  plan: string | null
  periodStart: string | null
  periodEnd: string | null
  hostedInvoiceUrl: string | null
  invoicePdfUrl: string | null
  invoiceNumber: string | null
  description: string | null
  attemptCount: number
  paidAt: string | null
  createdAt: string
}

/**
 * Look up user email by user_id (for sending invoice emails).
 */
export async function getUserEmailById(userId: number): Promise<string | null> {
  const { rows } = await pool.query(
    `SELECT email FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  )
  return (rows[0]?.email as string) ?? null
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export interface UserSubscription {
  plan: ConsumerPlan
  status: string
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

/**
 * Get the active subscription for a user.
 * Returns the free plan if no active subscription exists.
 */
export async function getUserSubscription(userId: number): Promise<UserSubscription> {
  const { rows } = await pool.query(
    `SELECT plan, status, current_period_end, cancel_at_period_end
     FROM subscriptions
     WHERE user_id = $1 AND status IN ('active', 'trialing', 'past_due')
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId],
  )

  if (!rows[0]) {
    return {
      plan: 'free' as ConsumerPlan,
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }
  }

  return {
    plan: rows[0].plan as ConsumerPlan,
    status: rows[0].status as string,
    currentPeriodEnd: rows[0].current_period_end ? new Date(rows[0].current_period_end as string) : null,
    cancelAtPeriodEnd: rows[0].cancel_at_period_end as boolean,
  }
}
