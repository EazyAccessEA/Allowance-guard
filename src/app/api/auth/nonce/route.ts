import { NextResponse } from 'next/server'
import { issueNonce } from '@/lib/siwe'
import { limitHit } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * GET /api/auth/nonce — issues a single-use SIWE nonce.
 *
 * The client includes this nonce in the SIWE message it signs.
 * The nonce is consumed atomically by POST /api/auth/siwe.
 *
 * Rate-limited per IP to prevent nonce-table pollution.
 */
export async function GET(req: Request) {
  const ip = getIp(req)
  const rl = await limitHit(`siwe-nonce:${ip}`, 60, 30)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const nonce = await issueNonce()
  return NextResponse.json({ nonce })
}
