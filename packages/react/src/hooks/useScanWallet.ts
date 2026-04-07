import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { Address, ChainId, ScanResponse } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'
import { allowanceGuardQueryKeys } from '../query-keys'

export interface ScanWalletVariables {
  wallet: Address
  chains?: ChainId[]
}

export function useScanWallet(): UseMutationResult<ScanResponse, Error, ScanWalletVariables> {
  const client = useAllowanceGuardClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vars: ScanWalletVariables) => client.triggerScan(vars),
    onSuccess: (_data, vars) => {
      // Invalidate allowances + risk for this wallet — new scan may change them.
      queryClient.invalidateQueries({
        queryKey: allowanceGuardQueryKeys.allowances({ wallet: vars.wallet }),
      })
      queryClient.invalidateQueries({
        queryKey: allowanceGuardQueryKeys.riskScore({ wallet: vars.wallet }),
      })
      queryClient.invalidateQueries({
        queryKey: allowanceGuardQueryKeys.portfolioRisk({ wallet: vars.wallet }),
      })
    },
  })
}
