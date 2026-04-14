/**
 * Hand-authored types for the v0 skeleton of @allowance-guard/client.
 *
 * These will be REPLACED by types generated from the OpenAPI 3.1 spec at
 * `src/app/api/v1/openapi.json` once the backend spec generation is wired
 * up (see §5 of the architecture plan). Do not extend this file ad-hoc
 * — any new surface should be added to the OpenAPI spec first.
 */

export type Address = `0x${string}`
export type ChainId = number

export interface Chain {
  chainId: ChainId
  name: string
  symbol: string
  explorer: string
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface Allowance {
  chain_id: ChainId
  token_address: Address
  spender_address: Address
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: number
  risk_score: number
  risk_flags: string[] | null
  token_name: string | null
  token_symbol: string | null
  token_decimals: number | null
  spender_label: string | null
  spender_trust: string | null
}

export interface AllowancesResponse {
  allowances: Allowance[]
  pagination: Pagination
}

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'

export interface RiskScoreResponse {
  wallet: Address
  chainId: ChainId | 'all'
  riskScore: number
  riskLevel: RiskLevel
  breakdown: {
    totalAllowances: number
    unlimitedAllowances: number
    highRisk: number
    mediumRisk: number
    lowRisk: number
    maxIndividualScore: number
    avgRiskScore: number
    chainsWithAllowances: number
  }
  topRisks: Array<{
    chain_id: ChainId
    token_address: Address
    spender_address: Address
    risk_score: number
    risk_flags: string[] | null
    is_unlimited: boolean
    token_symbol: string | null
    spender_label: string | null
  }>
}

export interface PortfolioRiskResponse {
  wallet: Address
  portfolioRiskScore: number
  riskLevel: RiskLevel
  summary: {
    chainsWithAllowances: number
    totalAllowances: number
    unlimitedAllowances: number
    highRiskAllowances: number
    permit2Allowances: number
    estimatedTotalValueUsd: number
  }
  trend: {
    direction: 'improving' | 'worsening' | 'stable'
    deltaScore: number
    period: string
    message: string
  }
  benchmark: {
    saferThanPercent: number
    message: string
    totalWalletsCompared: number
  }
  chainBreakdown: Array<{
    chainId: ChainId
    chainName: string
    totalAllowances: number
    unlimitedAllowances: number
    highRiskCount: number
    estimatedValueUsd: number
    riskScore: number
    permit2Allowances: number
  }>
}

export interface RiskCheckRequest {
  token: Address
  spender: Address
  chainId: ChainId
  /** Raw integer amount as a decimal string, or the literal `"unlimited"`. */
  amount?: string
}

export interface RiskCheckFlag {
  code: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
}

export interface RiskCheckResponse {
  chainId: ChainId
  token: {
    address: Address
    name: string | null
    symbol: string | null
    decimals: number | null
  }
  spender: {
    address: Address
    label: string | null
    trusted: boolean
    affectedWallets: number
  }
  approval: {
    amount: string | null
    isUnlimited: boolean
  }
  risk: {
    score: number
    level: RiskLevel
    flags: RiskCheckFlag[]
  }
  recommendation: string
}

export interface ScanResponse {
  scanId: number
  wallet: Address
  chains: ChainId[]
  status: 'pending' | 'running' | 'complete' | 'failed'
  statusUrl: string
}

export interface SimulateRevokeArgs {
  wallet: Address
  chainId?: ChainId
  revokeAll?: boolean
  revokeSpenders?: Address[]
}

export interface SimulateResponse {
  wallet: Address
  chainId: ChainId | 'all'
  simulation: {
    before: {
      riskScore: number
      totalAllowances: number
      unlimitedAllowances: number
      highRisk: number
      mediumRisk: number
    }
    after: {
      riskScore: number
      totalAllowances: number
      unlimitedAllowances: number
      highRisk: number
      mediumRisk: number
    }
    improvement: {
      scoreReduction: number
      allowancesRevoked: number
      percentImprovement: number
    }
  }
}
