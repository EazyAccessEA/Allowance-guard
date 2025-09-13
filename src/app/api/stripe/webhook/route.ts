import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/db'
import { sql } from 'drizzle-orm'            // keep this 'sql' from drizzle-orm
import { notifySlackDonation } from '@/lib/notify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' })

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return new NextResponse('Missing STRIPE_WEBHOOK_SECRET', { status: 500 })

  const rawBody = await req.text()
  const sig = (await headers()).get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook signature verification failed:', errorMessage)
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status !== 'paid') {
        console.log('ℹ️ Session not paid; ignoring.', session.id)
        return NextResponse.json({ received: true })
      }

      const amount   = session.amount_total ?? 0
      const currency = session.currency ?? 'gbp'
      const email    = session.customer_details?.email ?? null
      const name     = session.customer_details?.name ?? null

      // Idempotent upsert (insert once; ignore duplicates)
      await db.execute(sql`
        INSERT INTO donations (
          stripe_session_id, stripe_event_id, amount_total, currency, email, payer_name, payment_status, metadata
        ) VALUES (
          ${session.id}, ${event.id}, ${amount}, ${currency}, ${email}, ${name}, ${session.payment_status}, ${JSON.stringify(session.metadata ?? {})}
        )
        ON CONFLICT (stripe_session_id) DO NOTHING
      `)

      await notifySlackDonation({ amount, currency, email, sessionId: session.id })
      console.log('✅ Donation recorded:', { session_id: session.id, event_id: event.id, amount, currency, email })
    } else {
      console.log(`ℹ️ Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook handler failed:', errorMessage)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}