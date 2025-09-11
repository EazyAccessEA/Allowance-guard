import { pool } from '@/lib/db'
import { enrichTokenMeta, getSpenderLabel, saveSpenderLabel } from './metadata'

const KNOWN_SPENDERS: Record<number, Record<string, string>> = {
  1: {
    // Ethereum mainnet - add a few high-signal defaults (lowercased)
    '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3 Router',
    '0x00000000006c3852cbef3e08e8df289169ede581': 'Seaport (OpenSea)',
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V2 Router',
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2 Router',
    '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router',
    '0xdef1c0ded9bec7f1a1670819833240f027b25eff': '0x Protocol',
    '0x881d40237659c251811cec9c364ef91dc08d300c': 'Metamask Swap Router',
    '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': 'Uniswap Universal Router',
  },
  42161: {
    // Arbitrum
    '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3 Router',
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V2 Router',
    '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router',
  },
  8453: {
    // Base
    '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3 Router',
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V2 Router',
    '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router',
  }
}

export async function enrichWallet(wallet: string) {
  wallet = wallet.toLowerCase()

  // pull distinct tokens & spenders for this wallet
  const { rows: uniq } = await pool.query(
    `SELECT DISTINCT chain_id, token_address, spender_address, standard
       FROM allowances WHERE wallet_address=$1`,
    [wallet]
  )

  for (const r of uniq) {
    // token metadata
    await enrichTokenMeta(Number(r.chain_id), r.token_address, r.standard)

    // spender label (if known or missing)
    const chainId = Number(r.chain_id)
    const spender = (r.spender_address as string).toLowerCase()
    const existing = await getSpenderLabel(chainId, spender)
    if (!existing) {
      const guess = KNOWN_SPENDERS[chainId]?.[spender]
      if (guess) {
        await saveSpenderLabel(chainId, spender, guess, 'curated')
      }
    }
  }
}
