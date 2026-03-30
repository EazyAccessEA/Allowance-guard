import { jsonRpc } from './rpc'
import { CHAINS } from '@/lib/networks'
import { normalizeAddress } from '@/lib/eth/normalize'

const SELECTOR = {
  // ERC20
  name: '0x06fdde03',
  symbol: '0x95d89b41',
  decimals: '0x313ce567',
  // ERC165
  supportsInterface: '0x01ffc9a7' // + 4-byte interface id padded
}

// Interface IDs
const IFACE = {
  ERC721: '0x80ac58cd',
  ERC1155: '0xd9b67a26'
}

// const pad32 = (hexNo0x: string) => `0x${hexNo0x}`.padEnd(66, '0')
const toDataSupports = (interfaceId: string) =>
  (SELECTOR.supportsInterface +
    interfaceId.replace(/^0x/, '').padStart(64, '0')).toLowerCase()

async function ethCall(rpcUrl: string, to: string, data: string): Promise<string> {
  return jsonRpc<string>(rpcUrl, 'eth_call', [{ to, data }, 'latest'])
}

async function getCode(rpcUrl: string, addr: string): Promise<string> {
  return jsonRpc<string>(rpcUrl, 'eth_getCode', [addr, 'latest'])
}

function pickRpc(chainId: number): string {
  const chain = CHAINS[chainId]
  if (!chain || !chain.rpcs?.length) throw new Error('No RPC configured for chain')
  // naive pick first; you can add rotation later
  return chain.rpcs[0].url
}

function hexToNumber(hex: string): number {
  if (!hex || hex === '0x') throw new Error('Bad hex')
  return Number(BigInt(hex))
}

async function probeERC20(rpcUrl: string, address: string) {
  const [dec] = await Promise.allSettled([
    ethCall(rpcUrl, address, SELECTOR.decimals),
    ethCall(rpcUrl, address, SELECTOR.name),
    ethCall(rpcUrl, address, SELECTOR.symbol)
  ])

  if (dec.status !== 'fulfilled') return { ok: false as const }
  let decimals = 0
  try { decimals = hexToNumber(dec.value) } catch { return { ok: false as const } }
  // If name/symbol fail, still OK — not all tokens implement both properly
  return { ok: true as const, decimals }
}

async function supportsInterface(rpcUrl: string, address: string, iface: string) {
  try {
    const res = await ethCall(rpcUrl, address, toDataSupports(iface))
    // result is 32-byte bool; EVM returns 0x...1 or 0x...0
    return res.toLowerCase().endsWith('1')
  } catch {
    return false
  }
}

export type DetectedStandard = 'ERC20' | 'ERC721' | 'ERC1155'

export async function validateTokenOnChain(opts: {
  chainId: number
  tokenAddress: string
  claimedStandard?: DetectedStandard
}): Promise<{ valid: true; standard: DetectedStandard; decimals?: number } | { valid: false; reason: string }> {
  const chainId = Number(opts.chainId)
  const address = normalizeAddress(opts.tokenAddress)
  const rpcUrl = pickRpc(chainId)

  // Must be a contract
  const code = await getCode(rpcUrl, address)
  if (!code || code === '0x') return { valid: false, reason: 'No contract code at address' }

  // If caller claims a standard, verify it first (fast-fail if mismatch)
  if (opts.claimedStandard === 'ERC721') {
    const ok721 = await supportsInterface(rpcUrl, address, IFACE.ERC721)
    if (ok721) return { valid: true, standard: 'ERC721' }
    return { valid: false, reason: 'Address does not support ERC721' }
  }
  if (opts.claimedStandard === 'ERC1155') {
    const ok1155 = await supportsInterface(rpcUrl, address, IFACE.ERC1155)
    if (ok1155) return { valid: true, standard: 'ERC1155' }
    return { valid: false, reason: 'Address does not support ERC1155' }
  }
  if (opts.claimedStandard === 'ERC20') {
    const erc20 = await probeERC20(rpcUrl, address)
    if (erc20.ok) return { valid: true, standard: 'ERC20', decimals: erc20.decimals }
    return { valid: false, reason: 'Address does not behave like ERC20' }
  }

  // Auto-detect if no claim
  const [ok721, ok1155] = await Promise.all([
    supportsInterface(rpcUrl, address, IFACE.ERC721),
    supportsInterface(rpcUrl, address, IFACE.ERC1155)
  ])
  if (ok721) return { valid: true, standard: 'ERC721' }
  if (ok1155) return { valid: true, standard: 'ERC1155' }

  const erc20 = await probeERC20(rpcUrl, address)
  if (erc20.ok) return { valid: true, standard: 'ERC20', decimals: erc20.decimals }

  return { valid: false, reason: 'Unknown or unsupported token standard' }
}
