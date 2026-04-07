import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Address, ScanResponse } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'
import { allowanceGuardQueryKeys } from '../query-keys'

/**
 * Read-side of the scan resource. Currently the v1 scan endpoint is
 * POST-only, so `useScan` is a placeholder for when a GET /scan/:id
 * status endpoint lands. For triggering a scan, see `useScanWallet`.
 */
export interface UseScanArgs {
  wallet: Address | undefined
  enabled?: boolean
}

export function useScan(args: UseScanArgs): UseQueryResult<ScanResponse, Error> {
  const client = useAllowanceGuardClient()
  const { wallet, enabled = false } = args
  return useQuery({
    queryKey: allowanceGuardQueryKeys.scan({ wallet: wallet ?? ('0x' as Address) }),
    // Placeholder: no GET endpoint yet. Enabling this hook is a no-op until
    // the backend exposes a scan-status GET route.
    queryFn: async () => {
      throw new Error(
        '@allowance-guard/react: useScan read-side not yet supported. ' +
          'Use useScanWallet to trigger a scan.',
      )
      // Unreachable, but keeps TS happy about return type:
      // eslint-disable-next-line no-unreachable
      return {} as ScanResponse
    },
    enabled: enabled && Boolean(wallet),
  })
}
