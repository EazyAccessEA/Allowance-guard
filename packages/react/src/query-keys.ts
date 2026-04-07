/**
 * Canonical query key factory for @allowance-guard/react.
 *
 * Every hook builds its TanStack Query cache key through this factory so
 * consumers can invalidate the whole package's cache with a single call:
 *
 *   queryClient.invalidateQueries({ queryKey: allowanceGuardQueryKeys.all })
 *
 * Or target a specific resource:
 *
 *   queryClient.invalidateQueries({
 *     queryKey: allowanceGuardQueryKeys.allowances({ wallet }),
 *   })
 */

import type { Address, ChainId } from '@allowance-guard/client'

const ROOT = 'allowance-guard' as const

export const allowanceGuardQueryKeys = {
  all: [ROOT] as const,

  chains: () => [ROOT, 'chains'] as const,

  allowances: (args: {
    wallet: Address
    chainId?: ChainId
    riskOnly?: boolean
    page?: number
    pageSize?: number
  }) => [ROOT, 'allowances', args] as const,

  riskScore: (args: { wallet: Address; chainId?: ChainId }) =>
    [ROOT, 'risk-score', args] as const,

  portfolioRisk: (args: { wallet: Address }) =>
    [ROOT, 'portfolio-risk', args] as const,

  scan: (args: { wallet: Address }) => [ROOT, 'scan', args] as const,
} as const
