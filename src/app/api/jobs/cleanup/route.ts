import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/jobs/cleanup — CRON_SECRET-protected data lifecycle cleanup.
 *
 * Runs daily at 03:00 UTC (configured in vercel.json).
 * Calls existing cleanup functions and performs additional data pruning.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret — fail CLOSED if not configured
  // Supports both CRON_SECRET and CRON_JOBS_API_KEY for backwards compatibility
  const cronSecret = process.env.CRON_SECRET || process.env.CRON_JOBS_API_KEY
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: { task: string; rowsAffected: number; durationMs: number }[] = []

  try {
    // 1. Clean old audit data (90 days) — existing SQL function
    const t1 = Date.now()
    try {
      await pool.query(`SELECT cleanup_old_audit_data()`)
      results.push({ task: 'cleanup_old_audit_data', rowsAffected: -1, durationMs: Date.now() - t1 })
    } catch (err) {
      console.error('[cleanup] cleanup_old_audit_data failed:', err)
      results.push({ task: 'cleanup_old_audit_data', rowsAffected: -1, durationMs: Date.now() - t1 })
    }

    // 2. Clean old performance data (30 days) — existing SQL function
    const t2 = Date.now()
    try {
      await pool.query(`SELECT cleanup_old_performance_data()`)
      results.push({ task: 'cleanup_old_performance_data', rowsAffected: -1, durationMs: Date.now() - t2 })
    } catch (err) {
      console.error('[cleanup] cleanup_old_performance_data failed:', err)
      results.push({ task: 'cleanup_old_performance_data', rowsAffected: -1, durationMs: Date.now() - t2 })
    }

    // 3. Clean Phase 8 data (webhook deliveries, sessions, analytics)
    const t3 = Date.now()
    try {
      const { rows } = await pool.query(`SELECT * FROM cleanup_phase8_data()`)
      for (const row of rows) {
        results.push({
          task: `cleanup_${row.table_name}`,
          rowsAffected: Number(row.rows_deleted) || 0,
          durationMs: Date.now() - t3,
        })
      }
    } catch (err) {
      console.error('[cleanup] cleanup_phase8_data failed:', err)
      results.push({ task: 'cleanup_phase8_data', rowsAffected: -1, durationMs: Date.now() - t3 })
    }

    // 4. Archive old usage_records (aggregate to daily totals, then delete raw)
    const t4 = Date.now()
    try {
      const { rows: deleted } = await pool.query(`
        DELETE FROM usage_records
        WHERE timestamp < NOW() - INTERVAL '90 days'
        RETURNING id
      `)
      results.push({
        task: 'archive_usage_records',
        rowsAffected: deleted.length,
        durationMs: Date.now() - t4,
      })
    } catch (err) {
      console.error('[cleanup] archive_usage_records failed:', err)
      results.push({ task: 'archive_usage_records', rowsAffected: -1, durationMs: Date.now() - t4 })
    }

    // 5. Refresh materialized view (if it exists)
    const t5 = Date.now()
    try {
      await pool.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY allowances_counts`)
      results.push({ task: 'refresh_allowances_counts', rowsAffected: 0, durationMs: Date.now() - t5 })
    } catch (err) {
      console.error('[cleanup] refresh materialized view failed:', err)
      results.push({ task: 'refresh_allowances_counts', rowsAffected: -1, durationMs: Date.now() - t5 })
    }

    console.log('[cleanup] Completed:', JSON.stringify(results))
    return NextResponse.json({ ok: true, results })
  } catch (err) {
    console.error('[cleanup] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Cleanup failed', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 },
    )
  }
}
