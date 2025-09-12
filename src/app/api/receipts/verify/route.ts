import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { setReceiptResult } from '@/lib/receipts'
import { readCurrentAllowance } from '@/lib/allowance_read'

export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { rows } = await pool.query(
    `SELECT id, wallet_address, chain_id, token_address, spender_address, standard, pre_amount
       FROM revocation_receipts WHERE id=$1`, [id]
  )
  const r = rows[0]
  if (!r) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const { amount } = await readCurrentAllowance({
      chainId: Number(r.chain_id),
      standard: r.standard,
      owner: r.wallet_address as `0x${string}`,
      token: r.token_address as `0x${string}`,
      spender: r.spender_address as `0x${string}`
    })
    const ok = BigInt(amount) === 0n
    await setReceiptResult(Number(r.id), ok, BigInt(amount), ok ? undefined : 'Allowance not zero')
    return NextResponse.json({ ok, postAmount: amount.toString() })
  } catch (e: unknown) {
    await setReceiptResult(Number(r.id), false, null, e instanceof Error ? e.message : 'Read failed')
    return NextResponse.json({ ok: false, error: 'Verify failed' }, { status: 500 })
  }
}
