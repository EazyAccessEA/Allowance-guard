'use client'
import { useRevoke } from './useRevoke'

type AllowanceRow = {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: string
  risk_score: number
  risk_flags: string[]
}

export function useBulkRevoke() {
  const { revoke } = useRevoke()

  async function revokeMany(rows: AllowanceRow[], onProgress?: (i:number, total:number)=>void) {
    for (let i = 0; i < rows.length; i++) {
      onProgress?.(i+1, rows.length)
      try { await revoke(rows[i]) } catch { /* continue to next */ }
    }
  }
  return { revokeMany }
}
