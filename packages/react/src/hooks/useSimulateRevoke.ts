import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { SimulateResponse, SimulateRevokeArgs } from '@allowance-guard/client'
import { useAllowanceGuardClient } from '../provider'

export function useSimulateRevoke(): UseMutationResult<
  SimulateResponse,
  Error,
  SimulateRevokeArgs
> {
  const client = useAllowanceGuardClient()
  return useMutation({
    mutationFn: (args: SimulateRevokeArgs) => client.simulateRevoke(args),
  })
}
