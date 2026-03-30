import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteCategory, updateCategory } from '@/lib/tokens/categories'

// TODO: auth guard for admin verbs

const idParam = z.coerce.number().int().positive()
const updateSchema = z.object({
  name: z.string().min(2).max(64).optional(),
  description: z.string().max(400).nullable().optional(),
  icon: z.string().max(16).nullable().optional(),
  color: z.string().max(24).nullable().optional()
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = idParam.parse(idStr)
    const json = await req.json()
    const body = updateSchema.parse(json)
    await updateCategory(id, body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params
    const id = idParam.parse(idStr)
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid category id' }, { status: 400 })
  }
}
