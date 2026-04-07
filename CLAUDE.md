# AllowanceGuard — Claude Code Instructions

## Project Identity

AllowanceGuard is a **Web3 wallet security platform** that helps users monitor, assess, and revoke token approvals across multiple blockchain networks. It is transitioning from a free donation-funded tool to a **revenue-generating open-core product** with freemium consumer tiers, a B2B API, and institutional compliance features.

- **Live site**: https://www.allowanceguard.com
- **Repo**: https://github.com/EazyAccessEA/Allowance-guard
- **License**: AGPL-3.0 + Commercial dual license (open-source core)
- **Version**: 1.14.9+

## Workflow Rules

1. **Plan first.** Before making any code changes, outline a plan: identify affected files, describe the approach, and list the steps. Only start implementation after the plan is clear.
2. **600-line limit.** Do not exceed 600 lines in any single code or HTML file. If a file would exceed this limit, split it into multiple files or modular parts.

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
- Cron routes (cleanup, monitoring, rules, webhooks, email) are called by [cron-job.org](https://cron-job.org) — no `CRON_SECRET` auth. Do not add Vercel Cron schedules to `vercel.json`.

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

## Design System — REDESIGN IN PROGRESS

> **Authority**: The design system is governed by the redesign specs in `docs/`. The old "PuredgeOS" system is deprecated. All new UI work must follow the redesign process.

### Design Spec Documents (source of truth)
- `docs/allowanceguard-1-strategy-spec (3).md` — Part 1: Strategy & Design Language (Phases 1–4)
- `docs/allowanceguard-2-build (3).md` — Part 2: Build specifications (Phases 5–7)

### The Five Laws (from the redesign spec)
1. **Saturation Over Safety** — whatever the colours, OWN them. Push saturation. Push contrast.
2. **Strip, Then Amplify** — kill everything that doesn't earn space. Make what survives impossible to ignore.
3. **Materiality** — surfaces feel crafted. Subtle grain, engineered depth, tactile quality. Not flat.
4. **One Signature Move** — one recurring visual element that brands every page without a logo.
5. **Confidence in the Departure** — break clean from PuredgeOS. No soft transition. Own the new identity.

### Design Directives
- **Type**: Display = declarations. Aggressive scale contrast. Body with backbone.
- **Colour**: Every colour earns its place. Accent = punctuation (rare, powerful). Council decides palette.
- **Motion**: Sharp easing, choreographed entrances, scroll as revelation. `prefers-reduced-motion` mandatory.
- **Imagery**: Editorial, not stock. Bold cropping. No filler.
- **Layout**: Break the grid with purpose. Whitespace as confidence. Density contrast.

### Design Council Process
Colours, typography, spacing, and component specs are produced through the Design Council process (six architects: Maren/Visual, Idris/Motion, Sable/UX, Kael/Systems, Noor/Accessibility with veto power, Thane/Performance). Output is a **Design Tokens Handbook** with CSS custom properties that becomes the implementation spec.

### Glassmorphism Layer (active — homepage canon)

The marketing surface uses a unified glassmorphism layer. Homepage cards, eyebrows, and secondary buttons must use the council-approved utilities defined in `src/app/globals.css`:

- `.glass-card` — primary glass surface (cards, panels). 20px blur + 140% saturation, 6%→2.5% white gradient over a 55% slate-900 underlay, 1px white/10 border, inset highlight.
- `.glass-pill` — eyebrow chips and labels. 12px blur, rounded-full.
- `.glass-button` — secondary CTAs. 14px blur, white/8 fill, white/18 border.
- `.glass-drift` — slow 6s drift shimmer for the hero Live Protection panel. Auto-disabled under `prefers-reduced-motion`.

**Rules:**
1. Every glass surface sits over the slate-900/55+ underlay so text contrast stays AAA against blurred backdrops (Noor's veto condition).
2. Cap visible glass blur layers at ~4 per viewport (Thane).
3. Glass borders are decorative — focus rings remain solid amber 2px.
4. The hero headline uses `bg-gradient-to-br from-white via-white to-amber-300 bg-clip-text text-transparent`. The word "approved." stays `text-crimson-500` — that is the only protected color moment.
5. Vanta NET background renders at 50% opacity behind the hero with a reinforced radial overlay.
6. New homepage sections must use `.glass-card` for content containers — do not introduce ad-hoc `bg-white/[0.0X] ring-white/[0.0X]` patterns.

See `docs/design-tokens-handbook.md` §10 for the full handbook entry.

### Current Tokens (legacy, to be replaced)
Until the council process produces the new handbook, `src/design/tokens.ts` remains active. Do not extend it — new work should wait for the redesign output.

### Component Library (existing, to be redesigned)
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

### Phase 6 — Design Upgrade ✅ → REDESIGN IN PROGRESS
- Dark mode system with theme provider ✅ (existing, under review)
- Glassmorphism card system ✅ (existing, under review)
- Navigation redesign (floating pill nav) ✅ (existing, under review)
- Animated hero background ✅ (existing, under review)
- Radial gauge for wallet security score ✅ (existing, under review)
- **Full visual redesign per new spec** 🔄 — see `docs/allowanceguard-1-strategy-spec (3).md` and `docs/allowanceguard-2-build (3).md`

## Do Not

- Do not remove or break existing free-tier functionality
- Do not expose premium features without auth/payment verification
- Do not store plaintext API keys or payment credentials
- Do not add chain support without full testing on that chain
- Do not use `any` types or skip input validation
- Do not commit `.env` files or secrets
- Do not make the free tier feel punishing — it should feel generous, with clear value in upgrading
