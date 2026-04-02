import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { pool } from '@/lib/db'
import { invalidateFlagCache } from '@/lib/feature-flags'

async function requireAdmin() {
  const session = await getSession()
  if (!session) return null

  const { rows } = await pool.query(
    `SELECT role FROM users WHERE id = $1`,
    [session.user_id],
  )
  if (!rows[0] || rows[0].role !== 'admin') return null
  return session
}

// GET — list all flags
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { rows } = await pool.query(
    `SELECT id, name, description, rollout_percentage, target_plans, enabled, created_at, updated_at
     FROM feature_flags
     ORDER BY created_at DESC`,
  )
  return NextResponse.json({ flags: rows })
}

// POST — create a new flag
export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { name, description, rollout_percentage, target_plans } = body

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const rollout = Math.max(0, Math.min(100, parseInt(rollout_percentage) || 0))
  const plans = Array.isArray(target_plans) ? target_plans : []

  const { rows } = await pool.query(
    `INSERT INTO feature_flags (name, description, rollout_percentage, target_plans, enabled)
     VALUES ($1, $2, $3, $4, false)
     RETURNING id, name`,
    [name, description || null, rollout, JSON.stringify(plans)],
  )

  invalidateFlagCache()
  return NextResponse.json({ flag: rows[0] }, { status: 201 })
}

// PATCH — update a flag (toggle enabled, change rollout)
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { id, enabled, rollout_percentage, target_plans } = body

  if (!id) {
    return NextResponse.json({ error: 'Flag id is required' }, { status: 400 })
  }

  const updates: string[] = []
  const params: unknown[] = []
  let paramIdx = 1

  if (typeof enabled === 'boolean') {
    updates.push(`enabled = $${paramIdx++}`)
    params.push(enabled)
  }
  if (typeof rollout_percentage === 'number') {
    updates.push(`rollout_percentage = $${paramIdx++}`)
    params.push(Math.max(0, Math.min(100, rollout_percentage)))
  }
  if (Array.isArray(target_plans)) {
    updates.push(`target_plans = $${paramIdx++}`)
    params.push(JSON.stringify(target_plans))
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
  }

  updates.push(`updated_at = NOW()`)
  params.push(id)

  await pool.query(
    `UPDATE feature_flags SET ${updates.join(', ')} WHERE id = $${paramIdx}`,
    params,
  )

  invalidateFlagCache()
  return NextResponse.json({ ok: true })
}

// DELETE — remove a flag
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'Flag id is required' }, { status: 400 })
  }

  await pool.query(`DELETE FROM feature_flags WHERE id = $1`, [id])
  invalidateFlagCache()
  return NextResponse.json({ ok: true })
}
