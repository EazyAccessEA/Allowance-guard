/**
 * Webhook Dispatcher
 *
 * Dispatches event payloads to registered webhooks with HMAC signing,
 * retry logic, and delivery logging.
 */
import { createHmac, randomUUID } from 'crypto'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'
import { sendMail } from '@/lib/mailer'
import { safeFetch } from '@/lib/safe-fetch'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WebhookEventType =
  | 'approval.new'
  | 'approval.changed'
  | 'approval.removed'
  | 'risk.increased'
  | 'risk.decreased'
  | 'scan.completed'
  | 'rule.triggered'
  | 'rule.executed'
  | 'monitor.alert'
  | 'team.wallet_added'
  | 'team.wallet_removed'
  | 'team.member_added'
  | 'team.member_removed'

export interface WebhookPayload {
  id: string
  event: WebhookEventType
  timestamp: string
  data: Record<string, unknown>
}

interface RegisteredWebhook {
  id: string
  url: string
  secret: string
  events: WebhookEventType[]
  enabled: boolean
  failure_count: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 5000, 15000] // ms
const TIMEOUT_MS = 10_000
const MAX_FAILURE_COUNT = 10 // disable webhook after this many consecutive failures

// ---------------------------------------------------------------------------
// HMAC signing
// ---------------------------------------------------------------------------

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

// ---------------------------------------------------------------------------
// Dispatch to a single webhook
// ---------------------------------------------------------------------------

async function deliverToWebhook(
  webhook: RegisteredWebhook,
  payload: WebhookPayload,
): Promise<{ success: boolean; statusCode?: number; responseBody?: string }> {
  const body = JSON.stringify(payload)
  const signature = signPayload(body, webhook.secret)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    // SSRF-safe delivery: safeFetch pre-resolves DNS and rejects if
    // the hostname resolves to a private/loopback/metadata address.
    // Also disables redirect-following — a 30x response is returned
    // to the caller (counted as failure below) instead of being
    // followed into a potentially private target.
    const result = await safeFetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AllowanceGuard-Signature': `sha256=${signature}`,
        'X-AllowanceGuard-Event': payload.event,
        'X-AllowanceGuard-Delivery': payload.id,
      },
      body,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!result.ok) {
      // SSRF guard rejection — log and treat as delivery failure.
      // The customer's webhook should never resolve to a private
      // address; if it does, either a misconfiguration or an attempt
      // at SSRF.
      secureLogger.warn('webhook.delivery.ssrf_reject', {
        webhookId: webhook.id,
        url: webhook.url,
        reason: result.reason,
        resolved: result.resolved,
      })
      return { success: false, responseBody: `SSRF guard: ${result.reason}` }
    }

    const res = result.response
    const responseBody = await res.text().catch(() => '')
    const success = res.status >= 200 && res.status < 300

    return { success, statusCode: res.status, responseBody: responseBody.slice(0, 1000) }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, responseBody: message }
  }
}

// ---------------------------------------------------------------------------
// Log delivery attempt
// ---------------------------------------------------------------------------

async function logDelivery(
  webhookId: string,
  eventType: string,
  payload: WebhookPayload,
  result: { success: boolean; statusCode?: number; responseBody?: string },
  attempt: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status_code, response_body, success, attempt)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [webhookId, eventType, JSON.stringify(payload), result.statusCode ?? null, result.responseBody ?? null, result.success, attempt],
  ).catch((err) => secureLogger.error('Failed to log webhook delivery', { err }))
}

// ---------------------------------------------------------------------------
// Update webhook failure state
// ---------------------------------------------------------------------------

async function updateWebhookState(webhookId: string, success: boolean): Promise<void> {
  if (success) {
    await pool.query(
      `UPDATE webhooks SET failure_count = 0, last_triggered_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [webhookId],
    )
  } else {
    await pool.query(
      `UPDATE webhooks SET failure_count = failure_count + 1, updated_at = NOW() WHERE id = $1`,
      [webhookId],
    )
    // Auto-disable after too many consecutive failures
    const { rowCount } = await pool.query(
      `UPDATE webhooks SET enabled = FALSE WHERE id = $1 AND failure_count >= $2 AND enabled = TRUE RETURNING id`,
      [webhookId, MAX_FAILURE_COUNT],
    )

    // Send email notification when a webhook is auto-disabled
    if (rowCount && rowCount > 0) {
      notifyWebhookDisabled(webhookId).catch((err) =>
        secureLogger.error('Failed to send webhook disable notification', { webhookId, err }),
      )
    }
  }
}

// ---------------------------------------------------------------------------
// Webhook disabled email notification
// ---------------------------------------------------------------------------

async function notifyWebhookDisabled(webhookId: string): Promise<void> {
  // Look up the webhook details and owner email
  const { rows } = await pool.query(
    `SELECT w.name, w.url, w.failure_count, u.email
     FROM webhooks w
     JOIN users u ON u.id = w.user_id
     WHERE w.id = $1`,
    [webhookId],
  )

  const webhook = rows[0] as { name: string; url: string; failure_count: number; email: string } | undefined
  if (!webhook?.email) return

  const webhookName = webhook.name || 'Unnamed webhook'
  const maskedUrl = webhook.url.length > 60
    ? webhook.url.slice(0, 50) + '...' + webhook.url.slice(-10)
    : webhook.url

  const subject = `Webhook "${webhookName}" has been auto-disabled`
  const html = `
    <h2 style="color: #0F172A; margin: 0 0 16px 0;">Webhook Auto-Disabled</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Your webhook <strong>${webhookName}</strong> has been automatically disabled
      after <strong>${webhook.failure_count}</strong> consecutive delivery failures.
    </p>

    <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
      <p style="margin: 0; color: #991B1B; font-size: 13px;">
        <strong>Endpoint:</strong> ${maskedUrl}
      </p>
    </div>

    <h3 style="color: #0F172A; margin: 20px 0 8px 0; font-size: 14px;">What happened?</h3>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      We tried to deliver events to your webhook endpoint, but it returned errors
      or was unreachable ${webhook.failure_count} times in a row. To prevent further
      failed deliveries, we automatically paused it.
    </p>

    <h3 style="color: #0F172A; margin: 20px 0 8px 0; font-size: 14px;">How to fix it</h3>
    <ol style="color: #475569; font-size: 14px; line-height: 1.8; padding-left: 20px;">
      <li>Check that your endpoint is online and accepting POST requests</li>
      <li>Verify it returns a 2xx status code on success</li>
      <li>Go to <strong>Settings &rarr; Webhooks</strong> in your AllowanceGuard dashboard</li>
      <li>Re-enable the webhook once the issue is resolved</li>
    </ol>

    <div style="margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/settings"
         style="display: inline-block; background: #00C2B3; color: #ffffff; padding: 10px 24px;
                border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Go to Webhook Settings
      </a>
    </div>
  `

  await sendMail(webhook.email, subject, html, undefined, { kind: 'alert' })
  secureLogger.info('Webhook disable notification sent', { webhookId, to: webhook.email })
}

// ---------------------------------------------------------------------------
// Dispatch with retries
// ---------------------------------------------------------------------------

async function dispatchWithRetry(
  webhook: RegisteredWebhook,
  payload: WebhookPayload,
): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await deliverToWebhook(webhook, payload)
    await logDelivery(webhook.id, payload.event, payload, result, attempt)

    if (result.success) {
      await updateWebhookState(webhook.id, true)
      return
    }

    // Wait before retry (except on last attempt)
    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt - 1]))
    }
  }

  // All retries failed
  await updateWebhookState(webhook.id, false)
  secureLogger.warn('Webhook delivery failed after retries', {
    webhookId: webhook.id,
    event: payload.event,
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Dispatch an event to all matching webhooks for a given user.
 */
export async function dispatchWebhookEvent(
  userId: number,
  event: WebhookEventType,
  data: Record<string, unknown>,
): Promise<void> {
  const { rows: webhooks } = await pool.query(
    `SELECT id, url, secret, events, enabled, failure_count
     FROM webhooks
     WHERE user_id = $1 AND enabled = TRUE`,
    [userId],
  )

  const payload: WebhookPayload = {
    id: randomUUID(),
    event,
    timestamp: new Date().toISOString(),
    data,
  }

  const matching = (webhooks as unknown as RegisteredWebhook[]).filter(
    (w) => {
      const events = Array.isArray(w.events) ? w.events : []
      return events.length === 0 || events.includes(event)
    },
  )

  // Dispatch in parallel (fire-and-forget per webhook)
  await Promise.allSettled(
    matching.map((w) => dispatchWithRetry(w, payload)),
  )
}

/**
 * Dispatch an event to all matching webhooks for a team.
 */
export async function dispatchTeamWebhookEvent(
  teamId: number,
  event: WebhookEventType,
  data: Record<string, unknown>,
): Promise<void> {
  const { rows: webhooks } = await pool.query(
    `SELECT id, url, secret, events, enabled, failure_count
     FROM webhooks
     WHERE team_id = $1 AND enabled = TRUE`,
    [teamId],
  )

  const payload: WebhookPayload = {
    id: randomUUID(),
    event,
    timestamp: new Date().toISOString(),
    data,
  }

  const matching = (webhooks as unknown as RegisteredWebhook[]).filter(
    (w) => {
      const events = Array.isArray(w.events) ? w.events : []
      return events.length === 0 || events.includes(event)
    },
  )

  await Promise.allSettled(
    matching.map((w) => dispatchWithRetry(w, payload)),
  )
}

/**
 * Get recent delivery logs for a webhook.
 */
export async function getWebhookDeliveries(
  webhookId: string,
  limit = 25,
  offset = 0,
): Promise<{ deliveries: Record<string, unknown>[]; total: number }> {
  const [{ rows: deliveries }, { rows: countRows }] = await Promise.all([
    pool.query(
      `SELECT id, event_type, status_code, success, attempt, created_at
       FROM webhook_deliveries
       WHERE webhook_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [webhookId, limit, offset],
    ),
    pool.query(
      `SELECT COUNT(*)::int AS count FROM webhook_deliveries WHERE webhook_id = $1`,
      [webhookId],
    ),
  ])

  return {
    deliveries,
    total: (countRows[0]?.count as number) ?? 0,
  }
}
