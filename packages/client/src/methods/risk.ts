import type { AllowanceGuardClient, RequestOptions } from '../client'
import type {
  Address,
  ChainId,
  PortfolioRiskResponse,
  RiskScoreResponse,
} from '../types'

export interface GetRiskScoreArgs {
  wallet: Address
  chainId?: ChainId
}

export function getRiskScore(
  client: AllowanceGuardClient,
  args: GetRiskScoreArgs,
  opts?: RequestOptions,
): Promise<RiskScoreResponse> {
  return client.request<RiskScoreResponse>('/risk-score', {
    method: 'GET',
    signal: opts?.signal,
    query: { wallet: args.wallet, chainId: args.chainId },
  })
}

export function getPortfolioRisk(
  client: AllowanceGuardClient,
  args: { wallet: Address },
  opts?: RequestOptions,
): Promise<PortfolioRiskResponse> {
  return client.request<PortfolioRiskResponse>('/portfolio-risk', {
    method: 'GET',
    signal: opts?.signal,
    query: { wallet: args.wallet },
  })
}
