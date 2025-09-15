// lib/http.ts
import { NextResponse } from 'next/server'
import { ZodError, ZodSchema } from 'zod'

export function badRequest(msg = 'Bad request') {
  return NextResponse.json({ error: msg }, { status: 400 })
}

export function serverError() {
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}

export function zodParse<T>(schema: ZodSchema<T>, data: unknown) {
  const res = schema.safeParse(data)
  if (!res.success) {
    const z = res.error as ZodError
    const msg = z.issues?.[0]?.message || 'Bad request'
    throw new Response(JSON.stringify({ error: msg }), { status: 400 })
  }
  return res.data as T
}
