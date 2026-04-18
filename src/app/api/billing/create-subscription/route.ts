import { NextResponse, type NextRequest } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/billing'
import { CONSUMER_PRICES, API_PRICES, type ConsumerPlan, type ApiPlan } from '@/lib/plans'
import { validateRequest } from '@/middleware/validation'
import { limitOrThrow } from '@/lib/ratelimit'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Error responses must never be cached by any intermediary. Next.js's
// default on error responses has been observed as `public, must-revalidate`,
// which lets service workers and CDNs cache a 401 and lock users out of
// the upgrade flow. Explicit no-store on every error path.
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
} as const

const ALL_PAID_PLANS = ['pro', 'sentinel', 'api_developer', 'api_growth'] as const

const subscribeSchema = z.object({
  plan: z.enum(ALL_PAID_PLANS),
  interval: z.enum(['monthly', 'yearly']).default('monthly'),
})

function isApiPlan(plan: string): plan is 'api_developer' | 'api_growth' {
  return plan === 'api_developer' || plan === 'api_growth'
}

export async function POST(req: Request) {
  const L = withReq(req)

  try {
    // Rate-limit per IP — 'stripe-checkout' = 10 requests per 60s
    // (defined in lib/ratelimit.ts RATE_LIMITS). Auth-gated below, but
    // an authenticated user could still hammer this endpoint without
    // a per-IP limit. Cheap defence; existing config was wired but
    // the call site was missing.
    const h = await nextHeaders()
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
    try {
      await limitOrThrow(ip, 'stripe-checkout')
    } catch {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please wait a moment and try again.' },
        { status: 429, headers: NO_STORE_HEADERS },
      )
    }

    const session = await requireUser()

    const validation = await validateRequest(subscribeSchema)(req as NextRequest)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const { plan, interval } = validation.data!

    let priceId: string

    if (isApiPlan(plan)) {
      const apiPrices = API_PRICES[plan as Exclude<ApiPlan, 'api_free' | 'api_enterprise' | 'api_public'>]
      if (!apiPrices) {
        return NextResponse.json({ error: 'Invalid API plan' }, { status: 400, headers: NO_STORE_HEADERS })
      }
      priceId = interval === 'yearly'
        ? apiPrices.stripePriceIdYearly
        : apiPrices.stripePriceIdMonthly
    } else {
      const consumerPrices = CONSUMER_PRICES[plan as Exclude<ConsumerPlan, 'free'>]
      if (!consumerPrices) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400, headers: NO_STORE_HEADERS })
      }
      priceId = interval === 'yearly'
        ? consumerPrices.stripePriceIdYearly
        : consumerPrices.stripePriceIdMonthly
    }

    if (!priceId) {
      // The Stripe price env var for this plan + interval combination
      // isn't set in production. Log loud (operator needs to know) and
      // return a user-friendly message — checkout was initiated but the
      // backend can't complete it.
      L.error('billing.subscribe.missing_price_id', {
        plan,
        interval,
        envVarHint: isApiPlan(plan)
          ? interval === 'yearly'
            ? `STRIPE_PRICE_${plan.toUpperCase()}_YEARLY`
            : `STRIPE_PRICE_${plan.toUpperCase()}`
          : interval === 'yearly'
            ? `STRIPE_PRICE_${plan.toUpperCase()}_YEARLY`
            : `STRIPE_PRICE_${plan.toUpperCase()}_MONTHLY`,
      })
      return NextResponse.json(
        { error: 'This plan is temporarily unavailable. Please try again in a few minutes or contact support@allowanceguard.com.' },
        { status: 503, headers: NO_STORE_HEADERS },
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.allowanceguard.com'

    // No hardcoded trials. If a trial is desired, configure it on the price
    // in the Stripe Dashboard and disclose it on the pricing page.
    const checkoutUrl = await createCheckoutSession({
      userId: session.user_id as number,
      email: session.email as string,
      priceId,
      plan,
      successUrl: `${appUrl}/account/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/pricing`,
    })

    L.info('billing.subscribe.checkout_created', {
      userId: session.user_id,
      plan,
      interval,
    })

    return NextResponse.json({ ok: true, url: checkoutUrl }, { headers: NO_STORE_HEADERS })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: NO_STORE_HEADERS },
      )
    }
    L.error('billing.subscribe.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
