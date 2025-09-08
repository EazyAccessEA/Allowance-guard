// lib/abi.ts
import { Abi, AbiEvent } from 'viem'

export const ERC20_Approval: AbiEvent = {
  type: 'event',
  name: 'Approval',
  inputs: [
    { name: 'owner', type: 'address', indexed: true },
    { name: 'spender', type: 'address', indexed: true },
    { name: 'value', type: 'uint256', indexed: false }
  ]
}

export const ERC721_ApprovalForAll: AbiEvent = {
  type: 'event',
  name: 'ApprovalForAll',
  inputs: [
    { name: 'owner', type: 'address', indexed: true },
    { name: 'operator', type: 'address', indexed: true },
    { name: 'approved', type: 'bool', indexed: false }
  ]
}

// Write ABIs
export const ERC20_ABI: Abi = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool', name: '' }]
  }
]

export const ERC721_ABI: Abi = [
  {
    type: 'function',
    name: 'setApprovalForAll',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' }
    ],
    outputs: []
  }
]

// (Optional later) ERC721 "Approval" for single tokenId if you want per-token entries
