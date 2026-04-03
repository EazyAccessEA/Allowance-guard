# AllowanceGuard — Claude Code Instructions

## Project Identity

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
| Auth | Cookie-based sessions (30-day, `ag_sess`) |
| Email | Postmark / SMTP (Nodemailer) |
| Web3 | Wagmi 2 + Viem 2 + Reown AppKit |
| Monitoring | Rollbar, Slack webhooks |
| Deployment | Vercel |
| Testing | Playwright (E2E) |
| Icons | Lucide React |
| Components | CVA (class-variance-authority) for variants |

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # 35+ API route handlers
│   │   ├── billing/        # Stripe subscription management (NEW)
│   │   ├── v1/             # Public B2B API endpoints (NEW)
│   │   ├── scan/           # Wallet scanning
│   │   ├── allowances/     # Allowance queries
│   │   ├── bulk-revoke/    # Batch revocation
│   │   ├── alerts/         # Email alert subscriptions
│   │   ├── teams/          # Team management
│   │   ├── stripe/         # Stripe webhooks
│   │   ├── coinbase/       # Coinbase Commerce
│   │   └── ...
│   ├── pricing/            # Pricing page (NEW)
│   ├── account/            # Account & billing dashboard (NEW)
│   ├── features/           # Features showcase
│   ├── settings/           # User settings
│   ├── docs/               # Documentation pages
│   └── ...
├── components/
│   ├── ui/                 # Base design system (Button, Card, Input, Badge, Modal, etc.)
│   ├── tokens/             # Token search components
│   ├── charts/             # Data visualization
│   ├── docs/               # Documentation components
│   ├── Header.tsx          # Site header/navigation
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Homepage hero section
│   ├── AppArea.tsx         # Main security dashboard
│   ├── AllowanceTable.tsx  # Token approvals table
│   ├── WalletSecurity.tsx  # Security scoring dashboard
│   └── ...
├── db/
│   ├── index.ts            # Neon + Drizzle client
│   └── schema/             # Database table definitions
├── design/
│   ├── tokens.ts           # Design system tokens (colors, typography, spacing, motion)
│   └── README.md           # Design system documentation
├── hooks/                  # Custom React hooks
├── lib/                    # Shared utilities
│   ├── plans.ts            # Plan definitions & feature limits (NEW)
│   ├── feature-gate.ts     # Tier-based feature gating (NEW)
│   ├── api-keys.ts         # API key management (NEW)
│   ├── billing.ts          # Stripe billing helpers (NEW)
│   ├── auth.ts             # Session management
│   ├── cache.ts            # DB-backed cache
│   ├── ratelimit.ts        # Redis rate limiting
│   ├── audit.ts            # Audit logging
│   └── utils.ts            # General utilities (cn helper)
├── context/                # React context providers
├── middleware/             # Request middleware
├── styles/                 # Additional style files
└── types/                  # TypeScript type definitions
```

## Business Model & Revenue Architecture

AllowanceGuard uses an **open-core model**:

### Free Tier (open source, always free)
- Scan up to 3 wallets
- Single-chain view
- Manual revocation
- Basic risk labels

### Pro Tier ($9.99/month or $79/year)
- Unlimited wallets
- Multi-chain portfolio view (all 10 chains)
- Continuous monitoring with email/Telegram alerts
- Batch revocation with gas savings display
- Historical risk timeline
- Export audit reports (PDF/CSV)

### Sentinel Tier ($49.99/month or $499/year)
- Everything in Pro
- Monitor up to 50 wallets (DAOs, treasuries)
- Automated revocation rules
- Team dashboard with role-based access
- Compliance-ready audit logs
- Webhook integrations
- Priority support

### B2B API Tiers
- **Free**: 100 calls/day
- **Developer** ($39/month): 10,000 calls/day
- **Growth** ($149/month): 100,000 calls/day
- **Enterprise**: Custom pricing, SLA

## Key Messaging Rules

**CRITICAL**: The old "Free Forever" / "no premium features, no paywalls" messaging is being replaced. The new positioning is:

- **Say**: "Core tool: free and open source. Always."
- **Say**: "Premium monitoring and API access for power users and teams."
- **Don't say**: "Free Forever" (as a blanket statement)
- **Don't say**: "No premium features, no paywalls, no subscriptions"
- **Don't say**: "100% free"

The core scanner remains free. Premium *services* (monitoring, alerts, API, teams, compliance) are paid. This is not betraying the community — it's sustaining the project.

## Coding Standards

### General
- TypeScript strict mode. No `any` types unless absolutely necessary.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging.
- Use CVA (class-variance-authority) for component variants.
- Prefer Tailwind classes. Use CSS custom properties for theme tokens.
- All components must be accessible (WCAG AA). Use semantic HTML, ARIA labels, keyboard navigation.
- Mobile-first responsive design. Test at 375px, 768px, 1024px, 1440px.

### File Naming
- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- API routes: `route.ts` inside descriptive directories
- DB schemas: `kebab-case.ts`

### API Routes
- Always validate input with Zod schemas via `src/middleware/validation.ts`.
- Always rate limit public endpoints.
- Use `src/lib/api-response.ts` for consistent JSON responses.
- Log significant actions via `src/lib/audit.ts`.
- B2B API routes live under `/api/v1/` and use API key auth.
- Consumer routes use session auth.

### Database
- Use Drizzle ORM for all queries. No raw SQL.
- Schema definitions in `src/db/schema/`.
- All tables need `created_at` timestamps.
- Use UUIDs for primary keys on new tables.
- Monetary values stored in minor units (pence/cents as integers).

### Feature Gating
- Use `checkFeature(userId, feature)` from `src/lib/feature-gate.ts` before serving gated content.
- Never expose premium data in free-tier API responses.
- Show blurred previews with upgrade prompts for locked features in the UI.
- Free tier limits: 3 wallets, no batch revoke, no export, no alerts, no teams.

### Payments & Billing
- All Stripe operations go through `src/lib/billing.ts`.
- Webhook handlers must be idempotent (use `src/lib/webhook_guard.ts`).
- Never store raw card details. Stripe handles PCI compliance.
- Test with Stripe test mode keys. Use `E2E_FAKE_PAYMENTS=true` for E2E tests.

### Security
- Never commit secrets or API keys. Use environment variables.
- Validate all user input at API boundaries.
- Hash API keys before storing (store prefix for identification).
- Rate limit all public endpoints.
- Use parameterized queries (Drizzle handles this).
- CSP headers configured in `next.config.ts`.

### Testing
- E2E tests with Playwright in `/tests/`.
- Run `pnpm test:e2e` before submitting PRs.
- Payment flows testable with `E2E_FAKE_PAYMENTS=true`.
- Email flows testable with `E2E_FAKE_EMAIL=true`.

## Design System

### Colors (Serum Teal theme)
- **Primary**: `#00C2B3` (Serum Teal)
- **Backgrounds**: `#FFFFFF`, `#F8FAFC`, `#F1F5F9` (light), `#0A0E1A`, `#111827`, `#1E293B` (dark)
- **Text**: `#0F172A` primary, `#475569` secondary, `#64748B` tertiary
- **Semantic**: Success `#22C55E`, Warning `#F59E0B`, Error `#EF4444`, Info `#0EA5E9`

### Typography
- **Headings**: Satoshi (bold, tight letter-spacing)
- **Body**: Inter (regular) — self-hosted via `next/font/local` from `public/fonts/`
- **Mono**: JetBrains Mono (code, wallet addresses, token amounts) — self-hosted via `next/font/local` from `public/fonts/`

### Motion
- Fast: 150ms (button interactions)
- Base: 250ms (modal transitions)
- Slow: 500ms (complex animations)
- Respect `prefers-reduced-motion`

### Component Library
Located in `src/components/ui/`:
- `Button.tsx` — CVA variants: primary, secondary, ghost, destructive, outline
- `Card.tsx` — With CardHeader, CardTitle, CardContent, CardFooter
- `Input.tsx` — Labels, error states, icons
- `Badge.tsx` — StatusBadge, RiskBadge, ChainBadge
- `Modal.tsx` — Accessible dialogs with focus trap
- `Alert.tsx` — Semantic alerts + auto-dismiss toasts

## Environment Variables

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

## Supported Chains
1. Ethereum (mainnet)
2. Arbitrum
3. Base
4. Polygon
5. Optimism
6. Avalanche
7. BNB Smart Chain (BSC)
8. Fantom
9. zkSync Era
10. Polygon zkEVM

## Common Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run tests with Playwright UI
pnpm run migrate      # Run database migrations
```

## Competitive Context

| Factor | AllowanceGuard | Revoke.cash | Blowfish |
|--------|---------------|-------------|----------|
| Model | Open-core freemium | Free / Donations | B2B API (paid) |
| Chains | 10 | 100+ | 10+ |
| Unique | Time Machine, Batch Revoke, Gas Savings | Browser Extension, 100 chains | Real-time tx simulation |
| Revenue | Subscriptions + API + Enterprise | Unsolved | B2B contracts |

## Implementation Status

> All 6 phases are **complete**. See `IMPLEMENTATION_PLAN.md` for full details.

### Phase 1 — Subscription Infrastructure ✅
- Database schemas (subscriptions, api_keys, usage, plan_limits)
- Plan definitions and feature gating
- Stripe billing integration
- API key system

### Phase 2 — Messaging & UI ✅
- Removed "Free Forever" messaging
- Pricing page
- Upgrade prompts and feature locks
- Account/billing dashboard

### Phase 3 — B2B API ✅
- Public REST API v1 endpoints
- API key authentication
- Per-key rate limiting
- API documentation

### Phase 4 — Pro Features ✅
- Continuous monitoring service
- Historical timeline
- Gas savings calculator
- Automated revocation rules

### Phase 5 — Institutional ✅
- Team dashboard expansion
- Compliance audit export
- Webhook system for integrations

### Phase 6 — Design Upgrade ✅
- Dark mode system with theme provider
- Glassmorphism card system
- Navigation redesign (floating pill nav)
- Animated hero background
- Radial gauge for wallet security score

## Do Not

- Do not remove or break existing free-tier functionality
- Do not expose premium features without auth/payment verification
- Do not store plaintext API keys or payment credentials
- Do not add chain support without full testing on that chain
- Do not use `any` types or skip input validation
- Do not commit `.env` files or secrets
- Do not make the free tier feel punishing — it should feel generous, with clear value in upgrading
