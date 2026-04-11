# Billing MCP — Deferred Plan

> **Status:** Deferred. Not built. Trigger-gated.
> **Owner:** Pending.
> **Target:** `packages/mcp-ag-billing` — an AllowanceGuard-native MCP server for billing ops.
> **Decision date:** 2026-04-11.
> **Reviewed by:** Standing Council (17+) — see §3.

---

## 1. Why this document exists

An MCP (Model Context Protocol) server for billing ops has been evaluated and **deferred**. The decision is not "no" — it is "not yet, and when yes, we build our own." This doc captures the rationale, the trigger conditions that would flip the decision, and a ready-to-execute plan so the future build starts from a known spec instead of a blank page.

The alternative path considered — adopting Stripe's official `@stripe/mcp` as a stopgap — was rejected. See §4.

---

## 2. Current state of billing ops (2026-04-11)

- Billing logic lives in `src/lib/billing.ts`. Single source of truth.
- Stripe integration via `stripe` SDK. Webhooks guarded by `src/lib/webhook_guard.ts`.
- Parallel Coinbase Commerce rail for crypto-native buyers.
- `E2E_FAKE_PAYMENTS=true` short-circuits payments in Playwright.
- Audit logging via `src/lib/audit.ts`.
- Plan tiers defined in `src/lib/plans.ts` (`free`, `pro`, `sentinel`, `api_developer`, `api_growth`, `enterprise`).
- API key ceilings linked to plan tier.
- Operator tooling today = the Stripe Dashboard + ad-hoc `tsx scripts/`. No MCP, no custom CLI.

Ops pain today is **unmeasured**. See §6 for the gap-capture protocol that must run before the build is triggered.

---

## 3. Council decision log

The Standing Council was consulted on three options: (a) adopt `@stripe/mcp` now, (b) build `packages/mcp-ag-billing` now, (c) defer both and plan. Verdict: **(c) defer**.

| # | Voice | Position | Reasoning |
|---|---|---|---|
| 4 | Security | Defer | No immediate security gap. Stripe Dashboard access is already scoped. An MCP is new attack surface without a compensating benefit today. |
| 10 | DevOps / SRE | Defer, **with telemetry** | Need real data on how often billing ops happen before committing engineering. Asks for the gap-capture protocol in §6. |
| 15 | Staff engineer | Defer | No tech-debt forcing function. `billing.ts` is not yet painful to operate. Don't build tools for problems we don't have. |
| 16 | QA | Defer | No test-coverage gap that an MCP would close. |
| 18 | DBA | Defer | Subscription drift is not a documented incident class yet. If it becomes one, that flips the trigger. |
| 6 | B2B API expert | Defer, **watch** | API-key tier linkage is new. If we start getting manual upgrade requests, this flips fast. |
| 5 | Product marketing | Defer | Zero user-facing benefit. Ops tool only. |
| 11 | Investor / founder voice | Defer | Ops efficiency is not a fundability signal. Revenue features come first. |
| 17 | Thane (Perf) | Defer | Fewer packages is better. Don't add a workspace member for a problem we don't have. |
| 2 | OSS maintainer | Defer, note license question | If we ever build, check package licensing. Not a today problem. |
| 9 | Legal / compliance | Defer | PCI scope unchanged by deferring. |
| 19 | Privacy / GDPR | Defer | No new data flows today. |
| 1 | Editor-in-chief | Defer | Writing the plan now is the right output. Building the code now is not. |
| 13 | UX writer | N/A | No user-facing copy. |
| 14 | DX engineer | **Defer with reservation** | Would personally use this tomorrow. Accepts the deferral because the gap-capture protocol will prove or disprove the need within weeks, not months. |
| 7 | Maren (Visual) | N/A | No visual surface. |
| 8 | Noor (Accessibility) | N/A | No user-facing surface. |
| 12 | Ecosystem strategist | Defer | No partnership implications. |

**Veto check:** No vetoes raised. Noor (a11y veto) and the Investor voice (banned-phrases gatekeeper) had nothing to say — this is an internal ops tool.

**Unanimous:** defer.

---

## 4. Why not adopt `@stripe/mcp` as a stopgap

Stripe ships an official MCP at `https://mcp.stripe.com` (hosted, OAuth + Restricted API keys) and `npx @stripe/mcp@latest` (local). Confirmed 25-tool surface as of 2026-04-11 — see §10 for the full list.

**Rejected because:**

1. **Throwaway effort.** Adopting Stripe's MCP means onboarding operators to a tool we plan to replace. Re-training is a cost we will pay twice.
2. **The domain gap is the whole point.** Stripe's MCP speaks Stripe primitives (`update_subscription`, `create_refund`). AllowanceGuard operates on wallet → plan → API key tier chains. The primitives don't compose cleanly — every upgrade is a multi-step chain that an operator would hand-assemble every time.
3. **No audit trail integration.** Actions via Stripe's MCP don't hit `audit.ts`. We would be flying blind on who did what.
4. **No drift protection.** Stripe's MCP can update a subscription without touching our `subscriptions` table. That's a drift-generation machine, not a drift-prevention one.
5. **`E2E_FAKE_PAYMENTS` incompatibility.** Stripe's MCP can't honor our test harness flag. Any ops playbook built on it would diverge from the Playwright tests.
6. **Council #15 (staff engineer):** "Don't build tools for problems we don't have — and don't adopt them either."

**Kept as an option for later:** we may still recommend Stripe's MCP to institutional customers who want to audit their own Stripe state. That's a support recommendation, not an internal adoption.

---

## 5. Trigger conditions — when this flips to "build now"

The build is triggered when **any two** of the following become true, or when **any one** of the starred items becomes true:

### Operational triggers
- **★ Subscription drift incident:** one documented case where our `subscriptions` table disagreed with Stripe and a customer was billed incorrectly or denied a paid feature.
- **★ Manual reconciliation time > 2 hours / week** sustained for two consecutive weeks.
- Webhook replay requested more than 3 times in a calendar month.
- Refund operations issued more than 5 times in a calendar month.
- Plan upgrades/downgrades handled manually (not through self-serve) more than 5 times in a month.

### Organisational triggers
- **★ Second operator.** Founder-only ops is tolerable without audit tooling. A second person working on billing demands an audit trail.
- Support ticket class "billing state incorrect" appears with any frequency.
- A customer asks for an "ops playbook" as part of a procurement process.

### Ecosystem triggers
- Stripe deprecates or materially changes `@stripe/mcp` in a way that affects our fallback option.
- Coinbase Commerce volume grows to the point where a unified MCP (both rails) becomes necessary.
- Team plan volume exceeds X (define X when the Sentinel tier has >20 paying teams).

### Explicit non-triggers
- "It would be nice to have." Not a trigger.
- "DX engineer wants it." Not a trigger (council already accounted for).
- "A user suggested it." Not a trigger — this is ops tooling.

---

## 6. Gap-capture protocol (do this now, even while deferred)

The council's deferral is conditional on collecting real data. Without this, the trigger conditions in §5 cannot be evaluated.

**Ops journal.** Create `docs/ops/billing-ops-journal.md` (empty until needed). Every time a billing operation is performed manually — Stripe Dashboard, `tsx scripts/`, SQL console — log a single line:

```
YYYY-MM-DD  operator  action  wallet/customer  duration_minutes  notes
```

**Weekly review.** Every Monday, scan the last 7 days of the journal. If the totals hit any trigger in §5, open an issue tagged `billing-mcp-trigger` and schedule the build.

**Retention.** Keep the journal for 90 days minimum. It becomes the spec for the MCP's most-used tools.

**Why not automate this?** Because the point is to notice the pain, not abstract it away.

---

## 7. The plan (ready to execute when triggered)

When §5 triggers, execute this plan. No further council review needed for the scope below — the council has pre-approved it. Material deviations (new tools, security model changes) require re-consultation.

### 7.1 Repo placement

- New pnpm workspace package: `packages/mcp-ag-billing`.
- Not inside `src/`. Not a Next.js dep. Not bundled.
- Workspace dependency on `src/lib/billing.ts`, `src/lib/audit.ts`, `src/lib/webhook_guard.ts`, `src/db/`. The MCP is a thin adapter over existing business logic — **it imports, it does not reimplement**.
- Name honesty: it is an AllowanceGuard billing MCP, not a Stripe MCP. The name reflects that.

### 7.2 Tech

- `@modelcontextprotocol/sdk` (TypeScript server).
- `stripe` SDK (already a repo dep).
- `zod` schemas for every tool input (mirrors `src/middleware/validation.ts` convention).
- `tsup` for build (matches `packages/client`/`packages/react` convention).
- stdio transport by default. HTTP transport optional behind a flag.

### 7.3 Tool surface — 8 tools, no more

Grouped by risk tier. Every write tool takes `confirm: boolean`. Without it, tools return a dry-run preview.

**Read (safe, no confirmation):**
1. `get_user_billing_state(wallet)` — merged view: plan, Stripe sub ID, status, current period end, API key tier, usage snapshot, redacted email (domain + last-4 of local part only).
2. `get_subscription_drift(wallet?)` — diff between our DB and Stripe's truth. Single-user or full-table mode.
3. `get_usage(wallet, period)` — API calls vs tier ceiling, from the `usage` table.

**Write (sandbox default, live gated):**
4. `upgrade_user_plan(wallet, plan, interval, confirm)` — calls `billing.ts:changePlan`. Single atomic operation across Stripe + DB + audit + API-key-tier update.
5. `cancel_user_plan(wallet, at_period_end, confirm)` — downgrades plan and API key tier in one transaction.
6. `reconcile_subscription(wallet, confirm)` — pulls Stripe truth, writes DB, writes audit row. The drift-fixer.
7. `replay_webhook_event(event_id, confirm)` — reuses `webhook_guard.ts` idempotency.

**Dangerous (live requires two-factor):**
8. `issue_refund_with_notice(payment_intent, amount?, reason, confirm)` — Slack webhook fires **before** the refund is issued, giving the operator a 10-second cancel window. Then `stripe.refunds.create`. Then audit.

**What is intentionally NOT in scope:**
- Customer creation (self-serve handles this).
- Product / price creation (Stripe Dashboard is fine, rare operation).
- Invoice creation (Stripe handles automatically).
- Dispute management (Stripe Dashboard).
- Coupon creation (rare, Stripe Dashboard).
- Read tools that Stripe's own MCP already covers if the operator ever needs them — recommend running `@stripe/mcp` alongside for those, read-only, scoped to a Restricted Key.

### 7.4 Security model

- **Two environments:** `AG_MCP_MODE=sandbox|live`. Sandbox is the default. Live requires `AG_MCP_LIVE_ACK=i-understand-live-writes` to start.
- **Two keys:** `STRIPE_SANDBOX_KEY` and `STRIPE_LIVE_KEY`. Never both loaded at once — the mode picks one.
- **Confirmation pattern:** every write tool takes `confirm: boolean`. Default behaviour without confirm is dry-run with a structured preview of what would change.
- **Audit write-through:** every tool call — read or write — emits an `audit.ts` row with actor = `mcp:${process.env.USER}@${hostname}`.
- **Slack mirror:** every live-mode write emits a Slack webhook in real time. Operators see each other's actions.
- **Rate limit:** per-tool, in-memory, conservative defaults. Writes capped at 10/minute, reads at 60/minute.
- **No key echo:** tools never return environment, never log full secrets, never expose restricted-key capability sets in responses.
- **PII redaction:** customer email → `d***@domain.com`. Full record only when explicitly requested via a separate `get_user_billing_state_full(wallet, justification)` tool, which writes a reason to the audit log. (This tool is P2 — not in the initial 8.)

### 7.5 Test plan

- **Unit tests** on every tool handler with Stripe SDK mocked. Assert audit rows, DB state, dry-run previews.
- **Integration tests** against Stripe sandbox with real test keys, fixtures shared with existing billing tests.
- **Playwright E2E** — a test that drives the MCP end-to-end through a plan upgrade with `E2E_FAKE_PAYMENTS=true`. The MCP must honor the flag or the test fails.
- **Drift test** — deliberately desync DB and Stripe in a fixture, run `reconcile_subscription`, assert parity.

### 7.6 Rollout

1. Week 1: build, tests green, sandbox-only. Self-dogfood on support tickets.
2. Week 2: audit log review. Zero surprises → proceed. Any surprise → stop, diagnose, fix, repeat Week 1.
3. Week 3: enable live mode behind `AG_MCP_LIVE_ACK`. Slack mirror hot. One operator.
4. Week 4: second operator onboarded. Compare audit logs. Write ops runbook in `docs/ops/billing-mcp-runbook.md`.
5. Ongoing: changeset entry on every tool surface change. Treat the tool surface as a public API — deprecate, don't remove.

### 7.7 Docs

- `packages/mcp-ag-billing/README.md` — install, env vars, tool reference, safety protocol.
- `docs/ops/billing-mcp-runbook.md` — incident playbooks: subscription drift, webhook replay, refund-in-error, plan-upgrade-failed.
- Update `CLAUDE.md` Standing Council section only if a new council member was added during the build.

---

## 8. What would make us abandon this plan entirely

- Stripe ships a domain-extensible MCP (custom tools that call our code). Unlikely but possible.
- We switch billing provider. Unlikely.
- We outgrow operator tooling entirely (self-serve covers 100% of ops). The goal state, but not realistic.
- The gap-capture journal runs for 6 months and shows <30 minutes/week of billing ops. Then the MCP is never worth building — the plan stays documented as a historical artifact.

---

## 9. Open questions (resolve at trigger time, not now)

- Should the MCP also speak Coinbase Commerce, or is that a separate package? (Probably separate, to keep the surface small.)
- Does the hosted HTTP transport buy us anything, or is stdio-only sufficient for internal ops? (Lean stdio-only.)
- Do we want per-tool permission scopes (e.g. "refunds operator" vs "plans operator") or a single operator role? (Single role until we have 3+ operators.)
- Should drift reconciliation be automatic on a schedule, or always manual? (Manual initially — automatic reconciliation is a foot-gun without drift investigation.)

---

## 10. Reference — Stripe's official MCP tool surface (as of 2026-04-11)

Captured from `docs.stripe.com/mcp` for future comparison. 25 tools.

**Read:** `get_stripe_account_info`, `retrieve_balance`, `list_coupons`, `list_customers`, `list_disputes`, `list_invoices`, `list_payment_intents`, `list_prices`, `list_products`, `list_subscriptions`, `search_stripe_resources`, `fetch_stripe_resources`, `search_stripe_documentation`.

**Write:** `create_coupon`, `create_customer`, `update_dispute`, `create_invoice`, `create_invoice_item`, `finalize_invoice`, `create_payment_link`, `create_price`, `create_product`, `create_refund`, `cancel_subscription`, `update_subscription`.

**Access:** hosted at `https://mcp.stripe.com` (OAuth or Restricted API key as Bearer); local via `npx -y @stripe/mcp@latest --api-key=<key>`. Sandbox vs live selected by which key is provided.

**Gap vs our needs:** no plan-tier awareness, no wallet→customer mapping, no drift reconciliation, no webhook replay, no `audit.ts` integration, no `E2E_FAKE_PAYMENTS` compatibility, no API-key-tier linkage, no Coinbase path. See §4.

---

## 11. Changelog

| Date | Change | Author |
|---|---|---|
| 2026-04-11 | Initial deferral plan. Council consulted; unanimous defer. | Claude Code session |
