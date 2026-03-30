# AllowanceGuard Revenue Engine — Implementation Plan

> **Status**: Phases 1–5 Complete — Phase 6 next
> **Branch**: `claude/complete-phase-5-FdxN1`
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

## Phase 2: Messaging & UI Overhaul  ✅ COMPLETE (2026-03-30)

> **Commit**: Phase 2 — 13 new files, 7 modified files
>
> **Files created**:
> - `src/app/pricing/page.tsx` — Three-tier pricing page with monthly/yearly toggle
> - `src/components/PricingCard.tsx` — Individual plan card with feature list and CTA
> - `src/components/PricingTable.tsx` — Feature comparison matrix
> - `src/components/UpgradePrompt.tsx` — Post-scan gate (wallet limit reached)
> - `src/components/ProNudge.tsx` — Value demonstration nudge after risk results
> - `src/components/FeatureLock.tsx` — Blurred preview with "Unlock with Pro" overlay
> - `src/components/PlanBadge.tsx` — Current plan badge for header/dashboard
> - `src/app/account/page.tsx` — Account overview (plan, usage, billing)
> - `src/app/account/billing/page.tsx` — Billing history, upgrade/downgrade
> - `src/app/account/keys/page.tsx` — API key management
> - `src/components/account/PlanCard.tsx` — Current plan display
> - `src/components/account/UsageChart.tsx` — Usage statistics
> - `src/components/account/ApiKeyManager.tsx` — Key CRUD UI
>
> **Files modified**:
> - `src/components/Footer.tsx` — "Free Forever" → "Free Core", updated messaging and nav links
> - `src/components/DonationModal.tsx` — Removed "100% free" / "No premium features" messaging
> - `src/app/page.tsx` — Updated trust indicators
> - `src/components/Hero.tsx` — Updated trust line
> - `src/app/contribute/page.tsx` — Updated "free forever" to "core scanner is free forever"
> - `src/app/faq/page.tsx` — Updated pricing FAQ with tier information
> - `src/components/Header.tsx` — Added Pricing nav, plan badge, Account link, Upgrade button
> - `src/components/AppArea.tsx` — Added plan context, feature locks on exports, ProNudge
> - `src/components/BulkRevokePanel.tsx` — Added gas savings estimate display

### 2.1 Remove "Free Forever" Messaging
- [x] `src/components/Footer.tsx` — Badge: "Free Forever" → "Open Source • Free Core"; update donation text
- [x] `src/components/DonationModal.tsx` — Remove "100% free" / "No premium features" lines
- [x] `src/app/page.tsx` — Update trust indicators ("100% free" → "Free core • No private keys • Read-only")
- [x] `src/components/Hero.tsx` — Update trust line
- [x] `src/app/contribute/page.tsx` — "the app is free forever" → "The core scanner is free forever"
- [x] `src/app/faq/page.tsx` — Update FAQ answer about pricing

### 2.2 Pricing Page
- [x] `src/app/pricing/page.tsx` — Three-tier card layout (Free / Pro / Sentinel)
- [x] `src/components/PricingCard.tsx` — Individual plan card with feature list and CTA
- [x] `src/components/PricingTable.tsx` — Feature comparison matrix

### 2.3 Conversion Funnel UI
- [x] `src/components/UpgradePrompt.tsx` — Post-scan gate (wallet limit reached)
- [x] `src/components/ProNudge.tsx` — Value demonstration after risk results
- [x] `src/components/FeatureLock.tsx` — Blurred preview with "Unlock with Pro" overlay
- [x] `src/components/PlanBadge.tsx` — Current plan badge for header/dashboard
- [x] Modify `src/components/AppArea.tsx` — Add plan context, gate tabs
- [x] Modify `src/components/BulkRevokePanel.tsx` — Gas savings display
- [x] Modify `src/components/Header.tsx` — Add plan badge + "Upgrade" link

### 2.4 Account & Billing Dashboard
- [x] `src/app/account/page.tsx` — Account overview (plan, usage, billing)
- [x] `src/app/account/billing/page.tsx` — Billing history, upgrade/downgrade
- [x] `src/app/account/keys/page.tsx` — API key management
- [x] `src/components/account/PlanCard.tsx` — Current plan display
- [x] `src/components/account/UsageChart.tsx` — Usage statistics
- [x] `src/components/account/ApiKeyManager.tsx` — Key CRUD UI

### 2.5 Navigation Updates
- [x] Header: Add "Pricing" nav link, "Account" when logged in, plan badge, "Upgrade" button for free users
- [x] Footer: Replace "Support Us" with "Pricing" link, deprioritize donation, update messaging

---

## Phase 3: B2B API Product  ✅ COMPLETE (2026-03-30)

> **Commit**: Phase 3 — 14 new files
>
> **Files created**:
> - `src/lib/api-response.ts` — Standardized API response envelope `{ data, error, meta }`
> - `src/middleware/api-rate-limit.ts` — Per-key burst rate limiting (sliding window)
> - `src/app/api/v1/health/route.ts` — Health check (public, no auth)
> - `src/app/api/v1/chains/route.ts` — List supported chains
> - `src/app/api/v1/scan/route.ts` — Trigger wallet scan
> - `src/app/api/v1/scan/[id]/route.ts` — Check scan status
> - `src/app/api/v1/allowances/route.ts` — Get allowances with filtering/pagination
> - `src/app/api/v1/risk-score/route.ts` — Aggregated risk score (0-100) with breakdown
> - `src/app/api/v1/risk-check/route.ts` — Pre-signing approval risk assessment
> - `src/app/api/v1/simulate/route.ts` — Time Machine revocation simulation
> - `src/app/docs/api-reference/page.tsx` — Interactive API reference documentation
> - `src/components/docs/ApiEndpoint.tsx` — Expandable endpoint documentation block
> - `src/components/docs/CodeExample.tsx` — Multi-language code tabs (JS/Python/cURL)
> - `src/components/docs/ApiPlayground.tsx` — Interactive try-it sandbox

### 3.1 Public API v1 Endpoints
- [x] `src/lib/api-response.ts` — Standardized response helpers `{ data, error, meta: { requestId, rateLimit } }`
- [x] `src/middleware/api-rate-limit.ts` — Per-key rate limiting
- [x] `GET /api/v1/health/route.ts` — Health check
- [x] `GET /api/v1/chains/route.ts` — Supported chains
- [x] `POST /api/v1/scan/route.ts` — Trigger wallet scan
- [x] `GET /api/v1/scan/[id]/route.ts` — Check scan status
- [x] `GET /api/v1/allowances/route.ts` — Get allowances for wallet
- [x] `GET /api/v1/risk-score/route.ts` — Get risk score for wallet
- [x] `POST /api/v1/risk-check/route.ts` — Pre-signing approval risk check
- [x] `POST /api/v1/simulate/route.ts` — Time Machine simulation

### 3.2 API Documentation
- [x] `src/app/docs/api-reference/page.tsx` — Interactive API docs
- [x] `src/components/docs/ApiEndpoint.tsx` — Endpoint documentation block
- [x] `src/components/docs/CodeExample.tsx` — Multi-language code tabs
- [x] `src/components/docs/ApiPlayground.tsx` — Interactive try-it sandbox

---

## Phase 4: Pro Features Build  ✅ COMPLETE (2026-03-30)

> **Commit**: Phase 4 — 16 new files, 4 modified files
>
> **Files created**:
> - `src/db/schema/monitoring.ts` — monitored_wallets + monitoring_events tables
> - `src/db/schema/history.ts` — wallet_events + risk_snapshots tables
> - `src/db/schema/policies.ts` — revocation_rules + rule_executions tables
> - `src/lib/monitoring.ts` — Monitoring logic, change detection, alert dispatch (email/Slack)
> - `src/lib/rule-engine.ts` — Rule condition evaluator, rule execution engine, CRUD helpers
> - `src/app/api/monitor/cron/route.ts` — Vercel Cron handler (every 15 min)
> - `src/app/api/monitor/events/route.ts` — GET/POST monitoring events
> - `src/app/api/history/route.ts` — Historical wallet events query
> - `src/app/api/history/risk/route.ts` — Risk snapshots over time
> - `src/app/api/history/risk-snapshots.ts` — Shared risk snapshot query handler
> - `src/app/api/gas-estimate/route.ts` — Live gas price + ETH price (CoinGecko + RPC)
> - `src/app/api/rules/route.ts` — CRUD for automated revocation rules (Sentinel-gated)
> - `src/components/MonitoringDashboard.tsx` — Monitoring status + events timeline UI
> - `src/components/HistoricalTimeline.tsx` — Time Machine: risk charts + event timeline
> - `src/components/RuleBuilder.tsx` — Visual rule builder with condition editor
> - `migrations/021_phase4_pro_features.sql` — All Phase 4 database tables
>
> **Files modified**:
> - `src/db/schema.ts` — Added Phase 4 schema exports
> - `src/components/BulkRevokePanel.tsx` — Full gas savings calculator with live pricing
> - `src/app/api/bulk-revoke/route.ts` — Per-standard gas estimates + batch savings
> - `vercel.json` — Added cron schedule for monitoring

### 4.1 Continuous Monitoring
- [x] `src/db/schema/monitoring.ts` — monitored_wallets + monitoring_events tables
- [x] `src/app/api/monitor/cron/route.ts` — Cron job: re-scan monitored wallets every 15 min
- [x] `src/app/api/monitor/events/route.ts` — GET/POST monitoring events
- [x] `src/lib/monitoring.ts` — Monitoring logic + alert dispatch (email/Slack/Telegram)
- [x] `src/components/MonitoringDashboard.tsx` — Monitoring status UI

### 4.2 Historical Timeline
- [x] `src/db/schema/history.ts` — wallet_events + risk_snapshots tables
- [x] `src/app/api/history/route.ts` — History query endpoint (with filtering/pagination)
- [x] `src/app/api/history/risk/route.ts` — Risk snapshots over time
- [x] `src/components/HistoricalTimeline.tsx` — Visual timeline UI with risk chart

### 4.3 Gas Savings Calculator
- [x] Modify `src/components/BulkRevokePanel.tsx` — Full gas calculator: per-standard estimates, batch vs individual comparison, live gas/ETH prices, per-chain breakdown, USD cost display
- [x] `src/app/api/gas-estimate/route.ts` — Live gas price (RPC) + ETH price (CoinGecko) with 60s cache
- [x] Modify `src/app/api/bulk-revoke/route.ts` — Per-standard gas estimates + batch savings in response

### 4.4 Automated Revocation Rules (Sentinel)
- [x] `src/db/schema/policies.ts` — revocation_rules + rule_executions tables
- [x] `src/app/api/rules/route.ts` — CRUD for rules (Sentinel-gated)
- [x] `src/lib/rule-engine.ts` — Rule condition evaluation + execution engine
- [x] `src/components/RuleBuilder.tsx` — Visual rule creation UI with condition editor

---

## Phase 5: Institutional & Compliance  ✅ COMPLETE (2026-03-30)

> **Commit**: Phase 5 — 16 new files, 2 modified files
>
> **Files created**:
> - `migrations/022_phase5_institutional.sql` — All Phase 5 database tables (webhooks, webhook_deliveries, team_activity, compliance_exports + team enhancements)
> - `src/db/schema/webhooks.ts` — Drizzle schemas: webhooks, webhookDeliveries, teamActivity, complianceExports
> - `src/lib/webhook-dispatcher.ts` — HMAC-signed webhook delivery with retries, logging, auto-disable
> - `src/lib/compliance-export.ts` — Audit log, risk summary, allowance snapshot, team report exports (JSON/CSV)
> - `src/app/api/webhooks/route.ts` — GET (list) + POST (create) webhooks (Sentinel-gated)
> - `src/app/api/webhooks/[id]/route.ts` — GET (details+deliveries) + PUT (update) + DELETE (revoke)
> - `src/app/api/compliance/export/route.ts` — POST (generate) + GET (history) compliance exports (Pro+)
> - `src/app/api/teams/details/route.ts` — GET team details with summary stats
> - `src/app/api/teams/members/route.ts` — GET team members with role info
> - `src/app/api/teams/portfolio/route.ts` — GET multi-wallet portfolio overview
> - `src/app/api/teams/portfolio/allowances/route.ts` — GET allowances for team wallet
> - `src/app/api/teams/activity/route.ts` — GET/POST team activity log
> - `src/app/team/[id]/page.tsx` — Team dashboard with portfolio, activity, members tabs
> - `src/components/team/TeamPortfolioView.tsx` — Multi-wallet portfolio view with expandable details
> - `src/components/team/TeamActivityLog.tsx` — Per-member activity timeline with export
> - `src/components/compliance/AuditReport.tsx` — Report generator UI with type/format/date selection
>
> **Files modified**:
> - `src/app/api/teams/route.ts` — Expanded with PUT (update), richer GET (stats), Sentinel-gated POST, activity logging
> - `src/db/schema.ts` — Added Phase 5 schema exports

### 5.1 Team Dashboard Enhancement
- [x] Expand `src/app/api/teams/route.ts` — Multi-wallet portfolio, role-based views, team update
- [x] `src/app/api/teams/details/route.ts` — Team details with member/wallet counts
- [x] `src/app/api/teams/members/route.ts` — Team members with roles
- [x] `src/app/api/teams/portfolio/route.ts` — Aggregated wallet stats across all chains
- [x] `src/app/api/teams/portfolio/allowances/route.ts` — Per-wallet allowance detail
- [x] `src/app/api/teams/activity/route.ts` — Team activity log with pagination
- [x] `src/app/team/[id]/page.tsx` — Team dashboard page with tabs (portfolio/activity/members)
- [x] `src/components/team/TeamPortfolioView.tsx` — All team wallets, all chains, expandable details
- [x] `src/components/team/TeamActivityLog.tsx` — Per-member activity log with CSV export

### 5.2 Compliance Audit Export
- [x] `src/app/api/compliance/export/route.ts` — Timestamped audit log export (JSON/CSV)
- [x] `src/components/compliance/AuditReport.tsx` — Report generator UI with type/format/date filtering
- [x] `src/lib/compliance-export.ts` — Export generation (full_audit, risk_summary, allowance_snapshot, team_report)

### 5.3 Webhook System
- [x] `src/db/schema/webhooks.ts` — webhooks, webhook_deliveries, team_activity, compliance_exports tables
- [x] `src/app/api/webhooks/route.ts` — Register + list webhooks (Sentinel-gated)
- [x] `src/app/api/webhooks/[id]/route.ts` — GET details + PUT update + DELETE webhook
- [x] `src/lib/webhook-dispatcher.ts` — HMAC-signed dispatch with retries, delivery logging, auto-disable

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
| Database schemas | 7 | 2 |
| API routes (billing) | 4 | 0 |
| API routes (v1 public) | 8 | 0 |
| API routes (features) | 8 | 2 |
| API routes (teams/compliance/webhooks) | 8 | 1 |
| Middleware/lib | 12 | 3 |
| Pages | 7 | 4 |
| Components | 21 | 8 |
| Migrations | 1 | 0 |
| **Total** | **~76 new** | **~20 modified** |
