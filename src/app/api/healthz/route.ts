import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { cacheHealthCheck } from '@/lib/cache'
import { redisHealthCheck } from '@/lib/redis'
import { getBlockNumber } from 'viem/actions'
import { clientFor } from '@/lib/chains'
import { enabledChainIds } from '@/lib/networks'
import pkg from '../../../../package.json'

export const runtime = 'nodejs'

// Track uptime from first request
let startedAt: number | null = null

async function timedCheck<T>(fn: () => Promise<T>): Promise<{ result: T; latencyMs: number }> {
  const start = Date.now()
  const result = await fn()
  return { result, latencyMs: Date.now() - start }
}

export async function GET() {
  if (!startedAt) startedAt = Date.now()

  const services: Record<string, { status: string; latency_ms?: number; details?: string }> = {}
  let overallOk = true

  // Database check
  try {
    const { latencyMs } = await timedCheck(() => pool.query('SELECT 1'))
    services.database = { status: 'ok', latency_ms: latencyMs }
  } catch (e: unknown) {
    overallOk = false
    services.database = { status: 'error', details: e instanceof Error ? e.message : 'Unknown error' }
  }

  // Redis check
  try {
    const redis = await redisHealthCheck()
    services.redis = {
      status: redis.ok ? 'ok' : 'degraded',
      latency_ms: redis.latencyMs,
      ...(redis.ok ? {} : { details: redis.message }),
    }
  } catch {
    services.redis = { status: 'unavailable', details: 'Redis not configured' }
  }

  // Cache check
  try {
    const cache = await cacheHealthCheck()
    services.cache = {
      status: cache.ok ? 'ok' : 'degraded',
      details: cache.ok ? cache.backend : cache.message,
    }
  } catch (e: unknown) {
    services.cache = { status: 'error', details: e instanceof Error ? e.message : 'Unknown error' }
  }

  // RPC checks per chain
  const chainIds = enabledChainIds()
  for (const id of chainIds) {
    const chainKey = `rpc_${id}`
    try {
      const { result: blockNum, latencyMs } = await timedCheck(() => getBlockNumber(clientFor(id)))
      services[chainKey] = { status: 'ok', latency_ms: latencyMs, details: `block:${blockNum}` }
    } catch (e: unknown) {
      // Individual chain failures don't fail the overall health check
      services[chainKey] = {
        status: 'degraded',
        details: e instanceof Error ? e.message.slice(0, 120) : 'Unknown error',
      }
    }
  }

  const uptimeSeconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0

  const response = {
    status: overallOk ? 'healthy' : 'unhealthy',
    version: pkg.version,
    uptime_seconds: uptimeSeconds,
    services,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status: overallOk ? 200 : 503 })
}
