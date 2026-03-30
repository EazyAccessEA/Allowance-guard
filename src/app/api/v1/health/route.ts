/**
 * GET /api/v1/health — API health check
 *
 * Public endpoint (no auth required). Returns service status
 * and supported API version.
 */
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { cacheHealthCheck } from '@/lib/cache'

export const runtime = 'nodejs'

export async function GET() {
  const checks: Record<string, 'ok' | 'degraded' | 'down'> = {
    api: 'ok',
    database: 'down',
    cache: 'down',
  }

  // Check database
  try {
    await pool.query('SELECT 1')
    checks.database = 'ok'
  } catch {
    checks.database = 'down'
  }

  // Check cache
  try {
    const cacheOk = await cacheHealthCheck()
    checks.cache = cacheOk ? 'ok' : 'degraded'
  } catch {
    checks.cache = 'degraded'
  }

  const allHealthy = Object.values(checks).every((s) => s === 'ok')

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      version: 'v1',
      services: checks,
      timestamp: new Date().toISOString(),
    },
    { status: allHealthy ? 200 : 503 },
  )
}
