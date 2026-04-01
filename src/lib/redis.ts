// src/lib/redis.ts — Shared Redis client for caching and rate limiting
import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

let _client: RedisClient | null = null
let _ready = false
let _connecting = false

/**
 * Get or create a shared Redis client.
 * Returns null if Redis is not configured.
 */
export function getRedisClient(): RedisClient | null {
  const url = process.env.REDIS_URL
  const host = process.env.REDIS_HOST

  // No Redis configured
  if (!url && !host) return null

  if (_client && _ready) return _client

  if (!_client && !_connecting) {
    _connecting = true
    _client = createClient({
      url: url || undefined,
      socket: host ? { host, port: Number(process.env.REDIS_PORT || 6379) } : undefined,
      password: process.env.REDIS_PASSWORD || undefined,
      database: Number(process.env.REDIS_DB || 0),
    })

    _client.on('error', () => {
      _ready = false
    })
    _client.on('ready', () => {
      _ready = true
    })

    _client.connect().then(() => {
      _ready = true
      _connecting = false
    }).catch(() => {
      _ready = false
      _connecting = false
    })
  }

  return _ready ? _client : null
}

/**
 * Check if Redis is available and responding.
 */
export async function redisHealthCheck(): Promise<{ ok: boolean; latencyMs: number; message: string }> {
  const start = Date.now()
  const client = getRedisClient()

  if (!client) {
    return { ok: false, latencyMs: 0, message: 'Redis not configured' }
  }

  try {
    await client.ping()
    return { ok: true, latencyMs: Date.now() - start, message: 'ok' }
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
