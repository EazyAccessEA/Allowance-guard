// /src/app/api/coinbase/create-charge/route.ts
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { limitOrThrow } from '@/lib/ratelimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Body = {
  amount: number // minor units (e.g., 100 = 1.00)
  currency?: string // optional, default GBP
  email?: string // optional email for receipt
}

function toDecimalString(minor: number) {
  // Convert 100 -> "1.00", 250 -> "2.50"
  const whole = Math.floor(minor / 100)
  const cents = Math.abs(minor % 100)
  return `${whole}.${cents.toString().padStart(2, '0')}`
}

export async function POST(req: Request) {
  try {
    const h = await nextHeaders()
    const ip = h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown'
    await limitOrThrow(ip, 'coinbase-charge')

    const apiKey = process.env.COINBASE_COMMERCE_API_KEY
    const apiBase = process.env.COINBASE_COMMERCE_API_BASE || 'https://api.commerce.coinbase.com'
    const version = process.env.COINBASE_COMMERCE_VERSION || '2018-03-22'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!apiKey)  return NextResponse.json({ error: 'Missing COINBASE_COMMERCE_API_KEY' }, { status: 500 })
    if (!appUrl)  return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 })

    const MIN = Number(process.env.DONATION_MIN_MINOR ?? 100)
    const MAX = Number(process.env.DONATION_MAX_MINOR ?? 500000)

    const { amount, currency = 'GBP', email }: Body = await req.json()

    if (!amount || isNaN(amount) || amount < MIN || amount > MAX) {
      return NextResponse.json({ error: `Amount must be between ${(MIN/100).toFixed(2)} and ${(MAX/100).toFixed(2)}` }, { status: 400 })
    }
    const curr = (currency || 'GBP').toUpperCase()
    const amountDecimal = toDecimalString(amount)

    // Coinbase recommends idempotency key to avoid duplicate charges on retries
    const idempotencyKey =
      (global as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`

    // Build charge payload: fixed-price in fiat (mirrors your Stripe behavior)
    const payload = {
      name: 'Contribution to Allowance Guard',
      description: 'Support the ongoing development and security of Allowance Guard.',
      pricing_type: 'fixed_price',
      local_price: {
        amount: amountDecimal, // e.g., "10.00"
        currency: curr,        // e.g., "GBP"
      },
      metadata: {
        source: 'allowanceguard.com',
        email: email || null,
      },
      redirect_url: `${appUrl}/thank-you`,
      cancel_url: `${appUrl}/contribute`,
    }

    const res = await fetch(`${apiBase}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': version,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Coinbase Commerce error:', text)
      return NextResponse.json({ error: 'Failed to create Coinbase charge' }, { status: 502 })
    }

    const data = await res.json()
    // Coinbase response shape: { data: { hosted_url, code, ... } }
    const hosted = data?.data?.hosted_url
    const code = data?.data?.code

    if (!hosted) {
      return NextResponse.json({ error: 'Charge created but no hosted_url returned' }, { status: 500 })
    }

    return NextResponse.json({ hosted_url: hosted, code })
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.error('Coinbase create-charge error:', errorMessage)
    if ((e as Error & { status?: number }).status === 429) {
      return NextResponse.json({ error: (e as Error).message }, { status: 429 })
    }
    return NextResponse.json({ error: 'Server error creating charge' }, { status: 500 })
  }
}
