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

## ✅ Completed — follow-up session

### Backend: public API key tier (`ag_pub_*`)
- **Migration `027_api_public_keys.sql`** — adds `key_type` (`secret` | `public`) and `allowed_origins text[]` to `api_keys`, with a CHECK constraint and new index. Additive; all existing keys default to `secret`, preserving behaviour.
- **Drizzle schema** (`src/db/schema/api-keys.ts`) — mirrors the migration.
- **New plan tier** (`src/lib/plans.ts`) — `api_public` at 500 calls/day, 30/minute. Priced/unpriced (public keys are free). Excluded from `API_PRICES`.
- **`src/lib/api-keys.ts`**:
  - `generatePublicApiKey(userId, name, allowedOrigins?)` — mints `ag_pub_*` keys pinned to `api_public` and `key_type='public'`.
  - `validateApiKey` now accepts both prefixes and returns `keyType` + `allowedOrigins` on `ValidatedKey`.
  - `listApiKeys` returns `keyType` and `allowedOrigins`.
  - `upgradeApiKeyPlan` bulk upgrades now scoped to `key_type='secret'` so public keys stay pinned.
- **`src/middleware/api-auth.ts`** — hardened enforcement for public keys:
  - OPTIONS preflight short-circuits before auth.
  - Public keys are **GET-only** (405 with `Allow: GET, OPTIONS` on anything else).
  - Optional per-key origin allow-list enforced against the `Origin` header (403 `ORIGIN_NOT_ALLOWED`).
  - `withUsageTracking` attaches `Access-Control-Allow-Origin` + `Vary` on every public-key response.
- **Global `middleware.ts`** — carves `/api/v1/*` out of the app-wide CORS handler so the route-level logic owns per-key CORS. Permissive preflight (GET + OPTIONS) returned for `/api/v1/*`.
- **`POST /api/keys/public`** — new authenticated route (`src/app/api/keys/public/route.ts`) that issues public keys with an optional `allowedOrigins: ["https://app.example.com"]` array. Same 5-key-per-user limit as secret keys. Audit-logged.

### Known follow-ups for the public-key tier
- Account dashboard UI for creating/revoking public keys (currently only accessible via direct API call).
- Per-IP rate limit for public keys (currently only per-key daily + burst; a scraper with the key can still consume the full 500/day from one IP). Tracked as a hardening task, not a blocker for v0.1.0.
- Tests: middleware behaviour for the GET-only enforcement and origin allow-list.

## 🛑 Blocking dependencies remaining

| Dependency | Why it blocks v0.1.0 | Risk of acting without approval |
|---|---|---|
| **OpenAPI 3.1 spec for `/api/v1`** | Hand-authored `packages/client/src/types.ts` WILL drift. Types must be generated. | Adds a devDep (`@asteasolutions/zod-to-openapi`) and response-shape annotations to every route. Should go through normal PR review. |
| **Run migration 027 against staging + prod** | Schema change must be applied before the new code can function. | Standard deployment step; operator runs `pnpm run migrate`. |
| **Verify CORS end-to-end from a staging dApp** | Need a real browser test to confirm the chain of global middleware → route-level CORS works across Vercel's edge. | Needs a staging key issued and a tiny test page. |

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
