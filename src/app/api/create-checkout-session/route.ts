// src/app/api/create-checkout-session/route.ts (App Router)
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { limitOrThrow } from '@/src/lib/ratelimit'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(req: Request) {
  try {
    const h = await nextHeaders()
    const ip = h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown'
    await limitOrThrow(ip, 'stripe-checkout')

    const MIN = Number(process.env.DONATION_MIN_MINOR ?? 100)
    const MAX = Number(process.env.DONATION_MAX_MINOR ?? 500000)

    const { amount, email } = await req.json()

    if (!amount || isNaN(amount) || amount < MIN || amount > MAX) {
      return NextResponse.json({ error: `Amount must be between ${(MIN/100).toFixed(2)} and ${(MAX/100).toFixed(2)}` }, { status: 400 })
    }

    const idempotencyKey = crypto.randomUUID()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Contribution to Allowance Guard',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/contribute`,
    }, { idempotencyKey })

    return NextResponse.json({ id: session.id })
  } catch (err) {
    console.error('Stripe Checkout Error:', err)
    if ((err as any).status === 429) {
      return NextResponse.json({ error: (err as Error).message }, { status: 429 })
    }
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
