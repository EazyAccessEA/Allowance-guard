import nodemailer from 'nodemailer'
import { emailLogger } from './logger'
import { incrEmail } from '@/lib/metrics'
import { createEmailHTML, type EmailKind } from './email-templates'

// Email provider configuration. Resend (HTTP API) is preferred. Postmark
// and Microsoft SMTP remain as fallbacks. In production, refusing the
// log-only transport is a safety guarantee — see getTransport().
const postmarkToken = process.env.POSTMARK_SERVER_TOKEN
const host = process.env.SMTP_HOST || 'smtp-mail.outlook.com'
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const fromEmail = process.env.ALERTS_FROM_EMAIL || 'no_reply@allowanceguard.com'
const fromName = process.env.ALERTS_FROM_NAME || 'Allowance Guard'

export type { EmailKind } from './email-templates'
export { createEmailHTML } from './email-templates'

export function getTransport() {
  if (postmarkToken) {
    emailLogger.info('Using Postmark email service')
    return nodemailer.createTransport({
      service: 'postmark',
      auth: { user: postmarkToken, pass: postmarkToken },
    }) as nodemailer.Transporter
  }

  if (!host || !user || !pass) {
    if (process.env.NODE_ENV === 'production') {
      emailLogger.error(
        'No email provider configured (RESEND_API_KEY, POSTMARK_SERVER_TOKEN, or SMTP creds required in production)',
      )
      throw new Error('Email service not configured')
    }
    emailLogger.warn('SMTP configuration missing, using log-only transport (dev fallback)')
    return nodemailer.createTransport({ jsonTransport: true }) as nodemailer.Transporter
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  }) as nodemailer.Transporter
}

export interface SendMailOptions {
  /**
   * Visual + footer kind. Defaults to 'operational' — the safest neutral
   * choice for any caller that doesn't explicitly think about kind. New
   * callers should pass an explicit kind.
   */
  kind?: EmailKind
}

export async function sendMail(
  to: string,
  subject: string,
  html: string,
  text?: string,
  options: SendMailOptions = {},
) {
  const kind = options.kind ?? 'operational'

  // E2E fake email mode — short-circuits before any provider call.
  if (process.env.E2E_FAKE_EMAIL === '1' || process.env.E2E_FAKE_EMAIL === 'true') {
    console.log('[E2E_FAKE_EMAIL]', { to, subject, kind })
    return { ok: true, id: 'fake' }
  }

  // Preferred provider: Resend (HTTP API).
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const fullHTML = createEmailHTML(html, to, kind)
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [to],
          subject,
          html: fullHTML,
          text: text || fullHTML.replace(/<[^>]*>/g, ''),
        }),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        emailLogger.error('Resend send failed', {
          status: res.status,
          body: errText.slice(0, 500),
          kind,
          to,
          subject,
        })
        throw new Error(`Resend send failed: ${res.status}`)
      }
      const data = (await res.json()) as { id?: string }
      emailLogger.info('Email sent (resend)', { messageId: data.id, kind, to, subject, from: fromEmail })
      await incrEmail()
      return { messageId: data.id ?? '', accepted: [to] }
    } catch (error) {
      emailLogger.error('Resend send error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        kind,
        to,
        subject,
      })
      throw error
    }
  }

  const transporter = getTransport()

  try {
    await transporter.verify()

    const fullHTML = createEmailHTML(html, to, kind)

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html: fullHTML,
      text: text || fullHTML.replace(/<[^>]*>/g, ''),
    })

    emailLogger.info('Email sent', {
      messageId: info.messageId,
      kind,
      to,
      subject,
      from: fromEmail,
    })

    await incrEmail()

    return info
  } catch (error) {
    emailLogger.error('Email send failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      kind,
      to,
      subject,
      from: fromEmail,
    })
    throw error
  }
}

// ---------------------------------------------------------------------------
// Helper functions per email type. Each passes an explicit `kind`.
// ---------------------------------------------------------------------------

/** Generic alert wrapper. Used by `alertEmail` in `ops_alert.ts`. */
export async function sendAlertEmail(to: string, subject: string, content: string) {
  return sendMail(to, subject, content, undefined, { kind: 'alert' })
}

/**
 * Risk-approval alert. Sent when a wallet has a high-risk approval that
 * warrants user attention. Subject is plain text per VOICE.md (no emoji).
 */
export async function sendRiskAlert(
  to: string,
  walletAddress: string,
  riskData: { token?: string; spender?: string; amount?: string; riskLevel?: string },
) {
  const content = `
    <div class="alert-box">
      <h2 style="margin-top: 0;">High-risk approval detected</h2>
      <p style="margin-bottom: 0;">A token approval on your wallet warrants immediate attention.</p>
    </div>

    <h2>Wallet</h2>
    <span class="address">${walletAddress}</span>

    <h2>Risk details</h2>
    <ul>
      <li><strong>Token:</strong> ${riskData.token || 'Unknown'}</li>
      <li><strong>Spender:</strong> <span class="address" style="display:inline;padding:2px 6px;">${riskData.spender || 'Unknown'}</span></li>
      <li><strong>Amount:</strong> ${riskData.amount || 'Unlimited'}</li>
      <li><strong>Risk level:</strong> ${riskData.riskLevel || 'High'}</li>
    </ul>

    <p><a href="https://allowanceguard.com/revoke" class="button button-danger">Revoke this approval</a></p>

    <p><strong>Recommended action.</strong> Review this approval and revoke it if you don't recognise the spender or the amount looks excessive.</p>
  `

  return sendMail(to, 'Risk detected on your wallet', content, undefined, { kind: 'alert' })
}

/**
 * Failed-payment notification. Operational, not marketing — the user has
 * an active subscription and needs to act on it.
 */
export async function sendFailedPaymentEmail(to: string, plan: string, attemptCount: number) {
  const planLabel = plan.includes('sentinel')
    ? 'Sentinel'
    : plan.includes('growth')
      ? 'API Growth'
      : plan.includes('developer')
        ? 'API Developer'
        : 'Pro'

  const isLastAttempt = attemptCount >= 3

  const content = `
    <div class="alert-box">
      <h2 style="margin-top: 0;">Payment failed</h2>
      <p style="margin-bottom: 0;">We were unable to process your payment for <strong>${planLabel}</strong>.</p>
    </div>

    ${
      isLastAttempt
        ? `<p><strong>This was our final attempt.</strong> Your subscription will be cancelled unless you update your payment method now.</p>`
        : `<p>We'll try again in a few days. Update your payment method now to avoid any interruption.</p>`
    }

    <p><a href="https://allowanceguard.com/account/billing" class="button">Update payment method</a></p>
  `

  return sendMail(
    to,
    isLastAttempt
      ? 'Action required: payment failed — subscription at risk'
      : 'Payment failed — please update your payment method',
    content,
    undefined,
    { kind: 'operational' },
  )
}

/**
 * Re-engagement email for cancelled customers (sent ~7 days after
 * cancellation by the email/cron job). Marketing tone.
 */
export async function sendReEngagementEmail(to: string, plan: string) {
  const planLabel = plan.includes('sentinel') ? 'Sentinel' : 'Pro'

  const content = `
    <h1>We miss you.</h1>
    <p>You recently cancelled your <strong>${planLabel}</strong> subscription. We wanted to check in.</p>

    <div class="alert-box">
      <h3>Here's what you're missing</h3>
      <ul style="margin-bottom: 0;">
        ${
          planLabel === 'Sentinel'
            ? `<li>Monitoring up to 50 wallets across 27 chains</li>
        <li>Automated revocation rules protecting your assets 24/7</li>
        <li>Team dashboard with role-based access</li>
        <li>Compliance-ready audit logs</li>
        <li>Webhook integrations and priority support</li>`
            : `<li>Unlimited wallet scanning across all 27 chains</li>
        <li>Twice-daily monitoring with risk alerts</li>
        <li>Batch revoke (multiple approvals from one click)</li>
        <li>Historical risk timeline for your approvals</li>
        <li>Export audit reports (PDF / CSV)</li>`
        }
      </ul>
    </div>

    <div class="success-box">
      <h3>Come back and save 20%</h3>
      <p style="margin-bottom: 0;">Use code <strong>COMEBACK20</strong> at checkout for 20% off your next 3 months.</p>
    </div>

    <p><a href="https://allowanceguard.com/pricing?reactivate=true&amp;code=COMEBACK20" class="button">Reactivate ${planLabel}</a></p>

    <p>Your free account is still active — you can keep scanning up to 3 wallets at any time. If you have feedback on what we could improve, we'd genuinely love to hear it at <a href="mailto:support@allowanceguard.com">support@allowanceguard.com</a>.</p>
  `

  return sendMail(to, `Come back to AllowanceGuard ${planLabel}`, content, undefined, {
    kind: 'marketing',
  })
}

/**
 * Waitlist welcome — sent immediately on subscribe (and re-subscribe).
 */
export async function sendWaitlistWelcomeEmail(to: string, interest: string, _unsubId: string) {
  const interestLabels: Record<string, string> = {
    general: 'AllowanceGuard updates',
    mobile: 'the mobile app',
    sdk: 'the developer SDK',
    api: 'the B2B API',
    chains: 'new chain support',
  }
  const interestLabel = interestLabels[interest] || 'AllowanceGuard updates'

  const content = `
    <h1>You're on the list.</h1>

    <p>Thanks for signing up — we'll keep you posted on <strong>${interestLabel}</strong>.</p>

    <div class="success-box">
      <h3>What to expect</h3>
      <ul style="margin-bottom:0;">
        <li>Early access when we launch new features</li>
        <li>Occasional updates — never spam</li>
        <li>A heads-up before public announcements</li>
      </ul>
    </div>
  `

  return sendMail(
    to,
    `You're on the AllowanceGuard waitlist — ${interestLabel}`,
    content,
    undefined,
    { kind: 'marketing' },
  )
}

/** Diagnostic helper retained for the SMTP test endpoint. */
export async function testSMTPConnection() {
  try {
    const transporter = getTransport()
    await transporter.verify()
    emailLogger.info('SMTP connection successful')
    return true
  } catch (error) {
    emailLogger.error('SMTP connection failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return false
  }
}
