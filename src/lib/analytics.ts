/**
 * Analytics tracking library — Phase 8.3
 *
 * Tracks funnel events for business decision-making.
 * Events are stored in the analytics_events table and aggregated
 * via materialized views for the admin dashboard.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics'
 *   await trackEvent(userId, 'scan_completed', { chainId: 1, allowanceCount: 12 })
 */
import { createHash } from 'crypto'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'

/** Known funnel event names for type safety */
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
  | 'api_key_created'
  | 'export_generated'
  | 'alert_configured'
  | 'team_created'
  | 'webhook_created'
  | 'page_view'
  | (string & {}) // allow custom events

export type EventCategory =
  | 'funnel'
  | 'engagement'
  | 'revenue'
  | 'feature'
  | 'general'

interface TrackOptions {
  category?: EventCategory
  sessionId?: string
  pageUrl?: string
  referrer?: string
  userAgent?: string
  ip?: string
  properties?: Record<string, unknown>
}

/**
 * Track an analytics event. Non-blocking — errors are logged, never thrown.
 */
export async function trackEvent(
  userId: number | null,
  eventName: AnalyticsEvent,
  opts: TrackOptions = {},
): Promise<void> {
  try {
    const {
      category = inferCategory(eventName),
      sessionId,
      pageUrl,
      referrer,
      userAgent,
      ip,
      properties = {},
    } = opts

    const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : null

    await pool.query(
      `INSERT INTO analytics_events
        (user_id, session_id, event_name, event_category, properties, page_url, referrer, user_agent, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        sessionId ?? null,
        eventName,
        category,
        JSON.stringify(properties),
        pageUrl ?? null,
        referrer ?? null,
        userAgent ?? null,
        ipHash,
      ],
    )
  } catch (err) {
    // Analytics should never break application flow
    secureLogger.error('Analytics tracking failed', {
      eventName,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

/**
 * Batch-track multiple events (for server-side bulk inserts).
 */
export async function trackEvents(
  events: Array<{ userId: number | null; eventName: AnalyticsEvent; opts?: TrackOptions }>,
): Promise<void> {
  for (const { userId, eventName, opts } of events) {
    await trackEvent(userId, eventName, opts)
  }
}

/**
 * Get event counts for a given time range (used by admin dashboard).
 */
export async function getEventCounts(
  eventName: string,
  days: number = 30,
): Promise<{ day: string; count: number }[]> {
  const { rows } = await pool.query(
    `SELECT DATE(created_at) AS day, COUNT(*) AS count
     FROM analytics_events
     WHERE event_name = $1
       AND created_at > NOW() - INTERVAL '1 day' * $2
     GROUP BY DATE(created_at)
     ORDER BY day DESC`,
    [eventName, days],
  )
  return rows.map((r) => ({
    day: String(r.day),
    count: Number(r.count),
  }))
}

/**
 * Get funnel summary for the admin dashboard.
 */
export async function getFunnelSummary(days: number = 30): Promise<
  Array<{ event_name: string; count: number; unique_users: number }>
> {
  const { rows } = await pool.query(
    `SELECT event_name, COUNT(*) AS count, COUNT(DISTINCT user_id) AS unique_users
     FROM analytics_events
     WHERE created_at > NOW() - INTERVAL '1 day' * $1
       AND event_category = 'funnel'
     GROUP BY event_name
     ORDER BY count DESC`,
    [days],
  )
  return rows.map((r) => ({
    event_name: String(r.event_name),
    count: Number(r.count),
    unique_users: Number(r.unique_users),
  }))
}

/**
 * Get revenue metrics from subscriptions (for admin dashboard).
 */
export async function getRevenueMetrics(): Promise<{
  totalActive: number
  byPlan: Array<{ plan: string; count: number }>
  churnRate: number
  trialCount: number
  newLast30d: number
}> {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'active') AS total_active,
       COUNT(*) FILTER (WHERE status = 'trialing') AS trial_count,
       COUNT(*) FILTER (WHERE cancelled_at IS NOT NULL AND cancelled_at > NOW() - INTERVAL '30 days') AS cancelled_30d,
       COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') AS new_30d
     FROM subscriptions`,
  )

  const stats = rows[0] || {}
  const totalActive = Number(stats.total_active || 0)
  const cancelled30d = Number(stats.cancelled_30d || 0)

  const { rows: planRows } = await pool.query(
    `SELECT plan, COUNT(*) AS count FROM subscriptions WHERE status = 'active' GROUP BY plan ORDER BY count DESC`,
  )

  return {
    totalActive,
    byPlan: planRows.map((r) => ({ plan: String(r.plan), count: Number(r.count) })),
    churnRate: totalActive > 0 ? cancelled30d / totalActive : 0,
    trialCount: Number(stats.trial_count || 0),
    newLast30d: Number(stats.new_30d || 0),
  }
}

/**
 * Get API usage by tier for admin dashboard.
 */
export async function getApiUsageByTier(days: number = 30): Promise<
  Array<{ plan: string; total_calls: number; unique_keys: number }>
> {
  const { rows } = await pool.query(
    `SELECT ak.plan, COUNT(ur.id) AS total_calls, COUNT(DISTINCT ur.api_key_id) AS unique_keys
     FROM usage_records ur
     JOIN api_keys ak ON ak.id = ur.api_key_id
     WHERE ur.timestamp > NOW() - INTERVAL '1 day' * $1
     GROUP BY ak.plan
     ORDER BY total_calls DESC`,
    [days],
  )
  return rows.map((r) => ({
    plan: String(r.plan),
    total_calls: Number(r.total_calls),
    unique_keys: Number(r.unique_keys),
  }))
}

/** Infer event category from event name */
function inferCategory(eventName: string): EventCategory {
  if (['checkout_started', 'checkout_completed', 'trial_started', 'trial_converted', 'upgrade_clicked'].includes(eventName)) {
    return 'revenue'
  }
  if (['wallet_connected', 'scan_started', 'scan_completed', 'revoke_initiated', 'revoke_completed'].includes(eventName)) {
    return 'funnel'
  }
  if (['api_key_created', 'export_generated', 'alert_configured', 'team_created', 'webhook_created'].includes(eventName)) {
    return 'feature'
  }
  return 'general'
}
