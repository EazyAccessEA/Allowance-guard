/**
 * Admin Feature Flags API — Phase 8.4
 *
 * CRUD operations for feature flags. Admin-only.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllFlags, createFlag, updateFlag, deleteFlag } from '@/lib/feature-flags'
import { pool } from '@/lib/db'

async function isAdmin(userId: number): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT role FROM users WHERE id = $1`,
    [userId],
  )
  return rows[0]?.role === 'admin'
}

async function requireAdmin(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  if (!(await isAdmin(Number(session.user_id)))) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { session }
}

/** GET — List all flags */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth && auth.error) return auth.error

  try {
    const flags = await getAllFlags()
    return NextResponse.json({ flags })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch flags', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

/** POST — Create a new flag */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth && auth.error) return auth.error

  try {
    const body = await req.json()
    const { name, description, enabled, rolloutPercentage, targetPlans } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (rolloutPercentage !== undefined && (rolloutPercentage < 0 || rolloutPercentage > 100)) {
      return NextResponse.json({ error: 'Rollout percentage must be 0-100' }, { status: 400 })
    }

    const flag = await createFlag({
      name: name.trim(),
      description: description?.trim(),
      enabled: Boolean(enabled),
      rolloutPercentage: Number(rolloutPercentage ?? 0),
      targetPlans: Array.isArray(targetPlans) ? targetPlans : [],
    })

    return NextResponse.json({ flag }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('duplicate key') || msg.includes('unique')) {
      return NextResponse.json({ error: 'Flag name already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create flag', details: msg }, { status: 500 })
  }
}

/** PUT — Update a flag */
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth && auth.error) return auth.error

  try {
    const body = await req.json()
    const { id, description, enabled, rolloutPercentage, targetPlans } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Flag ID is required' }, { status: 400 })
    }

    if (rolloutPercentage !== undefined && (rolloutPercentage < 0 || rolloutPercentage > 100)) {
      return NextResponse.json({ error: 'Rollout percentage must be 0-100' }, { status: 400 })
    }

    const flag = await updateFlag(id, {
      description,
      enabled,
      rolloutPercentage,
      targetPlans,
    })

    if (!flag) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
    }

    return NextResponse.json({ flag })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update flag', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

/** DELETE — Remove a flag */
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth && auth.error) return auth.error

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Flag ID is required' }, { status: 400 })
    }

    const deleted = await deleteFlag(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to delete flag', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
