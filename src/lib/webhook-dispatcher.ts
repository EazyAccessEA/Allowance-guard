/**
 * Webhook Dispatcher
 *
 * Dispatches event payloads to registered webhooks with HMAC signing,
 * retry logic, and delivery logging.
 */
import { createHmac, randomUUID } from 'crypto'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'

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

    const res = await fetch(webhook.url, {
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
    await pool.query(
      `UPDATE webhooks SET enabled = FALSE WHERE id = $1 AND failure_count >= $2`,
      [webhookId, MAX_FAILURE_COUNT],
    )
  }
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

  const matching = (webhooks as RegisteredWebhook[]).filter(
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

  const matching = (webhooks as RegisteredWebhook[]).filter(
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
