import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    // Database must be reachable for the app to be considered ready
    const start = Date.now()
    await pool.query('SELECT 1')
    const latencyMs = Date.now() - start

    return NextResponse.json({
      ready: true,
      database_latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
    })
  } catch (e: unknown) {
    return NextResponse.json(
      {
        ready: false,
        error: e instanceof Error ? e.message : 'Database unreachable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
