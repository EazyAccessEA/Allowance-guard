# architecture-rules.md

Architectural invariants for `src/`. Canonical source for file-level rules; `projects/allowanceguard/ARCHITECTURE.md` is the canonical source for system design.

## Invariants

### Routes

- App Router only. API routes live at `src/app/api/<route>/route.ts`.
- Route handlers export named HTTP verbs (`GET`, `POST`, etc.). No default exports.
- Every route that mutates state validates input (Zod or equivalent) before touching anything.
- Every route has a rate-limit decision: which ratelimit, which key. If none applies, comment why.
- CSRF: state-changing routes under the same origin check the `ag_csrf` cookie via middleware. Do not reimplement per-route.

### Components

- Server Components by default. Client Components (`"use client"`) only where hooks or browser APIs are required.
- Co-locate component-specific files under the component directory. Do not spread implementation across unrelated folders.
- Single-export files for components. Named exports for utilities and hooks.

### Data access

- All database access through Drizzle. Never raw `pg` or `postgres.js` in route handlers.
- Query files live under `src/lib/db/` or `src/lib/<domain>/queries.ts`. Not inside routes.
- Transactions via `db.transaction(...)`. No manual `BEGIN`/`COMMIT`.

### Authentication

- Auth logic in `src/lib/auth/`. Never reimplemented in routes or components.
- Session reads via the canonical helper. Do not read session cookies directly.
- #4 Security VETO on any change under `src/lib/auth/`, `src/app/api/auth/**`.

### Payments

- Stripe code confined to `src/lib/stripe/` and `src/app/api/stripe/**`.
- Webhook handlers verify the signature before any side effect. No exceptions.
- #30 Payment systems + #31 Crypto payments + #4 Security convened on every payment change.

### Dependencies

- No new top-level dependency without explicit user approval. Justify with: what it replaces, why a vendored copy won't work, bundle impact.
- Prefer standard library / existing dependencies.
- Never add a dependency solely to avoid writing 30 lines of code.

### File size

- 600-line limit (`memory/PROCESS.md:15-16`). Applies to `src/`, `memory/`, `projects/`, and `.claude/skills/`.
- Split by responsibility, not by line count. A 580-line file doing one thing beats three 200-line files doing thirds of it.

### Naming

- Files: `kebab-case.ts` for utilities; `PascalCase.tsx` for components.
- Exports: named over default. Default exports only for Next.js route files that require them.
- No abbreviations that aren't industry-standard (`auth`, `api` OK; `usr`, `mgr` not OK).

## Hard bans

- No `bg-white`, `bg-slate-*`, or glassmorphism utilities on marketing surfaces (Ledger canon only). See `projects/allowanceguard/DESIGN.md`.
- No Vanta, no WebGL on marketing pages (Thane bundle-budget veto).
- No fetch from untrusted input without validation + rate-limit + error handling.
- No `eval`, no `Function(...)`, no dynamic `require`.
- No `any` as a lazy escape hatch. Use `unknown` + narrow.

## When this file gets updated

- A new invariant emerges and `#15 Staff engineer` agrees it applies project-wide.
- An ADR lands under `projects/allowanceguard/decisions/` that changes a rule.
- A CORRECTIONS.md entry upgrades a lesson to a rule.

## Invariants added 2026-04-18 (session lessons)

### Email-OTP is the primary account-identity path; SIWE is secondary

- User accounts are keyed by **email**. OTP (6-digit code, HMAC-hashed, 10-min TTL, single-use, 5-attempt lock) is the primary sign-in channel. Implementation: `src/lib/otp.ts`, `src/app/api/auth/otp-{request,verify}/route.ts`, migration `032_otp_codes.sql`.
- SIWE (wallet signature) is retained at `/login` for wallet-first users and by `SaveWalletButton`, but is NOT on the purchase funnel. Do not add SIWE back into pricing / upgrade flows. The pre-2026-04-18 attempt to gate Stripe checkout behind SIWE produced four compounding production bugs (domain mismatch, cached 429, rate-limit exhaustion, mobile flakiness). See `incident-history.md` 2026-04-18.

### Rate-limiter fails OPEN on provider error

- `src/lib/ratelimit.ts` flipped from fail-closed to fail-open with an error log (`[ratelimit] failing OPEN due to Upstash error`) after the Upstash free-tier quota exhaustion on 2026-04-18 disabled 100% of rate-limited endpoints (OTP, checkout, nonce, scan).
- Rationale: an attacker timing abuse to a provider outage is vanishingly unlikely compared to 100% revenue loss every time Upstash hiccups. Matches Vercel / Cloudflare defaults.
- **Do not revert to fail-closed** without explicit operator sign-off + a ready-to-go fallback provider. The log line must stay stable so Rollbar / log search picks up every fail-open event.

### Stripe `automatic_tax` requires `customer_update: { address, name }`

- API plans set `automatic_tax: { enabled: true }`. That requires a billing address on the Stripe Customer. Email-only customers created via the OTP path do not have one.
- Pass `customer_update: { address: 'auto', name: 'auto' }` + `billing_address_collection: 'required'` + `tax_id_collection: { enabled: true }` on every Checkout Session for API plans. See `src/lib/billing.ts` `createCheckoutSession`.
- **Do not** remove these flags without also disabling `automatic_tax` — the combination is what prevents the "customer does not have an address" 500.

### Browser extension tier sync reads `/api/user/plan`, does not re-auth

- Extension popup fetches `/api/user/plan` with `credentials: 'include'` on open; the user's existing `ag_sess` cookie (scoped to `*.allowanceguard.com` via extension `host_permissions`) authenticates the call.
- Result cached for 5 minutes in `chrome.storage.local` (`userTierFetchedAt`). No separate extension-specific auth, no paste-your-API-key flow. See `extension/src/popup.js`.

### No-store headers on every error response that touches a paying user

- Error responses on the upgrade funnel (`/api/auth/otp-request`, `/api/auth/otp-verify`, `/api/auth/nonce`, `/api/auth/siwe`, `/api/billing/create-subscription`) must include:
  `Cache-Control: no-store, no-cache, must-revalidate, max-age=0; Pragma: no-cache; Expires: 0`.
- Rationale: a service worker or edge CDN cached a 429 with `max-age=31536000, immutable` pre-fix and locked users out of retry. The `dynamic = 'force-dynamic'` route directive is not sufficient — explicit headers are.

### Every user-facing claim about the product belongs in `claims-register.md`

- `memory/compliance-risk/claims-register.md` is the source of truth for public claims. A new component, route, email, or store listing that introduces a claim the register doesn't cover is a **P0 merge-blocker**. Added `2026-04-18` after a fabricated-discount component shipped to `/account` for months undetected. See compliance-risk `claims-register.md` retired entries + `platform-rules.md` for the full lesson.
