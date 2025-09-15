import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    // Quick DB check (if this passes, app is usually ready)
    await pool.query('SELECT 1')
    // Optional: check outstanding migrations, queue backlog, etc.
    return NextResponse.json({ ready: true })
  } catch {
    return NextResponse.json({ ready: false }, { status: 503 })
  }
}
