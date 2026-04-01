import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ensureCategory, getTokenCategories } from '@/lib/tokens/categories'
import { getSession } from '@/lib/auth'

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',').filter(Boolean).map(Number)

const createSchema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().max(400).optional(),
  icon: z.string().max(16).optional(),
  color: z.string().max(24).optional()
})

export async function GET() {
  const cats = await getTokenCategories()
  return NextResponse.json({ success: true, data: cats })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!ADMIN_USER_IDS.includes(session.user_id as number)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const json = await req.json()
    const body = createSchema.parse(json)
    const created = await ensureCategory(body.name.trim(), {
      description: body.description ?? null,
      icon: body.icon ?? null,
      color: body.color ?? null
    })
    return NextResponse.json({ success: true, data: created })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid category payload' }, { status: 400 })
  }
}
