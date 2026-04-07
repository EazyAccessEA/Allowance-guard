import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Address, ChainId, RiskScoreResponse } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'
import { allowanceGuardQueryKeys } from '../query-keys'

export interface UseRiskScoreArgs {
  wallet: Address | undefined
  chainId?: ChainId
  enabled?: boolean
}

export function useRiskScore(args: UseRiskScoreArgs): UseQueryResult<RiskScoreResponse, Error> {
  const client = useAllowanceGuardClient()
  const { wallet, chainId, enabled = true } = args
  return useQuery({
    queryKey: allowanceGuardQueryKeys.riskScore({
      wallet: wallet ?? ('0x' as Address),
      chainId,
    }),
    queryFn: ({ signal }) => client.getRiskScore({ wallet: wallet!, chainId }, { signal }),
    enabled: enabled && Boolean(wallet),
    staleTime: 30 * 1000,
  })
}
