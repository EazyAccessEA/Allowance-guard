import { apiLogger } from '@/lib/logger'
import {
  CONSUMER_PRICES,
  API_PRICES,
  getPlanDisplayName,
  type ConsumerPlan,
  type ApiPlan,
} from '@/lib/plans'

export type PaidPlan =
  | Exclude<ConsumerPlan, 'free'>
  | Exclude<ApiPlan, 'api_free' | 'api_enterprise'>

export type BillingInterval = 'monthly' | 'yearly'

interface CreateCryptoChargeOpts {
  userId: number
  email: string
  plan: PaidPlan
  interval: BillingInterval
}

interface CoinbaseChargeResponse {
  data: {
    code: string
    hosted_url: string
    pricing?: { local?: { amount: string; currency: string } }
  }
}

function isConsumer(plan: PaidPlan): plan is Exclude<ConsumerPlan, 'free'> {
  return plan === 'pro' || plan === 'sentinel'
}

export function getPlanPriceMinor(plan: PaidPlan, interval: BillingInterval): {
  amountMinor: number
  currency: string
} {
  if (isConsumer(plan)) {
    const p = CONSUMER_PRICES[plan]
    return {
      amountMinor: interval === 'yearly' ? p.yearlyPence : p.monthlyPence,
      currency: p.currency,
    }
  }
  const p = API_PRICES[plan]
  return { amountMinor: p.monthlyPence, currency: p.currency }
}

/**
 * Create a one-time Coinbase Commerce charge for a subscription period.
 * Metadata carries ag_user_id / ag_plan / ag_interval so the webhook
 * can activate the subscription on `charge:confirmed`.
 */
export async function createCryptoSubscriptionCharge(
  opts: CreateCryptoChargeOpts
): Promise<{ hostedUrl: string; code: string }> {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY
  if (!apiKey) throw new Error('COINBASE_COMMERCE_API_KEY not set')

  const { amountMinor, currency } = getPlanPriceMinor(opts.plan, opts.interval)
  const amount = (amountMinor / 100).toFixed(2)

  if (process.env.E2E_FAKE_PAYMENTS === 'true') {
    const fakeCode = `FAKE_${Date.now()}`
    return {
      code: fakeCode,
      hostedUrl: `/account/success?provider=coinbase&charge_id=${fakeCode}`,
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.allowanceguard.com'
  const apiBase = process.env.COINBASE_COMMERCE_API_BASE ?? 'https://api.commerce.coinbase.com'
  const apiVersion = process.env.COINBASE_COMMERCE_VERSION ?? '2018-03-22'

  const idempotencyKey =
    (globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.() ||
    `${opts.userId}-${opts.plan}-${Date.now()}`

  const displayName = getPlanDisplayName(opts.plan)
  const body = {
    name: `AllowanceGuard ${displayName}`,
    description: `${displayName} (${opts.interval}) subscription`,
    pricing_type: 'fixed_price' as const,
    local_price: { amount, currency: currency.toUpperCase() },
    redirect_url: `${appUrl}/account/success?provider=coinbase&charge_id={CHARGE_ID}`,
    cancel_url: `${appUrl}/pricing?cancelled=1`,
    metadata: {
      ag_user_id: String(opts.userId),
      ag_plan: opts.plan,
      ag_interval: opts.interval,
      email: opts.email,
      kind: 'subscription',
    },
  }

  const res = await fetch(`${apiBase}/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': apiKey,
      'X-CC-Version': apiVersion,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    apiLogger.error('coinbase.subscription.charge_failed', {
      status: res.status,
      body: errText.slice(0, 500),
    })
    throw new Error(`Coinbase charge failed: ${res.status}`)
  }

  const json = (await res.json()) as CoinbaseChargeResponse
  const code = json?.data?.code
  const hostedUrl = json?.data?.hosted_url
  if (!code || !hostedUrl) {
    throw new Error('Malformed Coinbase response')
  }

  apiLogger.info('coinbase.subscription.charge_created', {
    userId: opts.userId,
    plan: opts.plan,
    interval: opts.interval,
    code,
  })

  return { code, hostedUrl }
}
