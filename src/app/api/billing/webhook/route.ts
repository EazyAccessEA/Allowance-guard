import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, syncSubscription, upsertInvoice, getUserEmailById } from '@/lib/billing'
import { sendPaymentReceiptEmail, sendPaymentFailedEmail, sendTrialEndingEmail, sendExpiringCardEmail } from '@/lib/invoice-emails'
import { upgradeApiKeyPlan, downgradeApiKeysToFree } from '@/lib/api-keys'
import { alreadyProcessed, markProcessed, auditWebhook } from '@/lib/webhook_guard'
import { withReq } from '@/lib/logger'
import { reportError } from '@/lib/rollbar'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve user_id and email from a Stripe customer ID. */
async function resolveUserFromCustomer(
  custId: string | undefined,
  L: ReturnType<typeof withReq>,
): Promise<{ userId: number; email: string } | null> {
  if (!custId) return null

  const { rows } = await pool.query(
    `SELECT user_id, plan FROM subscriptions WHERE stripe_customer_id = $1 LIMIT 1`,
    [custId],
  )
  const userId = rows[0]?.user_id as number | undefined
  if (!userId) return null

  const email = await getUserEmailById(userId)
  if (!email) {
    L.warn('billing.webhook.user_email_missing', { userId, customerId: custId })
    return null
  }

  return { userId, email }
}

/** Extract customer ID string from Stripe's polymorphic customer field. */
function extractCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | undefined {
  if (!customer) return undefined
  return typeof customer === 'string' ? customer : customer.id
}

/**
 * POST /api/billing/webhook
 *
 * Handles Stripe subscription lifecycle and invoice events:
 * - customer.subscription.created / updated / deleted
 * - customer.subscription.trial_will_end
 * - invoice.finalized
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 * - invoice.voided
 * - invoice.marked_uncollectible
 * - charge.refunded
 * - customer.source.expiring
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

        // Sync API key tier when an API plan subscription changes
        const subPlan = subscription.metadata?.ag_plan ?? ''
        const subUserId = subscription.metadata?.ag_user_id ? parseInt(subscription.metadata.ag_user_id, 10) : null
        if (subUserId && (subPlan === 'api_developer' || subPlan === 'api_growth')) {
          if (subscription.status === 'active') {
            await upgradeApiKeyPlan(subUserId, subPlan)
            L.info('billing.webhook.api_keys_upgraded', { userId: subUserId, plan: subPlan })
          } else if (subscription.status === 'canceled') {
            await downgradeApiKeysToFree(subUserId)
            L.info('billing.webhook.api_keys_downgraded', { userId: subUserId })
          }
        }

        // Track cancellation timestamp for re-engagement emails
        if (event.type === 'customer.subscription.deleted' && subscription.status === 'canceled') {
          await pool.query(
            `UPDATE subscriptions
             SET cancelled_at = NOW(), re_engagement_email_sent = FALSE
             WHERE stripe_subscription_id = $1`,
            [subscription.id],
          )
          L.info('billing.webhook.cancellation_tracked', {
            subscriptionId: subscription.id,
            userId: subscription.metadata?.ag_user_id,
          })
        }

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
      case 'invoice.finalized': {
        const invoice = event.data.object as Stripe.Invoice

        // Persist finalized invoice to local DB
        await upsertInvoice(invoice)

        L.info('billing.webhook.invoice.finalized', {
          invoiceId: invoice.id,
          number: invoice.number,
          amount: invoice.amount_due,
          customerId: invoice.customer,
        })

        await auditWebhook('stripe', 'invoice.finalized', invoice.id ?? null, {
          amount: invoice.amount_due,
          currency: invoice.currency,
          number: invoice.number,
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        // Persist paid invoice to local DB
        await upsertInvoice(invoice)

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

        // Send payment receipt email — skip zero-amount invoices (trials, prorations)
        if ((invoice.amount_paid ?? 0) > 0) {
          try {
            const custId = extractCustomerId(invoice.customer)
            const user = await resolveUserFromCustomer(custId, L)
            if (user) {
              await sendPaymentReceiptEmail(user.email, {
                invoiceNumber: invoice.number ?? invoice.id ?? 'unknown',
                amountPaid: invoice.amount_paid ?? 0,
                currency: invoice.currency ?? 'usd',
                plan: invoice.lines?.data?.[0]?.metadata?.ag_plan ?? null,
                periodEnd: invoice.period_end
                  ? new Date(invoice.period_end * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : null,
                hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
                invoicePdfUrl: invoice.invoice_pdf ?? null,
              })
            }
          } catch (emailErr) {
            L.error('billing.webhook.receipt_email_failed', {
              invoiceId: invoice.id,
              error: emailErr instanceof Error ? emailErr.message : 'Unknown',
            })
          }
        }
        break
      }

      case 'invoice.voided':
      case 'invoice.marked_uncollectible': {
        const invoice = event.data.object as Stripe.Invoice

        // Update invoice status in local DB
        await upsertInvoice(invoice)

        L.info('billing.webhook.invoice.status_change', {
          type: event.type,
          invoiceId: invoice.id,
          status: invoice.status,
          customerId: invoice.customer,
        })

        await auditWebhook('stripe', event.type, invoice.id ?? null, {
          status: invoice.status,
          amount: invoice.amount_due,
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

        // Send trial-ending email notification
        try {
          const uid = subscription.metadata?.ag_user_id ? parseInt(subscription.metadata.ag_user_id, 10) : null
          if (uid) {
            const email = await getUserEmailById(uid)
            if (email) {
              await sendTrialEndingEmail(email, {
                plan: subscription.metadata?.ag_plan ?? 'pro',
                trialEnd: subscription.trial_end
                  ? new Date(subscription.trial_end * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'soon',
              })
            } else {
              L.warn('billing.webhook.user_email_missing', { userId: uid, subscriptionId: subscription.id })
            }
          }
        } catch (emailErr) {
          L.error('billing.webhook.trial_email_failed', {
            subscriptionId: subscription.id,
            error: emailErr instanceof Error ? emailErr.message : 'Unknown',
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Persist failed invoice to local DB
        await upsertInvoice(invoice)

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

        // Send failed payment email — skip zero-amount invoices
        if ((invoice.amount_due ?? 0) > 0) {
          try {
            const custId = extractCustomerId(invoice.customer)
            const user = await resolveUserFromCustomer(custId, L)
            if (user) {
              await sendPaymentFailedEmail(user.email, {
                invoiceNumber: invoice.number ?? invoice.id ?? 'unknown',
                amountDue: invoice.amount_due ?? 0,
                currency: invoice.currency ?? 'usd',
                attemptCount: invoice.attempt_count ?? 1,
                nextAttempt: invoice.next_payment_attempt
                  ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : null,
              })
            }
          } catch (emailErr) {
            L.error('billing.webhook.failed_email_failed', {
              invoiceId: invoice.id,
              error: emailErr instanceof Error ? emailErr.message : 'Unknown',
            })
          }
        }
        break
      }

      // ----- Refunds -----
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const custId = extractCustomerId(charge.customer)

        L.info('billing.webhook.charge.refunded', {
          chargeId: charge.id,
          amountRefunded: charge.amount_refunded,
          currency: charge.currency,
          customerId: custId,
        })

        await auditWebhook('stripe', 'charge.refunded', charge.id, {
          amountRefunded: charge.amount_refunded,
          currency: charge.currency,
          customerId: custId,
        })

        // If there's an associated invoice, update it in our DB
        const chargeInvoice = (charge as unknown as Record<string, unknown>).invoice as string | { id: string } | null | undefined
        if (chargeInvoice) {
          try {
            const invoiceId = typeof chargeInvoice === 'string' ? chargeInvoice : chargeInvoice.id
            const stripeInvoice = await stripe.invoices.retrieve(invoiceId)
            await upsertInvoice(stripeInvoice)
          } catch (refundErr) {
            L.error('billing.webhook.refund_invoice_sync_failed', {
              chargeId: charge.id,
              error: refundErr instanceof Error ? refundErr.message : 'Unknown',
            })
          }
        }
        break
      }

      // ----- Expiring card -----
      case 'customer.source.expiring': {
        const source = event.data.object as Stripe.Card

        const custId = typeof source.customer === 'string' ? source.customer : (source.customer as Stripe.Customer)?.id
        L.info('billing.webhook.card_expiring', {
          cardLast4: source.last4,
          brand: source.brand,
          expMonth: source.exp_month,
          expYear: source.exp_year,
          customerId: custId,
        })

        await auditWebhook('stripe', 'customer.source.expiring', custId ?? null, {
          cardLast4: source.last4,
          brand: source.brand,
          expMonth: source.exp_month,
          expYear: source.exp_year,
        })

        // Send expiring card email
        try {
          if (custId) {
            const { rows: subRows } = await pool.query(
              `SELECT user_id, plan FROM subscriptions WHERE stripe_customer_id = $1 AND status IN ('active','trialing','past_due') LIMIT 1`,
              [custId],
            )
            const uid = subRows[0]?.user_id as number | undefined
            const plan = (subRows[0]?.plan as string) ?? null
            if (uid) {
              const email = await getUserEmailById(uid)
              if (email) {
                await sendExpiringCardEmail(email, {
                  cardBrand: source.brand ?? 'Card',
                  cardLast4: source.last4 ?? '****',
                  expMonth: source.exp_month,
                  expYear: source.exp_year,
                  plan,
                })
              } else {
                L.warn('billing.webhook.user_email_missing', { userId: uid, customerId: custId })
              }
            }
          }
        } catch (emailErr) {
          L.error('billing.webhook.expiring_card_email_failed', {
            customerId: custId,
            error: emailErr instanceof Error ? emailErr.message : 'Unknown',
          })
        }
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
