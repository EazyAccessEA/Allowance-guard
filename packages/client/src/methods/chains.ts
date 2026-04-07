import type { AllowanceGuardClient, RequestOptions } from '../client'
import type { Chain } from '../types'

export async function getChains(
  client: AllowanceGuardClient,
  opts?: RequestOptions,
): Promise<Chain[]> {
  const data = await client.request<{ chains: Chain[]; count: number }>('/chains', {
    method: 'GET',
    signal: opts?.signal,
  })
  return data.chains
}
