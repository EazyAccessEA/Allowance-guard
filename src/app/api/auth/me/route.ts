import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: s.user_id, email: s.email, name: s.name } })
}
