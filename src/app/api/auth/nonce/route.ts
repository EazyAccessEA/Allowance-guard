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
  // 120/min per IP. Raised from 30 after the Pro upgrade flow hit 429s
  // on a single user's IP while debugging. A home/office NAT shares one
  // IP across multiple users, and a wallet-reject-retry costs two
  // nonces per attempt — 30/min was far too tight for a gate real users
  // cross 1–2 times in their entire session lifetime. The nonce table
  // stays safe: each nonce is single-use and expires, so even a 300/min
  // bucket wouldn't pollute it meaningfully.
  const rl = await limitHit(`siwe-nonce:${ip}`, 60, 120)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const nonce = await issueNonce()
  return NextResponse.json({ nonce })
}
