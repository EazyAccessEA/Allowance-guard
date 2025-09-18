import { NextResponse } from 'next/server'
import { claimPending, finishJob, JobRow } from '@/lib/jobs'
import { scanWalletOnChain } from '@/lib/scanner'
import { apiLogger } from '@/lib/logger'
import { refreshRiskForWallet } from '@/lib/risk'
import { enrichWallet } from '@/lib/enrich'
import { driftCheckAndNotify } from '@/lib/drift'
import { pool } from '@/lib/db'
import { withTimeout } from '@/lib/retry'
import { cacheDel } from '@/lib/cache'
import { reportError } from '@/lib/rollbar'

async function handle(job: JobRow) {
  if (job.type !== 'scan_wallet') throw new Error(`Unknown job type: ${job.type}`)
  const { wallet, chains } = job.payload as { wallet: string; chains: number[] }
  
  apiLogger.info('Processing scan job', { jobId: job.id, wallet, chains })
  
  // Process chains sequentially (safe for RPC rate limits)
  for (const chainId of chains) {
    await withTimeout(scanWalletOnChain(wallet, chainId as 1|42161|8453), 60_000)
  }
  
  // Post-scan: risk, enrich, drift
  await refreshRiskForWallet(wallet)
  await enrichWallet(wallet)
  await driftCheckAndNotify(wallet)

  // Update monitor's last_scan_at if it exists
  await pool.query(
    `UPDATE wallet_monitors SET last_scan_at=NOW(), updated_at=NOW()
     WHERE wallet_address=$1`,
    [wallet.toLowerCase()]
  )
  
  // Invalidate cache after scan → risk → enrich operations
  await cacheDel(`allow:${wallet.toLowerCase()}:*`)
  
  apiLogger.info('Scan job completed', { jobId: job.id, wallet })
}

export async function POST() {
  try {
    const jobs = await claimPending(2) // small batch
    let done = 0
    
    for (const j of jobs) {
      try { 
        await handle(j)
        await finishJob(j.id, true)
        done++
        apiLogger.info('Job succeeded', { jobId: j.id })
      } catch (e: unknown) { 
        const errorMessage = e instanceof Error ? e.message : String(e)
        reportError(e instanceof Error ? e : new Error(String(e)), { jobId: j.id })
        await finishJob(j.id, false, errorMessage)
        apiLogger.error('Job failed', { jobId: j.id, error: errorMessage })
      }
    }
    
    return NextResponse.json({ ok: true, claimed: jobs.length, processed: done })
  } catch (error) {
    reportError(error instanceof Error ? error : new Error(String(error)))
    apiLogger.error('Job processor error', { error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json({ error: 'Job processing failed' }, { status: 500 })
  }
}

export async function GET() { 
  return POST() 
}
