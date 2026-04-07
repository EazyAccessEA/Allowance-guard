/**
 * SSR / RSC helpers for @allowance-guard/react.
 *
 * Planned for v0.2.0. Will expose:
 *   - fetchAllowances(args, { apiKey })
 *   - fetchRiskScore(args, { apiKey })
 *   - prefetchAllowances(queryClient, args, { apiKey })
 *
 * These run in Next.js Server Components and Remix loaders and hand off
 * to the browser via TanStack Query's hydration boundary. See §12 for
 * phasing rationale.
 */

export {}
