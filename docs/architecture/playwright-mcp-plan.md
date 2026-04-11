# Playwright MCP — Two-Phase Adoption Plan

> **Status:** Phase 1 ready now (authoring-time adoption). Phase 2 precondition-gated.
> **Owner:** Pending — likely QA + DX pairing.
> **Target:** Internal authoring tool. Not a package. Not a repo dep. Operator-installed via `npx @playwright/mcp@latest`.
> **Decision date:** 2026-04-11.
> **Reviewed by:** Standing Council (17+) — see §3.

---

## 1. Why this document exists

Playwright MCP (`@playwright/mcp`, Microsoft-maintained, MIT) gives an AI agent live control of a browser through the same Playwright engine our E2E suite already uses. It is an **authoring-time** tool — a way to draft, debug, and extend tests faster — not a CI execution mechanism. CI will continue to run plain `pnpm test:e2e` with `@playwright/test`.

Unlike the Billing MCP (see `docs/architecture/billing-mcp-plan.md`), which was deferred because the pain was unmeasured, this plan is **partially ready to execute today**. The E2E pain is visible in the current `tests/` directory: 15 spec files, most of which use shallow presence checks because authoring deeper tests against a wallet-centric dApp is expensive. Playwright MCP reduces that authoring cost for everything *except* wallet-signing flows — and those need a harness we should build regardless.

This doc captures the two-phase decision so Phase 1 can be actioned without re-convening the council, and Phase 2 has a known trigger.

---

## 2. Current state of E2E (2026-04-11)

**Toolchain:**
- `@playwright/test ^1.55.0`
- `@axe-core/playwright ^4.10.2` — installed, underused
- `playwright.config.ts` — chromium-only project, `pnpm build && pnpm start` webServer, 60s timeout, retries on CI, traces/video retained on failure
- `pnpm test:e2e`, `pnpm test:e2e:ui` scripts

**Coverage today:**
- 15 spec files: `a11y`, `account`, `api-key`, `auth`, `chains`, `dark-mode`, `donations`, `export`, `feature-gate`, `mobile`, `monitoring`, `payment`, `revoke`, `scan`, `team`
- One helper file (`tests/helpers/chains.ts`) — chain definitions + a hardcoded test wallet address string (not a real test wallet setup)
- Tests are largely **presence checks and URL assertions**. Example: `auth.spec.ts` asserts a Connect Wallet button exists but never completes a connection.
- **No wallet harness.** No mock provider, no synpress, no pre-authenticated session fixture.
- **No baseline axe-core sweep.** The dep is installed but no centralized a11y run exists across pages.
- **No visual regression** for the Ledger redesign in flight.
- `E2E_FAKE_PAYMENTS=true` and `E2E_FAKE_EMAIL=true` flags exist and are respected by the server, but the test suite's use of them is uneven.

**What this means:** the core product loops — SIWE auth, scan-with-wallet, revoke-single, revoke-batch, plan upgrade, API key issuance — are **not end-to-end tested** in any meaningful sense. They are partially unit-tested at the lib layer and partially "does the page load" tested at the E2E layer. The gap is the middle.

---

## 3. Council decision log

| # | Voice | Phase 1 | Phase 2 | Reasoning |
|---|---|---|---|---|
| 16 | QA | **Yes now** | Yes, after wallet harness | Existing coverage is shallow. MCP authoring closes the marketing/docs/account gaps immediately. Wallet flows need a harness first. |
| 8 | Noor (A11y, **veto**) | **Yes now, conditional** | Yes | **Condition: axe-core runs as part of every MCP-authored page sweep.** Without axe, this is clicking around. With axe, it's a real a11y defense. No veto either way. |
| 3 | Web3/DeFi expert | Yes now | **Gated on harness** | Wallet signing is the real gap. MCP can inject `ag_sess` cookies for post-auth flows (covers ~60% of wallet-adjacent coverage). Signing itself needs a mock provider. |
| 15 | Staff engineer | Yes now, with rules | Yes | Rule: MCP output is a draft, not an artifact. Every generated test is reviewed, locators stabilized, committed like any other test. |
| 4 | Security | **Yes with isolation** | Yes | Mandatory `--isolated` flag, dev server only, no prod credentials. MCP = shell-level access. Treat accordingly. |
| 14 | DX engineer | Yes now | Yes | Biggest unblocker for test authoring velocity. |
| 17 | Thane (Perf) | Interested | Interested | Side quest: MCP + Lighthouse for Ledger homepage perf budgets. Not a blocker. |
| 7 | Maren (Visual) | **Yes now** | N/A | Visual audits of Ledger homepage at every breakpoint during redesign. Pairs with active design work. |
| 10 | DevOps/SRE | Neutral | Neutral | MCP is authoring-time, not CI. Zero SRE impact. |
| 2 | OSS maintainer | OK | OK | MIT, Microsoft-maintained, clean. |
| 18 | DBA | N/A | N/A | No DB impact. |
| 19 | Privacy/GDPR | Caution | Caution | Test accounts only. No real user data touches MCP sessions. |
| 9 | Legal | N/A | N/A | |
| 5 | Product marketing | N/A | N/A | |
| 6 | B2B API | N/A | N/A | API tests already work via `request` fixture, no browser needed. |
| 11 | Investor voice | N/A | N/A | |
| 12 | Ecosystem | N/A | N/A | |
| 13 | UX writer | N/A | N/A | |
| 1 | Editor-in-chief | Defer to QA | Defer to QA | |

**Veto check:** No vetoes. Noor's condition (axe-core integration) is mandatory for Phase 1, not a veto — failing to meet it means Phase 1 is incomplete, not blocked.

**Verdict:**
- **Phase 1: adopt now** (authoring tool, non-wallet surfaces + post-auth-cookie flows).
- **Phase 2: gated on a wallet harness that is worth building independently**. The MCP does not create this dependency; the dependency already exists and is the real E2E gap.

---

## 4. The value case

Playwright MCP earns its place on three specific jobs:

1. **Authoring new tests against the non-wallet surface.** Homepage (Ledger), pricing, docs, features, settings (unauth), account (with injected session), API key management, cookie consent, dark mode toggles, mobile breakpoints. This is maybe 40% of the app's user-visible surface and currently has shallow coverage.
2. **Accessibility sweeps.** `@axe-core/playwright` is installed. An MCP-driven workflow that navigates every major page at every major breakpoint and runs axe gives Noor the coverage she has been implicitly asking for since the redesign began.
3. **Visual audits during the Ledger redesign.** Phase 6 redesign is shipping. MCP can take screenshots at `375px / 768px / 1024px / 1440px` for every homepage section after every change. Quick Design Council review loop.

Jobs Playwright MCP does **not** do (don't expect it to):
- Run in CI. CI runs plain Playwright.
- Solve wallet state. That's a wallet-harness problem.
- Replace unit tests.
- Replace code review of test output.

---

## 5. Phase 1 — ready to execute

### 5.1 Scope

**In-scope pages and flows (non-wallet, or post-auth via cookie injection):**
- Homepage (`Hero`, `HowItWorks`, `FeaturesPreview`, `StatisticsSection`, `CTABand`, `Testimonials`, `ChainLogoCarousel`)
- `/pricing` — all tier cards, CTA targets, deep-links to `/#scan`
- `/features`, `/docs/**`, `/account` (with injected session), `/settings` (with injected session)
- Cookie consent banner (essential-only vs analytics-enabled paths)
- Dark mode toggle (dashboard/docs canon)
- Mobile layouts at `375px`, `768px`, `1024px`, `1440px`
- Payment entry flow — `/pricing → checkout redirect` with `E2E_FAKE_PAYMENTS=true`
- API key management (view, create public key, revoke) — with injected session
- Feature-gate behavior — upgrade prompts for locked features (Free tier logged-in view)

**Out of Phase 1 (moves to Phase 2):**
- SIWE signing flow
- `POST /api/scan` with real wallet-derived session
- Revoke / batch revoke flows requiring signed transactions
- Approve-and-test loops

### 5.2 Activation — no re-review needed, a QA engineer can action this

**Step 1. Install Playwright MCP locally.** Not a repo dep. Each operator runs:
```
npx @playwright/mcp@latest --isolated --browser chromium
```
Add to personal Claude Code / Cursor MCP config. Do not commit keys, profiles, or config into the repo.

**Step 2. Create a pre-authenticated session fixture.** One-time script:
- `scripts/e2e-auth-fixture.ts` — starts local dev server, performs a real SIWE flow using a dev wallet keypair (kept in `.env.local`, not committed), saves the resulting `ag_sess` cookie + any CSRF token to `tests/fixtures/authed-session.json`.
- `.gitignore` the fixture file. It expires with the session (30 days).
- Document the refresh procedure in `tests/README.md`.

**Step 3. Operator workflow for MCP-driven test authoring.** Documented in `docs/ops/playwright-mcp-workflow.md`:
1. Start the dev server (`pnpm dev`).
2. Start Playwright MCP (`npx @playwright/mcp@latest --isolated --browser chromium`).
3. In Claude Code, ask for a test for feature X on page Y.
4. Claude drives the browser via MCP, captures accessibility snapshots, drafts a `*.spec.ts`.
5. **Operator reviews the draft.** Stabilize locators (prefer `getByRole` and `data-testid` over CSS selectors). Remove brittle waits. Add explicit assertions.
6. Commit the refactored test. CI runs it via plain Playwright.

**Step 4. Axe-core integration (Noor's condition).** Create `tests/helpers/axe.ts` with a single function:
```ts
export async function runAxe(page, ruleset = 'wcag2aa')
```
Every MCP-authored page test is expected to call this after the initial navigation. Axe violations become test assertions. This is the concrete deliverable that satisfies Noor's Phase 1 condition.

**Step 5. Visual audit workflow for redesign.** Create `tests/visual/ledger-homepage.spec.ts` that takes screenshots at four breakpoints for every homepage section. MCP-authored, then stabilized. Output goes to `test-results/` and can be reviewed as part of Design Council rounds.

**Step 6. Expand the chromium project to firefox + webkit.** The current `playwright.config.ts` is chromium-only. Phase 1 is a natural moment to add the other two — MCP authoring and cross-browser parity are complementary. Low cost. High signal.

### 5.3 Success criteria

Phase 1 is **done** when:
- [ ] Pre-authenticated session fixture exists and is documented.
- [ ] Axe helper exists and is called by at least 8 page-level tests.
- [ ] Visual audit spec exists for the Ledger homepage.
- [ ] Operator workflow doc exists in `docs/ops/playwright-mcp-workflow.md`.
- [ ] At least 5 new MCP-authored-then-reviewed tests have been merged.
- [ ] `playwright.config.ts` includes firefox and webkit projects.
- [ ] CI runs all of the above. No MCP in CI.
- [ ] No failing tests introduced into the suite.

---

## 6. Phase 2 — precondition-gated

### 6.1 Precondition: wallet harness

**This is not an MCP decision. It is an E2E coverage decision.** The council is unanimous that the wallet harness is the real E2E gap. Phase 2 of this plan does not start until the harness exists.

Options for the harness (evaluated separately, not in this doc):
1. **`@synthetixio/synpress`** — established pattern, MetaMask automation, heavy.
2. **Mock Wagmi connector** — lightweight, tests the app logic but not the real wallet surface.
3. **Anvil + local keypair + custom connector** — full control, moderate complexity.
4. **Playwright + private key signing shim** — minimal, bespoke.

Whichever is chosen, the harness must support:
- Deterministic wallet address (reused across tests)
- SIWE signing without human interaction
- Transaction approval without human interaction
- `E2E_FAKE_PAYMENTS=true` compatibility
- Cross-browser (or chromium-only with a clear reason)

A separate architecture doc — `docs/architecture/e2e-wallet-harness-plan.md` — should be written when this is scoped. Not in scope for this doc.

### 6.2 Scope once unlocked

- SIWE authentication flow end-to-end
- Wallet-initiated scan (`/api/scan`)
- Single revoke
- Batch revoke
- Approve-then-test loops
- Permit2 flows
- Multi-chain wallet switching

### 6.3 Activation criteria

Phase 2 starts when **both** of these are true:
1. Wallet harness lands in `tests/helpers/wallet.ts` (or equivalent) with at least one passing spec that uses it.
2. The harness is documented in `docs/architecture/e2e-wallet-harness-plan.md` and accepted by Council #3 (Web3/DeFi expert) and #4 (Security).

No other gating. Phase 2 is mechanical once the harness exists — the same MCP authoring workflow from Phase 1 extends to wallet flows.

---

## 7. Security & isolation model

**Non-negotiable rules for running Playwright MCP against AllowanceGuard:**

1. **Always `--isolated`.** Ephemeral profile. No persistent cookies, no leaked state between sessions.
2. **Dev server only.** Point at `localhost:3000` or a sandbox deployment. Never at production.
3. **No real secrets.** Test-mode Stripe keys only. Test wallet only. Fake email sink only.
4. **`--blocked-origins`** to restrict network egress to localhost + Stripe test endpoints + Neon branch. Block everything else.
5. **No `browser_run_code` or `browser_evaluate` against prod.** These are shell-level. Reviewers should flag any test that commits code invoking them against a non-local URL.
6. **Session fixtures are gitignored.** `tests/fixtures/authed-session.json` contains a signed session token. Never commit.
7. **Rotate the dev wallet quarterly.** Not a secret-level concern, but hygiene.
8. **No browser extension mode for dev work.** The "Playwright MCP Bridge" extension connects to real browser tabs with real logins. That's a prod-credential-exposure risk. Stick to spawned browsers.

**Council #4 (Security) sign-off condition:** these rules are enforced in the operator workflow doc AND the initial adopter of Phase 1 has confirmed `--isolated` is their default. No exceptions for "just this once."

---

## 8. What not to use Playwright MCP for

- **CI execution.** CI uses plain `@playwright/test`. MCP is authoring-time only.
- **Performance testing.** Use Lighthouse CI or `@lighthouse/ci`, not the MCP.
- **Load testing.** Not its job.
- **API testing without a UI.** Use Playwright's `request` fixture directly. Don't spin up a browser to hit an endpoint.
- **Testing against production.** Ever.
- **"Just run the tests" automation.** `pnpm test:e2e` already does this. MCP adds nothing for running, only for authoring.
- **Visual regression as a single source of truth.** MCP-captured screenshots are for Design Council review, not pixel-diff regressions. If pixel-diff becomes a real need, adopt `@percy/playwright` or similar — not MCP.
- **Replacing human test review.** Every MCP-generated test is a draft until a human stabilizes locators and removes `waitForTimeout` calls.

---

## 9. Open questions (resolve during Phase 1)

- Does the pre-authenticated session fixture need rotation automation, or is manual refresh every 30 days acceptable?
- Should axe-core violations be failing assertions or soft warnings in Phase 1? Recommendation: failing, with a documented allowlist for known issues tracked in a GitHub issue.
- Do we want a dedicated `tests/mcp-drafts/` holding area for unreviewed MCP output, or does that invite drift? Recommendation: no holding area — drafts stay in the operator's working copy until reviewed.
- Should visual audits run on every PR or on-demand? Recommendation: on-demand for now. Per-PR runs risk flakiness in a codebase mid-redesign.
- Does Phase 1 block on expanding to firefox/webkit, or is chromium-only acceptable for initial adoption? Recommendation: expand as part of Phase 1 — low cost, catches webkit-specific CSS bugs in the Ledger aesthetic.

---

## 10. Reference — Playwright MCP tool surface (as of 2026-04-11)

Captured from `github.com/microsoft/playwright-mcp` for future comparison. Roughly 50 tools across default + opt-in capability sets. The default set (core automation) is what Phase 1 relies on; opt-in sets are enabled only when needed.

**Core automation (default):**
`browser_click`, `browser_close`, `browser_console_messages`, `browser_drag`, `browser_evaluate`, `browser_file_upload`, `browser_fill_form`, `browser_handle_dialog`, `browser_hover`, `browser_navigate`, `browser_navigate_back`, `browser_network_requests`, `browser_press_key`, `browser_resize`, `browser_run_code`, `browser_select_option`, `browser_snapshot`, `browser_take_screenshot`, `browser_type`, `browser_wait_for`

**Tabs:** `browser_tabs`

**Network (opt-in):** `browser_network_state_set`, `browser_route`, `browser_route_list`, `browser_unroute`

**Storage (opt-in, used by Phase 1 for session injection):** `browser_cookie_clear`, `browser_cookie_delete`, `browser_cookie_get`, `browser_cookie_list`, `browser_cookie_set`, `browser_localstorage_*`, `browser_sessionstorage_*`, `browser_set_storage_state`, `browser_storage_state`

**DevTools (opt-in):** `browser_resume`, `browser_start_tracing`, `browser_stop_tracing`, `browser_start_video`, `browser_stop_video`, `browser_video_chapter`

**Vision (opt-in, coordinate-based, requires `--caps vision`):** `browser_mouse_click_xy`, `browser_mouse_down`, `browser_mouse_drag_xy`, `browser_mouse_move_xy`, `browser_mouse_up`, `browser_mouse_wheel`

**PDF (opt-in):** `browser_pdf_save`

**Test assertions (opt-in, used by Phase 1 for locator generation):** `browser_generate_locator`, `browser_verify_element_visible`, `browser_verify_list_visible`, `browser_verify_text_visible`, `browser_verify_value`

**Config:** `browser_get_config`

**Transport:** stdio by default, HTTP via `--port`. Install via `npx @playwright/mcp@latest`. Browsers: chromium, firefox, webkit, msedge. Default mode is accessibility-tree snapshots; vision mode opt-in via `--caps vision`. Isolation via `--isolated` (ephemeral profile) — mandatory per §7.

---

## 11. Relationship to other plans

- **`docs/architecture/billing-mcp-plan.md`** — separate, deferred. Different decision logic (no measured pain there; measurable pain here).
- **Future `docs/architecture/e2e-wallet-harness-plan.md`** — a precondition of Phase 2. Must be written before Phase 2 starts. Owned by whoever picks up the wallet harness work.
- **Ledger redesign** (`docs/allowanceguard-1-strategy-spec (3).md`, `docs/allowanceguard-2-build (3).md`) — Phase 1 visual audits serve the redesign directly.

---

## 12. Changelog

| Date | Change | Author |
|---|---|---|
| 2026-04-11 | Initial two-phase plan. Council consulted; Phase 1 approved now, Phase 2 gated on wallet harness. No vetoes. Noor condition (axe-core integration) recorded as mandatory for Phase 1 completion. | Claude Code session |
