import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 5 requests / 60s per IP per endpoint
export const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, '60 s'),
  analytics: false,
  prefix: 'ag:rl:',
})

export async function limitOrThrow(ip: string | null, bucket: string) {
  if (!ip) return // best effort
  const { success, reset } = await limiter.limit(`${bucket}:${ip}`)
  if (!success) {
    const secs = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    const err = new Error(`Too many requests. Try again in ${secs}s.`)
    ;(err as any).status = 429
    throw err
  }
}
