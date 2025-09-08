// lib/scanner.ts
import { clientFor } from './chains'
import { ERC20_Approval, ERC721_ApprovalForAll } from './abi'
import { upsertAllowance } from './db'

const CHUNK = BigInt(50_000)  // adjust if RPC complains
const UINT256_MAX = (BigInt(1) << BigInt(256)) - BigInt(1)

async function latestBlock(c: ReturnType<typeof clientFor>) {
  return await c.getBlockNumber()
}

async function rangeChunks(from: bigint, to: bigint) {
  const res: Array<[bigint,bigint]> = []
  let start = from
  while (start <= to) {
    const end = (start + CHUNK - BigInt(1) <= to) ? start + CHUNK - BigInt(1) : to
    res.push([start, end])
    start = end + BigInt(1)
  }
  return res
}

export async function scanWalletOnChain(wallet: string, chainId: 1|42161|8453) {
  const w = wallet.toLowerCase() as `0x${string}`
  const c = clientFor(chainId)
  const tip = await latestBlock(c)

  // 1) ERC20 Approval(owner, spender, value)
  for (const [fromBlock, toBlock] of await rangeChunks(BigInt(0), tip)) {
    const logs = await c.getLogs({
      event: ERC20_Approval,
      args: { owner: w },
      fromBlock, toBlock,
      strict: false
    })
    for (const log of logs) {
      const token = log.address.toLowerCase()
      const args = log.args as { owner: string; spender: string; value: string | bigint }
      const owner = args.owner.toLowerCase()
      const spender = args.spender.toLowerCase()
      const value = BigInt(args.value)
      const isUnlimited = value === UINT256_MAX
      await upsertAllowance({
        wallet: owner,
        chainId,
        token,
        spender,
        standard: 'ERC20',
        allowanceType: 'per-token',
        amount: value,
        isUnlimited,
        lastSeenBlock: BigInt(log.blockNumber)
      })
    }
  }

  // 2) ERC721/1155 ApprovalForAll(owner, operator, approved)
  for (const [fromBlock, toBlock] of await rangeChunks(BigInt(0), tip)) {
    const logs = await c.getLogs({
      event: ERC721_ApprovalForAll,
      args: { owner: w },
      fromBlock, toBlock,
      strict: false
    })
    for (const log of logs) {
      const collection = log.address.toLowerCase()
      const args = log.args as { owner: string; operator: string; approved: boolean }
      const owner = args.owner.toLowerCase()
      const operator = args.operator.toLowerCase()
      const approved = Boolean(args.approved)
      await upsertAllowance({
        wallet: owner,
        chainId,
        token: collection,
        spender: operator,
        standard: 'ERC721',
        allowanceType: 'all-assets',
        amount: approved ? UINT256_MAX : BigInt(0),
        isUnlimited: approved,
        lastSeenBlock: BigInt(log.blockNumber)
      })
    }
  }
}
