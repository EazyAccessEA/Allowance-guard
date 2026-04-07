import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { limitHit } from '@/lib/ratelimit'
import { createCryptoSubscriptionCharge, type PaidPlan } from '@/lib/coinbase-billing'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALL_PAID_PLANS = ['pro', 'sentinel', 'api_developer', 'api_growth'] as const

const schema = z.object({
  plan: z.enum(ALL_PAID_PLANS),
  interval: z.enum(['monthly', 'yearly']).default('monthly'),
})

function getIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: Request) {
  try {
    const session = await requireUser()

    const ip = getIp(req)
    const rl = await limitHit(`coinbase-charge:${ip}`, 60, 10)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { plan, interval } = parsed.data

    if ((plan === 'api_developer' || plan === 'api_growth') && interval === 'yearly') {
      return NextResponse.json(
        { error: 'API plans currently support monthly billing only' },
        { status: 400 }
      )
    }

    const { hostedUrl, code } = await createCryptoSubscriptionCharge({
      userId: session.user_id as number,
      email: session.email as string,
      plan: plan as PaidPlan,
      interval,
    })

    return NextResponse.json({ ok: true, checkoutUrl: hostedUrl, code })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    apiLogger.error('billing.crypto_subscription.failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    return NextResponse.json({ error: 'Failed to create crypto charge' }, { status: 500 })
  }
}
