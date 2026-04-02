/**
 * Data Retention Cleanup Cron — Phase 8.1
 *
 * Runs daily at 03:00 UTC via Vercel Cron.
 * Cleans up expired/old data across multiple tables to prevent unbounded growth.
 *
 * Protected by CRON_SECRET (fail-closed).
 */
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'

export const runtime = 'nodejs'
export const maxDuration = 60

function verifyCronSecret(req: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET || process.env.CRON_JOBS_API_KEY
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

interface CleanupResult {
  table: string
  rowsDeleted: number
  error?: string
}

async function cleanupTable(
  label: string,
  query: string,
  params: unknown[] = [],
): Promise<CleanupResult> {
  try {
    const { rowCount } = await pool.query(query, params)
    return { table: label, rowsDeleted: rowCount }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    secureLogger.error(`Cleanup failed for ${label}`, { error: msg })
    return { table: label, rowsDeleted: 0, error: msg }
  }
}

export async function GET(req: NextRequest) {
  return handleCleanup(req)
}

export async function POST(req: NextRequest) {
  return handleCleanup(req)
}

async function handleCleanup(req: NextRequest) {
  const authError = verifyCronSecret(req)
  if (authError) return authError

  const results: CleanupResult[] = []

  // 1. Audit logs — retain 90 days
  results.push(
    await cleanupTable(
      'audit_logs',
      `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days'`,
    ),
  )

  // 2. Performance metrics — retain 30 days
  results.push(
    await cleanupTable(
      'performance_metrics',
      `DELETE FROM performance_metrics WHERE created_at < NOW() - INTERVAL '30 days'`,
    ),
  )

  // 3. Performance alerts (resolved only) — retain 30 days
  results.push(
    await cleanupTable(
      'performance_alerts',
      `DELETE FROM performance_alerts WHERE resolved = TRUE AND created_at < NOW() - INTERVAL '30 days'`,
    ),
  )

  // 4. Webhook deliveries — retain 30 days
  results.push(
    await cleanupTable(
      'webhook_deliveries',
      `DELETE FROM webhook_deliveries WHERE created_at < NOW() - INTERVAL '30 days'`,
    ),
  )

  // 5. Usage records — aggregate then delete records older than 90 days
  //    First, insert aggregated daily totals into a summary row, then delete originals
  results.push(
    await cleanupTable(
      'usage_records_aggregation',
      `INSERT INTO usage_records (user_id, api_key_id, endpoint, method, response_status, duration_ms, metadata, timestamp)
       SELECT user_id, api_key_id, endpoint, method,
              ROUND(AVG(response_status))::int,
              ROUND(AVG(duration_ms))::int,
              jsonb_build_object('aggregated', true, 'count', COUNT(*), 'period', to_char(DATE(timestamp), 'YYYY-MM-DD')),
              DATE(timestamp) + INTERVAL '12 hours'
       FROM usage_records
       WHERE timestamp < NOW() - INTERVAL '90 days'
         AND (metadata IS NULL OR metadata->>'aggregated' IS NULL)
       GROUP BY user_id, api_key_id, endpoint, method, DATE(timestamp)
       ON CONFLICT DO NOTHING`,
    ),
  )
  results.push(
    await cleanupTable(
      'usage_records_old',
      `DELETE FROM usage_records
       WHERE timestamp < NOW() - INTERVAL '90 days'
         AND (metadata IS NULL OR metadata->>'aggregated' IS NULL)`,
    ),
  )

  // 6. Expired sessions
  results.push(
    await cleanupTable(
      'sessions',
      `DELETE FROM sessions WHERE expires_at < NOW()`,
    ),
  )

  // 7. Expired compliance export download tokens
  results.push(
    await cleanupTable(
      'compliance_exports_expired',
      `UPDATE compliance_exports SET download_token = NULL WHERE expires_at < NOW() AND download_token IS NOT NULL`,
    ),
  )

  // 8. Old monitoring events (acknowledged, older than 90 days)
  results.push(
    await cleanupTable(
      'monitoring_events_old',
      `DELETE FROM monitoring_events WHERE acknowledged = TRUE AND created_at < NOW() - INTERVAL '90 days'`,
    ),
  )

  // 9. Old risk snapshots — keep at most 1 per day per wallet for data older than 30 days
  results.push(
    await cleanupTable(
      'risk_snapshots_dedup',
      `DELETE FROM risk_snapshots
       WHERE snapshot_at < NOW() - INTERVAL '30 days'
         AND id NOT IN (
           SELECT DISTINCT ON (wallet_address, DATE(snapshot_at)) id
           FROM risk_snapshots
           WHERE snapshot_at < NOW() - INTERVAL '30 days'
           ORDER BY wallet_address, DATE(snapshot_at), snapshot_at DESC
         )`,
    ),
  )

  // 10. Refresh materialized views
  let matViewRefreshed = false
  try {
    await pool.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY allowances_counts`)
    matViewRefreshed = true
  } catch {
    // View may not exist yet — not critical
    secureLogger.warn('Materialized view allowances_counts refresh skipped (may not exist)')
  }

  try {
    await pool.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_summary`)
  } catch {
    secureLogger.warn('Materialized view analytics_daily_summary refresh skipped (may not exist)')
  }

  // 11. Stale analytics aggregation cleanup (analytics_events older than 180 days)
  results.push(
    await cleanupTable(
      'analytics_events_old',
      `DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '180 days'`,
    ),
  )

  const totalDeleted = results.reduce((sum, r) => sum + r.rowsDeleted, 0)
  const errors = results.filter((r) => r.error)

  secureLogger.info('Data cleanup completed', {
    totalDeleted,
    errors: errors.length,
    matViewRefreshed,
    details: results,
  })

  return NextResponse.json({
    ok: true,
    totalDeleted,
    matViewRefreshed,
    results,
    errors: errors.length > 0 ? errors : undefined,
  })
}
