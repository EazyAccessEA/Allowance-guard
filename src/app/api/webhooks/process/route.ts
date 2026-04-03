/**
 * Cron endpoint for webhook delivery retry processing.
 *
 * Retries failed webhook deliveries that haven't exhausted their retry budget.
 * Called every 5 minutes via cron-job.org.
 */
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'
import { createHmac, randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 60

const TIMEOUT_MS = 10_000
const MAX_RETRIES = 3
const MAX_FAILURE_COUNT = 10

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export async function GET(req: NextRequest) {
  return handleProcess(req)
}

export async function POST(req: NextRequest) {
  return handleProcess(req)
}

async function handleProcess(_req: NextRequest) {
  const startTime = Date.now()
  let retried = 0
  let succeeded = 0
  let failed = 0

  try {
    // Find failed deliveries from the last 24 hours that haven't exceeded max retries
    const { rows: failedDeliveries } = await pool.query(
      `SELECT DISTINCT ON (wd.webhook_id, wd.event_type, wd.payload)
              wd.id, wd.webhook_id, wd.event_type, wd.payload, wd.attempt,
              w.url, w.secret, w.enabled, w.failure_count
       FROM webhook_deliveries wd
       JOIN webhooks w ON w.id = wd.webhook_id
       WHERE wd.success = FALSE
         AND wd.attempt < $1
         AND wd.created_at > NOW() - INTERVAL '24 hours'
         AND w.enabled = TRUE
         AND w.failure_count < $2
         AND NOT EXISTS (
           SELECT 1 FROM webhook_deliveries wd2
           WHERE wd2.webhook_id = wd.webhook_id
             AND wd2.event_type = wd.event_type
             AND wd2.payload = wd.payload
             AND wd2.success = TRUE
         )
       ORDER BY wd.webhook_id, wd.event_type, wd.payload, wd.attempt DESC
       LIMIT 50`,
      [MAX_RETRIES, MAX_FAILURE_COUNT],
    )

    for (const delivery of failedDeliveries) {
      retried++
      const nextAttempt = (delivery.attempt as number) + 1
      const body = JSON.stringify(delivery.payload)
      const signature = signPayload(body, delivery.secret as string)

      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

        const res = await fetch(delivery.url as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AllowanceGuard-Signature': `sha256=${signature}`,
            'X-AllowanceGuard-Event': delivery.event_type as string,
            'X-AllowanceGuard-Delivery': randomUUID(),
          },
          body,
          signal: controller.signal,
        })

        clearTimeout(timeout)

        const responseBody = await res.text().catch(() => '')
        const success = res.status >= 200 && res.status < 300

        // Log retry attempt
        await pool.query(
          `INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status_code, response_body, success, attempt)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [delivery.webhook_id, delivery.event_type, JSON.stringify(delivery.payload), res.status, responseBody.slice(0, 1000), success, nextAttempt],
        )

        if (success) {
          succeeded++
          await pool.query(
            `UPDATE webhooks SET failure_count = 0, last_triggered_at = NOW(), updated_at = NOW() WHERE id = $1`,
            [delivery.webhook_id],
          )
        } else {
          failed++
          await pool.query(
            `UPDATE webhooks SET failure_count = failure_count + 1, updated_at = NOW() WHERE id = $1`,
            [delivery.webhook_id],
          )
        }
      } catch (err) {
        failed++
        const message = err instanceof Error ? err.message : 'Unknown error'
        await pool.query(
          `INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status_code, response_body, success, attempt)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [delivery.webhook_id, delivery.event_type, JSON.stringify(delivery.payload), null, message, false, nextAttempt],
        ).catch(() => {})
      }
    }

    const durationMs = Date.now() - startTime
    secureLogger.info('Webhook process cron completed', { retried, succeeded, failed, durationMs })

    return NextResponse.json({
      ok: true,
      retried,
      succeeded,
      failed,
      durationMs,
    })
  } catch (err) {
    secureLogger.error('Webhook process cron failed', { err })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
