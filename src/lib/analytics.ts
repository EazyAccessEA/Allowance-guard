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
 * Reads the analytics consent state from localStorage.
 *
 * Returns true only if the user explicitly accepted analytics cookies
 * in the CookieBanner. If no consent record exists (banner not yet
 * shown), returns false — we default to privacy-safe.
 *
 * This is the ONLY gate between client-side behavioral tracking and
 * the database. Server-side trackEvent() is NOT gated because it
 * handles operational/legitimate-interest events (scan_started, etc.)
 * that the service needs to function.
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem('allowance-guard-cookie-consent')
    if (!raw) return false
    const prefs = JSON.parse(raw)
    return prefs.analytics === true
  } catch {
    return false
  }
}

/**
 * Client-side analytics helper — posts event to the analytics API.
 * Use this in React components (client-side).
 *
 * **Gated by cookie consent.** If the user selected "Essential only"
 * or hasn't responded to the banner yet, this is a no-op. The event
 * never reaches the server. This makes the CookieBanner's Analytics
 * toggle control something real.
 */
export async function trackClientEvent(
  event: AnalyticsEvent,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (!hasAnalyticsConsent()) return

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
