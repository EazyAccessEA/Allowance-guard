import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { createClient } from 'redis'
import { getBlockNumber } from 'viem/actions'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { clientFor } from '@/lib/chains'
import { enabledChainIds } from '@/lib/networks'

export const runtime = 'nodejs'

export async function GET() {
  const out: { ok: boolean; checks: Record<string, string> } = { ok: true, checks: {} }

  // DB check
  try { 
    await pool.query('SELECT 1')
    out.checks.db = 'ok' 
  } catch (e: unknown) { 
    out.ok = false
    out.checks.db = e instanceof Error ? e.message : 'Unknown error'
  }

  // Redis check (best-effort)
  try {
    const url = process.env.REDIS_URL
    const r = url ? createClient({ url }) : createClient({ 
      socket: { 
        host: process.env.REDIS_HOST || 'localhost', 
        port: Number(process.env.REDIS_PORT || 6379) 
      }, 
      password: process.env.REDIS_PASSWORD || undefined 
    })
    await r.connect()
    const pong = await r.ping()
    await r.disconnect()
    out.checks.redis = pong === 'PONG' ? 'ok' : 'fail'
  } catch (e: unknown) { 
    out.ok = false
    out.checks.redis = e instanceof Error ? e.message : 'Unknown error'
  }

  // RPC check (Ethereum mainnet as sentinel)
  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.ETH_RPC_URL || 'https://eth.llamarpc.com')
    })
    const n = await getBlockNumber(client)
    out.checks.rpc = `ok:${n}`
  } catch (e: unknown) { 
    out.ok = false
    out.checks.rpc = e instanceof Error ? e.message : 'Unknown error'
  }

  // Per-chain health checks
  out.checks.chains = {}
  for (const id of enabledChainIds()) {
    try {
      const bn = await getBlockNumber(clientFor(id))
      out.checks.chains[id] = `ok:${bn}`
    } catch (e: unknown) {
      out.ok = false
      out.checks.chains[id] = `fail:${e instanceof Error ? e.message?.slice(0,120) : 'Unknown error'}`
    }
  }

  return NextResponse.json(out, { status: out.ok ? 200 : 503 })
}
