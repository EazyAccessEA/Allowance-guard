# @allowance-guard/react

> React hooks for [AllowanceGuard](https://www.allowanceguard.com) — wallet security,
> token approval monitoring, and one-click revocation inside your own dApp.

**Status:** `0.0.x` — pre-alpha scaffold. The API surface is **not frozen**. See
[`docs/architecture/allowance-guard-react-hooks.md`](../../docs/architecture/allowance-guard-react-hooks.md)
for the full architecture plan and roadmap to 1.0.

## Install

```bash
pnpm add @allowance-guard/react @allowance-guard/client @tanstack/react-query
```

`react`, `@tanstack/react-query`, and `@allowance-guard/client` are **peer
dependencies**. Most Web3 apps already have `@tanstack/react-query`
installed because wagmi v2 requires it.

## Quickstart

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AllowanceGuardProvider, useRiskScore } from '@allowance-guard/react'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AllowanceGuardProvider apiKey={process.env.NEXT_PUBLIC_ALLOWANCE_GUARD_KEY!}>
        <WalletRiskBadge wallet="0xabc..." />
      </AllowanceGuardProvider>
    </QueryClientProvider>
  )
}

function WalletRiskBadge({ wallet }: { wallet: `0x${string}` }) {
  const { data, isLoading, error } = useRiskScore({ wallet })
  if (isLoading) return <span>Scanning…</span>
  if (error) return <span>Error: {error.message}</span>
  return <span>Risk: {data?.riskLevel} ({data?.riskScore}/100)</span>
}
```

## Hooks

### Read hooks

- `useChains()` — list supported chains
- `useAllowances({ wallet, chainId?, riskOnly?, page?, pageSize? })`
- `useRiskScore({ wallet, chainId? })`
- `usePortfolioRisk({ wallet })`
- `useScan({ wallet })` — *placeholder (v0.2)*

### Mutation hooks

- `useScanWallet()` — trigger a fresh scan
- `useSimulateRevoke()` — "time machine" before/after risk comparison
- `useRevokeApproval()` — returns an unsigned `approve(spender, 0)` tx
  that you pass to `wagmi`'s `useSendTransaction`

All hooks return standard TanStack Query shapes
(`{ data, error, isLoading, isSuccess, refetch }` for queries,
`{ mutate, mutateAsync, data, error, isPending }` for mutations).

## Auth

Use a **public key** (`ag_pub_*`) in browser code. The provider will throw
at construction if it detects a secret key (`ag_live_*`) in a browser context.

## Cache invalidation

```ts
import { allowanceGuardQueryKeys } from '@allowance-guard/react'

// Invalidate everything from this package:
queryClient.invalidateQueries({ queryKey: allowanceGuardQueryKeys.all })

// Invalidate just one wallet's allowances:
queryClient.invalidateQueries({
  queryKey: allowanceGuardQueryKeys.allowances({ wallet }),
})
```

## License

GPL-3.0-or-later. Commercial licensing available — `legal.support@allowanceguard.com`.
