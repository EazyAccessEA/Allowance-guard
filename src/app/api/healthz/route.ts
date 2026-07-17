import { NextRequest, NextResponse } from 'next/server'
import pkg from '../../../../package.json'

export const runtime = 'nodejs'

// Track uptime from first request
let startedAt: number | null = null

async function timedCheck<T>(fn: () => Promise<T>): Promise<{ result: T; latencyMs: number }> {
  const start = Date.now()
  const result = await fn()
  return { result, latencyMs: Date.now() - start }
}

export async function GET(req: NextRequest) {
  if (!startedAt) startedAt = Date.now()

  // fast=1 — liveness-only mode for frequent uptime pingers. Skips the
  // database check (which wakes Neon compute; the free plan bills every
  // awake minute), the cache check (which falls back to Postgres when
  // Upstash is absent), and the 27-chain RPC sweep. Point any monitor
  // that polls more often than hourly at /api/healthz?fast=1.
  // See docs/ops-monitoring.md "Neon compute guardrails".
  const fast = req.nextUrl.searchParams.get('fast') === '1'

  const services: Record<string, { status: string; latency_ms?: number; details?: string }> = {}
  let overallOk = true

  // Database check — lazy import to avoid crash when DATABASE_URL is missing
  if (fast) {
    services.database = { status: 'skipped', details: 'fast mode' }
  } else if (process.env.DATABASE_URL) {
    try {
      const { pool } = await import('@/lib/db')
      const { latencyMs } = await timedCheck(() => pool.query('SELECT 1'))
      services.database = { status: 'ok', latency_ms: latencyMs }
    } catch (e: unknown) {
      overallOk = false
      services.database = { status: 'error', details: e instanceof Error ? e.message : 'Unknown error' }
    }
  } else {
    services.database = { status: 'unavailable', details: 'DATABASE_URL not configured' }
  }

  // Upstash (Redis-protocol cache backend) check — lazy import.
  try {
    const { upstashHealthCheck } = await import('@/lib/upstash')
    const upstash = await upstashHealthCheck()
    services.upstash = {
      status: upstash.ok ? 'ok' : 'degraded',
      latency_ms: upstash.latencyMs,
      ...(upstash.ok ? {} : { details: upstash.message }),
    }
  } catch {
    services.upstash = { status: 'unavailable', details: 'Upstash not configured' }
  }

  // Cache check — lazy import
  if (fast) {
    services.cache = { status: 'skipped', details: 'fast mode' }
  } else {
    try {
      const { cacheHealthCheck } = await import('@/lib/cache')
      const cache = await cacheHealthCheck()
      services.cache = {
        status: cache.ok ? 'ok' : 'degraded',
        details: cache.ok ? cache.backend : cache.message,
      }
    } catch (e: unknown) {
      services.cache = { status: 'error', details: e instanceof Error ? e.message : 'Unknown error' }
    }
  }

  // RPC checks per chain — lazy import
  if (fast) {
    services.rpc = { status: 'skipped', details: 'fast mode' }
  } else {
    try {
      const { getBlockNumber } = await import('viem/actions')
      const { clientFor } = await import('@/lib/chains')
      const { enabledChainIds } = await import('@/lib/networks')
      const chainIds = enabledChainIds()
      for (const id of chainIds) {
        const chainKey = `rpc_${id}`
        try {
          const { result: blockNum, latencyMs } = await timedCheck(() => getBlockNumber(clientFor(id as Parameters<typeof clientFor>[0])))
          services[chainKey] = { status: 'ok', latency_ms: latencyMs, details: `block:${blockNum}` }
        } catch (e: unknown) {
          services[chainKey] = {
            status: 'degraded',
            details: e instanceof Error ? e.message.slice(0, 120) : 'Unknown error',
          }
        }
      }
    } catch {
      services.rpc = { status: 'unavailable', details: 'RPC modules not available' }
    }
  }

  const uptimeSeconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0

  const response = {
    ok: overallOk,
    status: overallOk ? 'healthy' : 'unhealthy',
    mode: fast ? 'fast' : 'deep',
    version: pkg.version,
    uptime_seconds: uptimeSeconds,
    services,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status: overallOk ? 200 : 503 })
}
