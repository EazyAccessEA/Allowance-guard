import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

/**
 * Shared handler for risk snapshot queries.
 * Used by /api/history/risk route.
 */
export async function getRiskSnapshots(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') ?? '').toLowerCase()
  const days = Math.min(365, Math.max(1, parseInt(searchParams.get('days') ?? '30')))

  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const { rows } = await pool.query(
    `SELECT risk_score, total_allowances, unlimited_count, high_risk_count,
            chain_breakdown, snapshot_at
     FROM risk_snapshots
     WHERE wallet_address = $1 AND snapshot_at >= NOW() - ($2 || ' days')::interval
     ORDER BY snapshot_at ASC`,
    [wallet, String(days)],
  )

  return NextResponse.json({ snapshots: rows })
}
