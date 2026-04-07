import type { AllowanceGuardClient, RequestOptions } from '../client'
import type { Address, AllowancesResponse, ChainId } from '../types'

export interface ListAllowancesArgs {
  wallet: Address
  chainId?: ChainId
  riskOnly?: boolean
  page?: number
  pageSize?: number
}

export function listAllowances(
  client: AllowanceGuardClient,
  args: ListAllowancesArgs,
  opts?: RequestOptions,
): Promise<AllowancesResponse> {
  return client.request<AllowancesResponse>('/allowances', {
    method: 'GET',
    signal: opts?.signal,
    query: {
      wallet: args.wallet,
      chainId: args.chainId,
      riskOnly: args.riskOnly,
      page: args.page,
      pageSize: args.pageSize,
    },
  })
}
