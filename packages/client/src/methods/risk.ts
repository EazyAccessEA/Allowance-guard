import type { AllowanceGuardClient, RequestOptions } from '../client'
import type {
  Address,
  ChainId,
  PortfolioRiskResponse,
  RiskCheckRequest,
  RiskCheckResponse,
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

/**
 * Pre-signing risk assessment for a proposed `approve()` transaction.
 * Call BEFORE the user signs to surface known-spender / unlimited-amount risks.
 */
export function riskCheck(
  client: AllowanceGuardClient,
  args: RiskCheckRequest,
  opts?: RequestOptions,
): Promise<RiskCheckResponse> {
  return client.request<RiskCheckResponse>('/risk-check', {
    method: 'POST',
    signal: opts?.signal,
    body: JSON.stringify(args),
  })
}
