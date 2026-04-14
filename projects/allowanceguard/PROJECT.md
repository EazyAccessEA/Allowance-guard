# AllowanceGuard — Project

## Identity

AllowanceGuard is a **Web3 wallet security platform** that helps users monitor, assess, and revoke token approvals across multiple blockchain networks. It is transitioning from a free donation-funded tool to a **revenue-generating open-core product** with freemium consumer tiers, a B2B API, and institutional compliance features.

- **Live site**: https://www.allowanceguard.com
- **Repo**: https://github.com/EazyAccessEA/Allowance-guard
- **License**: AGPL-3.0 + Commercial dual license (open-source core)
- **Version**: 1.14.9+

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| Language | TypeScript 5.0, React 19 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Database | PostgreSQL (Neon serverless) via Drizzle ORM |
| Cache | Redis (Upstash) + DB-backed cache |
| Payments | Stripe (checkout + billing) + Coinbase Commerce |
| Auth | SIWE (EIP-4361) → Cookie-based sessions (30-day, `ag_sess`). Magic-link deprecated. |
| Email | Postmark / SMTP (Nodemailer) |
| Web3 | Wagmi 2 + Viem 2 + Reown AppKit |
| Monitoring | Rollbar, Slack webhooks |
| Deployment | Vercel |
| Testing | Playwright (E2E) |
| Icons | Lucide React |
| Components | CVA (class-variance-authority) for variants |

See `ARCHITECTURE.md` for directory structure, API rules, DB rules, and supported chains.

## Environment Variables

> **NAMES ONLY. NEVER VALUES.** If a value appears in this file, it's a leak. Delete immediately and rotate.

Required for development:

```
DATABASE_URL              # Neon PostgreSQL connection string
REDIS_URL                 # Upstash Redis (or REDIS_HOST/PORT/PASSWORD)
STRIPE_SECRET_KEY         # Stripe API key
STRIPE_WEBHOOK_SECRET     # Stripe webhook signing secret
COINBASE_COMMERCE_API_KEY # Coinbase Commerce
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID  # WalletConnect
NEXT_PUBLIC_APP_URL       # App URL (https://www.allowanceguard.com)
POSTMARK_SERVER_TOKEN     # Email (or SMTP_HOST/PORT/USER/PASS)
SLACK_WEBHOOK_URL         # Slack notifications
ROLLBAR_ACCESS_TOKEN      # Error monitoring
```

Test mode flags:

```
E2E_FAKE_PAYMENTS=true    # Skip Stripe/Coinbase in tests
E2E_FAKE_EMAIL=true       # Skip email sending in tests
```

## Common Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run tests with Playwright UI
pnpm run migrate      # Run database migrations
```

## Changelog

- 2026-04-14: Split from `CLAUDE.md`. Env vars got a "NAMES ONLY" header.
