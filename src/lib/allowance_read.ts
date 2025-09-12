import { clientFor } from './chains'
import { readContract } from 'viem'
import { ERC20_READ_ABI, ERC721_READ_ABI, ERC1155_READ_ABI } from './abi'

export async function readCurrentAllowance(params: {
  chainId: number
  standard: 'ERC20'|'ERC721'|'ERC1155'
  owner: `0x${string}`
  token: `0x${string}`
  spender: `0x${string}`
}): Promise<{ amount: bigint, isUnlimited: boolean }> {
  const client = clientFor(params.chainId as any)
  if (params.standard === 'ERC20') {
    const amt = await readContract(client, {
      address: params.token, abi: ERC20_READ_ABI,
      functionName: 'allowance', args: [params.owner, params.spender]
    }) as bigint
    return { amount: amt, isUnlimited: false } // unlimited represented by huge value; compare in UI if needed
  }
  // ERC721/1155 use isApprovedForAll → map true => unlimited, false => 0
  const abi = params.standard === 'ERC721' ? ERC721_READ_ABI : ERC1155_READ_ABI
  const approved = await readContract(client, {
    address: params.token, abi,
    functionName: 'isApprovedForAll', args: [params.owner, params.spender]
  }) as boolean
  return { amount: approved ? (1n<<256n)-1n : 0n, isUnlimited: approved }
}
