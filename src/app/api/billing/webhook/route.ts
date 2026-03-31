import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, syncSubscription } from '@/lib/billing'
import { alreadyProcessed, markProcessed, auditWebhook } from '@/lib/webhook_guard'
import { withReq } from '@/lib/logger'
import { reportError } from '@/lib/rollbar'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/billing/webhook
 *
 * Handles Stripe subscription lifecycle events:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */
export async function POST(req: Request) {
  const L = withReq(req)

  const webhookSecret = process.env.STRIPE_BILLING_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    L.error('billing.webhook.no_secret')
    return new NextResponse('Webhook secret not configured', { status: 500 })
  }

  // Read raw body for signature verification
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    L.warn('billing.webhook.missing_signature')
    return new NextResponse('Missing stripe-signature header', { status: 400 })
  }

  // Verify webhook signature
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    L.error('billing.webhook.signature_failed', { error: msg })
    return new NextResponse(`Webhook signature verification failed: ${msg}`, { status: 400 })
  }

  // Idempotency: skip already-processed events
  if (await alreadyProcessed('stripe', event.id)) {
    L.info('billing.webhook.replay', { eventId: event.id })
    return NextResponse.json({ ok: true, replay: true })
  }

  try {
    switch (event.type) {
      // ----- Subscription lifecycle -----
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Map Stripe statuses to our internal statuses
        await syncSubscription(subscription)

        await auditWebhook('stripe', event.type, subscription.id, {
          plan: subscription.metadata?.ag_plan,
          status: subscription.status,
          userId: subscription.metadata?.ag_user_id,
        })

        L.info('billing.webhook.subscription', {
          type: event.type,
          subscriptionId: subscription.id,
          status: subscription.status,
          plan: subscription.metadata?.ag_plan,
        })
        break
      }

      // ----- Invoice events -----
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        L.info('billing.webhook.invoice.paid', {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          customerId: invoice.customer,
        })

        await auditWebhook('stripe', 'invoice.payment_succeeded', invoice.id ?? null, {
          amount: invoice.amount_paid,
          currency: invoice.currency,
        })
        break
      }

      // ----- Trial ending soon -----
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription

        L.info('billing.webhook.trial_ending', {
          subscriptionId: subscription.id,
          trialEnd: subscription.trial_end,
          userId: subscription.metadata?.ag_user_id,
        })

        await auditWebhook('stripe', 'trial_will_end', subscription.id, {
          trialEnd: subscription.trial_end,
          userId: subscription.metadata?.ag_user_id,
          plan: subscription.metadata?.ag_plan,
        })

        // TODO: Send trial-ending email notification to user
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        L.warn('billing.webhook.invoice.failed', {
          invoiceId: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
          customerId: invoice.customer,
        })

        await auditWebhook('stripe', 'invoice.payment_failed', invoice.id ?? null, {
          amount: invoice.amount_due,
          currency: invoice.currency,
          attemptCount: invoice.attempt_count,
        })

        // TODO: Send failed payment email notification to user
        break
      }

      default:
        L.info('billing.webhook.unhandled', { type: event.type })
    }

    await markProcessed('stripe', event.id)
    return NextResponse.json({ received: true })
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), {
      eventId: event.id,
      eventType: event.type,
    })
    L.error('billing.webhook.handler_failed', {
      eventId: event.id,
      eventType: event.type,
      error: err instanceof Error ? err.message : 'Unknown error',
    })
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}
