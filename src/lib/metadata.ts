import { pool } from '@/lib/db'
import { clientFor } from './chains'
import { readContract } from 'viem'
import { ERC20_READ_ABI, ERC721_READ_ABI } from './abi'

const TTL_DAYS = 30 // refresh every ~month

function isFresh(updatedAt?: string | null) {
  if (!updatedAt) return false
  return (Date.now() - new Date(updatedAt).getTime()) < TTL_DAYS*24*60*60*1000
}

export async function getTokenMeta(chainId: number, token: string) {
  token = token.toLowerCase()
  const { rows } = await pool.query(
    `SELECT standard, name, symbol, decimals, to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as updated_iso
       FROM token_metadata WHERE chain_id=$1 AND token_address=$2`,
    [chainId, token]
  )
  return rows[0] || null
}

export async function saveTokenMeta(chainId: number, token: string, standard:'ERC20'|'ERC721'|'ERC1155'|'UNKNOWN', name:string|null, symbol:string|null, decimals:number|null) {
  await pool.query(
    `INSERT INTO token_metadata (chain_id, token_address, standard, name, symbol, decimals, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,NOW())
     ON CONFLICT (chain_id, token_address)
     DO UPDATE SET standard=EXCLUDED.standard, name=EXCLUDED.name, symbol=EXCLUDED.symbol,
                   decimals=EXCLUDED.decimals, updated_at=NOW()`,
    [chainId, token.toLowerCase(), standard, name, symbol, decimals]
  )
}

export async function enrichTokenMeta(chainId: number, token: string, standardGuess?: string) {
  token = token.toLowerCase()
  const current = await getTokenMeta(chainId, token)
  if (current && isFresh(current.updated_iso)) return current

  const client = clientFor(chainId as any)
  let standard:'ERC20'|'ERC721'|'ERC1155'|'UNKNOWN' = 'UNKNOWN'
  let name: string | null = null
  let symbol: string | null = null
  let decimals: number | null = null

  // Try ERC20 first (most common)
  try {
    const [n, s, d] = await Promise.all([
      readContract(client, { address: token as `0x${string}`, abi: ERC20_READ_ABI, functionName: 'name' }),
      readContract(client, { address: token as `0x${string}`, abi: ERC20_READ_ABI, functionName: 'symbol' }),
      readContract(client, { address: token as `0x${string}`, abi: ERC20_READ_ABI, functionName: 'decimals' })
    ])
    name = (n as any) || null
    symbol = (s as any) || null
    decimals = Number(d as any)
    standard = 'ERC20'
  } catch {
    // Try ERC721
    try {
      const [n, s] = await Promise.all([
        readContract(client, { address: token as `0x${string}`, abi: ERC721_READ_ABI, functionName: 'name' }),
        readContract(client, { address: token as `0x${string}`, abi: ERC721_READ_ABI, functionName: 'symbol' })
      ])
      name = (n as any) || null
      symbol = (s as any) || null
      decimals = null
      standard = 'ERC721'
    } catch {
      // ERC1155 or non-standard; leave UNKNOWN
      standard = (standardGuess as any) || 'UNKNOWN'
    }
  }

  await saveTokenMeta(chainId, token, standard, name, symbol, decimals)
  return { standard, name, symbol, decimals }
}

// --- Spender labels ---

export async function getSpenderLabel(chainId: number, addr: string) {
  const { rows } = await pool.query(
    `SELECT label, trust, to_char(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS updated_iso
       FROM spender_labels WHERE chain_id=$1 AND address=$2`,
    [chainId, addr.toLowerCase()]
  )
  return rows[0] || null
}

export async function saveSpenderLabel(chainId: number, addr: string, label: string, trust:'official'|'curated'|'community'='community') {
  await pool.query(
    `INSERT INTO spender_labels (chain_id, address, label, trust, updated_at)
     VALUES ($1,$2,$3,$4,NOW())
     ON CONFLICT (chain_id, address)
     DO UPDATE SET label=EXCLUDED.label, trust=EXCLUDED.trust, updated_at=NOW()`,
    [chainId, addr.toLowerCase(), label, trust]
  )
}
