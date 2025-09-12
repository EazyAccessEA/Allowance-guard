import { pool } from '@/lib/db'

export async function createReceipt(r: {
  wallet: string, chainId: number, token: string, spender: string,
  standard: 'ERC20'|'ERC721'|'ERC1155', allowanceType: 'per-token'|'all-assets',
  preAmount: string | bigint, txHash: string
}) {
  const q = `
    INSERT INTO revocation_receipts
    (wallet_address, chain_id, token_address, spender_address, standard, allowance_type, pre_amount, tx_hash)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id
  `
  const v = [r.wallet.toLowerCase(), r.chainId, r.token.toLowerCase(), r.spender.toLowerCase(),
             r.standard, r.allowanceType, r.preAmount.toString(), r.txHash.toLowerCase()]
  const { rows } = await pool.query(q, v)
  return rows[0].id as number
}

export async function listReceipts(wallet: string, limit = 50) {
  const q = `
    SELECT id, chain_id, token_address, spender_address, standard, allowance_type,
           pre_amount, post_amount, tx_hash, status, error, created_at, verified_at
    FROM revocation_receipts
    WHERE wallet_address = $1
    ORDER BY created_at DESC
    LIMIT $2
  `
  const { rows } = await pool.query(q, [wallet.toLowerCase(), limit])
  return rows
}

export async function setReceiptResult(id: number, ok: boolean, postAmount: bigint | null, err?: string) {
  if (ok) {
    await pool.query(
      `UPDATE revocation_receipts
         SET status='verified', post_amount=$2, verified_at=NOW()
       WHERE id=$1`, [id, postAmount?.toString() ?? '0']
    )
  } else {
    await pool.query(
      `UPDATE revocation_receipts
         SET status='mismatch', post_amount=$2, verified_at=NOW(), error=$3
       WHERE id=$1`, [id, postAmount?.toString() ?? null, (err || '').slice(0, 1000)]
    )
  }
}
