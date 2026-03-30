import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' })

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json()
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)
    return NextResponse.json({
      ok: true,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
    })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 })
  }
}
