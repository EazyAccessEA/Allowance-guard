---
"@allowance-guard/client": minor
"@allowance-guard/react": minor
---

Initial scaffold of the `@allowance-guard/client` and `@allowance-guard/react` packages.

- Framework-agnostic TypeScript client with typed errors (Auth, RateLimit, Validation, Network, Api) and methods for `chains`, `allowances`, `risk-score`, `portfolio-risk`, `scan`, `simulate`.
- React hooks package built on `@tanstack/react-query` peer dependency: `useChains`, `useAllowances`, `useRiskScore`, `usePortfolioRisk`, `useScan`, `useScanWallet`, `useSimulateRevoke`, `useRevokeApproval`.
- Hard-fails on secret keys (`ag_live_*`) used in browser context.
- Suspense and server subpaths stubbed for v0.2.0.

Not yet published. Public-key API tier (`ag_pub_*`) and OpenAPI-driven type generation remain blocking dependencies — see `docs/architecture/allowance-guard-react-hooks.md` §11.
