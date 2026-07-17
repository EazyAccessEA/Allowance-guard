import { NextRequest, NextResponse } from 'next/server'
import { alertSlack, alertEmail, fmtBlock } from '@/lib/ops_alert'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) {
      console.error('NEXT_PUBLIC_APP_URL not configured')
      return NextResponse.json({ error: 'App URL not configured' }, { status: 500 })
    }

    // fast=1 skips healthz's database/cache/RPC checks — required for any
    // pinger that runs more often than hourly, or the health check itself
    // keeps Neon compute awake. See docs/ops-monitoring.md.
    const fast = req.nextUrl.searchParams.get('fast') === '1'

    const r = await fetch(`${appUrl}/api/healthz${fast ? '?fast=1' : ''}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    const j = await r.json().catch(() => ({
      ok: false,
      error: 'Failed to parse health response',
      status: r.status
    }))

    // healthz reports { ok: boolean, status: 'healthy' | 'unhealthy' }
    const healthy = r.ok && (j.ok === true || j.status === 'healthy')

    if (!healthy) {
      const txt = `⚠️ Health degraded\n${fmtBlock(j)}`
      await Promise.all([
        alertSlack(txt),
        alertEmail('Health degraded', `<pre>${JSON.stringify(j, null, 2)}</pre>`)
      ])
    }

    return NextResponse.json({
      ok: healthy,
      health: j,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health alert check failed:', error)

    const errorMsg = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }

    await Promise.all([
      alertSlack(`🚨 Health check failed: ${errorMsg.error}`),
      alertEmail('Health check failed', `<pre>${JSON.stringify(errorMsg, null, 2)}</pre>`)
    ])

    return NextResponse.json(errorMsg, { status: 500 })
  }
}
