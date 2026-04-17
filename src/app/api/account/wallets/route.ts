/**
 * GET  /api/account/wallets — list the signed-in user's saved wallets.
 * POST /api/account/wallets — save a new wallet to the user's address
 *                             book. Gated by requireWalletQuota
 *                             (Free=3, Pro/Sentinel=unlimited).
 *
 * Backend half of the save-wallet feature. Schema lives in
 * src/db/schema/wallets.ts; quota check in lib/feature-gate.ts.
 *
 * Council:
 *   #4 Security (VETO): all queries scoped by session.user_id (no
 *     IDOR — a user cannot read or write another user's wallets);
 *     CSRF covered globally by middleware.ts.
 *   #18 DBA: unique index on (user_id, lower(wallet_address)) catches
 *     case-difference duplicates; the API also normalises to
 *     lowercase before INSERT for consistency with existing reads.
 *   #15 Staff engineer: uses requireWalletQuota from plan-guard.ts
 *     so the gate isn't reimplemented; matches the canonical 403
 *     payload shape from the per-route plan-gate commits.
 *   #16 QA: the unique index is the secondary defence against the
 *     TOCTOU window between checkWalletQuota and INSERT — even if a
 *     race lets two concurrent saves through, the second hits the
 *     unique constraint and 409s gracefully.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db'
import { userWallets } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { requireWalletQuota } from '@/middleware/plan-guard'

export const runtime = 'nodejs'

const SaveSchema = z.object({
  walletAddress: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Wallet address must be a 0x-prefixed 40-hex-char string')
    .transform((v) => v.toLowerCase()),
  label: z
    .string()
    .trim()
    .max(80, 'Label must be 80 characters or fewer')
    .optional()
    .or(z.literal('')),
})

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const rows = await db
    .select({
      id: userWallets.id,
      walletAddress: userWallets.walletAddress,
      label: userWallets.label,
      createdAt: userWallets.createdAt,
    })
    .from(userWallets)
    .where(eq(userWallets.userId, session.user_id as number))
    .orderBy(desc(userWallets.createdAt))

  return NextResponse.json({ wallets: rows })
}

export async function POST(req: Request) {
  // Quota check is the first gate — returns 401 if not authed, 403
  // with PLAN_LIMIT_EXCEEDED + upgradeUrl if at the cap.
  const guard = await requireWalletQuota(req)
  if (guard instanceof NextResponse) return guard

  // requireWalletQuota returned null = access granted; we still need
  // the session for user_id.
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = SaveSchema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return NextResponse.json({ error: issue?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { walletAddress, label } = parsed.data

  try {
    const [inserted] = await db
      .insert(userWallets)
      .values({
        userId: session.user_id as number,
        walletAddress,
        label: label || null,
      })
      .returning({
        id: userWallets.id,
        walletAddress: userWallets.walletAddress,
        label: userWallets.label,
        createdAt: userWallets.createdAt,
      })

    return NextResponse.json({ ok: true, wallet: inserted })
  } catch (err) {
    // Unique-index violation (race-window duplicate) — surface as 409.
    if (err instanceof Error && /unique|duplicate/i.test(err.message)) {
      return NextResponse.json(
        { error: 'This wallet is already saved' },
        { status: 409 },
      )
    }
    console.error('[account/wallets] insert failed', err)
    return NextResponse.json({ error: 'Could not save wallet' }, { status: 500 })
  }
}
