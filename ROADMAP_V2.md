# AllowanceGuard v2.0 — Strategic Remediation & Evolution Plan

> **Generated**: 2026-03-31
> **Based on**: Council of 12 Full-Stack Gap Analysis
> **Current version**: 1.14.9
> **Target version**: 2.0.0
> **Objective**: Close every gap identified in the evaluation — security, revenue, UX, testing, infrastructure, legal, and competitive positioning — with zero remaining blind spots.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 0 — Security Critical (Week 1)](#phase-0--security-critical-week-1)
3. [Phase 1 — Revenue Engine (Week 2)](#phase-1--revenue-engine-week-2)
4. [Phase 2 — Web3 Credibility (Week 3–4)](#phase-2--web3-credibility-week-34)
5. [Phase 3 — Frontend & UX Overhaul (Week 3–5)](#phase-3--frontend--ux-overhaul-week-35)
6. [Phase 4 — Testing & CI/CD (Week 2–4)](#phase-4--testing--cicd-week-24)
7. [Phase 5 — Infrastructure & Observability (Week 4–6)](#phase-5--infrastructure--observability-week-46)
8. [Phase 6 — Execution Layer Completion (Week 5–7)](#phase-6--execution-layer-completion-week-57)
9. [Phase 7 — Legal & Compliance (Week 4–6)](#phase-7--legal--compliance-week-46)
10. [Phase 8 — Data Lifecycle & Analytics (Week 6–8)](#phase-8--data-lifecycle--analytics-week-68)
11. [Phase 9 — Competitive Moat (Month 3+)](#phase-9--competitive-moat-month-3)
12. [Verification Checklist](#verification-checklist)
13. [Success Metrics](#success-metrics)

---

## Executive Summary

The Council of 12 evaluation scored AllowanceGuard at **C-** overall. The architecture is 90% complete but only 40% of features work end-to-end. The codebase has:

- **13 unprotected API endpoints** (including bulk-revoke, audit logs, job processor)
- **Hardcoded `userPlan = 'free'`** in the main dashboard — no paying customer can access paid features
- **3 of 7 chains** actually connected in the frontend (advertises 6)
- **No Permit2 scanning** — the single biggest credibility gap for a Web3 security tool
- **15 test files** for 85 API endpoints — CI set to `continue-on-error: true`
- **Rate limiting fails open** when Redis is unavailable
- **No working payment→feature unlock loop** — Stripe checkout exists but the return flow is broken
- **No rule execution engine, webhook dispatcher, or monitoring cron verification**
- **No Terms of Service for paid users, no SLA, no refund policy**
- **Source maps exposed in production**
- **Batch revoke claims gas savings but executes sequentially** — marketing fiction

This plan addresses every finding across all 12 evaluators. Each phase has concrete tasks, file paths, acceptance criteria, and verification steps. After full implementation, every cell in the Feature Completion Matrix should read **YES**.

### Priority Order Rationale

| Priority | Phase | Why This Order |
|----------|-------|----------------|
| P0 | Phase 0: Security | Unprotected routes are exploitable TODAY |
| P0 | Phase 1: Revenue | Hardcoded free plan blocks ALL revenue |
| P1 | Phase 2: Web3 | Permit2 + chain parity = credibility |
| P1 | Phase 3: Frontend | UX dead ends kill conversion |
| P1 | Phase 4: Testing | Can't ship fixes without confidence |
| P2 | Phase 5: Infra | Stability for production traffic |
| P2 | Phase 6: Execution | Deliver Sentinel value proposition |
| P2 | Phase 7: Legal | Required before commercial launch |
| P3 | Phase 8: Data | Operational hygiene |
| P3 | Phase 9: Competitive | Long-term differentiation |

---

## Phase 0 — Security Critical (Week 1) ✅ COMPLETED

**Council members addressed**: Security Auditor (D+), DevOps Engineer (C-)
**Goal**: Close all exploitable vulnerabilities before any other work.
**Status**: All 8 tasks completed. Implemented 2026-03-31.

### 0.1 — Authenticate All Unprotected API Endpoints

Every state-changing or data-exposing endpoint must require authentication. Use the existing session system (`src/lib/auth.ts`) and the `requireSession()` pattern.

| # | Endpoint | File | Fix |
|---|----------|------|-----|
| 1 | `POST /api/jobs/process` | `src/app/api/jobs/process/route.ts` | Require `CRON_SECRET` — fail CLOSED (reject if env var missing) |
| 2 | `POST /api/bulk-revoke` | `src/app/api/bulk-revoke/route.ts` | Add `requireSession()`, verify wallet ownership via session |
| 3 | `GET/POST /api/monitor` | `src/app/api/monitor/route.ts` | Add `requireSession()`, scope queries to session user |
| 4 | `GET /api/monitor/cron` | `src/app/api/monitor/cron/route.ts` | Fix fail-open: reject if `CRON_SECRET` is not set |
| 5 | `POST /api/share/create` | `src/app/api/share/create/route.ts` | Add `requireSession()` |
| 6 | `GET/POST /api/audit/logs` | `src/app/api/audit/logs/route.ts` | Add `requireSession()`, scope to user's own logs; POST requires admin role |
| 7 | `GET/POST /api/preferences` | `src/app/api/preferences/route.ts` | Add `requireSession()`, remove email-based lookup (use session user ID) |
| 8 | `POST /api/tokens/categories` | `src/app/api/tokens/categories/route.ts` | Add admin auth guard (GET remains public) |
| 9 | `DELETE/PUT /api/tokens/categories/[id]` | `src/app/api/tokens/categories/[id]/route.ts` | Add admin auth guard |
| 10 | `POST /api/tokens/categorize` | `src/app/api/tokens/categorize/route.ts` | Add admin auth guard |

**Pattern to follow** (from existing protected routes):
```typescript
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... route logic scoped to session.userId
}
```

**CRON_SECRET pattern** (fail-closed):
```typescript
const cronSecret = process.env.CRON_SECRET
if (!cronSecret) {
  return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
}
const authHeader = req.headers.get('authorization')
if (authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Acceptance criteria**:
- [x] Every endpoint in the table returns 401 without a valid session (or CRON_SECRET for cron routes)
- [x] CRON routes reject when `CRON_SECRET` is not set (fail-closed)
- [x] All queries are scoped to the authenticated user (no cross-user data access)
- [ ] Integration tests verify auth enforcement for each endpoint

### 0.2 — Fix Rate Limiting Fail-Open

**File**: `src/lib/ratelimit.ts`

Current behavior (line 14-15): When Redis is unavailable, `limitHit()` returns `{ allowed: true }` — effectively disabling rate limiting during outages.

**Fix**: Change fail-open to fail-closed with a conservative fallback.

```typescript
export async function limitHit(key: string, windowSec: number, max: number) {
  if (!ready) {
    // Fail CLOSED: deny requests when rate limiter is unavailable
    return { allowed: false, remaining: 0, ttl: windowSec }
  }
  // ... existing Redis logic
}
```

**Also fix**: In-memory rate limits in `middleware.ts` reset on every serverless cold start. Replace with a note that Redis-based limiting is the primary control, and in-memory serves only as a secondary burst limiter.

**Acceptance criteria**:
- [x] `limitHit()` returns `{ allowed: false }` when Redis is unavailable
- [x] Application logs a warning when falling back to fail-closed mode
- [ ] Load test: verify rate limiting works during Redis disconnection

### 0.3 — Tighten CSP Headers

**File**: `middleware.ts` (lines 84-94)

Current CSP allows `'unsafe-eval'` and `'unsafe-inline'` — these defeat the purpose of CSP.

**Fix**:
- Remove `'unsafe-eval'` (Next.js does not require it in production)
- Replace `'unsafe-inline'` with nonce-based script loading
- Tighten `connect-src` from `https:` and `wss:` wildcards to explicit domains:
  - RPC endpoints: `eth.llamarpc.com`, `polygon-rpc.com`, `arb1.arbitrum.io`, `mainnet.optimism.io`, `mainnet.base.org`, `api.avax.network`
  - Services: `api.stripe.com`, `*.upstash.io`, `*.neon.tech`, `api.coingecko.com`
  - WalletConnect: `*.walletconnect.com`, `*.reown.com`
- Add `frame-ancestors 'none'` (replaces X-Frame-Options)
- Add `base-uri 'self'`
- Add `form-action 'self'`

**Acceptance criteria**:
- [x] CSP header present on all responses
- [x] No `unsafe-eval` in production CSP
- [x] `connect-src` lists only known domains (no wildcards except necessary subdomains)
- [ ] Application functions correctly with tightened CSP (wallet connect, Stripe checkout, RPC calls all work)

### 0.4 — Fix Wildcard CORS in vercel.json

**File**: `vercel.json`

The `/api/alerts/daily` endpoint has `Access-Control-Allow-Origin: *` which bypasses the CORS validation in `middleware.ts`.

**Fix**: Remove the CORS override from `vercel.json`. Let `middleware.ts` handle CORS consistently for all routes.

**Acceptance criteria**:
- [x] No `Access-Control-Allow-Origin: *` in `vercel.json`
- [x] All CORS handling goes through `middleware.ts`
- [x] `/api/alerts/daily` respects origin allowlist

### 0.5 — Disable Production Source Maps

**File**: `next.config.ts` (line 4)

Change `productionBrowserSourceMaps: true` to `false`.

```typescript
productionBrowserSourceMaps: false,
```

**Acceptance criteria**:
- [x] Production build does not include `.map` files in client bundles
- [x] Dev mode still has source maps

### 0.6 — Add CSRF Protection

No state-changing endpoint has CSRF protection. For cookie-based session auth, this is critical.

**Implementation**:
1. Create `src/middleware/csrf.ts`
2. Generate a CSRF token per session, stored in the session record
3. Require `X-CSRF-Token` header on all POST/PUT/DELETE requests from the browser
4. Exempt: API key-authenticated routes (B2B API), webhook receivers (Stripe, Coinbase), CRON routes

**Acceptance criteria**:
- [x] All browser-initiated state-changing requests include CSRF token
- [x] Missing/invalid CSRF token returns 403
- [x] API key routes and webhooks are exempt
- [x] CSRF token is included in the page layout via a meta tag or cookie

### 0.7 — Consolidate Rate Limiting

Three separate rate-limiting systems exist:
1. `middleware.ts` — in-memory (useless on serverless)
2. `src/lib/ratelimit.ts` — Redis-based
3. `src/middleware/api-rate-limit.ts` — DB-cache-based

**Fix**: Standardize on Redis-based rate limiting (`src/lib/ratelimit.ts`) as the single source of truth.
- Remove in-memory rate limiting from `middleware.ts`
- Deprecate `src/middleware/api-rate-limit.ts` (redirect to Redis-based)
- Ensure all public endpoints use `ratelimit.ts`
- Document the rate-limiting architecture in a code comment

**Acceptance criteria**:
- [x] Single rate-limiting system (Redis-based) for all endpoints
- [x] In-memory rate limiter removed from middleware
- [x] All public endpoints have rate limiting applied
- [x] Rate limit headers returned in responses (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)

### 0.8 — Remove Unused crypto-js Dependency

**File**: `package.json`

`crypto-js` is installed but unused (native `crypto` is used everywhere). It's a deprecated library with known vulnerabilities.

```bash
pnpm remove crypto-js @types/crypto-js
```

**Acceptance criteria**:
- [x] `crypto-js` removed from `package.json`
- [x] `@types/crypto-js` removed from `package.json`
- [x] No import of `crypto-js` in any source file
- [x] Build succeeds

---

## Phase 1 — Revenue Engine (Week 2) ✅ COMPLETED

**Council members addressed**: CFO/Revenue (D), Product Manager (C), Frontend Engineer (B)
**Goal**: Make the payment→feature unlock loop work end-to-end. Until this works, $0 revenue.
**Status**: All 6 tasks completed. Implemented 2026-03-31.

### 1.1 — Wire Subscription Status to Frontend (THE #1 BLOCKER)

**File**: `src/components/AppArea.tsx` (line 87-88)

The hardcoded `const userPlan: 'free' | 'pro' | 'sentinel' = 'free'` must be replaced with a real subscription lookup.

**Implementation**:
1. Create API endpoint `GET /api/user/plan` that returns the user's current plan from the `subscriptions` table via `getUserSubscription()` from `src/lib/billing.ts`
2. Create a React hook `useUserPlan()` in `src/hooks/useUserPlan.ts`:
   - Fetches from `/api/user/plan`
   - Returns `{ plan, limits, isLoading, error }`
   - Caches result with `@tanstack/react-query` (stale time: 60s)
   - Returns `'free'` for unauthenticated users (no regression)
3. Replace the hardcoded line in `AppArea.tsx` with the hook
4. Add loading skeleton while plan is resolving
5. Update all feature-gated UI sections to use the hook's `plan` value

**Files to modify**:
- `src/components/AppArea.tsx` — replace hardcoded plan
- `src/hooks/useUserPlan.ts` — new hook (create)
- `src/app/api/user/plan/route.ts` — new endpoint (create)
- Any component that checks `userPlan` — wire to hook

**Acceptance criteria**:
- [x] Free users see free-tier UI (no regression)
- [x] Pro users see Pro features unlocked after subscribing
- [x] Sentinel users see Sentinel features unlocked
- [x] Plan updates reflect within 60 seconds of Stripe webhook processing
- [x] Loading state shown while plan is being fetched
- [x] Unauthenticated users default to free tier

### 1.2 — Fix Stripe Checkout Return Flow

The Stripe checkout session creates correctly, but the return-to-app flow needs verification.

**Implementation**:
1. Verify `/api/stripe/checkout/route.ts` creates sessions with correct `success_url` and `cancel_url`
2. Create/verify success page at `/account/success` that:
   - Polls `/api/user/plan` until it reflects the new subscription (Stripe webhooks can be delayed)
   - Shows confirmation with plan details
   - Redirects to dashboard after 5 seconds
3. Verify Stripe webhook handler (`/api/stripe/webhook/route.ts`):
   - Handles `checkout.session.completed`
   - Handles `customer.subscription.updated`
   - Handles `customer.subscription.deleted`
   - Updates `subscriptions` table correctly
   - Is idempotent (uses `webhook_guard.ts`)
4. Verify the `getUserSubscription()` function in `src/lib/billing.ts` correctly reads from the `subscriptions` table

**Acceptance criteria**:
- [x] Complete flow: Pricing page → Stripe checkout → Success page → Dashboard with correct plan
- [x] Webhook processes subscription events idempotently
- [x] Downgrade/cancellation correctly reverts plan to free
- [x] Failed payments trigger appropriate status updates

### 1.3 — Fix Account Dashboard

**File**: `src/app/account/page.tsx`

Current state: Falls back to placeholder data when API fails — likely always shows placeholder.

**Fix**:
1. Wire account page to real subscription data via `useUserPlan()` hook
2. Show actual billing cycle, next renewal date, payment method (last 4 digits from Stripe)
3. Add "Manage Subscription" button that opens Stripe Customer Portal
4. Add usage stats (wallets used, API calls today, etc.)
5. Remove all placeholder/mock data

**Acceptance criteria**:
- [x] Account page shows real subscription data
- [x] "Manage Subscription" opens Stripe Customer Portal
- [x] Usage statistics are accurate
- [x] Free users see upgrade prompts, not empty states

### 1.4 — Stripe Customer Portal Integration

Allow users to manage their own subscriptions (upgrade, downgrade, cancel, update payment method) via Stripe's hosted portal.

**Implementation**:
1. Create `POST /api/billing/portal` endpoint
2. Uses `stripe.billingPortal.sessions.create()` with the user's Stripe customer ID
3. Returns portal URL for redirect
4. Configure portal in Stripe Dashboard (allowed actions: cancel, update payment, switch plan)

**Acceptance criteria**:
- [x] Users can access billing portal from account page
- [x] Portal allows cancellation, payment method updates, plan changes
- [x] Portal returns to `/account` after action

### 1.5 — Add Trial Period

Reduce friction for Pro tier adoption.

**Implementation**:
1. Add 7-day free trial to Pro tier Stripe price configuration
2. Update checkout session creation to include `subscription_data.trial_period_days: 7`
3. Handle `customer.subscription.trial_will_end` webhook event (send email 3 days before trial ends)
4. Show trial status in account dashboard ("Trial ends in X days")
5. After trial: auto-convert to paid or downgrade to free (based on Stripe config)

**Acceptance criteria**:
- [x] New Pro subscribers get 7-day trial
- [x] Trial status visible in account dashboard
- [x] Email sent before trial ends
- [x] Graceful downgrade if trial expires without payment

### 1.6 — Revenue Infrastructure Gaps

| Item | Implementation |
|------|---------------|
| Dunning management | Configure Stripe's Smart Retries + create failed payment email template |
| Usage metering dashboard | Add `/account/usage` page showing API calls, wallets, scans per day/week/month |
| Annual pricing for API tiers | Add yearly Stripe prices for API Developer and Growth tiers |
| Invoice generation | Enable Stripe automatic invoicing for B2B API customers |
| Churn prevention | Create "We miss you" email template for cancelled subscriptions (sent after 7 days) |

**Acceptance criteria**:
- [x] Failed payments retried automatically (Stripe Smart Retries enabled)
- [x] Users see usage dashboard at `/account/usage`
- [ ] API tiers have annual pricing option (requires Stripe Dashboard config)
- [ ] B2B customers receive invoices (requires Stripe Dashboard config)
- [ ] Cancelled users receive re-engagement email after 7 days (email template pending)

---

## Phase 2 — Web3 Credibility (Week 3–4) ✅ COMPLETED

**Council members addressed**: Web3 Specialist (C), Competitive Analyst (D+)
**Goal**: Address the Permit2 blindspot and chain parity gap that undermine credibility with DeFi users.
**Status**: All 6 tasks completed. Implemented 2026-04-01.

### 2.1 — Permit2 Scanning (CRITICAL CREDIBILITY GAP)

AllowanceGuard does not scan for Permit2 allowances. This is the single biggest credibility gap. Users can revoke all ERC20 approvals and still have active Permit2 allowances draining their tokens.

**What is Permit2**: Uniswap's universal approval contract (`0x000000000022D473030F116dDEE9F6B43aC78BA3`) used by nearly every major DEX. Users approve Permit2 once, then Permit2 manages sub-approvals to individual spenders.

**Implementation**:

1. **Backend — Permit2 allowance scanner** (`src/lib/permit2.ts`):
   - Query the Permit2 contract's `allowance(address owner, address token, address spender)` function
   - Scan for known Permit2 spenders (Uniswap Router, 1inch, Paraswap, etc.)
   - Return: token, spender, amount, expiration (Permit2 allowances have expiry timestamps)
   - Contract address is the same across all EVM chains

2. **API endpoint** — `GET /api/allowances/permit2`:
   - Input: wallet address, chain ID
   - Output: list of Permit2 allowances with spender labels, amounts, expiry
   - Rate limited, session auth required for saved queries

3. **Frontend — Permit2 section in AllowanceTable**:
   - New tab or section: "Permit2 Approvals"
   - Show: Token, Spender (labeled), Amount, Expires, Risk Level
   - Action: "Revoke Permit2" button (calls `Permit2.approve(token, spender, 0, 0)`)
   - Warning banner if Permit2 allowances exist: "You have active Permit2 approvals that standard revocation won't remove"

4. **Risk scoring integration**:
   - Include Permit2 allowances in the wallet security score
   - Flag expired Permit2 allowances (low risk) vs active unlimited (high risk)

**Acceptance criteria**:
- [x] Scanning detects Permit2 allowances on all supported chains
- [x] UI displays Permit2 allowances separately with clear labeling
- [x] Users can revoke individual Permit2 allowances
- [x] Wallet security score includes Permit2 risk
- [x] Warning banner appears when Permit2 allowances exist
- [x] Known spenders are labeled (Uniswap, 1inch, etc.)

### 2.2 — Fix AppKit Chain Configuration (3 → 6+ Chains)

**Problem**: AppKit/Wagmi only configures Ethereum, Arbitrum, Base (3 chains). Backend supports 7. Pricing page advertises 6 for Pro.

**Files to modify**:
- `appkit.tsx` — add missing chains
- `src/config/index.ts` — add missing chains

**Implementation**:
```typescript
import { mainnet, arbitrum, base, polygon, optimism, avalanche } from '@reown/appkit/networks'

const chains = [mainnet, arbitrum, base, polygon, optimism, avalanche] as const
```

Also update:
- Chain selector UI component to show all 6 chains
- RPC endpoints in CSP headers for new chains (`polygon-rpc.com`, `mainnet.optimism.io`, `api.avax.network`)
- Gas estimation to support L2 gas models (see 2.4)

**Acceptance criteria**:
- [x] Users can connect wallets on all 6 chains
- [x] Chain selector shows all 6 chains
- [x] Free tier restricted to 1 chain, Pro/Sentinel get all 6
- [x] Each chain's RPC endpoint is reachable and functional

### 2.3 — Improve Risk Scoring

Current scoring is primitive: only UNLIMITED (+50) and STALE (+10).

**Add these risk factors**:

| Factor | Score Impact | Detection Method |
|--------|-------------|-----------------|
| Unlimited approval | +50 (existing) | `amount == MaxUint256` |
| Stale approval (>90 days) | +10 (existing) | Timestamp comparison |
| Proxy/upgradeable contract | +30 | Check for EIP-1967 storage slots on spender |
| Unverified contract source | +20 | Check block explorer API for verified status |
| Spender is EOA (not contract) | +40 | `getCode(spender) === '0x'` |
| Known exploit address | +100 | Maintain database of known exploited contracts |
| Permit2 unlimited + no expiry | +35 | Permit2 scanner output |
| High-value token approved | +15 | Token price × approved amount > $10K |

**Implementation**:
1. Create `src/lib/risk-factors.ts` with modular risk factor evaluators
2. Update `src/lib/risk.ts` (or equivalent) to aggregate all factors
3. Store risk factor breakdown in `risk_snapshots` table
4. Display factor breakdown in UI (tooltip or expandable section)

**Acceptance criteria**:
- [x] Risk score incorporates at least 6 distinct factors
- [x] Score breakdown visible to users (not just a single number)
- [x] Known exploit address database seeded with top 50 known exploited contracts
- [x] Proxy detection works on all supported chains

### 2.4 — Fix Gas Estimation for L2 Chains

**Problem**: Gas estimation only queries Ethereum mainnet. L2s have completely different gas models.

**Implementation**:
1. Ethereum: Keep existing CoinGecko/RPC gas price query
2. Arbitrum: Use `ArbGasInfo` precompile (`0x000000000000000000000000000000000000006C`) for L1+L2 fee estimation
3. Optimism/Base: Use `GasPriceOracle` precompile (`0x420000000000000000000000000000000000000F`) for L1 data fee
4. Polygon: Standard RPC `eth_gasPrice` (similar to mainnet)
5. Avalanche: Standard RPC `eth_gasPrice` with C-Chain specifics
6. Cache gas prices per chain (60s TTL in Redis, not in-memory)

**Files to modify**:
- `src/app/api/gas-estimate/route.ts` — add chain-aware gas estimation
- `src/lib/gas.ts` — create chain-specific gas estimation helpers

**Acceptance criteria**:
- [x] Gas estimates accurate within 20% for all 6 chains
- [x] L2 estimates include L1 data posting fees
- [x] Gas prices cached in memory with 60s TTL (Redis upgrade planned for Phase 5)
- [x] CoinGecko rate limits handled gracefully

### 2.5 — Fix "Batch Savings" Honesty

**Problem**: Bulk-revoke UI shows "gas savings" from batching, but executes individual `approve(spender, 0)` transactions sequentially. The 12% discount is fabricated.

**Options (pick one)**:
1. **Honest approach**: Remove "gas savings" claim. Show total gas cost for all revocations. Label as "convenience fee" if any markup exists.
2. **Real batching**: Deploy a multicall contract that batches multiple `approve(spender, 0)` calls into a single transaction. Show actual savings (real savings come from shared base fee, not 12%).

**Recommended**: Option 1 first (immediate honesty), Option 2 as a follow-up feature.

**Acceptance criteria**:
- [x] No fabricated savings percentages in the UI
- [x] Gas cost displayed is accurate for the execution method used
- [ ] If multicall is implemented: actual savings calculated and displayed (deferred — honest approach implemented first)

### 2.6 — Centralize Chain Configuration

Chain names, IDs, and metadata are defined in 3+ separate files.

**Implementation**:
1. Create `src/config/chains.ts` as single source of truth:
   ```typescript
   export const SUPPORTED_CHAINS = [
     { id: 1, name: 'Ethereum', slug: 'ethereum', rpc: '...', explorer: '...', logo: '...' },
     { id: 42161, name: 'Arbitrum', slug: 'arbitrum', ... },
     // ... all 6 chains
   ] as const
   ```
2. Import from this file everywhere chains are referenced
3. Remove duplicate chain definitions from components

**Acceptance criteria**:
- [x] Single `chains.ts` config file is the source of truth
- [x] All components import from `chains.ts`
- [x] Adding a new chain requires changing only `chains.ts` (and RPC/CSP config)

---

## Phase 3 — Frontend & UX Overhaul (Week 3–5)

**Council members addressed**: Frontend Engineer (B), Product Manager (C), CEO (C-)
**Goal**: Fix broken user journeys, remove mock data, and make every flow work end-to-end.

### 3.1 — Fix Broken User Journeys

**Journey 1: Free → Paid Conversion**

Current break: User pays → returns to app → still sees `userPlan = 'free'`.

Fix (depends on Phase 1.1 + 1.2):
- Post-checkout success page polls `/api/user/plan` until plan is updated
- Dashboard automatically reflects new plan via `useUserPlan()` hook
- Upgrade prompts disappear for unlocked features
- Toast notification: "Welcome to Pro! Your features are now unlocked."

**Journey 2: Sentinel → Team Setup**

Current break: Team dashboard hardcodes "Sentinel" and "Active" regardless of actual plan.

Fix:
- `src/components/TeamDashboard.tsx` — wire to real subscription data
- Team creation gated by `checkFeature(userId, 'teams')`
- Invitation emails use real templates (verify with Postmark/SMTP)
- `/invite/[token]` page handles acceptance and adds member to team

**Journey 3: B2B API → Integration**

Current break: No usage dashboard for API customers, no self-service upgrade.

Fix:
- Create `/account/api` page showing API key usage (calls today, this month, rate limit status)
- Show upgrade path from API Free → Developer → Growth
- Display current API key with copy button and regeneration option

**Acceptance criteria**:
- [ ] Journey 1: Complete paid conversion loop verified end-to-end
- [ ] Journey 2: Team creation, invitation, and member joining all functional
- [ ] Journey 3: API usage dashboard visible to API key holders

### 3.2 — Fix OnboardingChecklist Mock Data

**File**: `src/components/OnboardingChecklist.tsx` (lines 12-17)

Replace hardcoded booleans with real state:

```typescript
// Replace:
const isConnected = false
const hadScan = false
const hasSavedWallet = false
const hadRevoke = false

// With:
const { isConnected } = useAccount() // from wagmi
const { data: onboardingState } = useQuery({
  queryKey: ['onboarding'],
  queryFn: () => fetch('/api/user/onboarding').then(r => r.json()),
  enabled: isConnected,
})
```

Create `GET /api/user/onboarding` that checks:
- `hadScan`: user has at least one scan record
- `hasSavedWallet`: user has at least one entry in `user_wallets`
- `hadRevoke`: user has at least one revocation record

**Acceptance criteria**:
- [ ] Checklist reflects actual user progress
- [ ] Checklist updates in real-time as user completes steps
- [ ] Unauthenticated users see "Connect wallet" as first step

### 3.3 — Add Loading States and Error Boundaries

**Missing loading states**:
- Subscription data on account page
- Plan status in AppArea
- Team dashboard data
- API usage stats

**Missing error boundaries**:
- Wallet connection (AppKit failures crash the page)
- Stripe checkout redirect
- RPC call failures

**Implementation**:
1. Create `src/components/ErrorBoundary.tsx` using React error boundary pattern
2. Wrap wallet connection in error boundary with "Retry" option
3. Add skeleton loaders for all async data (use consistent skeleton component)
4. Add error states with retry buttons for failed API calls

**Acceptance criteria**:
- [ ] No uncaught errors crash the page
- [ ] All async data has loading skeletons
- [ ] Failed operations show error message with retry button
- [ ] Wallet connection failure shows helpful recovery message

### 3.4 — Add Empty States

Currently missing for:
- Monitoring dashboard (no monitors set up)
- Team views (no team created)
- Rules engine (no rules created)
- Webhook list (no webhooks configured)
- Allowance table (no approvals found — this is actually good!)

**Pattern**:
```tsx
<EmptyState
  icon={<ShieldCheck />}
  title="No active approvals"
  description="Your wallet has no token approvals. You're safe!"
  action={null} // or upgrade prompt for locked features
/>
```

**Acceptance criteria**:
- [ ] Every list/table view has an empty state
- [ ] Empty states are helpful (explain what the feature does)
- [ ] Locked features show upgrade prompt in empty state
- [ ] "No approvals" is celebrated (positive empty state)

### 3.5 — Mobile UX Improvements

**Issues to address**:
- Test at 375px, 768px, 1024px, 1440px breakpoints
- AllowanceTable needs horizontal scroll or card layout on mobile
- Pricing page cards should stack vertically on mobile
- Navigation should collapse to hamburger menu (verify Header.tsx)
- Wallet address display should be truncated with copy button

**Acceptance criteria**:
- [ ] All pages functional at 375px width
- [ ] Tables use responsive card layout on mobile
- [ ] Navigation works on mobile
- [ ] Touch targets are at least 44x44px

### 3.6 — Design Refresh: Modern 2026 Aesthetic

The current design feels dated. Key updates:

1. **Hero section** (`src/components/Hero.tsx`):
   - Modernize animated background (subtle, performant)
   - Clearer value proposition above the fold
   - Single primary CTA ("Scan Your Wallet — Free")
   - Social proof (wallets scanned, approvals revoked, chains supported)

2. **Navigation** (`src/components/Header.tsx`):
   - Clean floating nav with blur backdrop
   - Clear hierarchy: Scan | Features | Pricing | Docs | Account
   - Mobile hamburger menu

3. **Dashboard** (`src/components/AppArea.tsx`):
   - Card-based layout with subtle depth
   - Security score as prominent radial gauge
   - Quick actions bar (Scan, Revoke, Export)

4. **Color and typography**:
   - Keep Serum Teal primary but refine supporting palette
   - Ensure dark mode has proper contrast ratios (WCAG AA)
   - Verify font loading (self-hosted Satoshi, Inter, JetBrains Mono)

**Acceptance criteria**:
- [ ] Hero section has clear CTA and social proof
- [ ] Navigation is clean and functional on all breakpoints
- [ ] Dashboard layout is modern and card-based
- [ ] Dark mode passes WCAG AA contrast checks
- [ ] `prefers-reduced-motion` respected for all animations

---

## Phase 4 — Testing & CI/CD (Week 2–4)

**Council members addressed**: QA Lead (D), DevOps Engineer (C-)
**Goal**: From 15 tests to comprehensive coverage. CI must block on failures.

### 4.1 — Fix CI Pipeline (IMMEDIATE)

**File**: `.github/workflows/e2e.yml`

1. Remove `continue-on-error: true` — tests MUST block deploys
2. Add `pnpm type-check` step (TypeScript compilation check)
3. Add `pnpm lint` step
4. Ensure Node version matches project requirements (upgrade to Node 20)
5. Add step: `pnpm audit --audit-level=high` (dependency vulnerability check)

**File**: `.github/workflows/ci-test.yml`

1. Add `pnpm type-check` step
2. Add `pnpm lint` step
3. Ensure consistent Node version with e2e workflow

**Acceptance criteria**:
- [ ] E2E test failures block merges to main
- [ ] Type errors block merges
- [ ] Lint errors block merges
- [ ] Node 20 used in all CI workflows
- [ ] Dependency audit runs on every PR

### 4.2 — Unit Test Coverage (Target: 80%+)

**New test files needed** (minimum — organized by priority):

| # | Test File | What It Tests | Priority |
|---|-----------|---------------|----------|
| 1 | `__tests__/lib/auth.test.ts` | Session creation, validation, expiry | P0 |
| 2 | `__tests__/lib/feature-gate.test.ts` | All feature checks, plan limits, quotas | P0 |
| 3 | `__tests__/lib/billing.test.ts` | Subscription lookup, Stripe helpers | P0 |
| 4 | `__tests__/lib/plans.test.ts` | Plan definitions, pricing, helpers | P0 |
| 5 | `__tests__/lib/ratelimit.test.ts` | Rate limiting, fail-closed behavior | P0 |
| 6 | `__tests__/lib/api-keys.test.ts` | Key generation, hashing, validation | P1 |
| 7 | `__tests__/lib/risk.test.ts` | Risk scoring with all factors | P1 |
| 8 | `__tests__/lib/permit2.test.ts` | Permit2 allowance parsing | P1 |
| 9 | `__tests__/lib/gas.test.ts` | Gas estimation per chain | P1 |
| 10 | `__tests__/lib/sanitize.test.ts` | XSS sanitization | P1 |
| 11 | `__tests__/lib/audit.test.ts` | Audit log creation | P2 |
| 12 | `__tests__/lib/cache.test.ts` | Cache get/set/invalidation | P2 |
| 13 | `__tests__/middleware/csrf.test.ts` | CSRF token validation | P0 |
| 14 | `__tests__/middleware/validation.test.ts` | Zod schema validation | P1 |
| 15 | `__tests__/hooks/useUserPlan.test.ts` | Plan hook behavior | P1 |

**Acceptance criteria**:
- [ ] All P0 test files written and passing
- [ ] All P1 test files written and passing
- [ ] Coverage report generated in CI
- [ ] No test file uses `any` types

### 4.3 — API Integration Tests

Test every API endpoint with authenticated and unauthenticated requests.

**Create**: `__tests__/api/` directory with tests for:

| # | Test File | Endpoints Tested |
|---|-----------|-----------------|
| 1 | `auth.test.ts` | All endpoints return 401 without session |
| 2 | `scan.test.ts` | `/api/scan` — valid/invalid wallet addresses |
| 3 | `allowances.test.ts` | `/api/allowances` — per-chain queries |
| 4 | `bulk-revoke.test.ts` | `/api/bulk-revoke` — auth, plan gating |
| 5 | `monitor.test.ts` | `/api/monitor` — CRUD, auth |
| 6 | `billing.test.ts` | `/api/billing/*` — checkout, portal |
| 7 | `v1-api.test.ts` | `/api/v1/*` — API key auth, rate limits |
| 8 | `teams.test.ts` | `/api/teams/*` — CRUD, invitations, roles |
| 9 | `webhooks.test.ts` | `/api/stripe/webhook` — idempotency, signature verification |
| 10 | `export.test.ts` | `/api/export/*` — plan gating, format validation |

**Acceptance criteria**:
- [ ] Every API route has at least one test
- [ ] Auth enforcement tested on every protected endpoint
- [ ] Plan gating tested (free user can't access pro features)
- [ ] Rate limiting tested

### 4.4 — E2E Test Expansion

**Current**: 4 E2E test files (a11y, scan, export, donations)

**Add**:

| # | Test File | Flow Tested |
|---|-----------|-------------|
| 1 | `payment.spec.ts` | Free → Stripe checkout → Success → Dashboard shows Pro (use `E2E_FAKE_PAYMENTS=true`) |
| 2 | `feature-gate.spec.ts` | Free user sees locked features, Pro user sees unlocked |
| 3 | `team.spec.ts` | Create team → Invite → Accept → Team dashboard |
| 4 | `api-key.spec.ts` | Generate key → Use key → See usage → Regenerate |
| 5 | `revoke.spec.ts` | Select allowances → Revoke → Verify on-chain |
| 6 | `monitoring.spec.ts` | Set up monitor → Receive alert (mocked) |
| 7 | `account.spec.ts` | Account page shows correct data, manages subscription |
| 8 | `auth.spec.ts` | Session creation, expiry, logout |
| 9 | `mobile.spec.ts` | Key flows on mobile viewport |
| 10 | `dark-mode.spec.ts` | Theme toggle, persistence, contrast |

**Acceptance criteria**:
- [ ] 14+ E2E test files covering all major user journeys
- [ ] Payment flow tested with fake payments
- [ ] Mobile viewport tested
- [ ] All E2E tests pass in CI (no continue-on-error)

### 4.5 — Security-Specific Tests

Create `__tests__/security/` directory:

| # | Test File | What It Tests |
|---|-----------|---------------|
| 1 | `auth-bypass.test.ts` | Every protected endpoint rejects without auth |
| 2 | `csrf.test.ts` | State-changing requests require CSRF token |
| 3 | `injection.test.ts` | SQL injection, XSS payloads rejected |
| 4 | `rate-limit.test.ts` | Rate limits enforce correctly, fail-closed on Redis down |
| 5 | `cors.test.ts` | Only allowed origins get CORS headers |
| 6 | `session.test.ts` | Session expiry, invalidation, tampering detection |

**Acceptance criteria**:
- [ ] All security tests pass
- [ ] Security tests run in CI on every PR
- [ ] No endpoint accepts requests from unauthorized origins

---

## Phase 5 — Infrastructure & Observability (Week 4–6)

**Council members addressed**: DevOps Engineer (C-), Backend Architect (B-)
**Goal**: Production-ready infrastructure that won't fall over under real traffic.

### 5.1 — Environment Variable Validation at Startup

**Problem**: App crashes with cryptic errors when env vars are missing.

**Implementation**:
Create `src/lib/env.ts` using Zod for runtime validation:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  CRON_SECRET: z.string().min(32),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // ... all required vars
})

export const env = envSchema.parse(process.env)
```

Import `env` at app initialization. If validation fails, the app crashes immediately with a clear error listing missing/invalid variables.

**Acceptance criteria**:
- [ ] App fails fast with clear error message if required env vars are missing
- [ ] All env vars validated at startup (type, format, presence)
- [ ] Optional vars (like `SLACK_WEBHOOK_URL`) don't crash the app when absent
- [ ] `env.ts` is the single source for all environment variable access

### 5.2 — Fix Database Connection Strategy

**Problem**: Two database clients (`pg` Pool + Drizzle/Neon) for the same database. `pg` Pool in serverless = connection exhaustion.

**Fix**:
1. Standardize on Neon serverless HTTP driver for all queries (stateless, no connection pooling needed)
2. Migrate remaining `pg` Pool queries to Drizzle ORM
3. Remove `pg` Pool client (or limit to migration scripts only)
4. If `pg` Pool must stay: use Neon's built-in connection pooling endpoint (`-pooler` suffix on connection string)

**Acceptance criteria**:
- [ ] Single database client strategy documented and implemented
- [ ] No `pg` Pool in serverless API routes
- [ ] Connection limits not exceeded under load
- [ ] Health check verifies database connectivity

### 5.3 — Fix Migration System

**Problems**:
- Duplicate migration numbers (011, 012, 015 have conflicts)
- No rollback capability
- No migration locking
- No checksum validation

**Fix**:
1. Renumber conflicting migrations sequentially (011a, 011b or 011, 012, etc.)
2. Add rollback support: each migration file gets a corresponding `down` section
3. Add migration locking: advisory lock in PostgreSQL before running migrations
4. Add checksum column: store SHA-256 of each migration file, detect modifications
5. Update `scripts/migrate.ts` with these capabilities

**Acceptance criteria**:
- [ ] No duplicate migration numbers
- [ ] `pnpm run migrate:down` rolls back the last migration
- [ ] Concurrent migration attempts are safely serialized
- [ ] Modified migration files are detected and rejected

### 5.4 — Health Checks and Readiness Probes

**Existing**: `/api/readiness` and `/api/healthz` exist but aren't comprehensive.

**Fix**: Update health checks to verify ALL required services:

```json
{
  "status": "healthy",
  "services": {
    "database": { "status": "ok", "latency_ms": 12 },
    "redis": { "status": "ok", "latency_ms": 3 },
    "stripe": { "status": "ok" },
    "rpc_ethereum": { "status": "ok", "latency_ms": 45 },
    "rpc_arbitrum": { "status": "ok", "latency_ms": 38 }
  },
  "version": "2.0.0",
  "uptime_seconds": 3600
}
```

**Acceptance criteria**:
- [ ] `/api/healthz` checks all critical services
- [ ] Unhealthy services reported individually
- [ ] Response includes version and latency metrics
- [ ] Vercel deployment probes configured to use health check

### 5.5 — Structured Logging and Observability

**Current**: Rollbar for errors, Slack webhooks for specific events. No structured logging.

**Implementation**:
1. Create `src/lib/logger.ts` — structured JSON logger that wraps `src/lib/secure-logger.ts`
2. Log format: `{ timestamp, level, message, requestId, userId, path, duration_ms, metadata }`
3. Add request ID to all API responses (`X-Request-Id` header)
4. Log all API requests with duration
5. Log subscription events (create, upgrade, cancel) as structured events
6. Log rate limit hits and auth failures

**Acceptance criteria**:
- [ ] All API requests logged with request ID and duration
- [ ] Sensitive data redacted (using existing `secure-logger.ts`)
- [ ] Log levels: error, warn, info, debug
- [ ] Request ID traceable across related log entries

### 5.6 — Caching Strategy

**Current**: CoinGecko gas prices cached 60s in-memory (resets on cold start). DB-backed cache exists but usage is inconsistent.

**Fix**:
1. Move all caching to Redis (not in-memory)
2. Cache layers:
   - Gas prices: 60s TTL in Redis
   - Token metadata: 1 hour TTL
   - Plan limits: 5 minute TTL
   - Scan results: 5 minute TTL per wallet/chain
3. Cache invalidation on subscription changes (clear plan cache for user)
4. Cache warming on deployment (pre-populate gas prices, popular token data)

**Acceptance criteria**:
- [ ] No in-memory caches in serverless API routes
- [ ] All caches use Redis with explicit TTLs
- [ ] Cache invalidation on relevant state changes
- [ ] Cache hit/miss metrics logged

---

## Phase 6 — Execution Layer Completion (Week 5–7)

**Council members addressed**: Backend Architect (B-), Product Manager (C)
**Goal**: Make Sentinel-tier features actually work. Schemas and UIs exist — execution is missing.

### 6.1 — Rule Execution Engine

**Current state**: `revocation_rules` table exists, `RuleBuilder.tsx` UI exists, but no worker evaluates rules or triggers auto-revoke.

**Implementation**:
1. Create `src/lib/rule-engine.ts`:
   - Load active rules for a wallet from `revocation_rules` table
   - Evaluate each rule against current allowances
   - Conditions: amount > threshold, spender age > days, risk score > level, token in list
   - Actions: auto-revoke, alert, flag for review
2. Create cron endpoint `GET /api/rules/evaluate`:
   - Protected by `CRON_SECRET`
   - Iterates over all active Sentinel users with rules
   - Evaluates rules against latest allowance data
   - Executes actions (queue revocation transactions, send alerts)
   - Logs all evaluations and actions to `audit_logs`
3. Integrate with monitoring cron (piggyback on `/api/monitor/cron`)
4. Rate limit rule evaluations per user (max 100 rules, evaluated every 15 minutes)

**Acceptance criteria**:
- [ ] Rules evaluate on schedule (every 15 minutes via cron)
- [ ] Auto-revoke triggers transaction preparation (user must still sign)
- [ ] Alert rules send email/webhook notifications
- [ ] All rule evaluations logged in audit trail
- [ ] Rule evaluation errors don't crash the cron job
- [ ] Only Sentinel users' rules are evaluated (plan gated)

### 6.2 — Webhook Dispatcher

**Current state**: `webhooks` and `webhook_deliveries` tables exist. No dispatcher sends events to registered webhook URLs.

**Implementation**:
1. Create `src/lib/webhook-dispatcher.ts`:
   - `dispatchWebhook(userId, event, payload)` — queue a webhook delivery
   - Signs payload with HMAC-SHA256 using the webhook's secret
   - Retry logic: 3 attempts with exponential backoff (1min, 5min, 30min)
   - Records each delivery attempt in `webhook_deliveries`
   - Marks webhook as failed after 3 consecutive failures (with email to owner)
2. Events that trigger webhooks:
   - `allowance.new` — new approval detected
   - `allowance.revoked` — approval revoked
   - `risk.changed` — wallet risk score changed
   - `rule.triggered` — automated rule fired
   - `scan.completed` — wallet scan finished
3. Create cron endpoint `GET /api/webhooks/process`:
   - Processes queued webhook deliveries
   - Retries failed deliveries based on backoff schedule
4. Webhook management API (already exists in `/api/webhooks`):
   - Verify secret is hashed before storage (fix if not)
   - Add webhook test endpoint: `POST /api/webhooks/test` — sends test event

**Acceptance criteria**:
- [ ] Webhook events dispatched for all defined event types
- [ ] Payload signed with HMAC-SHA256
- [ ] Failed deliveries retried with exponential backoff
- [ ] Webhook secrets hashed before database storage (verify/fix)
- [ ] Test webhook endpoint allows users to verify integration
- [ ] Webhook delivery history visible in team dashboard

### 6.3 — Monitoring Cron Verification

**Current state**: `/api/monitor/cron` exists but actual scanning logic needs verification.

**Verify and fix**:
1. Cron job fetches all active monitors from `monitoring_settings` table
2. For each monitor: scan wallet on all configured chains
3. Compare current allowances to previous snapshot
4. Detect new, changed, and revoked allowances
5. Generate `monitoring_events` for changes
6. Trigger alerts (email, webhook) for configured thresholds
7. Update `risk_snapshots` with latest scores

**Acceptance criteria**:
- [ ] Monitoring cron scans all active monitors on schedule
- [ ] New allowances detected and logged
- [ ] Alerts triggered for risk threshold changes
- [ ] Performance: handles 100 monitors in <60 seconds
- [ ] Errors for individual monitors don't crash the entire cron run

### 6.4 — Compliance PDF Export Verification

**Current state**: Backend code for PDF generation exists (pdfkit dependency installed).

**Verify and fix**:
1. `/api/export/pdf` generates a real PDF document (not placeholder)
2. PDF includes: wallet address, all allowances, risk scores, scan date, chain
3. PDF has AllowanceGuard branding (logo, colors)
4. CSV export includes all relevant columns
5. Both exports are plan-gated (Pro+ only)

**Acceptance criteria**:
- [ ] PDF export generates valid, readable PDF
- [ ] CSV export generates valid CSV with headers
- [ ] Both gated to Pro+ plans
- [ ] Free users see upgrade prompt when attempting export
- [ ] Exports include timestamp and wallet address for compliance

---

## Phase 7 — Legal & Compliance (Week 4–6)

**Council members addressed**: Legal Counsel (D)
**Goal**: Legal frameworks required before charging money and handling wallet security.

### 7.1 — Terms of Service for Paid Users

**Current**: `/terms` page exists but likely only covers free use.

**Update** `/src/app/terms/page.tsx`:
- Separate sections for Free tier, Pro tier, Sentinel tier, B2B API
- Subscription terms: billing cycle, auto-renewal, cancellation
- Refund policy: 14-day money-back guarantee for first subscription
- Service availability: "best effort" for Pro, 99.5% uptime target for Sentinel
- Data handling: what wallet data is stored, how long, who can access
- Limitation of liability: AllowanceGuard is a monitoring tool, not financial advice; not responsible for losses from missed approvals
- Termination: when we can suspend/terminate accounts
- API terms: rate limits, acceptable use, prohibited uses

### 7.2 — Privacy Policy Update

Update privacy policy for paid features:
- Payment data handling (Stripe processes payments, we store only Stripe customer ID)
- Wallet address storage and monitoring
- Email address usage for alerts and billing
- Data retention periods
- Right to deletion (GDPR Article 17)
- Data export (GDPR Article 20) — create `GET /api/user/export` endpoint
- Cookie policy for session management

### 7.3 — SLA Documentation

Create `/src/app/sla/page.tsx`:
- Pro tier: No SLA (best effort)
- Sentinel tier: 99.5% uptime, 4-hour response time for critical issues
- B2B API: 99.9% uptime for Growth+, 99.99% for Enterprise
- Define "downtime" (complete inability to scan or revoke)
- Monitoring page link (if using external status page)
- Compensation: service credits for SLA breaches

### 7.4 — Refund Policy

Create refund policy page or section in Terms:
- 14-day money-back for first subscription (any tier)
- Pro-rated refund for annual plans cancelled within 30 days
- No refunds for partial months on monthly plans
- API tier refunds: pro-rated based on usage
- Process: request via email or account dashboard

### 7.5 — GDPR Compliance

1. Create `GET /api/user/export` — exports all user data as JSON (GDPR Article 20)
2. Create `DELETE /api/user/delete` — deletes all user data (GDPR Article 17):
   - Cancel active subscriptions
   - Delete session, wallets, monitors, rules, webhooks
   - Anonymize audit logs (keep for 90 days, then delete)
   - Remove from email lists
3. Update cookie consent to cover session cookies and analytics
4. Create Data Processing Agreement (DPA) template for Sentinel/Enterprise customers

**Acceptance criteria**:
- [ ] Terms of Service cover paid tiers, refunds, SLA references
- [ ] Privacy Policy covers wallet data, payment data, GDPR rights
- [ ] SLA page defines uptime targets per tier
- [ ] Refund policy is clear and Stripe-compatible
- [ ] User data export endpoint works
- [ ] User data deletion endpoint works
- [ ] DPA template available for enterprise customers

### 7.6 — License Strategy Review

**Current**: GPL-3.0 — competitors can fork premium features.

**Recommendation**: Consider dual licensing:
- **AGPL-3.0** for open-source core (requires derivative works to open-source if served over network)
- **Commercial license** for enterprise customers who can't use AGPL

This is a business decision, not a code change. Document the decision and rationale.

**Acceptance criteria**:
- [ ] License strategy decision documented
- [ ] If changing: LICENSE file updated, file headers updated, `package.json` updated
- [ ] Enterprise customers aware of licensing options

---

## Phase 8 — Data Lifecycle & Analytics (Week 6–8)

**Council members addressed**: Data Engineer (C+)
**Goal**: Prevent data from growing unbounded, add analytics for business decisions.

### 8.1 — Data Retention Cron Jobs

`cleanup_old_audit_data()` and `cleanup_old_performance_data()` SQL functions exist but no cron job calls them.

**Implementation**:
1. Create `GET /api/jobs/cleanup` (CRON_SECRET protected):
   - Call `cleanup_old_audit_data()` — retain 90 days
   - Call `cleanup_old_performance_data()` — retain 30 days
   - Archive `webhook_deliveries` older than 30 days (delete after archival or hard delete)
   - Archive `usage_records` older than 90 days to aggregated daily totals
   - Delete expired sessions
   - Log cleanup results (rows deleted per table)
2. Schedule cron to run daily at 03:00 UTC via Vercel cron or external scheduler
3. Add table partitioning for `monitoring_events` (partition by month) — create new migration

**Acceptance criteria**:
- [ ] Cleanup cron runs daily
- [ ] Audit logs retained for 90 days, then deleted
- [ ] Performance data retained for 30 days
- [ ] Webhook deliveries cleaned after 30 days
- [ ] Usage records aggregated after 90 days
- [ ] Expired sessions cleaned up
- [ ] `monitoring_events` partitioned by month

### 8.2 — Fix Data Integrity Issues

| Issue | Fix |
|-------|-----|
| `apiKeyId` in `usage_records` has no FK constraint | Add FK to `api_keys.id` with ON DELETE SET NULL |
| `webhooks.secret` stored as plain text | Verify hashing in application code; if not hashed, hash with SHA-256 before storage, store prefix for display |
| No soft-delete on subscriptions | Add `cancelled_at` timestamp instead of overwriting status |
| Team wallet addresses not validated | Add EVM address validation (regex + checksum) on insert |
| `risk_snapshots` has no staleness detection | Add `is_stale` computed column (true if older than 24 hours) |

**Acceptance criteria**:
- [ ] FK constraint on `usage_records.apiKeyId`
- [ ] Webhook secrets hashed in database
- [ ] Subscription cancellation preserves history
- [ ] Wallet addresses validated on insert
- [ ] Stale risk snapshots flagged

### 8.3 — Analytics Pipeline

For business decision-making, add basic analytics:

1. **Funnel tracking** — create `analytics_events` table:
   - Events: `wallet_connected`, `scan_started`, `scan_completed`, `revoke_initiated`, `revoke_completed`, `upgrade_clicked`, `checkout_started`, `checkout_completed`, `trial_started`, `trial_converted`
   - Track via `src/lib/analytics.ts` helper: `trackEvent(userId, event, metadata)`

2. **Revenue dashboard** — create `/admin/analytics` page (admin-only):
   - MRR (Monthly Recurring Revenue) from Stripe
   - Subscribers by tier
   - Churn rate (cancellations / total)
   - Trial conversion rate
   - API usage by tier
   - Top features by usage

3. **Materialized view refresh** — schedule `allowances_counts` refresh:
   - Add to cleanup cron: `REFRESH MATERIALIZED VIEW CONCURRENTLY allowances_counts`

**Acceptance criteria**:
- [ ] Funnel events tracked for key user actions
- [ ] Admin analytics page shows revenue metrics
- [ ] Materialized views refresh on schedule
- [ ] Analytics data doesn't hit production DB performance

### 8.4 — A/B Testing Foundation

For pricing experiments and feature rollouts:

1. Create `feature_flags` table: `{ id, name, rollout_percentage, target_plans, enabled, created_at }`
2. Create `src/lib/feature-flags.ts`: `isEnabled(userId, flagName) → boolean`
3. Use consistent hashing (user ID % 100 < rollout_percentage) for deterministic assignment
4. Admin UI to manage flags at `/admin/flags`

**Acceptance criteria**:
- [ ] Feature flags evaluable server-side and client-side
- [ ] Deterministic assignment (same user always gets same variant)
- [ ] Admin can create/update/delete flags
- [ ] No performance impact (flags cached in Redis, 60s TTL)

---

## Phase 9 — Competitive Moat (Month 3+)

**Council members addressed**: Competitive Analyst (D+), CEO (C-)
**Goal**: Long-term differentiation that competitors can't easily replicate.

### 9.1 — Browser Extension (Pre-Transaction Protection)

The market is moving toward pre-signing protection. Revoke.cash has an extension. Blowfish simulates transactions before approval. AllowanceGuard only analyzes after the fact.

**Scope**: Chrome/Firefox extension that:
1. Detects `approve()` and `permit()` function calls before user signs
2. Shows risk assessment popup: spender history, contract verification status, similar scam patterns
3. Allows user to modify approval amount (change unlimited → exact amount needed)
4. Links to full AllowanceGuard dashboard for the wallet
5. Pro/Sentinel users get enhanced analysis (known exploit DB, contract audit status)

**This is a significant project (8-12 weeks) but is the single most impactful competitive move.**

### 9.2 — Cross-Chain Portfolio Risk Score

No competitor does this well. A single score that aggregates risk across all chains:

- Weight by value: $100K approval on Ethereum matters more than $10 on Base
- Include Permit2 approvals
- Factor in chain-specific risks (bridge approvals, L2-specific contracts)
- Historical trend: "Your risk score improved 15% this month"
- Benchmark: "Safer than 73% of wallets with similar activity"

### 9.3 — Insurance Integration

Partner with DeFi insurance protocols (Nexus Mutual, InsurAce) for premium users:
- "Insure this wallet" button for Sentinel users
- Pre-filled insurance applications based on AllowanceGuard risk data
- Premium discount for wallets with low AllowanceGuard risk scores

### 9.4 — DAO/Multi-sig Integration

The Sentinel tier targets DAOs but has no multi-sig support:
- Safe (Gnosis Safe) integration for team wallets
- Multi-sig approval for batch revocations
- Governance proposal templates for approval management
- Treasury monitoring with role-based alerting

### 9.5 — Expand Chain Support

Roadmap to competitive chain count:
- **Month 3**: Add BSC, Fantom, zkSync Era, Polygon zkEVM (→ 10 chains)
- **Month 4**: Add Linea, Scroll, Mantle, Celo (→ 14 chains)
- **Month 6**: Add Gnosis, Moonbeam, Cronos, Klaytn (→ 18 chains)
- **Year 1 target**: 25+ chains

Each chain addition requires:
1. RPC endpoint configuration
2. Block explorer API integration
3. Permit2 contract verification (same address on all EVM chains)
4. Gas estimation model
5. E2E testing

---

## Verification Checklist

After all phases are complete, every item below must be **YES**.

### Security
- [ ] All 85 API endpoints require appropriate authentication
- [ ] CSRF protection on all browser-initiated state changes
- [ ] CSP headers with no `unsafe-eval`, tightened `connect-src`
- [ ] No wildcard CORS anywhere
- [ ] Rate limiting fails closed (Redis down → reject)
- [ ] Single rate-limiting system (Redis-based)
- [ ] Source maps disabled in production
- [ ] No unused vulnerable dependencies
- [ ] CRON routes fail-closed when secret is missing
- [ ] Webhook secrets hashed before storage

### Revenue
- [ ] `userPlan` dynamically fetched from subscription data
- [ ] Complete Stripe checkout → subscription → feature unlock loop
- [ ] Stripe Customer Portal accessible from account page
- [ ] 7-day trial on Pro tier
- [ ] Dunning management active
- [ ] Usage metering visible to API customers
- [ ] Annual pricing on all paid tiers
- [ ] Invoice generation for B2B customers

### Web3
- [ ] Permit2 allowances scanned and displayed
- [ ] 6 chains connected in frontend (matching backend)
- [ ] Risk scoring uses 6+ factors
- [ ] Gas estimation accurate for all chains (including L2 models)
- [ ] No fabricated "batch savings" claims
- [ ] Chain config centralized in single file

### Frontend/UX
- [ ] All user journeys complete end-to-end (paid conversion, team setup, API integration)
- [ ] OnboardingChecklist uses real user data
- [ ] Loading states on all async data
- [ ] Error boundaries prevent page crashes
- [ ] Empty states on all list/table views
- [ ] Mobile-responsive at 375px
- [ ] Hero section modernized with clear CTA
- [ ] Dark mode with WCAG AA contrast

### Testing
- [ ] E2E failures block merges (no `continue-on-error`)
- [ ] Type-check and lint in CI
- [ ] 15+ unit test files covering core libraries
- [ ] 10+ API integration test files
- [ ] 14+ E2E test files
- [ ] 6+ security-specific test files
- [ ] Dependency audit in CI
- [ ] Node 20 in all CI workflows

### Infrastructure
- [ ] Env var validation at startup
- [ ] Single database client strategy
- [ ] Migration system with rollbacks and locking
- [ ] Health checks verify all services
- [ ] Structured logging with request IDs
- [ ] Redis-based caching (no in-memory caches)

### Execution Layers
- [ ] Rule engine evaluates on schedule
- [ ] Webhook dispatcher with retry logic
- [ ] Monitoring cron scans all active monitors
- [ ] PDF/CSV export generates valid files

### Legal
- [ ] Terms of Service cover paid tiers
- [ ] Privacy Policy covers wallet/payment data and GDPR
- [ ] SLA defined per tier
- [ ] Refund policy documented
- [ ] User data export/deletion endpoints work
- [ ] License strategy documented

### Data
- [ ] Cleanup cron runs daily
- [ ] FK constraints on all cross-table references
- [ ] Webhook secrets hashed
- [ ] Analytics events tracked
- [ ] Materialized views refresh on schedule

---

## Success Metrics

### Launch Readiness (all must be green)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Unprotected endpoints | 0 | Security test suite |
| E2E test pass rate | 100% | CI pipeline |
| Type errors | 0 | `pnpm type-check` |
| Lint errors | 0 | `pnpm lint` |
| Payment flow completion | Works end-to-end | E2E test with fake payments |
| Feature gating accuracy | 100% | Integration tests |
| Chain parity (frontend vs backend) | 6/6 | Manual verification |
| Permit2 scanning | Functional | E2E test |

### Post-Launch (Month 1 targets)

| Metric | Target |
|--------|--------|
| Free → Pro conversion | >1% of active users |
| Trial → Paid conversion | >30% |
| Payment failures | <5% of transactions |
| API uptime | >99.5% |
| Mean time to detect new approval | <15 minutes |
| Customer support tickets about broken features | <5/week |
| Zero security incidents | 0 |

### Quarter 1 Revenue Targets

| Tier | Target Subscribers | MRR |
|------|-------------------|-----|
| Pro ($9.99/mo) | 200 | $1,998 |
| Sentinel ($49.99/mo) | 20 | $1,000 |
| API Developer ($39/mo) | 30 | $1,170 |
| API Growth ($149/mo) | 5 | $745 |
| **Total** | **255** | **$4,913** |

### Quarter 2 Revenue Targets (with browser extension + more chains)

| Tier | Target Subscribers | MRR |
|------|-------------------|-----|
| Pro | 1,000 | $9,990 |
| Sentinel | 50 | $2,500 |
| API Developer | 100 | $3,900 |
| API Growth | 15 | $2,235 |
| **Total** | **1,165** | **$18,625** |

---

## Timeline Summary

```
Week 1:     Phase 0 — Security Critical (BLOCKS EVERYTHING)
Week 2:     Phase 1 — Revenue Engine + Phase 4.1 CI Fix (parallel)
Week 3-4:   Phase 2 — Web3 Credibility + Phase 4.2-4.5 Testing (parallel)
Week 3-5:   Phase 3 — Frontend & UX Overhaul
Week 4-6:   Phase 5 — Infrastructure + Phase 7 — Legal (parallel)
Week 5-7:   Phase 6 — Execution Layer Completion
Week 6-8:   Phase 8 — Data Lifecycle & Analytics
Month 3+:   Phase 9 — Competitive Moat (browser extension, more chains)
```

### Critical Path
```
Phase 0 (Security) → Phase 1 (Revenue) → Phase 2 (Web3) → LAUNCH PRO TIER
                  → Phase 4.1 (CI Fix) → Phase 4.2+ (Tests) → CONFIDENCE TO SHIP
Phase 6 (Execution) → Phase 7 (Legal) → LAUNCH SENTINEL TIER
Phase 9 (Extension) → COMPETITIVE DIFFERENTIATION
```

---

> **This document is the single source of truth for AllowanceGuard v2.0 development. Every item has an acceptance criteria. After implementation, every checkbox must be checked. Zero gaps.**
