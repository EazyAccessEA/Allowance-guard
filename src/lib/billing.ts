import Stripe from 'stripe'
import { pool } from '@/lib/db'
import { apiLogger } from '@/lib/logger'
import type { ConsumerPlan } from '@/lib/plans'

// ---------------------------------------------------------------------------
// Stripe client
// ---------------------------------------------------------------------------

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-08-27.basil',
})

export { stripe }

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

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { ag_user_id: String(userId) },
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

  const isApiPlan = opts.plan.startsWith('api_')

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
      invoice_settings: {
        custom_fields: [
          { name: 'Product', value: 'Allowance Guard' },
          { name: 'Plan', value: opts.plan.replace(/_/g, ' ').replace(/\bapi\b/i, 'API').replace(/\b\w/g, c => c.toUpperCase()) },
        ],
        footer: 'Allowance Guard is a product of Eazy Access Ltd | https://allowanceguard.com | support@allowanceguard.com',
      },
    },
    metadata: {
      ag_user_id: String(opts.userId),
      ag_plan: opts.plan,
    },
    // B2B API plans: enable automatic tax for invoices
    ...(isApiPlan && {
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
    }),
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
