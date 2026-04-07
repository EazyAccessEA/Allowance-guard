import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { Address, ChainId } from '@allowance-guard/client'

/**
 * Builds an unsigned ERC-20 `approve(spender, 0)` transaction that a
 * caller can hand to `wagmi`'s `useSendTransaction` (or any other signer).
 *
 * This hook deliberately does NOT sign or broadcast. It returns the
 * transaction request so integrators retain full control over signing,
 * gas overrides, and simulation — see v0.3.0 in the architecture plan
 * for the tighter wagmi-interop work.
 */

export interface RevokeApprovalVariables {
  wallet: Address
  token: Address
  spender: Address
  chainId: ChainId
}

export interface UnsignedTxRequest {
  to: Address
  data: `0x${string}`
  value: '0x0'
  chainId: ChainId
}

// ERC-20 `approve(address,uint256)` selector.
const APPROVE_SELECTOR = '0x095ea7b3'

function encodeApproveZero(spender: Address): `0x${string}` {
  const spenderPadded = spender.toLowerCase().replace(/^0x/, '').padStart(64, '0')
  const amountPadded = '0'.padStart(64, '0')
  return `${APPROVE_SELECTOR}${spenderPadded}${amountPadded}` as `0x${string}`
}

export function useRevokeApproval(): UseMutationResult<
  UnsignedTxRequest,
  Error,
  RevokeApprovalVariables
> {
  return useMutation({
    mutationFn: async (vars: RevokeApprovalVariables): Promise<UnsignedTxRequest> => {
      return {
        to: vars.token,
        data: encodeApproveZero(vars.spender),
        value: '0x0',
        chainId: vars.chainId,
      }
    },
  })
}
