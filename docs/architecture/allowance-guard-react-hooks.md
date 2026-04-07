# AllowanceGuard React Hooks — Architecture & Implementation Plan

> **Status:** Plan. Not yet implemented.
> **Owner:** Pending.
> **Target:** `@allowance-guard/react` v0.1.0 on npm.
> **Companion packages:** `@allowance-guard/client` (framework-agnostic core), `allowance-guard-sdk` (Node.js, already in `/sdk`).

---

## 1. Why this exists

The Web3 dApp ecosystem is React-dominant. Wagmi, Viem, RainbowKit, ConnectKit, and Web3Modal all ship hooks because dApp builders expect them. Without hooks, a team integrating AllowanceGuard for risk-scoring inside their own UI must hand-roll fetch + state + cache + invalidation against our REST API — friction that Wagmi explicitly removed and that Wagmi won the market because of.

The B2B API is a real revenue line. Hooks are the **distribution mechanism** of that revenue line into the React audience. Without them we lose every dApp integration to "I'll just call the API directly," which becomes "I'll just iframe Revoke.cash."

The SDK (server-side) and the browser extension (consumer) cover *server* and *standalone browser*. Hooks complete the triangle: **dApp-as-component**.

---

## 2. Council brief — three architects + the design council

### Architect of APIs (the surface)
Designs the public hook signatures and naming. Thinks like Tanner Linsley (TanStack Query), Wagmi v2, Gnosis Safe Apps SDK.

**Principles:**
1. One hook = one resource. No mega-hooks. `useAllowances()`, not `useAllowanceGuard()`.
2. Match Wagmi's naming conventions where they overlap. React devs in Web3 already think this way.
3. Every hook returns the same shape: `{ data, error, isLoading, isError, isSuccess, refetch }`. Predictable and composable.
4. Mutations (revoke, scan-trigger) return a `mutate(args)` function plus state — same as Wagmi `useWriteContract`.
5. Hooks never throw. Errors land in `error`. Suspense is opt-in via a separate import path (`@allowance-guard/react/suspense`) to avoid forcing a React feature on consumers who don't want it.

### Architect of State (caching, invalidation, SSR)
Decides the data-fetching layer: roll our own or stand on TanStack Query.

**Decision: peer-dep on `@tanstack/react-query` ^5.**

**Reasoning:**
- Wagmi v2 already requires it. ~80% of our target audience already has it installed.
- Building our own request-deduping, stale-while-revalidate, and cache-invalidation system is a one-year sidequest that ends at "we built a worse TanStack Query."
- Peer-dep means zero bundle weight for consumers who already have it.
- TanStack Query handles SSR (Next.js App Router, Remix), Suspense, and infinite queries for free.

**Trade-off:** consumers without TanStack Query must install it (one `npm i`). Acceptable cost for what we get.

**Cache key contract:**
```ts
['allowance-guard', 'allowances', { wallet, chains, includeRevoked }]
['allowance-guard', 'risk-score',  { wallet, spender, token }]
['allowance-guard', 'scan',        { wallet }]
['allowance-guard', 'chains']
```
Stable, sorted, JSON-serialisable. Invalidation is `queryClient.invalidateQueries({ queryKey: ['allowance-guard'] })`.

### Architect of Distribution (packaging, peer deps, types)
Decides how the package ships and how it stays maintainable.

**Principles:**
1. **Two packages, not one.** `@allowance-guard/client` is the framework-agnostic core (fetch wrapper, types, schema validation, retries, rate-limit handling). `@allowance-guard/react` is a thin React adapter that imports `@allowance-guard/client` and wraps each method in a TanStack Query hook. This means a future Vue/Svelte/Solid adapter is a 200-line wrapper — no rewrite of the transport layer.
2. **Dual ESM/CJS** via `tsup`. Tree-shakeable. `sideEffects: false` in `package.json`.
3. **TypeScript-first.** Types generated from a single OpenAPI spec at build time so they can never drift from the REST API. Source of truth: `src/app/api/v1/openapi.json` (to be added).
4. **Peer deps:** `react ^18 || ^19`, `@tanstack/react-query ^5`. No runtime dependencies in `@allowance-guard/react` beyond `@allowance-guard/client`.
5. **`@allowance-guard/client` runtime deps:** `zod` (schema validation, ~12kb gzipped, worth it), nothing else. No `axios`, no `node-fetch` — use the platform `fetch`.
6. **Minimum Node:** 18 (native fetch).
7. **`exports` map** in `package.json` so imports are explicit:
   - `@allowance-guard/react` → main hooks
   - `@allowance-guard/react/suspense` → Suspense-mode variants
   - `@allowance-guard/react/server` → SSR/RSC-safe primitives
8. **Versioning:** semver. Breaking changes only at major versions. Use Changesets for the changelog.
9. **License:** GPL-3.0 to match the SDK. Commercial license available on request — same dual-license model as the main app.

---

## 3. Hook surface (the API contract)

### Read hooks

```ts
useAllowances(args: {
  wallet: `0x${string}`;
  chains?: number[];          // default: all 15
  includeRevoked?: boolean;   // default: false
  enabled?: boolean;          // default: true
}): UseQueryResult<Allowance[]>

useRiskScore(args: {
  wallet: `0x${string}`;
  spender?: `0x${string}`;
  token?: `0x${string}`;
}): UseQueryResult<RiskScore>

usePortfolioRisk(args: {
  wallet: `0x${string}`;
}): UseQueryResult<PortfolioRisk>

useChains(): UseQueryResult<Chain[]>

useScan(args: {
  wallet: `0x${string}`;
  enabled?: boolean;
}): UseQueryResult<ScanResult>
```

### Mutation hooks

```ts
useScanWallet(): UseMutationResult<ScanResult, Error, { wallet: `0x${string}` }>

useSimulateRevoke(): UseMutationResult<SimulationResult, Error, { wallet, spender, token }>

useRevokeApproval(): UseMutationResult<TxRequest, Error, { wallet, spender, token, chainId }>
// returns an unsigned tx — caller signs with wagmi useSendTransaction
```

### Provider

```tsx
import { AllowanceGuardProvider } from '@allowance-guard/react'

function App() {
  return (
    <AllowanceGuardProvider
      apiKey={process.env.NEXT_PUBLIC_ALLOWANCE_GUARD_KEY}  // PUBLIC keys only
      // or, server-side:
      // apiKey={fetchedFromServer}
      baseUrl="https://www.allowanceguard.com/api/v1"
    >
      {children}
    </AllowanceGuardProvider>
  )
}
```

The provider is a thin context wrapper around the `Client` instance from `@allowance-guard/client`. It does *not* create its own QueryClient — consumers bring their own (or share Wagmi's).

---

## 4. Auth model (this is the dangerous part)

The REST API supports two key tiers:
- **Public keys** (`ag_pub_…`) — rate-limited per IP, can be embedded in client-side bundles. Read-only. Used by free-tier and Pro-tier dApps that want to show risk scores in their UI.
- **Secret keys** (`ag_live_…`) — full quota, must never be embedded in client-side code. Used server-side only.

The hooks **must refuse** to be initialised with a secret key in a browser environment. Detection:
```ts
if (typeof window !== 'undefined' && apiKey.startsWith('ag_live_')) {
  throw new Error(
    '@allowance-guard/react: secret keys (ag_live_*) cannot be used in the browser. ' +
    'Use a public key (ag_pub_*) or proxy requests through your server.'
  )
}
```

This needs a corresponding **Public Keys** feature on the API side that does not exist yet. **Blocking dependency** — see §11.

---

## 5. TypeScript types — single source of truth

The REST API needs a generated OpenAPI 3.1 spec at `src/app/api/v1/openapi.json`. Build pipeline:

1. Author the OpenAPI spec by hand (or generate from Zod schemas already in `src/app/api/v1/*/route.ts` using `zod-to-openapi`).
2. `@allowance-guard/client` build step runs `openapi-typescript` to generate `types.ts`.
3. Hooks import from generated types. Drift becomes structurally impossible.

**This is the most important architectural decision in this document.** Without a single source of truth for types, the hooks package will gradually diverge from the API and integrators will pay for it.

---

## 6. Build & packaging

```
packages/
├── client/                          # @allowance-guard/client
│   ├── src/
│   │   ├── index.ts                 # public exports
│   │   ├── client.ts                # fetch wrapper, retries, rate-limit
│   │   ├── errors.ts                # typed error classes
│   │   ├── types.generated.ts       # from openapi-typescript (gitignored)
│   │   └── methods/
│   │       ├── allowances.ts
│   │       ├── risk.ts
│   │       ├── scan.ts
│   │       └── chains.ts
│   ├── package.json
│   ├── tsup.config.ts
│   └── README.md
└── react/                           # @allowance-guard/react
    ├── src/
    │   ├── index.ts                 # public hooks
    │   ├── provider.tsx             # AllowanceGuardProvider + context
    │   ├── hooks/
    │   │   ├── useAllowances.ts
    │   │   ├── useRiskScore.ts
    │   │   ├── usePortfolioRisk.ts
    │   │   ├── useChains.ts
    │   │   ├── useScan.ts
    │   │   ├── useScanWallet.ts
    │   │   ├── useSimulateRevoke.ts
    │   │   └── useRevokeApproval.ts
    │   ├── suspense/
    │   │   └── index.ts             # Suspense-mode variants
    │   └── server/
    │       └── index.ts             # SSR helpers (fetchAllowances etc.)
    ├── package.json
    ├── tsup.config.ts
    └── README.md
```

**Build tool:** `tsup` (dual ESM/CJS, tree-shakeable, 30-line config).
**Package manager:** `pnpm` workspaces (already used by the main repo).
**Monorepo location:** `packages/` at repo root, alongside the existing `/sdk` and `/extension`. The existing `/sdk` package becomes `packages/sdk` so all three live together. (This is a small migration — see §11.)

---

## 7. Testing strategy

- **Unit:** `vitest` for the client transport layer (retries, rate-limit, error parsing). 95% coverage target.
- **Hooks:** `@testing-library/react-hooks` (or `@testing-library/react`'s `renderHook` in v18+) against MSW (`msw`) mocks of the REST API. Tests verify cache keys, refetch behaviour, error states.
- **Integration:** a small Next.js example app under `examples/next-app` that runs the real hooks against the staging API in CI.
- **Type tests:** `tsd` to verify generated types match the API OpenAPI spec on every build.

---

## 8. Documentation strategy

1. **Hosted docs:** the existing `/docs/integration` page already has a "React Hooks" section reserved (currently labelled "Roadmap"). When v0.1.0 ships, that section becomes the canonical landing page.
2. **Quickstart:** 8 lines of code that scan a wallet and render the result. Below the fold: every other hook with a one-paragraph example.
3. **Live playground:** the existing `/docs/widget` builder pattern, repurposed for hooks — a CodeSandbox-style embed where users can paste a wallet and see live risk scores.
4. **Migration guides:** for builders coming from raw `fetch` against `/api/v1`, and for builders coming from competitors (Revoke.cash, Etherscan).
5. **README on npm:** must be self-sufficient — install, provider setup, one example per hook.

---

## 9. Versioning, release, and distribution

- **Semver, Changesets-managed.** Every PR that touches `packages/client` or `packages/react` requires a changeset.
- **Pre-1.0 caveat:** until `@allowance-guard/client` v1.0, breaking changes are allowed at minor versions. This must be loud in the README.
- **Release flow:** GitHub Actions on `main`. `changeset version` → `changeset publish` → npm. Tags pushed automatically.
- **Distribution channels:**
  1. **npm** — primary.
  2. **JSR** — Deno-friendly, automatic from npm.
  3. **GitHub Packages** — backup mirror.
  4. **CDN** (`cdn.allowanceguard.com/react@latest`) — deferred to v0.2 if there's demand.
- **License:** GPL-3.0 (matches `/sdk`). Dual-license available — `legal.support@allowanceguard.com`.

---

## 10. Security considerations

1. **Never accept secret API keys in browser context.** Hard-fail at provider initialisation. (See §4.)
2. **CSP-friendly.** No `eval`, no `new Function`, no inline event handlers. `unsafe-eval` and `unsafe-inline` must not be required by the package.
3. **No telemetry by default.** Some libraries (Sentry, PostHog) ship opt-out telemetry. We ship none. If we ever add it, opt-IN, with a public schema document.
4. **Token leakage via error messages.** Errors must redact the API key before throwing. Test for this.
5. **Dependency hygiene.** `@allowance-guard/client` deps: `zod` only. `@allowance-guard/react` deps: zero (peer deps only). Every dep added in future requires a PR rationale.
6. **Supply-chain.** npm publish uses 2FA + provenance (`npm publish --provenance`). The publishing token is scoped to `@allowance-guard/*` only.

---

## 11. Blocking dependencies (must exist before v0.1.0 ships)

| Dependency | Owner | Status |
|---|---|---|
| **OpenAPI 3.1 spec for `/api/v1`** | Backend | Not started. Can be generated from existing Zod schemas via `zod-to-openapi`. |
| **Public API keys** (`ag_pub_*`) — read-only, IP-rate-limited tier | Backend + billing | Not started. New row in `api_keys` table; new gate in middleware. |
| **CORS enabled on `/api/v1` for browser callers** | Backend | Likely already enabled; verify and document. |
| **Migrate `/sdk` → `packages/sdk`** | Repo maintenance | Trivial git mv + path updates. |
| **`packages/` workspace registered in pnpm-workspace.yaml** | Repo maintenance | Trivial. |

None of these are large. Total estimated effort to unblock: 3–5 days.

---

## 12. Phasing

### v0.1.0 — MVP
- `@allowance-guard/client` with: `getAllowances`, `getRiskScore`, `getChains`, `scanWallet`, `simulateRevoke`.
- `@allowance-guard/react` with corresponding hooks + provider.
- Generated types from OpenAPI spec.
- Vitest + MSW test suite.
- Example Next.js app in `examples/next-app`.
- README + npm-published docs landing on `/docs/integration`.
- CI: typecheck, test, build, changeset version, publish on tag.

### v0.2.0 — Suspense + SSR
- `@allowance-guard/react/suspense` import path with Suspense-mode hooks.
- `@allowance-guard/react/server` helpers for Next.js Server Components and Remix loaders.
- TanStack Query hydration boundary support documented end-to-end.

### v0.3.0 — Mutations + Wagmi interop
- `useRevokeApproval` returns an unsigned tx that integrates cleanly with `wagmi`'s `useSendTransaction`.
- Optimistic updates for revocation flows.
- Optional `wagmi` peer dep for tighter integration.

### v1.0.0 — Stable API contract
- API surface frozen.
- Public commitment to semver discipline.
- Vue/Svelte adapter packages start (`@allowance-guard/vue`, `@allowance-guard/svelte`) — straightforward wrappers around `@allowance-guard/client`.

---

## 13. Open questions for the next session

1. **OpenAPI: hand-authored or generated?** Recommend generated from Zod via `zod-to-openapi` so the spec can never drift from the actual route handlers. Confirm Zod schemas exist on every `/api/v1` route.
2. **Public key tier pricing.** Free? Bundled into the existing `Free` API tier with stricter rate limits? Needs a billing decision before §4 can ship.
3. **Should the provider create its own QueryClient if none is found in context?** Pro: zero-config for new projects. Con: hidden state, memory leaks if mounted/unmounted. **Recommend: throw a clear error if no QueryClient is found, and document the 4-line setup.**
4. **React Server Components support — v0.1.0 or v0.2.0?** Recommend deferring to v0.2.0; RSC patterns are still in flux and getting it wrong locks us in.
5. **`wagmi` peer dep — soft or hard?** Soft (optional). Most users will have it, but a non-Wagmi codebase (e.g. raw Viem) should still work.
6. **Telemetry.** Confirm: zero by default, no opt-in until there's a clear use case and a public schema.

---

## 14. Definition of done for v0.1.0

- [ ] OpenAPI spec exists at `src/app/api/v1/openapi.json` and is generated from Zod schemas in CI.
- [ ] Public API keys (`ag_pub_*`) are issuable from the Account dashboard.
- [ ] `packages/client` and `packages/react` exist as pnpm workspaces.
- [ ] All 5 read hooks + 3 mutation hooks implemented.
- [ ] Test coverage ≥ 90% on `packages/client`, ≥ 80% on `packages/react`.
- [ ] Example Next.js app in `examples/next-app` runs against staging API.
- [ ] `/docs/integration` "React Hooks" section is updated to point at v0.1.0 with copy-pasteable quickstart.
- [ ] First release published to npm with provenance.
- [ ] Changeset workflow active on `main`.
- [ ] README on npm renders correctly and contains every hook.
- [ ] Security review completed: no key leakage in errors, browser-context secret-key check enforced.

---

## 15. References

- [TanStack Query docs](https://tanstack.com/query/latest)
- [Wagmi v2 hooks API](https://wagmi.sh/react/api/hooks)
- [openapi-typescript](https://github.com/drwpow/openapi-typescript)
- [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
- [Changesets](https://github.com/changesets/changesets)
- [tsup](https://tsup.egoist.dev/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements)

---

*Plan authored by the Council of Six (Sable, Maren, Idris, Kael, Noor, Thane) and three architects (APIs, State, Distribution). Pending owner assignment and prioritisation against the Q2 roadmap.*
