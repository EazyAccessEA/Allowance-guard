import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { enqueueScan } from '@/lib/jobs'
import { kickJobProcessor } from '@/lib/job-kick'
import { enabledChainIds } from '@/lib/networks'

export async function POST() {
  // Pick monitors that are enabled and due
  const { rows } = await pool.query(`
    SELECT wallet_address, freq_minutes, last_scan_at
    FROM wallet_monitors
    WHERE enabled = TRUE
      AND (last_scan_at IS NULL OR (NOW() - last_scan_at) > (freq_minutes || ' minutes')::interval)
    ORDER BY last_scan_at NULLS FIRST
    LIMIT 25
  `)
  const queued: Array<{wallet:string, jobId:number}> = []
  for (const r of rows) {
    const addr = String(r.wallet_address)
    const jobId = await enqueueScan(addr.toLowerCase(), enabledChainIds())
    queued.push({ wallet: addr, jobId })
  }
  // Start processing now instead of waiting for the fallback cron
  if (queued.length > 0) kickJobProcessor()
  return NextResponse.json({ ok: true, queued })
}

export async function GET() { return POST() }
