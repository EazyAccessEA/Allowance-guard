'use client'

import { useAccount, useChainId, useSwitchChain, useWriteContract } from 'wagmi'
import { ERC20_ABI, ERC721_ABI } from '@/lib/abi'

type Row = {
  chain_id: number
  token_address: string
  spender_address: string
  standard: 'ERC20'|'ERC721'|'ERC1155'|string
  allowance_type: 'per-token'|'all-assets'|string
}

export function useRevoke(selectedWallet?: string | null) {
  const { address } = useAccount()
  const activeChainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()

  async function revoke(row: Row) {
    if (!address) throw new Error('Connect your wallet first')
    if (!selectedWallet || selectedWallet.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Connect the selected wallet to revoke')
    }

    // Ensure we're on the correct chain
    if (activeChainId !== row.chain_id) {
      await switchChainAsync({ chainId: row.chain_id })
    }

    // Build the tx per standard
    if (row.standard === 'ERC20') {
      // approve(spender, 0)
      const hash = await writeContractAsync({
        address: row.token_address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [row.spender_address as `0x${string}`, BigInt(0)],
        chainId: row.chain_id
      })
      return hash
    } else if (row.standard === 'ERC721' || row.standard === 'ERC1155') {
      // setApprovalForAll(operator,false)
      const hash = await writeContractAsync({
        address: row.token_address as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'setApprovalForAll',
        args: [row.spender_address as `0x${string}`, false],
        chainId: row.chain_id
      })
      return hash
    } else {
      throw new Error(`Unsupported standard: ${row.standard}`)
    }
  }

  return { revoke }
}
