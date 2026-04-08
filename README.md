# AllowanceGuard

> **Open source Web3 wallet security.** Scan any wallet for risky token approvals across 15 EVM chains, score the risk of every active allowance, simulate the impact of revoking them, and batch-revoke in a single signed transaction.

[![License: AGPL-3.0 + Commercial](https://img.shields.io/badge/license-AGPL--3.0%20%2B%20Commercial-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Postgres](https://img.shields.io/badge/Postgres-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Security Disclosure](https://img.shields.io/badge/security-responsible%20disclosure-critical)](SECURITY.md)

**Live:** <https://www.allowanceguard.com> &nbsp;•&nbsp; **Docs:** <https://www.allowanceguard.com/docs> &nbsp;•&nbsp; **API:** <https://www.allowanceguard.com/docs/api-reference> &nbsp;•&nbsp; **Pricing:** <https://www.allowanceguard.com/pricing>

Open source core. Independently operated. Built to last.

---

## Table of contents

- [What is AllowanceGuard?](#what-is-allowanceguard)
- [Why token approvals matter](#why-token-approvals-matter)
- [Integration paths](#integration-paths)
- [Plans](#plans)
- [Supported chains](#supported-chains)
- [Quickstart](#quickstart)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Tech stack](#tech-stack)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Database migrations](#database-migrations)
- [Testing](#testing)
- [API reference](#api-reference)
- [Security](#security)
- [Competitive context](#competitive-context)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

---

## What is AllowanceGuard?

AllowanceGuard is a **non-custodial wallet-security platform** that tracks every token approval (allowance) across supported EVM chains, scores each approval's risk, and lets users revoke dangerous ones in a single signed transaction. The core scanner is free and open source. Premium monitoring, team dashboards, and the B2B API sustain the project.

- **Non-custodial by design.** We never ask for or store private keys. All scanning uses public chain data. All revocations are signed by the user in their own wallet.
- **Cross-chain from day one.** 15 EVM networks. One dashboard. One risk score.
- **Built to integrate.** Web app, React hooks (`@allowance-guard/react`), REST API, Node SDK, and a browser extension — five ways to ship AllowanceGuard into your workflow.

---

## Why token approvals matter

Every time a wallet interacts with a DeFi protocol, it grants that protocol's smart contract **permission to move its tokens** — a persistent approval that outlives the interaction itself. Two risks compound over time:

1. **Unlimited approvals.** Most approvals default to `uint256.max`, granting a contract indefinite access to the entire balance of a token.
2. **Stale approvals.** Approvals don't expire. A contract you interacted with once in 2021 can still move your 2026 tokens — including contracts that have since been compromised, abandoned, or proxied to malicious implementations.

Hundreds of millions of dollars have been drained via approval exploits. AllowanceGuard gives users — and the products they use — the tools to see, score, and remove that exposure **before** it's weaponised.

---

## Integration paths

Five ways to use AllowanceGuard. All five share the same risk engine.

| Path | Use when | Install |
|---|---|---|
| **Web app** | End users, one-off scans, manual revocation | <https://www.allowanceguard.com> |
| **React hooks** (`@allowance-guard/react`) | You're building a dApp and want risk scores inside your own UI | `pnpm add @allowance-guard/react @allowance-guard/client @tanstack/react-query` |
| **REST API** (`/api/v1`) | Server-side integrations, cron jobs, any non-JS stack | Bearer auth — see [API reference](#api-reference) |
| **Node SDK** | Node.js services, scripts, CI checks | `npm install allowance-guard-sdk` |
| **Browser extension** | In-wallet risk warnings during approval prompts | `extension/` directory — self-host build |

### React hooks

`@allowance-guard/react` ships 5 read hooks and 3 mutation hooks on top of TanStack Query. It peer-deps on the same `@tanstack/react-query` that wagmi v2 already requires, so most dApp codebases pay zero extra install cost.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AllowanceGuardProvider, useRiskScore } from '@allowance-guard/react'

const queryClient = new QueryClient()

export default function App() {
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

Browser-embedded integrations use **public API keys** (`ag_pub_*`) — read-only, rate-limited, and safe to include in client-side bundles. The provider hard-fails at construction if it detects a secret key (`ag_live_*`) in a browser context.

### REST API

```bash
curl -H "Authorization: Bearer ag_live_YOUR_KEY" \
  "https://www.allowanceguard.com/api/v1/risk-score?wallet=0xabc..."
```

Full OpenAPI 3.1 spec: [`src/app/api/v1/openapi.json`](src/app/api/v1/openapi.json). See [API reference](#api-reference) below.

---

## Plans

The **core scanner is free and open source. Always.** Premium *services* — continuous monitoring, team dashboards, compliance exports, the B2B API — sustain the project.

### Consumer tiers

| Feature | Free | Pro | Sentinel |
|---|---|---|---|
| Wallets tracked | 3 | Unlimited | 50 monitored |
| Chains visible | 1 at a time | All 15 | All 15 |
| Risk scoring | Basic | Full | Full + automated rules |
| Batch revocation | — | Included | Included |
| Continuous monitoring + alerts | — | Email + Telegram | Email + Telegram + Webhooks |
| Historical risk timeline (Time Machine) | — | Included | Included |
| Export (CSV / PDF) | — | Included | Compliance-grade audit |
| Team dashboard (RBAC) | — | — | Included |
| Automated revocation rules | — | — | Included |
| Priority support | — | — | Included |
| **Price** | **$0** | **$9.99/mo or $79/yr** | **$49.99/mo or $499/yr** |

### B2B API tiers

Build AllowanceGuard into your own product.

| Tier | Calls/day | Burst (per min) | Price |
|---|---|---|---|
| **Free** | 100 | 10 | $0 |
| **Public** (`ag_pub_*`, browser-safe, GET-only) | 500 | 30 | $0 |
| **Developer** | 10,000 | 60 | $39/mo |
| **Growth** | 100,000 | 300 | $149/mo |
| **Enterprise** | Custom | Custom | Contact sales |

Full API docs: <https://www.allowanceguard.com/docs/api-reference>. Issue keys from <https://www.allowanceguard.com/account/keys>.

---

## Supported chains

All 15 chains share one risk engine, one dashboard, one API.

| # | Chain | Chain ID | Status |
|---|---|---|---|
| 1 | Ethereum | 1 | Live |
| 2 | Arbitrum One | 42161 | Live |
| 3 | Base | 8453 | Live |
| 4 | Optimism | 10 | Live |
| 5 | Polygon | 137 | Live |
| 6 | Avalanche C-Chain | 43114 | Live |
| 7 | BNB Smart Chain | 56 | Live |
| 8 | Fantom | 250 | Live |
| 9 | zkSync Era | 324 | Live |
| 10 | Polygon zkEVM | 1101 | Live |
| 11 | Mantle | 5000 | Live |
| 12 | Gnosis | 100 | Live |
| 13 | Linea | 59144 | Live |
| 14 | Scroll | 534352 | Live |
| 15 | Celo | 42220 | Live |

Adding a chain is a migration + RPC config — see `src/lib/networks.ts`.

---

## Quickstart

### 1. Scan a wallet (no install)

Visit <https://www.allowanceguard.com>, paste or connect a wallet, and read the risk score. Free tier — no account required for a one-off scan.

### 2. Embed risk scores in your dApp (React)

```bash
pnpm add @allowance-guard/react @allowance-guard/client @tanstack/react-query
```

Get a **public** API key from <https://www.allowanceguard.com/account/keys> (look for "Create public key") and drop it into your env as `NEXT_PUBLIC_ALLOWANCE_GUARD_KEY`. Then see the React snippet in [Integration paths](#integration-paths).

### 3. Query the REST API (any language)

```bash
curl -H "Authorization: Bearer ag_live_YOUR_SECRET_KEY" \
  "https://www.allowanceguard.com/api/v1/allowances?wallet=0xabc&riskOnly=true"
```

Secret keys (`ag_live_*`) live in your server env and never touch the browser.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                       Next.js 15                        │
│  (App Router, Turbopack, React 19, Tailwind, Wagmi v2)  │
└─────────┬──────────────────────┬───────────────────────┘
          │                      │
    ┌─────▼──────┐       ┌──────▼────────┐
    │  Web app   │       │  /api/v1      │
    │ (consumer) │       │  (B2B REST)   │
    └─────┬──────┘       └──────┬────────┘
          │                     │
          └──────────┬──────────┘
                     │
      ┌──────────────▼──────────────┐
      │      Core scan engine        │
      │ (Viem reads, risk scoring,   │
      │  labels, spender reputation) │
      └──────┬──────────────┬────────┘
             │              │
      ┌──────▼────┐   ┌─────▼─────┐
      │  Postgres │   │   Redis   │
      │  (Neon)   │   │ (Upstash) │
      └───────────┘   └───────────┘
```

- **Auth.** Consumer UI uses 30-day cookie sessions (`ag_sess`). B2B API uses bearer tokens (`ag_live_*` or `ag_pub_*`).
- **Caching.** Hot reads hit Redis; fallback DB cache.
- **Billing.** Stripe (cards) + Coinbase Commerce (crypto).
- **Monitoring.** Rollbar for errors, Slack webhooks for ops, custom audit log for institutional tier.

---

## Repository structure

The repo is a pnpm workspace.

```
/
├── src/                      # Next.js app source
│   ├── app/                  # App Router pages + API routes
│   │   ├── api/v1/           # Public B2B REST API
│   │   │   └── openapi.json  # Canonical OpenAPI 3.1 spec
│   │   ├── account/          # Billing, API keys, usage
│   │   ├── pricing/          # Pricing page
│   │   └── docs/             # Documentation pages
│   ├── components/           # React components
│   │   ├── ui/               # Design system primitives
│   │   └── account/          # Account dashboard widgets
│   ├── db/schema/            # Drizzle ORM table definitions
│   ├── lib/                  # Plans, billing, auth, caching, rate limiting
│   └── middleware/           # API key auth, CORS, CSRF, validation
├── packages/                 # npm-published client libraries
│   ├── client/               # @allowance-guard/client (framework-agnostic)
│   └── react/                # @allowance-guard/react (hooks)
├── sdk/                      # allowance-guard-sdk (Node.js, legacy)
├── extension/                # Browser extension
├── migrations/               # SQL migrations (pnpm run migrate)
├── scripts/                  # Tooling (generate-openapi.ts, etc)
├── tests/                    # Playwright E2E tests
├── docs/                     # Architecture plans, voice bible, handbooks
└── .changeset/               # Changesets for packages/* versioning
```

Top-level `CLAUDE.md` documents the Standing Council operating rules, messaging guidelines, and coding standards enforced across the repo.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Database | PostgreSQL (Neon) via Drizzle ORM |
| Cache | Redis (Upstash) + DB-backed fallback |
| Payments | Stripe (cards) + Coinbase Commerce (crypto) |
| Auth | Cookie sessions (consumer) + bearer API keys (B2B) |
| Email | Postmark / SMTP (Nodemailer) |
| Web3 | Wagmi 2, Viem 2, Reown AppKit |
| Monitoring | Rollbar, Slack webhooks |
| Deployment | Vercel |
| Testing | Playwright (E2E), Vitest (unit) |
| Components | class-variance-authority (CVA) |
| Icons | Lucide React |

---

## Local development

### Prerequisites

- **Node.js 18+** (20 recommended)
- **pnpm 9+**
- **PostgreSQL** (Neon is the easy path)
- **Redis** (Upstash is the easy path)
- A **WalletConnect / Reown** project ID
- Optional: Stripe test keys, Postmark token, Rollbar token

### Setup

```bash
git clone https://github.com/EazyAccessEA/Allowance-guard.git
cd Allowance-guard

pnpm install

cp production.env.example .env.local
# Fill in .env.local — at minimum DATABASE_URL, REDIS_URL,
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, NEXT_PUBLIC_APP_URL

pnpm run migrate    # Apply SQL migrations
pnpm dev            # Start Next.js (Turbopack)
```

The dev server runs on <http://localhost:3000>.

---

## Environment variables

Required for a working local stack:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string (Neon or self-hosted) |
| `REDIS_URL` | Yes | Redis URL (or `REDIS_HOST`/`PORT`/`PASSWORD` trio) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public origin (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | Reown / WalletConnect project ID |
| `STRIPE_SECRET_KEY` | For billing | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | For billing | Stripe webhook signing secret |
| `COINBASE_COMMERCE_API_KEY` | For crypto billing | Coinbase Commerce API key |
| `POSTMARK_SERVER_TOKEN` | For email | Postmark server token (or `SMTP_*` vars) |
| `SLACK_WEBHOOK_URL` | Optional | Slack ops notifications |
| `ROLLBAR_ACCESS_TOKEN` | Optional | Error monitoring |

E2E test shortcuts:

| Variable | Purpose |
|---|---|
| `E2E_FAKE_PAYMENTS=true` | Skip Stripe / Coinbase in Playwright runs |
| `E2E_FAKE_EMAIL=true` | Skip actual email delivery in tests |

---

## Database migrations

Raw SQL migrations live in `migrations/` and run in filename order.

```bash
pnpm run migrate       # Apply pending migrations
```

Migrations are **additive and backward-compatible** by policy — schema changes must not break running code. Example: migration `027_api_public_keys.sql` added the `key_type` column with a default of `'secret'` so existing keys worked unchanged.

---

## Testing

```bash
pnpm test:e2e                     # Playwright E2E suite
pnpm test:e2e:ui                  # Playwright UI mode
pnpm --filter @allowance-guard/client test     # Vitest unit tests
pnpm --filter @allowance-guard/client typecheck
```

- **E2E** covers scan flow, revocation, billing, alerts, account management, accessibility (WCAG AA).
- **Unit** covers `@allowance-guard/client` error translation, key-tier enforcement, query serialisation, and the leak-prevention rail on thrown errors.
- **Mock modes** (`E2E_FAKE_PAYMENTS`, `E2E_FAKE_EMAIL`) let you run the full suite without touching Stripe or Postmark.

CI: `.github/workflows/packages-ci.yml` runs typecheck + test + build for both client packages on every push to `main` and PR that touches `packages/**`.

---

## API reference

- **Hosted docs:** <https://www.allowanceguard.com/docs/api-reference>
- **OpenAPI 3.1 spec:** [`src/app/api/v1/openapi.json`](src/app/api/v1/openapi.json) — the single source of truth. Any new `/api/v1` endpoint must update this spec in the same PR.

### Endpoints (v1)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Service health (public, no auth) |
| `GET` | `/chains` | List supported chains |
| `GET` | `/allowances` | Paginated token approvals for a wallet |
| `GET` | `/risk-score` | Aggregated wallet risk score + top risks |
| `GET` | `/portfolio-risk` | Cross-chain portfolio score with benchmark |
| `POST` | `/risk-check` | Pre-signing risk check for a proposed approval |
| `POST` | `/scan` | Trigger an on-chain scan |
| `POST` | `/simulate` | Before/after risk comparison ("Time Machine") |

### Authentication — two key tiers

| Prefix | Where it lives | Use |
|---|---|---|
| `ag_live_*` | **Server only** | Full quota, all HTTP methods, server-side integrations |
| `ag_pub_*` | Browser-safe | GET-only, 500 calls/day, 30/min burst, optional per-key origin allow-list |

The API middleware rejects `ag_live_*` keys in browser contexts and refuses any non-GET method on a public key. CORS headers are attached automatically to public-key responses, with per-key origin allow-listing enforced against the `Origin` header.

All error responses follow a consistent envelope:

```json
{ "error": "Human-readable message", "code": "MACHINE_READABLE_CODE", "details": {} }
```

Rate-limited responses include a `Retry-After` header in seconds.

---

## Security

AllowanceGuard is **non-custodial by design**:

- **No private keys.** We never ask for, transmit, or store private keys or seed phrases.
- **Read-only scanning.** All wallet scans use public blockchain data. No wallet mutations without user signature.
- **User-signed revocations.** Every revocation is a normal ERC-20 `approve(spender, 0)` transaction signed in the user's own wallet.
- **Open source.** Full source code is available for audit under AGPL-3.0.

### Platform hardening

- Zod input validation on every API boundary.
- Redis-backed rate limiting (daily quota + burst per-minute).
- CSRF protection (`x-csrf-token` / `ag_csrf` cookie) on state-changing consumer requests.
- Strict Content-Security-Policy (no `unsafe-eval`), HSTS, `X-Frame-Options: DENY`, `frame-ancestors 'none'`.
- Stripe + Coinbase webhook signature verification + idempotency guards.
- API keys hashed at rest (SHA-256); only the prefix is stored for identification.
- CORS scoped per-key for `ag_pub_*` tier; `/api/v1` is carved out of the app-wide CORS handler.
- Audit logging for billing, key, and team actions (institutional tier).

### Reporting a vulnerability

Email **security@allowanceguard.com** with a clear reproduction. See [`SECURITY.md`](SECURITY.md) for the full responsible-disclosure policy and PGP key.

Please **do not** open a public GitHub issue for security reports.

---

## Competitive context

| | **AllowanceGuard** | Revoke.cash | Blowfish |
|---|---|---|---|
| Model | Open-core freemium + B2B API | Free / donations | B2B API (paid) |
| Chains | 15 EVM | 100+ | 10+ |
| Risk scoring | Continuous, cross-chain portfolio score | Per-approval flags | Real-time tx simulation |
| Batch revoke | Yes, with gas-savings estimate | Yes | No (simulation only) |
| Time-machine simulation | Yes | No | No |
| React hooks package | `@allowance-guard/react` | — | — |
| Team dashboard + audit export | Yes (Sentinel tier) | No | Enterprise only |
| License | AGPL-3.0 + commercial | MIT | Proprietary |

AllowanceGuard is positioned as **security infrastructure for Web3 products**, not a hosted consumer utility — the distribution story is the API and the React hooks, not the website.

---

## Contributing

The open-source core welcomes contributions. The workflow:

1. Fork the repo and create a feature branch: `git checkout -b feature/my-change`
2. Install with `pnpm install` and run `pnpm dev`
3. Follow the coding standards in [`CLAUDE.md`](CLAUDE.md) — TypeScript strict, Drizzle for queries, Zod at API boundaries, Tailwind + CVA for components, WCAG AA for UI
4. Add or update Playwright tests under `tests/`
5. For changes to `packages/*`, add a [Changeset](https://github.com/changesets/changesets) via `pnpm changeset`
6. Submit a pull request — the bot will walk you through the CLA on first contribution

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the detailed guide, [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and [`CLA.md`](CLA.md) for the contributor licence agreement.

### Standing Council

Non-trivial changes (code, copy, schema, APIs, infrastructure) are reviewed against the 19-person Standing Council defined in [`CLAUDE.md`](CLAUDE.md) — editor-in-chief, OSS maintainer, Web3 expert, security engineer, product marketing, B2B sales, visual designer, accessibility specialist (veto), compliance counsel, DevOps, founder voice, ecosystem strategist, UX writer, DX engineer, staff architect, QA, perf, DBA, privacy specialist. Pull requests that materially change user-facing copy, public APIs, or the design system are expected to reference the relevant council members in their description.

---

## License

AllowanceGuard is **dual-licensed**:

- **AGPL-3.0-or-later** — free for open source use, modification, and self-hosting. See [`LICENSE`](LICENSE).
- **Commercial licence** — required for closed-source redistribution, SaaS resale, or embedding without the AGPL's source-availability obligations. Contact **legal.support@allowanceguard.com**.

See [`LICENSE_STRATEGY.md`](LICENSE_STRATEGY.md) for the rationale and [`CORPORATE_ADDENDUM.md`](CORPORATE_ADDENDUM.md) for enterprise terms.

### Disclaimer

This software is provided "as is" without warranty of any kind. AllowanceGuard is a tool, not financial advice. Users remain responsible for their own security decisions. The maintainers are not liable for any loss of funds. Always verify approvals independently before revoking, and never sign a transaction you do not understand.

---

## Acknowledgments

Built with and standing on the shoulders of:

- [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/) for type-safe Web3
- [Reown AppKit](https://reown.com/) for wallet connection
- [Drizzle ORM](https://orm.drizzle.team/) on [Neon](https://neon.tech/) Postgres
- [TanStack Query](https://tanstack.com/query) for data fetching in `@allowance-guard/react`
- [Tailwind CSS](https://tailwindcss.com/) and [Lucide](https://lucide.dev/)
- [Playwright](https://playwright.dev/) and [Vitest](https://vitest.dev/) for testing
- Public RPC providers, block explorers, and token lists across all 15 supported chains

And every open-source maintainer whose library we depend on but haven't named — thank you.

---

## Contact

- **Product support:** <https://www.allowanceguard.com/contact>
- **Security disclosure:** security@allowanceguard.com
- **Commercial licensing:** legal.support@allowanceguard.com
- **B2B / API sales:** <https://www.allowanceguard.com/pricing>
- **Issues & feature requests:** <https://github.com/EazyAccessEA/Allowance-guard/issues>

---

<sub>Open source core. Independently operated. Built to last.</sub>
