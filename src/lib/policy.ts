import { pool } from '@/lib/db'

export type Policy = {
  min_risk_score: number
  unlimited_only: boolean
  include_spenders: string[]
  ignore_spenders: string[]
  include_tokens: string[]
  ignore_tokens: string[]
  chains: number[]
}

export async function getPolicy(wallet: string): Promise<Policy> {
  const { rows } = await pool.query(
    `SELECT COALESCE(min_risk_score,0) AS min_risk_score,
            COALESCE(unlimited_only,false) AS unlimited_only,
            COALESCE(include_spenders,'{}'::text[]) AS include_spenders,
            COALESCE(ignore_spenders,'{}'::text[]) AS ignore_spenders,
            COALESCE(include_tokens,'{}'::text[]) AS include_tokens,
            COALESCE(ignore_tokens,'{}'::text[]) AS ignore_tokens,
            COALESCE(chains,'{}'::int[]) AS chains
       FROM alert_policies WHERE wallet_address=$1`,
    [wallet]
  )
  return rows[0] ?? {
    min_risk_score: 0, unlimited_only: false,
    include_spenders: [], ignore_spenders: [],
    include_tokens: [],  ignore_tokens: [],
    chains: []
  }
}

type Row = {
  chain_id: number
  token_address: string
  spender_address: string
  risk_score: number
  is_unlimited: boolean
}

export function applyPolicy(rows: Row[], p: Policy) {
  const incS = new Set(p.include_spenders.map(x => x.toLowerCase()))
  const ignS = new Set(p.ignore_spenders.map(x => x.toLowerCase()))
  const incT = new Set(p.include_tokens.map(x => x.toLowerCase()))
  const ignT = new Set(p.ignore_tokens.map(x => x.toLowerCase()))
  const incChains = new Set(p.chains)

  return rows.filter(r => {
    if (p.unlimited_only && !r.is_unlimited) return false
    if (r.risk_score < p.min_risk_score) return false
    if (incChains.size && !incChains.has(r.chain_id)) return false

    const spender = r.spender_address.toLowerCase()
    const token   = r.token_address.toLowerCase()

    if (ignS.has(spender) || ignT.has(token)) return false
    if (incS.size && !incS.has(spender)) return false
    if (incT.size && !incT.has(token)) return false
    return true
  })
}
