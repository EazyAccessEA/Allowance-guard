/**
 * @allowance-guard/react — React hooks for AllowanceGuard.
 *
 * Built on top of:
 *   - @allowance-guard/client  (transport)
 *   - @tanstack/react-query    (caching / dedup / SSR)
 *
 * Consumers bring their own QueryClient. If no QueryClient is found in
 * context, every hook throws a clear error at first call. See §2 (Architect
 * of State) and §13 open question 3 in the architecture plan.
 */

export { AllowanceGuardProvider, useAllowanceGuardClient } from './provider'
export type { AllowanceGuardProviderProps } from './provider'

export { useChains } from './hooks/useChains'
export { useAllowances } from './hooks/useAllowances'
export { useRiskScore } from './hooks/useRiskScore'
export { usePortfolioRisk } from './hooks/usePortfolioRisk'
export { useScan } from './hooks/useScan'

export { useScanWallet } from './hooks/useScanWallet'
export { useSimulateRevoke } from './hooks/useSimulateRevoke'
export { useRevokeApproval } from './hooks/useRevokeApproval'

export { allowanceGuardQueryKeys } from './query-keys'
