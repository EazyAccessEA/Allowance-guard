# React Hooks — Execution Status

> Companion to `docs/architecture/allowance-guard-react-hooks.md`.
> Tracks what is actually on disk vs. what remains before `v0.1.0` can be published.

## ✅ Completed this session

### Workspace
- `pnpm-workspace.yaml` registers `packages/*` alongside existing `sdk` and `extension`.

### `packages/client` (`@allowance-guard/client`)
- `package.json` — dual ESM/CJS, `sideEffects: false`, `provenance: true`, `engines.node >= 18`.
- `tsup` + `tsconfig` build pipeline.
- `src/client.ts` — `AllowanceGuardClient` with typed `request()` helper, browser secret-key guard, fetch error translation.
- `src/errors.ts` — `AllowanceGuardError` hierarchy (`NetworkError`, `ApiError`, `AuthError`, `RateLimitError`, `ValidationError`). Messages never contain API keys.
- `src/types.ts` — hand-authored types for all v1 endpoints. Marked for replacement by generated types once OpenAPI pipeline lands.
- `src/methods/*.ts` — thin wrappers for `chains`, `allowances`, `risk-score`, `portfolio-risk`, `scan`, `simulate`.
- `README.md`.

### `packages/react` (`@allowance-guard/react`)
- `package.json` with three `exports` subpaths: `.`, `./suspense`, `./server`. Peer deps on `react ^18 || ^19`, `@tanstack/react-query ^5`, `@allowance-guard/client` (workspace).
- `AllowanceGuardProvider` + `useAllowanceGuardClient` context. Does **not** create a QueryClient — consumers bring their own (usually wagmi's).
- Query key factory at `src/query-keys.ts`. Single root (`['allowance-guard']`) for whole-package invalidation.
- **Read hooks:** `useChains`, `useAllowances`, `useRiskScore`, `usePortfolioRisk`, `useScan` (placeholder — backend lacks a GET status endpoint).
- **Mutation hooks:** `useScanWallet` (invalidates allowances + risk), `useSimulateRevoke`, `useRevokeApproval` (returns an unsigned `approve(spender, 0)` tx for wagmi handoff).
- `src/suspense/index.ts` and `src/server/index.ts` stubs so the `exports` map is stable.
- `README.md`.

### Repo tooling
- `.changeset/config.json` with `linked` pair `[@allowance-guard/client, @allowance-guard/react]` and `ignore` entries for the Next.js app, existing SDK, and extension.
- `.changeset/initial-scaffold.md` — first changeset, marked minor on both packages.
- `scripts/generate-openapi.ts` — **documented stub** describing the intended pipeline (Zod → OpenAPI 3.1 → `openapi-typescript`). Deliberately exits 1 until the backend team wires it up.

## 🛑 Blocking dependencies (unchanged from plan §11)

| Dependency | Why it blocks v0.1.0 | Risk of acting without approval |
|---|---|---|
| **Public API keys** (`ag_pub_*`) — read-only, IP-rate-limited tier | The provider hard-fails on `ag_live_*` in the browser. Without a public-key tier, every React integrator must proxy through their own backend, defeating the distribution story. | Touches `api_keys` table, middleware, billing decisions, account UI. Needs human sign-off. |
| **OpenAPI 3.1 spec for `/api/v1`** | Hand-authored `packages/client/src/types.ts` WILL drift. Types must be generated. | Adds a devDep (`@asteasolutions/zod-to-openapi`) and response-shape annotations to every route. Should go through normal PR review. |
| **CORS on `/api/v1` for browser origins** | Without it, browsers can't call the API directly even with a public key. | Likely already enabled; needs verification + documentation. |

## 🚧 Deferred (not started this session)

- **`sdk/` → `packages/sdk/` migration** — touches existing publish pipeline. Do separately with an atomic PR.
- **`examples/next-app`** — requires running `pnpm install` with new peer deps and a working staging API key. Defer until public keys ship.
- **Vitest + MSW test suite** — framework is wired in `package.json` but no tests written yet. Next step once there's a mock server spec.
- **CI workflow** (`.github/workflows/packages-release.yml`) — changeset-driven publish. Defer until first real release is desired.
- **`npm publish`** — explicitly requires human approval + 2FA + provenance token setup.

## Next session checklist (pick in order)

1. Backend: add `ag_pub_*` key tier + middleware check + issuance from `/account`. Tests.
2. Backend: wire `zod-to-openapi` and commit the first generated `src/app/api/v1/openapi.json`.
3. `packages/client`: swap `src/types.ts` → generated `src/types.generated.ts`. Remove hand-authored file.
4. `packages/react`: write vitest suites under `src/hooks/__tests__/` using MSW.
5. Add `examples/next-app` running against staging.
6. Add `.github/workflows/release.yml` driven by Changesets.
7. First publish: `pnpm changeset version && pnpm -r build && pnpm changeset publish` — human-in-the-loop.

Each step is < 1 day. The whole path to a published `v0.1.0` is 3–5 days after public keys land.
