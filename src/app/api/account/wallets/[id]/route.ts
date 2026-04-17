/**
 * PATCH  /api/account/wallets/[id] — update a saved wallet's label.
 * DELETE /api/account/wallets/[id] — remove a saved wallet.
 *
 * Both auth-gated and IDOR-safe — every query is bound to the
 * caller's user_id so user A cannot mutate user B's rows.
 *
 * Council:
 *   #4 Security (VETO): user_id is in the WHERE on every UPDATE/
 *     DELETE; a row that doesn't belong to the caller returns 404
 *     (don't leak existence to other users) — same shape as the
 *     teams PUT defence-in-depth from commit d61480d.
 *   #15 Staff engineer: PATCH is label-only by intent; the wallet
 *     address is immutable once saved (re-save with a new label is
 *     equivalent to delete+save, no migration story).
 */

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/db'
import { userWallets } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

const PatchSchema = z.object({
  label: z
    .string()
    .trim()
    .max(80, 'Label must be 80 characters or fewer')
    .nullable()
    .optional(),
})

interface Ctx {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid wallet id' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    )
  }

  const updated = await db
    .update(userWallets)
    .set({ label: parsed.data.label || null })
    .where(and(eq(userWallets.id, id), eq(userWallets.userId, session.user_id as number)))
    .returning({
      id: userWallets.id,
      walletAddress: userWallets.walletAddress,
      label: userWallets.label,
      createdAt: userWallets.createdAt,
    })

  if (updated.length === 0) {
    // Row doesn't exist OR doesn't belong to this user — 404 either
    // way to avoid leaking which.
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, wallet: updated[0] })
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid wallet id' }, { status: 400 })
  }

  const deleted = await db
    .delete(userWallets)
    .where(and(eq(userWallets.id, id), eq(userWallets.userId, session.user_id as number)))
    .returning({ id: userWallets.id })

  if (deleted.length === 0) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
