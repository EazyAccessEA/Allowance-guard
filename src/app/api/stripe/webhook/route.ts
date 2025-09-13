import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const runtime = 'nodejs'      // Required for raw body verification (not edge)
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' })

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return new NextResponse('Missing STRIPE_WEBHOOK_SECRET', { status: 500 })
  }

  // Get raw body and signature header
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook signature verification failed:', errorMessage)
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        // Optional: fetch expanded details
        // const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items', 'payment_intent'] })

        // TODO: persist this contribution to your DB (Neon/Drizzle) and/or trigger Slack
        console.log('✅ Contribution received', {
          session_id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          email: session.customer_details?.email,
        })
        break
      }
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    // Acknowledge receipt quickly; Stripe retries on non-2xx
    return NextResponse.json({ received: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook handler failed:', errorMessage)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}
