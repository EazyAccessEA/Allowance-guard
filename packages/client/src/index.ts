/**
 * @allowance-guard/client — framework-agnostic TypeScript client
 * for the AllowanceGuard REST API.
 *
 * This package is consumed directly by server-side integrators and is
 * wrapped by `@allowance-guard/react` for the React hooks distribution.
 *
 * See docs/architecture/allowance-guard-react-hooks.md for design intent.
 */

export { AllowanceGuardClient, createClient } from './client'
export type { ClientOptions, RequestOptions } from './client'

export {
  AllowanceGuardError,
  ApiError,
  NetworkError,
  RateLimitError,
  AuthError,
  ValidationError,
} from './errors'

export type {
  Address,
  ChainId,
  Chain,
  Allowance,
  AllowancesResponse,
  Pagination,
  RiskScoreResponse,
  RiskLevel,
  PortfolioRiskResponse,
  RiskCheckRequest,
  RiskCheckResponse,
  RiskCheckFlag,
  ScanResponse,
  SimulateRevokeArgs,
  SimulateResponse,
} from './types'

export type { ListAllowancesArgs } from './methods/allowances'
export type { GetRiskScoreArgs } from './methods/risk'
export type { ScanArgs } from './methods/scan'
