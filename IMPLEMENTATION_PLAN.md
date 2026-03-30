# AllowanceGuard Revenue Engine — Implementation Plan

> **Status**: In Progress — Phase 2 next
> **Branch**: `claude/explore-allowance-guard-MaFYK`
> **Started**: 2026-03-30

---

## Phase 1: Foundation — Subscription Infrastructure  ✅ COMPLETE (2026-03-30)

> **Commit**: `6a57c7f` — 17 files, 1,557 lines added
>
> **Files created**:
> - `src/lib/plans.ts` — Plan definitions, pricing, feature flags, helpers
> - `src/lib/billing.ts` — Stripe customer/checkout/portal/sync
> - `src/lib/feature-gate.ts` — Feature gating (wallet quota, API quota, chain access, boolean features)
> - `src/lib/api-keys.ts` — Key generation (ag_live_ prefix), SHA-256 hashing, validation, rate limiting
> - `src/db/schema/subscriptions.ts` — subscriptions table
> - `src/db/schema/api-keys.ts` — api_keys table
> - `src/db/schema/usage.ts` — usage_records table
> - `src/db/schema/plan-limits.ts` — plan_limits config table
> - `src/middleware/plan-guard.ts` — requireFeature() and requireWalletQuota() route guards
> - `src/middleware/api-auth.ts` — API key auth middleware for v1 endpoints
> - `src/app/api/billing/create-customer/route.ts`
> - `src/app/api/billing/create-subscription/route.ts`
> - `src/app/api/billing/manage/route.ts`
> - `src/app/api/billing/webhook/route.ts`
> - `src/app/api/keys/route.ts` — GET (list) + POST (create)
> - `src/app/api/keys/[id]/route.ts` — DELETE (revoke)
>
> **Files modified**:
> - `src/db/schema.ts` — Re-exports new schemas

### 1.1 Plan Definitions (`src/lib/plans.ts`)
- [x] Define consumer plans: Free, Pro ($9.99/mo | $79/yr), Sentinel ($49.99/mo | $499/yr)
- [x] Define API plans: Free (100/day), Developer ($39/mo, 10k/day), Growth ($149/mo, 100k/day), Enterprise (custom)
- [x] Define feature flags per plan (max_wallets, batch_revoke, export, alerts, teams, monitoring, time_machine)
- [x] Export helper functions: `getPlanLimits()`, `isPaidPlan()`, `getPlanPrice()`

### 1.2 Database Schemas
- [x] `src/db/schema/subscriptions.ts` — subscriptions table
- [x] `src/db/schema/api-keys.ts` — api_keys table
- [x] `src/db/schema/usage.ts` — usage_records table
- [x] `src/db/schema/plan-limits.ts` — plan_limits config table
- [x] Register new schemas in `src/db/schema.ts`

### 1.3 Stripe Billing Integration
- [x] `src/lib/billing.ts` — Stripe billing helpers
- [x] `POST /api/billing/create-customer/route.ts`
- [x] `POST /api/billing/create-subscription/route.ts`
- [x] `POST /api/billing/manage/route.ts`
- [x] `POST /api/billing/webhook/route.ts`

### 1.4 Feature Gating
- [x] `src/lib/feature-gate.ts` — `checkFeature(userId, feature)` returns `{ allowed, limit, used }`
- [x] `src/middleware/plan-guard.ts` — Middleware wrapper for gated API routes

### 1.5 API Key System
- [x] `src/lib/api-keys.ts` — Key generation (ag_live_xxx prefix), hashing, validation
- [x] `src/middleware/api-auth.ts` — API key auth middleware (Authorization: Bearer)
- [x] `POST /api/keys/route.ts` — Generate & list API keys
- [x] `DELETE /api/keys/[id]/route.ts` — Revoke a key

---

## Phase 2: Messaging & UI Overhaul

### 2.1 Remove "Free Forever" Messaging
- [ ] `src/components/Footer.tsx` — Badge: "Free Forever" → "Open Source • Free Core"; update donation text
- [ ] `src/components/DonationModal.tsx` — Remove "100% free" / "No premium features" lines
- [ ] `src/app/page.tsx` — Update trust indicators ("100% free" → "Free core • No private keys • Read-only")
- [ ] `src/components/Hero.tsx` — Update trust line
- [ ] `src/app/contribute/page.tsx` — "the app is free forever" → "The core scanner is free forever"
- [ ] `src/app/faq/page.tsx` — Update FAQ answer about pricing

### 2.2 Pricing Page
- [ ] `src/app/pricing/page.tsx` — Three-tier card layout (Free / Pro / Sentinel)
- [ ] `src/components/PricingCard.tsx` — Individual plan card with feature list and CTA
- [ ] `src/components/PricingTable.tsx` — Feature comparison matrix

### 2.3 Conversion Funnel UI
- [ ] `src/components/UpgradePrompt.tsx` — Post-scan gate (wallet limit reached)
- [ ] `src/components/ProNudge.tsx` — Value demonstration after risk results
- [ ] `src/components/FeatureLock.tsx` — Blurred preview with "Unlock with Pro" overlay
- [ ] `src/components/PlanBadge.tsx` — Current plan badge for header/dashboard
- [ ] Modify `src/components/AppArea.tsx` — Add plan context, gate tabs
- [ ] Modify `src/components/BulkRevokePanel.tsx` — Gas savings display
- [ ] Modify `src/components/Header.tsx` — Add plan badge + "Upgrade" link

### 2.4 Account & Billing Dashboard
- [ ] `src/app/account/page.tsx` — Account overview (plan, usage, billing)
- [ ] `src/app/account/billing/page.tsx` — Billing history, upgrade/downgrade
- [ ] `src/app/account/keys/page.tsx` — API key management
- [ ] `src/components/account/PlanCard.tsx` — Current plan display
- [ ] `src/components/account/UsageChart.tsx` — Usage statistics
- [ ] `src/components/account/ApiKeyManager.tsx` — Key CRUD UI

### 2.5 Navigation Updates
- [ ] Header: Add "Pricing" nav link, "Account" when logged in, plan badge, "Upgrade" button for free users
- [ ] Footer: Replace "Support Us" with "Pricing" link, deprioritize donation, update messaging

---

## Phase 3: B2B API Product

### 3.1 Public API v1 Endpoints
- [ ] `src/lib/api-response.ts` — Standardized response helpers `{ data, error, meta: { requestId, rateLimit } }`
- [ ] `src/middleware/api-rate-limit.ts` — Per-key rate limiting
- [ ] `GET /api/v1/health/route.ts` — Health check
- [ ] `GET /api/v1/chains/route.ts` — Supported chains
- [ ] `POST /api/v1/scan/route.ts` — Trigger wallet scan
- [ ] `GET /api/v1/scan/[id]/route.ts` — Check scan status
- [ ] `GET /api/v1/allowances/route.ts` — Get allowances for wallet
- [ ] `GET /api/v1/risk-score/route.ts` — Get risk score for wallet
- [ ] `POST /api/v1/risk-check/route.ts` — Pre-signing approval risk check
- [ ] `POST /api/v1/simulate/route.ts` — Time Machine simulation

### 3.2 API Documentation
- [ ] `src/app/docs/api-reference/page.tsx` — Interactive API docs
- [ ] `src/components/docs/ApiEndpoint.tsx` — Endpoint documentation block
- [ ] `src/components/docs/CodeExample.tsx` — Multi-language code tabs
- [ ] `src/components/docs/ApiPlayground.tsx` — Interactive try-it sandbox

---

## Phase 4: Pro Features Build

### 4.1 Continuous Monitoring
- [ ] `src/db/schema/monitoring.ts` — monitored_wallets + monitoring_events tables
- [ ] `src/app/api/monitor/cron/route.ts` — Cron job: re-scan monitored wallets every 15 min
- [ ] `src/lib/monitoring.ts` — Monitoring logic + alert dispatch (email/Slack/Telegram)
- [ ] `src/components/MonitoringDashboard.tsx` — Monitoring status UI

### 4.2 Historical Timeline
- [ ] `src/db/schema/history.ts` — wallet_events table for historical snapshots
- [ ] `src/app/api/history/route.ts` — History query endpoint
- [ ] `src/components/HistoricalTimeline.tsx` — Visual timeline UI

### 4.3 Gas Savings Calculator
- [ ] Modify `src/components/BulkRevokePanel.tsx` — Display gas savings (individual vs batch)
- [ ] Modify `src/app/api/bulk-revoke/route.ts` — Return savings estimate in response

### 4.4 Automated Revocation Rules (Sentinel)
- [ ] `src/db/schema/policies.ts` — revocation_rules table
- [ ] `src/app/api/rules/route.ts` — CRUD for rules
- [ ] `src/lib/rule-engine.ts` — Rule evaluation logic
- [ ] `src/components/RuleBuilder.tsx` — Rule creation UI

---

## Phase 5: Institutional & Compliance

### 5.1 Team Dashboard Enhancement
- [ ] Expand `src/app/api/teams/route.ts` — Multi-wallet portfolio, role-based views
- [ ] `src/app/team/[id]/page.tsx` — Team dashboard page
- [ ] `src/components/team/TeamPortfolioView.tsx` — All team wallets, all chains
- [ ] `src/components/team/TeamActivityLog.tsx` — Per-member activity log

### 5.2 Compliance Audit Export
- [ ] `src/app/api/compliance/export/route.ts` — Timestamped audit log export
- [ ] `src/components/compliance/AuditReport.tsx` — Branded PDF report UI
- [ ] `src/lib/compliance-export.ts` — PDF generation with audit data

### 5.3 Webhook System
- [ ] `src/db/schema/webhooks.ts` — webhooks table
- [ ] `src/app/api/webhooks/route.ts` — Register + list webhooks
- [ ] `src/app/api/webhooks/[id]/route.ts` — Delete webhook
- [ ] `src/lib/webhook-dispatcher.ts` — Dispatch payloads on events

---

## Phase 6: Design Upgrade (Parallel Track)

### 6.1 Dark Mode System
- [ ] `src/components/ThemeProvider.tsx` — Theme switching (dark/light/system)
- [ ] Update `src/design/tokens.ts` — Dark mode tokens, surface colors
- [ ] Update `tailwind.config.js` — Dark mode config
- [ ] Update `src/app/globals.css` — Dark mode CSS variables
- [ ] Update `src/app/layout.tsx` — Theme provider integration

### 6.2 Glassmorphism Card System
- [ ] Update `src/components/ui/Card.tsx` — Glass variants with backdrop-filter
- [ ] Update `src/components/ui/Button.tsx` — Glow effects, dark mode
- [ ] Update `src/components/ui/Badge.tsx` — Dot indicators, dark mode

### 6.3 Navigation Redesign
- [ ] Redesign `src/components/Header.tsx` — Floating pill nav, backdrop blur
- [ ] Redesign `src/components/Footer.tsx` — Dark mode compatible

### 6.4 Hero & Homepage
- [ ] `src/components/AnimatedBackground.tsx` — CSS mesh gradient (replace video)
- [ ] Redesign `src/components/Hero.tsx` — New animated hero
- [ ] Restructure `src/app/page.tsx` — Visual "acts" with scroll reveals

### 6.5 Dashboard & Data
- [ ] Redesign `src/components/AllowanceTable.tsx` — Modern data grid
- [ ] Redesign `src/components/WalletSecurity.tsx` — Radial gauge

---

## File Change Summary

| Category | New Files | Modified Files |
|----------|-----------|----------------|
| Database schemas | 6 | 1 |
| API routes (billing) | 4 | 0 |
| API routes (v1 public) | 8 | 0 |
| API routes (features) | 8 | 2 |
| Middleware/lib | 10 | 3 |
| Pages | 6 | 4 |
| Components | 18 | 8 |
| **Total** | **~60 new** | **~18 modified** |
