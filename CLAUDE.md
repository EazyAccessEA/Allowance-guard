# AllowanceGuard — Claude Code Instructions

# Startup Routine

## Foundation

At the start of every session or task:

1. Read everything in `context/`  
   This is the working foundation for the current environment, project, or task.

2. Read `MEMORY.md`  
   This is the accumulated record of learned preferences, corrections, project context, and operating rules.

3. Use both together  
   Let `context/` define the immediate situation, and let `MEMORY.md` define continuity over time.  
   Every task should be shaped by both.

---

# Memory System

When I correct you, clarify a preference, or you learn something important, update the relevant section in `MEMORY.md`.

## Update Categories

### Voice
Use for:
- tone preferences
- phrasing preferences
- writing corrections
- stylistic rules
- words or expressions to avoid

### Process
Use for:
- how I want tasks handled
- workflow preferences
- sequencing of work
- approval or review expectations
- recurring ways of operating

### People
Use for:
- who people are
- relationships
- roles
- relevant personal or professional context

### Projects
Use for:
- active work
- current tasks
- priorities
- project status
- ongoing decisions

### Output
Use for:
- preferred formats
- file naming conventions
- delivery style
- structure expectations
- presentation preferences

### Tools
Use for:
- which tools to use
- when to use them
- how to use them
- tool-specific constraints or preferences

---

# Update Rules

## Keep `MEMORY.md` current

When something changes, update the existing entry in place.

Do not simply append new information underneath outdated information.

The file should always reflect the latest accurate state, not a historical pile of contradictions.

## Prefer replacement over accumulation

If a preference, workflow, project status, or fact changes:
- replace outdated information
- remove stale details
- keep the file clean and authoritative

## Write for reuse

Entries in `MEMORY.md` should be:
- clear
- concise
- specific
- easy to apply in future tasks

Avoid vague notes that will be useless later.

---

# Principle

`context/` explains the present.  
`MEMORY.md` preserves continuity.  
Use both to produce consistent, accurate work every time.

## Project Identity

AllowanceGuard is a **Web3 wallet security platform** that helps users monitor, assess, and revoke token approvals across multiple blockchain networks. It is transitioning from a free donation-funded tool to a **revenue-generating open-core product** with freemium consumer tiers, a B2B API, and institutional compliance features.

- **Live site**: https://www.allowanceguard.com
- **Repo**: https://github.com/EazyAccessEA/Allowance-guard
- **License**: AGPL-3.0 + Commercial dual license (open-source core)
- **Version**: 1.14.9+

## Workflow Rules

1. **Plan first.** Before making any code changes, outline a plan: identify affected files, describe the approach, and list the steps. Only start implementation after the plan is clear.
2. **600-line limit.** Do not exceed 600 lines in any single code or HTML file. If a file would exceed this limit, split it into multiple files or modular parts.
3. **Conserve tokens.** Be terse. Don't re-read files you've already read in the session. Don't restate what the user said. Don't pad responses with explanations the user didn't ask for. Batch independent tool calls in a single message. Prefer surgical `Edit`s over full-file `Write`s. Skip exploratory searches when the path is already known.
4. **Convene the Standing Council.** Any non-trivial change — code, copy, documentation, architecture, naming, APIs, schemas, infrastructure — must be informed by the perspectives of the Standing Council below. You do not need to literally roleplay each member, but you must reason through the change as if each relevant member has reviewed it. If a domain isn't represented (e.g. you're touching a regulatory area we haven't covered, or shipping in a language we have no expert in), **add a new council member rather than skip the perspective**. The minimum council size is 17; new specialists can be added when needed but never removed.

## Standing Council (the canonical operating council)

This council is consulted on every non-trivial operation. It is the standard, not a one-off process. It supersedes ad-hoc councils convened for individual tasks.

| # | Role | Domain of authority |
|---|------|---------------------|
| 1 | Editor-in-chief / technical writer | Structure, tone, density, narrative flow |
| 2 | Open source maintainer | Contribution pathways, licensing, community health, CLA |
| 3 | Web3 / DeFi domain expert | Token approvals, ERC-20/721/1155, Permit2, EIP-712, chain accuracy |
| 4 | Security engineer | Threat model, disclosure policy, key handling, CSP, secrets, auth |
| 5 | Product marketing | Positioning, tier story, value proposition, segment messaging |
| 6 | B2B / API economy expert | Developer onboarding, OpenAPI, SDK ergonomics, key tiers |
| 7 | Visual designer | Hierarchy, badges, screenshots, Ledger aesthetic canon (homepage), glass canon (dashboard/docs), Five Laws |
| 8 | Accessibility specialist (**veto power**) | WCAG AA compliance, semantic structure, contrast, motion safety |
| 9 | Lawyer / compliance counsel | License accuracy, no false promises, securities exposure, GDPR |
| 10 | DevOps / SRE | Deployment, observability, env vars, rollout safety, incident response |
| 11 | Investor / founder voice | Fundability signal, banned-phrases purge, commercial intent |
| 12 | Ecosystem strategist | Competitive positioning, partnerships, distribution channels |
| 13 | UX writer | Microcopy, copy-pasteable quickstarts, error messages |
| 14 | DX engineer | Working code samples, install ergonomics, package taxonomy |
| 15 | Staff engineer / architect | Code design, scalability, tech-debt management, abstractions |
| 16 | QA / test engineer | Coverage, regressions, edge cases, test pyramid |
| 17 | Performance engineer | Bundle size, Core Web Vitals, runtime cost, Lighthouse |
| 18 | Database engineer / DBA | Migration safety, query plans, locks, index strategy |
| 19 | Privacy / GDPR specialist | Data handling, retention, user rights, cross-border transfer |
| 20 | Brand copywriter | Voice, tone, narrative arc, headline craft, emotional resonance |
| 21 | Technical copywriter | Accuracy of claims, precision in feature descriptions, no hand-waving |
| 22 | Conversion copywriter | CTA copy, landing page persuasion, objection handling, urgency without hype |
| 23 | Regulatory / compliance counsel | Securities law, AML/KYC exposure, advertising standards, jurisdictional risk |
| 24 | Data protection / privacy lawyer | GDPR Article-level accuracy, cookie consent language, DPA enforceability, cross-border transfer mechanisms |
| 25 | AI image director | Prompt engineering for image generation — model selection, style consistency, negative prompts, composition, aspect ratios, output quality |
| 26 | Visual brand photographer | Image-text coherence, editorial photography direction, colour grading to match design system, crop/composition for card layouts |
| 27 | Senior prompt engineer (photorealism) | Concrete subject matter, composition rules, lighting direction, camera angle, depth of field. Anti-pattern: abstract concept soup |
| 28 | Senior prompt engineer (brand systems) | Prompt-to-brand consistency, colour palette enforcement through prompt language, series cohesion across multiple generations |
| 29 | Art Director | Series cohesion across generated image sets. Enforces consistent background temperature, object materiality, lighting direction, and colour grade. Rejects any image that breaks the set. |
| 30 | Payment systems engineer | Stripe, Coinbase, crypto payment gateways, PCI compliance, webhook reliability, subscription lifecycle |
| 31 | Crypto payments specialist | On-chain payments, stablecoin checkout, Coinbase Commerce/Business APIs, Base L2 payments, USDC flows |
| 32 | Blockchain engineer (EVM) | Viem/ethers.js, RPC providers, multicall, ERC-20 approve/transferFrom, token approval indexing, chain-specific quirks |
| 33 | Backend engineer (Node.js/Next.js) | API routes, job queues, database queries, caching, error handling, Neon serverless, Drizzle ORM |
| 34 | Full-stack debugging engineer | End-to-end request tracing, RPC failure modes, timeout handling, error propagation, logging, production debugging |

**Sub-councils** (specialist groups convened in addition to the Standing Council for their domain):

- **Design Council (6)** — Maren (Visual), Idris (Motion), Sable (UX), Kael (Systems), Noor (Accessibility, **veto power**), Thane (Performance). Convened for visual / motion / system design work as documented in the redesign specs in `docs/`.
- **Copy Council (3)** — #20 Brand, #21 Technical, #22 Conversion. Convened for any user-facing copy: marketing pages, legal pages, emails, microcopy, blog posts. Every sentence must survive all three lenses: does it sound right (#20), is it accurate (#21), does it move the reader (#22)?
- **Legal Council (3)** — #9 Lawyer/compliance, #23 Regulatory, #24 Data protection. Convened for legal pages, privacy policy, terms, DPA, consent copy, and any claim that could create liability. #24 has **veto power** on privacy/consent language.

**Rules of operation:**

1. The council is consulted in spirit, not in literal roleplay. You reason through the change as the relevant members would.
2. The Accessibility specialist (#8) and the Design Council's Noor both hold a **veto** on anything that would degrade WCAG AA compliance, semantic structure, contrast, or motion safety.
3. The Investor / founder voice (#11) is the gatekeeper for the banned-phrases list (see "Key Messaging Rules" below). Any copy that fails their review must be revised before shipping.
4. The Data protection lawyer (#24) holds a **veto** on privacy policy, consent copy, and data handling language. No privacy-related copy ships without their sign-off.
5. Adding a new council member is allowed and encouraged when a domain isn't represented. Removing a member is not.
6. The minimum council size is 17. The current size is 34.
7. Sub-councils do not replace the Standing Council. The Design Council, Copy Council, and Legal Council operate *in addition to* it for their domains.

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

## Directory Structure

The repo is a pnpm workspace. Top-level packages:

```
/                             # Next.js app (allowance-guard)
├── src/                      # App source (see below)
├── extension/                # Browser extension (workspace)
├── sdk/                      # Legacy Node.js SDK (workspace, pending migration → packages/sdk)
├── packages/                 # NEW — client libraries distributed via npm
│   ├── client/               # @allowance-guard/client — framework-agnostic TS transport
│   └── react/                # @allowance-guard/react  — React hooks (peer-deps on TanStack Query)
├── migrations/               # SQL migrations (pnpm run migrate)
├── scripts/                  # Tooling (e.g. generate-openapi.ts)
├── docs/
│   └── architecture/         # Long-form architecture plans (e.g. react-hooks)
└── .changeset/               # Changesets for packages/* versioning
```

App source (`src/`):

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
- **No account required.** The free tier product IS the homepage scanner (`AddressInput` at `/#scan`). The pricing page's Free CTA deep-links to `/#scan` which scrolls to the input and auto-focuses it. Signing in (SIWE) is only required for Pro/Sentinel/API features.

### Pro Tier ($9.99/month or $79/year)
- Unlimited wallets
- Multi-chain portfolio view (all 27 chains)
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
- **Say**: "Open source core. Independently operated. Built to last."
- **Don't say**: "Free Forever" (as a blanket statement)
- **Don't say**: "No premium features, no paywalls, no subscriptions"
- **Don't say**: "100% free"
- **Don't say**: "No VC", "No token", "Community-funded", "donation-funded", or any other defensive financial self-disclaimer. These positions the company as a charity/donation project, blocks grant + SEIS/EIS + VC funding applications, and contradicts the actual freemium + B2B API revenue model. If you find these phrases anywhere in copy, replace them with operational claims (open source, independent, sustainable) — never with financial self-disclaimers.

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
- **Two API key tiers:** `ag_live_*` (secret, server-side, full access) and `ag_pub_*` (public, browser-safe, GET-only, `api_public` plan at 500/day). Public keys are enforced in `src/middleware/api-auth.ts` and issued via `POST /api/keys/public`. See migration `027_api_public_keys.sql`.
- **`/api/v1` OpenAPI spec** lives at `src/app/api/v1/openapi.json` and is the single source of truth for the `@allowance-guard/client` generated types. Any new v1 endpoint MUST update the spec in the same PR. Run `tsx scripts/generate-openapi.ts` to regenerate client types.
- Consumer routes use session auth.
- Cron routes are scheduled via **Vercel Cron** in `vercel.json`. No external scheduler (cron-job.org retired). No `CRON_SECRET` auth — Vercel calls the routes internally. Schedules: `/api/jobs/process` (every 5 min), `/api/monitor/cron` (every 15 min), `/api/rules/evaluate` (every 15 min), `/api/webhooks/process` (every 5 min), `/api/email/cron` (daily 10:00 UTC), `/api/jobs/cleanup` (daily 03:00 UTC).

### Database
- Use Drizzle ORM for all queries. No raw SQL.
- Schema definitions in `src/db/schema/`.
- All tables need `created_at` timestamps.
- Use UUIDs for primary keys on new tables.
- Monetary values stored in minor units (pence/cents as integers).
- **Neon serverless `.query()` rules** (the `pool` in `src/lib/db.ts` uses `@neondatabase/serverless`):
  - Object parameters MUST be `JSON.stringify()`d before passing — `.query()` does NOT auto-serialize objects (e.g. `$1::jsonb` with `JSON.stringify(payload)`).
  - PostgreSQL enum columns (e.g. `job_status`) MUST have explicit `::enum_type` casts on string literals — `.query()` does NOT auto-cast text to enums (e.g. `'pending'::job_status`, not `'pending'`).
  - Array parameters for `ANY($1::type[])` may need explicit casting.
  - When in doubt, cast explicitly. The old `neon()` direct-call API was permissive; `.query()` is strict.

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

### Ledger Aesthetic (active — homepage canon)

> **"Editorial financial publication."** — warm bone paper, ink body, a single oxblood beat.

The homepage uses the **Ledger aesthetic** — a light-first editorial redesign applied across the marketing surface. It establishes a light → dark → light rhythm (paper sections broken only by the single oxblood CTABand) and replaces all glass treatments on the homepage with paper surfaces, ink line-art, and Fraunces italic display type.

**Tokens (Tailwind):**
- Surfaces: `bg-paper` (#F7F5F0), `bg-paper-sub` (#EFECE3), `bg-paper-deep` (#E6E2D5), `bg-oxblood` (#2D0A0A), `bg-cream` (#F7F5F0 — type on oxblood)
- Text: `text-ink` (body 17:1), `text-ink-soft` (~12:1), `text-ink-muted` (~7.4:1), `text-ink-whisper` (metadata, AA)
- Rules: `border-ink-rule` (rgba(15,17,21,0.14)) for hairlines
- Accents: `text-amber-deep` (#854F08, AA on paper), `text-crimson-paper` (#B3151F, AA on paper), `text-ink-blue` (#0B2545)
- Type: `font-fraunces` (display, italic), `font-plex` (IBM Plex Sans body), `font-mono` (JetBrains Mono metadata)

**Utilities (`src/app/globals.css`):**
- `.paper` / `.paper-sub` / `.paper-deep` — section surfaces
- `.paper-card` — light card with letterpress drop shadow, no blur
- `.paper-card-raised` — elevated variant for featured content
- `.paper-pill` / `.paper-button` — chips and secondary CTAs
- `.grain` — inline SVG noise overlay for printed-paper texture
- `.ledger-rule` — double separator (strong ink hairline + amber hairline)
- `.ledger-rule-short` — short variant for section intros
- `.dotted-leader` — editorial "label ………… value" table row
- `.deckle-top` — torn-paper transition between dark and paper sections
- `.font-display-tight` / `.font-display-black` — Plex display tuning
- `.rule-amber-vert` — vertical amber column rule

**Rules:**
1. Homepage sections use `.paper` / `.paper-sub` / `.paper-deep` with `.grain` for texture. Do not introduce `bg-white`, `bg-slate-*`, or the glassmorphism utilities on homepage surfaces.
2. The signature move is oversized Fraunces italic numerals / roman numerals as margin notation, paired with `.ledger-rule`. One per major section.
3. The **single inverse moment** on the homepage is the CTABand (oxblood background, cream Fraunces, protected crimson accent word). No other dark sections.
4. Protected colour moment: the word "approved." (or equivalent headline accent) stays `text-crimson-paper`. Everything else is ink on paper.
5. Accessibility (Noor's veto): `ink-whisper` is the lowest-contrast text token allowed on paper (5.18:1 on paper-deep). `ink-muted` and above are required for body copy.
6. Performance (Thane): Vanta NET has been removed from the homepage (−180KB bundle). Do not re-introduce WebGL backgrounds on marketing pages.
7. Motion: all entrance animations respect `prefers-reduced-motion`. `.ledger-rule::after` amber glow is also disabled under that query.

**Where Ledger lives (homepage):**
- `Hero.tsx` — `.paper .grain .deckle-bottom`, compass SVG watermark, Fraunces/Plex headline, `.paper-card-raised` connected-wallet panel
- `HowItWorks.tsx` — `.paper .grain`, featured + compact steps in `.paper-card`/`.paper-card-raised`, ink line-art icons
- `FeaturesPreview.tsx` — `.paper .grain`, alternating editorial rows with ink line-art diagrams in `.paper-card-raised`
- `StatisticsSection.tsx` — `.paper-sub`, giant Fraunces italic display metric, `.dotted-leader` supporting rows
- `CTABand.tsx` — `bg-oxblood` (the single inverse moment)
- `Testimonials.tsx` — `.paper .grain`, featured Fraunces pull-quote + grid of `.paper-card` quotes
- `ChainLogoCarousel.tsx` — `.paper-sub` closing bookend

**Legacy glass canon (non-homepage surfaces):**
The `.glass-card` / `.glass-pill` / `.glass-button` / `.glass-drift` utilities remain in `src/app/globals.css` for the app dashboard, docs, and account pages which still run on the dark Midnight Amber canvas. They are **not** to be used on the homepage. See `docs/design-tokens-handbook.md` §10 (historical) and §11 (Ledger).

### Current Tokens (legacy, still active for dashboard/docs surfaces)
`src/design/tokens.ts` holds the Midnight Amber token set which remains the source of truth for the dark app surfaces. The homepage does not consume these tokens — it uses the Ledger tokens defined in `tailwind.config.js` and `src/app/globals.css`.

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

## Supported Chains (27 EVM networks)
1. Ethereum (mainnet)
2. Arbitrum
3. Base
4. Optimism
5. Polygon
6. Avalanche
7. BNB Smart Chain (BSC)
8. Fantom
9. zkSync Era
10. Polygon zkEVM
11. Mantle
12. Gnosis
13. Linea
14. Scroll
15. Celo
16. Blast
17. Cronos
18. Moonbeam
19. Aurora
20. opBNB
21. Manta Pacific
22. Mode
23. Taiko
24. Metis
25. Kava
26. ZetaChain
27. Worldchain

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

### Phase 6 — Design Upgrade ✅ → LEDGER AESTHETIC SHIPPED
- Dark mode system with theme provider ✅ (dashboard/docs)
- Glassmorphism card system ✅ (retained for dashboard/docs)
- Navigation redesign (Apple-discipline minimalism for paper theme) ✅
- Radial gauge for wallet security score ✅
- **Homepage Ledger aesthetic** ✅ — light-first editorial redesign. Fraunces + IBM Plex Sans, paper/ink/oxblood palette, `.paper-card` utilities, oversized italic numerals as signature move. See `docs/design-tokens-handbook.md` §11 and CLAUDE.md "Ledger Aesthetic (active — homepage canon)".

## Do Not

- Do not remove or break existing free-tier functionality
- Do not expose premium features without auth/payment verification
- Do not store plaintext API keys or payment credentials
- Do not add chain support without full testing on that chain
- Do not use `any` types or skip input validation
- Do not commit `.env` files or secrets
- Do not make the free tier feel punishing — it should feel generous, with clear value in upgrading
- Do not gate the free scanner behind authentication. The free tier IS the homepage scanner (`/#scan`). SIWE auth gates Pro/Sentinel/API features only.
- Do not re-introduce magic-link login. SIWE (EIP-4361) is the primary auth method. Magic link is `@deprecated` and retained only for team invites.
- Do not bypass the analytics consent gate. `trackClientEvent()` in `src/lib/analytics.ts` checks `localStorage('allowance-guard-cookie-consent').analytics === true` before firing. If the user clicked "Essential only", no client-side behavioral events reach the database. Server-side `trackEvent()` (scan_started, etc.) runs under legitimate interest and is NOT gated — it's operational.
- Do not set non-essential cookies. The app sets only `ag_sess` (session) and a CSRF token — both essential. The "Analytics" toggle in the cookie banner controls server-side DB tracking, not cookies. Be honest in all consent copy.
