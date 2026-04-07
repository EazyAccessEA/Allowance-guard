import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Chain } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'
import { allowanceGuardQueryKeys } from '../query-keys'

export function useChains(options?: { enabled?: boolean }): UseQueryResult<Chain[], Error> {
  const client = useAllowanceGuardClient()
  return useQuery({
    queryKey: allowanceGuardQueryKeys.chains(),
    queryFn: ({ signal }) => client.getChains({ signal }),
    staleTime: 60 * 60 * 1000, // chains list is effectively static
    enabled: options?.enabled ?? true,
  })
}
