import { NextResponse } from 'next/server'
import { db } from '@/db'
import { donations } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const rows = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt))
    .limit(20)

  return NextResponse.json(rows)
}
