/**
 * Invoice-related email templates.
 *
 * - sendPaymentReceiptEmail: sent on invoice.payment_succeeded
 * - sendPaymentFailedEmail: sent on invoice.payment_failed
 * - sendTrialEndingEmail: sent on customer.subscription.trial_will_end
 */
import { sendMail } from '@/lib/mailer'
import { getPlanDisplayName } from '@/lib/plans'
import type { ConsumerPlan } from '@/lib/plans'

// ---------------------------------------------------------------------------
// Payment receipt
// ---------------------------------------------------------------------------

export interface PaymentReceiptData {
  invoiceNumber: string
  amountPaid: number // minor units
  currency: string
  plan: string | null
  periodEnd: string | null
  hostedInvoiceUrl: string | null
  invoicePdfUrl: string | null
}

function formatAmount(minorUnits: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minorUnits / 100)
}

export async function sendPaymentReceiptEmail(to: string, data: PaymentReceiptData) {
  const planLabel = data.plan ? getPlanDisplayName(data.plan as ConsumerPlan) : 'AllowanceGuard'

  const content = `
    <div class="success-box">
      <h2 style="margin-top: 0;">Payment Received</h2>
      <p style="margin-bottom: 0;">Your payment for <strong>${planLabel}</strong> has been processed successfully.</p>
    </div>

    <h2>Invoice Details</h2>
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Invoice Number</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Amount Paid</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatAmount(data.amountPaid, data.currency)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Plan</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${planLabel}</td>
        </tr>
        ${data.periodEnd ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Next Billing Date</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.periodEnd}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${data.invoicePdfUrl ? `
    <p style="text-align: center;">
      <a href="${data.invoicePdfUrl}" class="button" style="margin-right: 8px;">Download Invoice PDF</a>
    </p>
    ` : ''}

    ${data.hostedInvoiceUrl ? `
    <p style="text-align: center; font-size: 14px;">
      <a href="${data.hostedInvoiceUrl}" style="color: #3b82f6;">View invoice online</a>
    </p>
    ` : ''}

    <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
      If you have any questions about this charge, please contact us at
      <a href="mailto:support@allowanceguard.com" style="color: #3b82f6;">support@allowanceguard.com</a>.
    </p>
  `

  return sendMail(to, `Payment Receipt — ${data.invoiceNumber}`, content)
}

// ---------------------------------------------------------------------------
// Payment failed
// ---------------------------------------------------------------------------

export interface PaymentFailedData {
  invoiceNumber: string
  amountDue: number // minor units
  currency: string
  attemptCount: number
  nextAttempt: string | null
}

export async function sendPaymentFailedEmail(to: string, data: PaymentFailedData) {
  const content = `
    <div class="alert-box">
      <h2 style="margin-top: 0;">Payment Failed</h2>
      <p style="margin-bottom: 0;">We were unable to process your payment of <strong>${formatAmount(data.amountDue, data.currency)}</strong>.</p>
    </div>

    <h2>What happened?</h2>
    <p>Our payment processor was unable to charge the payment method on file for invoice <strong>${data.invoiceNumber}</strong>.</p>

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Invoice</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Amount Due</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatAmount(data.amountDue, data.currency)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Attempts</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.attemptCount}</td>
        </tr>
        ${data.nextAttempt ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Next Retry</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.nextAttempt}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <h2>What to do</h2>
    <p>Please update your payment method to avoid service interruption. We will retry the payment automatically${data.nextAttempt ? ` on ${data.nextAttempt}` : ''}.</p>

    <p style="text-align: center;">
      <a href="https://www.allowanceguard.com/account/billing" class="button">Update Payment Method</a>
    </p>

    <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
      If your subscription is not renewed, your account will be downgraded to the Free tier.
      If you need assistance, contact us at
      <a href="mailto:support@allowanceguard.com" style="color: #3b82f6;">support@allowanceguard.com</a>.
    </p>
  `

  return sendMail(to, `Action Required: Payment Failed — ${data.invoiceNumber}`, content)
}

// ---------------------------------------------------------------------------
// Trial ending
// ---------------------------------------------------------------------------

export interface TrialEndingData {
  plan: string
  trialEnd: string
}

export async function sendTrialEndingEmail(to: string, data: TrialEndingData) {
  const planLabel = getPlanDisplayName(data.plan as ConsumerPlan)

  const content = `
    <div class="alert-box">
      <h2 style="margin-top: 0;">Your Trial Ends Soon</h2>
      <p style="margin-bottom: 0;">Your <strong>${planLabel}</strong> free trial ends on <strong>${data.trialEnd}</strong>.</p>
    </div>

    <h2>What happens next?</h2>
    <p>After your trial ends, your payment method on file will be charged automatically. You'll continue to enjoy all ${planLabel} features without interruption.</p>

    <h2>Not ready to commit?</h2>
    <p>No worries — you can cancel before your trial ends and keep using the free tier. Your data won't be deleted.</p>

    <p style="text-align: center;">
      <a href="https://www.allowanceguard.com/account/billing" class="button">Manage Subscription</a>
    </p>

    <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
      Questions? Reach out at
      <a href="mailto:support@allowanceguard.com" style="color: #3b82f6;">support@allowanceguard.com</a>.
    </p>
  `

  return sendMail(to, `Your ${planLabel} Trial Ends ${data.trialEnd}`, content)
}
