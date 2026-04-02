import { pool } from '@/lib/db'

/**
 * Valid analytics event names for funnel tracking.
 */
export type AnalyticsEvent =
  | 'wallet_connected'
  | 'scan_started'
  | 'scan_completed'
  | 'revoke_initiated'
  | 'revoke_completed'
  | 'upgrade_clicked'
  | 'checkout_started'
  | 'checkout_completed'
  | 'trial_started'
  | 'trial_converted'

/**
 * Track a funnel event for business analytics.
 *
 * This is fire-and-forget — errors are logged but never thrown,
 * so analytics never break production flows.
 */
export async function trackEvent(
  event: AnalyticsEvent,
  options?: {
    userId?: number | null
    sessionId?: string | null
    metadata?: Record<string, unknown>
    ipAddress?: string | null
    userAgent?: string | null
  },
): Promise<void> {
  try {
    const { userId, sessionId, metadata, ipAddress, userAgent } = options ?? {}
    await pool.query(
      `INSERT INTO analytics_events (user_id, session_id, event_name, metadata, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId ?? null,
        sessionId ?? null,
        event,
        JSON.stringify(metadata ?? {}),
        ipAddress ?? null,
        userAgent ?? null,
      ],
    )
  } catch (err) {
    // Never let analytics break production flows
    console.error('[analytics] trackEvent failed:', err)
  }
}

/**
 * Client-side analytics helper — posts event to the analytics API.
 * Use this in React components (client-side).
 */
export async function trackClientEvent(
  event: AnalyticsEvent,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event, metadata }),
    })
  } catch {
    // Silent fail — analytics should never block the UI
  }
}
