import { createClient } from 'redis'

const client = createClient({
  url: process.env.REDIS_URL || undefined,
  socket: process.env.REDIS_HOST ? { host: process.env.REDIS_HOST!, port: Number(process.env.REDIS_PORT||6379) } : undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  database: Number(process.env.REDIS_DB || 0),
})
client.on('error', () => {})
let ready = false
client.connect().then(()=>{ ready = true }).catch(()=>{})

export async function cacheGet<T=any>(key: string): Promise<T | null> {
  if (!ready) return null
  const s = await client.get(key)
  return s ? JSON.parse(s) as T : null
}

export async function cacheSet(key: string, val: any, ttlSec = 30) {
  if (!ready) return
  await client.setEx(key, ttlSec, JSON.stringify(val))
}

export async function cacheDel(pattern: string) {
  if (!ready) return
  const it = client.scanIterator({ MATCH: pattern, COUNT: 100 })
  for await (const k of it) await client.del(k as string)
}
