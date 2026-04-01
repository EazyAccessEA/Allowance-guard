import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/user/onboarding
 *
 * Returns the user's onboarding progress:
 * - hadScan: user has at least one scan record
 * - hasSavedWallet: user has at least one saved wallet
 * - hadRevoke: user has at least one revocation record
 */
export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({
      hadScan: false,
      hasSavedWallet: false,
      hadRevoke: false,
    })
  }

  const userId = session.user_id

  // Run all three checks in parallel
  const [scanResult, walletResult, revokeResult] = await Promise.all([
    pool.query(
      `SELECT EXISTS(SELECT 1 FROM usage_records WHERE user_id = $1 AND action = 'scan' LIMIT 1) AS has_scan`,
      [userId],
    ).catch(() => ({ rows: [{ has_scan: false }] })),
    pool.query(
      `SELECT EXISTS(SELECT 1 FROM user_wallets WHERE user_id = $1 LIMIT 1) AS has_wallet`,
      [userId],
    ).catch(() => ({ rows: [{ has_wallet: false }] })),
    pool.query(
      `SELECT EXISTS(SELECT 1 FROM usage_records WHERE user_id = $1 AND action = 'revoke' LIMIT 1) AS has_revoke`,
      [userId],
    ).catch(() => ({ rows: [{ has_revoke: false }] })),
  ])

  return NextResponse.json({
    hadScan: scanResult.rows[0]?.has_scan ?? false,
    hasSavedWallet: walletResult.rows[0]?.has_wallet ?? false,
    hadRevoke: revokeResult.rows[0]?.has_revoke ?? false,
  })
}
