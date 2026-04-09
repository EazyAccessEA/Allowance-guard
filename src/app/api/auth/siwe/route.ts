import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifySiwe, getOrCreateUserByWallet } from '@/lib/siwe'
import { createSession, setSessionCookie } from '@/lib/auth'
import { limitHit } from '@/lib/ratelimit'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  message: z.string().min(32).max(4096),
  signature: z.string().regex(/^0x[0-9a-fA-F]+$/),
})

function getIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Chain IDs we accept in SIWE messages. Reuses the product's supported
 * chain set so users can sign from whatever wallet network they're on.
 */
const ALLOWED_CHAIN_IDS = [
  1,        // Ethereum
  42161,    // Arbitrum
  8453,     // Base
  10,       // Optimism
  137,      // Polygon
  43114,    // Avalanche
  56,       // BNB
  250,      // Fantom
  324,      // zkSync Era
  1101,     // Polygon zkEVM
  5000,     // Mantle
  100,      // Gnosis
  59144,    // Linea
  534352,   // Scroll
  42220,    // Celo
]

function expectedDomainFromRequest(req: Request): string {
  // Prefer the configured public URL (canonical host), fall back to
  // the request's own host header for local dev.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    try { return new URL(appUrl).host } catch {}
  }
  const host = req.headers.get('host')
  return host ?? 'localhost'
}

/**
 * POST /api/auth/siwe
 * Body: { message: string, signature: 0x... }
 *
 * Verifies the SIWE message, consumes the nonce, creates or finds
 * the user by wallet address, issues a 30-day session cookie.
 */
export async function POST(req: Request) {
  // Rate limit — mirrors magic-link request
  const ip = getIp(req)
  const rl = await limitHit(`siwe-verify:${ip}`, 300, 10)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { message, signature } = parsed.data
  const expectedDomain = expectedDomainFromRequest(req)

  const result = await verifySiwe(
    message,
    signature as `0x${string}`,
    { expectedDomain, allowedChainIds: ALLOWED_CHAIN_IDS }
  )

  if (!result.ok) {
    apiLogger.warn('siwe.verify.failed', { reason: result.error, ip })
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  const userId = await getOrCreateUserByWallet(result.address)
  const sessionToken = await createSession(userId)
  await setSessionCookie(sessionToken)

  apiLogger.info('siwe.verify.ok', { userId, chainId: result.chainId })
  return NextResponse.json({
    ok: true,
    address: result.address,
    chainId: result.chainId,
  })
}
