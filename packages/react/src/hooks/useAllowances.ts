import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Address, AllowancesResponse, ChainId } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'
import { allowanceGuardQueryKeys } from '../query-keys'

export interface UseAllowancesArgs {
  wallet: Address | undefined
  chainId?: ChainId
  riskOnly?: boolean
  page?: number
  pageSize?: number
  enabled?: boolean
}

export function useAllowances(args: UseAllowancesArgs): UseQueryResult<AllowancesResponse, Error> {
  const client = useAllowanceGuardClient()
  const { wallet, enabled = true, ...rest } = args
  return useQuery({
    queryKey: allowanceGuardQueryKeys.allowances({
      wallet: wallet ?? ('0x' as Address),
      ...rest,
    }),
    queryFn: ({ signal }) => client.listAllowances({ wallet: wallet!, ...rest }, { signal }),
    enabled: enabled && Boolean(wallet),
    staleTime: 15 * 1000,
  })
}
