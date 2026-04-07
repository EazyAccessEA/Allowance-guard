// lib/ratelimit.ts
import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || undefined,
  socket: process.env.REDIS_HOST ? { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT || 6379) } : undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  database: Number(process.env.REDIS_DB || 0),
})
client.on('error', () => {}) // avoid crash on cold starts
let ready = false
client.connect().then(()=>{ ready = true }).catch(()=>{})

export async function limitHit(key: string, windowSec: number, max: number) {
  if (!ready) {
    // Fail CLOSED: deny requests when rate limiter is unavailable
    console.warn('[ratelimit] Redis unavailable — failing closed')
    return { allowed: false, remaining: 0, ttl: windowSec }
  }
  const now = Math.floor(Date.now()/1000)
  const bucket = `rl:${key}:${Math.floor(now / windowSec)}`
  const count = await client.incr(bucket)
  if (count === 1) await client.expire(bucket, windowSec)
  const allowed = count <= max
  const ttl = await client.ttl(bucket)
  return { allowed, remaining: Math.max(0, max - count), ttl }
}

/** Centralized rate limits for all public endpoints */
const RATE_LIMITS: Record<string, { windowSec: number; max: number }> = {
  'coinbase-charge': { windowSec: 60, max: 10 },
  'stripe-checkout': { windowSec: 60, max: 10 },
  'scan':            { windowSec: 60, max: 12 },
  'share-create':    { windowSec: 60, max: 20 },
  'bulk-revoke':     { windowSec: 60, max: 5 },
  'preferences':     { windowSec: 60, max: 20 },
  'monitor':         { windowSec: 60, max: 20 },
  'audit-logs':      { windowSec: 60, max: 30 },
  'billing-invoices': { windowSec: 60, max: 20 },
  'contact':         { windowSec: 600, max: 5 },
}

export async function limitOrThrow(ip: string, endpoint: string) {
  const config = RATE_LIMITS[endpoint]
  if (!config) return // no limit configured

  const result = await limitHit(`${endpoint}:${ip}`, config.windowSec, config.max)
  if (!result.allowed) {
    throw new Error('Rate limit exceeded')
  }
  return result
}