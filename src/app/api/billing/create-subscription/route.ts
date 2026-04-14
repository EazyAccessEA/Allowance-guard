import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/billing'
import { CONSUMER_PRICES, API_PRICES, type ConsumerPlan, type ApiPlan } from '@/lib/plans'
import { validateRequest } from '@/middleware/validation'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
    const session = await requireUser()

    const validation = await validateRequest(subscribeSchema)(req as NextRequest)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400 },
      )
    }

    const { plan, interval } = validation.data!

    let priceId: string

    if (isApiPlan(plan)) {
      // API plans only support monthly billing currently
      const apiPrices = API_PRICES[plan as Exclude<ApiPlan, 'api_free' | 'api_enterprise' | 'api_public'>]
      if (!apiPrices) {
        return NextResponse.json({ error: 'Invalid API plan' }, { status: 400 })
      }
      if (interval === 'yearly') {
        return NextResponse.json(
          { error: 'API plans currently support monthly billing only' },
          { status: 400 },
        )
      }
      priceId = apiPrices.stripePriceIdMonthly
    } else {
      // Consumer plans support monthly and yearly
      const consumerPrices = CONSUMER_PRICES[plan as Exclude<ConsumerPlan, 'free'>]
      if (!consumerPrices) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }
      priceId = interval === 'yearly'
        ? consumerPrices.stripePriceIdYearly
        : consumerPrices.stripePriceIdMonthly
    }

    if (!priceId) {
      L.error('billing.subscribe.missing_price_id', { plan, interval })
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 })
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

    return NextResponse.json({ ok: true, url: checkoutUrl })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('billing.subscribe.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
