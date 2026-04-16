// src/lib/metrics.ts — Operational counters (RPC calls, emails, scans).
//
// Now on Upstash Serverless Redis. Silent-degrade if Upstash isn't configured
// or a call fails — metrics are operational telemetry, not load-bearing.
//
// Keys bucketed by UTC day:
//   m:rpc:<YYYY-MM-DD>    → hash { <chainId> → count }
//   m:email:<YYYY-MM-DD>  → integer counter
//   m:scan:<YYYY-MM-DD>   → integer counter

import { getUpstash } from './upstash'

function k(prefix: string): string {
  const d = new Date()
  const day = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  return `m:${prefix}:${day}`
}

export async function incrRpc(chainId: number): Promise<void> {
  const client = getUpstash()
  if (!client) return
  try {
    await client.hincrby(k('rpc'), String(chainId), 1)
  } catch (error) {
    console.warn(
      '[metrics] Failed to increment RPC counter:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}

export async function incrEmail(): Promise<void> {
  const client = getUpstash()
  if (!client) return
  try {
    await client.incr(k('email'))
  } catch (error) {
    console.warn(
      '[metrics] Failed to increment email counter:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}

export async function incrScan(): Promise<void> {
  const client = getUpstash()
  if (!client) return
  try {
    await client.incr(k('scan'))
  } catch (error) {
    console.warn(
      '[metrics] Failed to increment scan counter:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}

export async function readToday(): Promise<{
  rpc: Record<string, number>
  email: number
  scan: number
}> {
  const empty = { rpc: {}, email: 0, scan: 0 }
  const client = getUpstash()
  if (!client) return empty

  try {
    const [rpc, email, scan] = await Promise.all([
      client.hgetall<Record<string, string | number>>(k('rpc')),
      client.get<string | number>(k('email')),
      client.get<string | number>(k('scan')),
    ])

    const rpcNum: Record<string, number> = {}
    if (rpc) {
      for (const [chain, v] of Object.entries(rpc)) {
        rpcNum[chain] = Number(v)
      }
    }

    return {
      rpc: rpcNum,
      email: Number(email ?? 0),
      scan: Number(scan ?? 0),
    }
  } catch (error) {
    console.warn(
      '[metrics] Failed to read metrics:',
      error instanceof Error ? error.message : 'Unknown error',
    )
    return empty
  }
}
