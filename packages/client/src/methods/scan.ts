import type { AllowanceGuardClient, RequestOptions } from '../client'
import type { Address, ChainId, ScanResponse } from '../types'

export interface ScanArgs {
  wallet: Address
  chains?: ChainId[]
}

export function triggerScan(
  client: AllowanceGuardClient,
  args: ScanArgs,
  opts?: RequestOptions,
): Promise<ScanResponse> {
  return client.request<ScanResponse>('/scan', {
    method: 'POST',
    signal: opts?.signal,
    body: JSON.stringify({ wallet: args.wallet, chains: args.chains }),
  })
}
