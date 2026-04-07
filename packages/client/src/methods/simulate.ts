import type { AllowanceGuardClient, RequestOptions } from '../client'
import type { SimulateResponse, SimulateRevokeArgs } from '../types'

export function simulateRevoke(
  client: AllowanceGuardClient,
  args: SimulateRevokeArgs,
  opts?: RequestOptions,
): Promise<SimulateResponse> {
  return client.request<SimulateResponse>('/simulate', {
    method: 'POST',
    signal: opts?.signal,
    body: JSON.stringify(args),
  })
}
