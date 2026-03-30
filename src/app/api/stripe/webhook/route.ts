import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/db'
import { sql } from 'drizzle-orm'            // keep this 'sql' from drizzle-orm
import { notifySlackDonation } from '@/lib/notify'
import { alreadyProcessed, markProcessed, auditWebhook } from '@/lib/webhook_guard'
import { reportError } from '@/lib/rollbar'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' })

export async function POST(req: Request) {
  const L = withReq(req)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return new NextResponse('Missing STRIPE_WEBHOOK_SECRET', { status: 500 })

  const rawBody = await req.text()
  const sig = (await headers()).get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    L.error('stripe.webhook.signature_failed', { error: errorMessage })
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  try {
    // Check for replay attacks
    if (await alreadyProcessed('stripe', event.id)) {
      return NextResponse.json({ ok: true, replay: true })
    }

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
      await auditWebhook('stripe', 'checkout.session.completed', session.id, { amount, currency, email })
      console.log('✅ Donation recorded:', { session_id: session.id, event_id: event.id, amount, currency, email })
    } else {
      console.log(`ℹ️ Unhandled event: ${event.type}`)
    }

    // Mark event as processed
    await markProcessed('stripe', event.id)
    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    reportError(err instanceof Error ? err : new Error(String(err)), { eventId: event?.id })
    L.error('stripe.webhook.exception', { error: errorMessage })
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}