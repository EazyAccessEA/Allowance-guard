import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { cacheHealthCheck } from '@/lib/cache'
import { getBlockNumber } from 'viem/actions'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { clientFor } from '@/lib/chains'
import { enabledChainIds } from '@/lib/networks'

export const runtime = 'nodejs'

export async function GET() {
  const out: { ok: boolean; checks: Record<string, string | Record<string, string>> } = { ok: true, checks: {} }

  // Basic app health
  out.checks.app = 'ok'

  // DB check
  try { 
    await pool.query('SELECT 1')
    out.checks.db = 'ok' 
  } catch (e: unknown) { 
    out.ok = false
    out.checks.db = e instanceof Error ? e.message : 'Unknown error'
  }

  // Cache check (using database-based cache)
  try {
    const cacheResult = await cacheHealthCheck()
    out.checks.cache = cacheResult.ok ? 'ok' : cacheResult.message
  } catch (e: unknown) { 
    // Don't fail overall health check for cache issues
    out.checks.cache = e instanceof Error ? e.message : 'Unknown error'
  }

  // RPC check (Ethereum mainnet as sentinel)
  try {
    const rpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
    const client = createPublicClient({
      chain: mainnet,
      transport: http(rpcUrl)
    })
    const n = await getBlockNumber(client)
    out.checks.rpc = `ok:${n}`
  } catch (e: unknown) { 
    // Don't fail the entire health check for RPC issues
    out.checks.rpc = e instanceof Error ? e.message : 'Unknown error'
  }

  // Per-chain health checks
  const chainChecks: Record<string, string> = {}
  for (const id of enabledChainIds()) {
    try {
      const bn = await getBlockNumber(clientFor(id))
      chainChecks[id] = `ok:${bn}`
    } catch (e: unknown) {
      // Don't fail the entire health check for individual chain issues
      chainChecks[id] = `fail:${e instanceof Error ? e.message?.slice(0,120) : 'Unknown error'}`
    }
  }
  out.checks.chains = chainChecks

  return NextResponse.json(out, { status: out.ok ? 200 : 503 })
}
