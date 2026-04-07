import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Address, PortfolioRiskResponse } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'
import { allowanceGuardQueryKeys } from '../query-keys'

export interface UsePortfolioRiskArgs {
  wallet: Address | undefined
  enabled?: boolean
}

export function usePortfolioRisk(
  args: UsePortfolioRiskArgs,
): UseQueryResult<PortfolioRiskResponse, Error> {
  const client = useAllowanceGuardClient()
  const { wallet, enabled = true } = args
  return useQuery({
    queryKey: allowanceGuardQueryKeys.portfolioRisk({ wallet: wallet ?? ('0x' as Address) }),
    queryFn: ({ signal }) => client.getPortfolioRisk({ wallet: wallet! }, { signal }),
    enabled: enabled && Boolean(wallet),
    staleTime: 60 * 1000,
  })
}
