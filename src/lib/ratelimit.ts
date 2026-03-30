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
  if (!ready) return { allowed: true, remaining: max, ttl: windowSec } // fallback if Redis not ready
  const now = Math.floor(Date.now()/1000)
  const bucket = `rl:${key}:${Math.floor(now / windowSec)}`
  const count = await client.incr(bucket)
  if (count === 1) await client.expire(bucket, windowSec)
  const allowed = count <= max
  const ttl = await client.ttl(bucket)
  return { allowed, remaining: Math.max(0, max - count), ttl }
}

export async function limitOrThrow(ip: string, endpoint: string) {
  const limits: Record<string, { windowSec: number; max: number }> = {
    'coinbase-charge': { windowSec: 60, max: 10 },
    'stripe-checkout': { windowSec: 60, max: 10 },
  }
  
  const config = limits[endpoint]
  if (!config) return // no limit configured
  
  const result = await limitHit(`${endpoint}:${ip}`, config.windowSec, config.max)
  if (!result.allowed) {
    throw new Error('Rate limit exceeded')
  }
}