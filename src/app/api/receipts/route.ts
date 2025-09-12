import { NextResponse } from 'next/server'
import { createReceipt, listReceipts } from '@/lib/receipts'
import { z } from 'zod'

const Create = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.number().int(),
  token: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  spender: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  standard: z.enum(['ERC20','ERC721','ERC1155']),
  allowanceType: z.enum(['per-token','all-assets']),
  preAmount: z.string(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/)
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  const rows = await listReceipts(wallet, Math.min(100, Number(searchParams.get('limit') || 50)))
  return NextResponse.json({ receipts: rows })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = Create.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  const id = await createReceipt({
    wallet: parsed.data.wallet, chainId: parsed.data.chainId,
    token: parsed.data.token, spender: parsed.data.spender,
    standard: parsed.data.standard, allowanceType: parsed.data.allowanceType,
    preAmount: parsed.data.preAmount, txHash: parsed.data.txHash
  })
  return NextResponse.json({ ok: true, id })
}
