import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/billing'
import { CONSUMER_PRICES, type ConsumerPlan } from '@/lib/plans'
import { validateRequest } from '@/middleware/validation'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const subscribeSchema = z.object({
  plan: z.enum(['pro', 'sentinel']),
  interval: z.enum(['monthly', 'yearly']).default('monthly'),
})

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
    const prices = CONSUMER_PRICES[plan as Exclude<ConsumerPlan, 'free'>]

    if (!prices) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = interval === 'yearly'
      ? prices.stripePriceIdYearly
      : prices.stripePriceIdMonthly

    if (!priceId) {
      L.error('billing.subscribe.missing_price_id', { plan, interval })
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.allowanceguard.com'

    // Pro tier gets a 7-day free trial
    const trialDays = plan === 'pro' ? 7 : undefined

    const checkoutUrl = await createCheckoutSession({
      userId: session.user_id as number,
      email: session.email as string,
      priceId,
      plan,
      successUrl: `${appUrl}/account/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/pricing`,
      trialDays,
    })

    L.info('billing.subscribe.checkout_created', {
      userId: session.user_id,
      plan,
      interval,
    })

    return NextResponse.json({ ok: true, checkoutUrl })
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
