# E2E Wallet Harness — Build Plan

> **Status:** Build when ready. Not deferred. The real E2E gap.
> **Owner:** QA + Web3 domain expert pairing.
> **Target:** `tests/helpers/wallet-mock.ts` + `tests/helpers/auth.ts` + `tests/fixtures/`
> **Decision date:** 2026-04-12.
> **Reviewed by:** Standing Council (17+) — see §3.

---

## 1. Why this exists

AllowanceGuard's E2E suite has 15 spec files but **cannot test the core product loops**: SIWE auth, scan-with-wallet, single revoke, batch revoke, chain switching, approval monitoring. The blocker is not test-writing skill — it's infrastructure. There is no test wallet.

When Playwright clicks "Connect Wallet," the dApp calls `window.ethereum.request({ method: 'eth_requestAccounts' })`. In production, MetaMask responds. In tests, nothing responds — there is no `window.ethereum`. The tests stop at the door.

A **wallet harness** replaces `window.ethereum` with a programmatic implementation the test controls: fixed address, automatic signing, no popups, no human. It is the single missing piece between "15 shallow specs" and "comprehensive E2E coverage of a wallet-security product."

This gap exists independently of any MCP decision (see `docs/architecture/playwright-mcp-plan.md`). The harness is worth building on its own merit.

---

## 2. Current state (2026-04-12)

- **15 spec files** in `tests/`: `a11y`, `account`, `api-key`, `auth`, `chains`, `dark-mode`, `donations`, `export`, `feature-gate`, `mobile`, `monitoring`, `payment`, `revoke`, `scan`, `team`.
- **One helper** (`tests/helpers/chains.ts`): chain definitions + a hardcoded wallet address string. Not a wallet. Not a signer.
- **No `window.ethereum` mock.** No synpress. No test keypair. No session fixture.
- **`@playwright/test ^1.55.0`** and **`@axe-core/playwright ^4.10.2`** — modern Playwright, axe installed.
- **`E2E_FAKE_PAYMENTS=true`** and **`E2E_FAKE_EMAIL=true`** exist. No equivalent `E2E_FAKE_WALLET` flag.
- **`viem ^2`** already in `package.json` — signing utilities available without adding deps.
- **Chromium-only** project in `playwright.config.ts`.
- Tests are largely **presence checks**: "does the page have a connect button?", "does the body have text?", "does the URL exist?"

**What is untested end-to-end:**
1. SIWE authentication (connect → sign → session)
2. Scan with connected wallet
3. Single token revoke
4. Batch revoke
5. Chain switching
6. Feature-gate enforcement for connected free-tier user
7. Post-auth account, settings, billing, API key flows
8. Alert subscription (requires authenticated session)
9. Team invite acceptance
10. Export (PDF/CSV, requires auth)

---

## 3. Council decision log

| # | Voice | Verdict | Key concern |
|---|---|---|---|
| 3 | Web3/DeFi expert | **Build now** | "This is our product's testing gap. A wallet-security tool that can't test wallet flows is testing nothing." |
| 16 | QA engineer | **Build now** | "This unblocks 7+ tests I've wanted to write since Phase 1 shipped." |
| 4 | Security | **Build, with guardrails** | Test private key management, build-time isolation, no mainnet funding. See §6. |
| 15 | Staff engineer | **Build, layered** | Three layers adopted incrementally, not monolithically. Don't overbuild Layer 3 before Layers 1–2 prove value. |
| 8 | Noor (A11y) | **Build** | "Connect/sign/error states are accessibility surfaces we currently can't test." |
| 10 | DevOps/SRE | **Build** | Anvil (Layer 3 only) is lightweight. CI implications are manageable. |
| 17 | Thane (Perf) | **Build** | Speed matters: Layer 1 ~0ms, Layer 2 ~100ms, Layer 3 ~500ms shared. All acceptable. |
| 18 | DBA | **Build** | Layer 3 needs chain-state ↔ DB-state parity. Seed script must populate both. |
| 14 | DX engineer | **Build** | Pairs with Playwright MCP Phase 2 — that plan explicitly gates on this harness. |
| 2 | OSS maintainer | OK | No new deps for Layer 1–2. Anvil (Layer 3) is MIT. |
| 19 | Privacy/GDPR | Caution | Test accounts only. No real user data. |
| 7 | Maren (Visual) | N/A | |
| 9 | Legal | N/A | |
| 5 | Product marketing | N/A | |
| 6 | B2B API | N/A | API tests use `request` fixture, no browser needed. |
| 11 | Investor voice | N/A | |
| 12 | Ecosystem | N/A | |
| 13 | UX writer | N/A | |
| 1 | Editor-in-chief | Build | "A wallet-security product without wallet E2E is a credibility gap, not just a testing gap." |

**No vetoes. Unanimous: build.**

---

## 4. Architecture — three layers, adopted incrementally

### Layer 1 — Pre-authenticated session fixture

**What:** A script that performs SIWE once, dumps the `ag_sess` cookie to a JSON file, and a helper that loads it into Playwright's browser context.

**Files:**
- `scripts/e2e-auth-fixture.ts` — runs `viem.privateKeyToAccount()`, requests SIWE nonce from `/api/siwe/nonce`, signs the SIWE message, posts to `/api/siwe/verify`, captures `Set-Cookie`, writes to fixture file.
- `tests/fixtures/authed-session.json` — the cookie. Gitignored. Valid 30 days (matches `ag_sess` expiry). Refresh by re-running the script.
- `tests/helpers/auth.ts` — exports `loginAs(page)` that calls `page.context().addCookies(cookies)`.

**Unlocks:** account, settings, billing, API key management, team management, alerts, export — everything that requires `ag_sess` but not an active wallet connection in the browser.

**Cost:** ~1 day.
**Dependencies:** None. Uses existing SIWE endpoints.
**CI impact:** Zero. Cookie is pre-generated.

### Layer 2 — Mock injected provider

**What:** A `window.ethereum` stub injected via `page.addInitScript()` that responds to EIP-1193 JSON-RPC calls using a test private key.

**Files:**
- `tests/helpers/wallet-mock.ts` — exports `installMockWallet(page, opts?)`.
- `.env.test` — contains `E2E_WALLET_PRIVATE_KEY` (a throwaway key, never funded on mainnet).

**Interface contract:**

```
installMockWallet(page, {
  privateKey?: string,    // defaults to E2E_WALLET_PRIVATE_KEY
  chainId?: number,       // defaults to 1 (Ethereum)
  balance?: bigint,       // fake balance for eth_getBalance
})
```

**RPC methods handled:**

| Method | Behavior |
|---|---|
| `eth_requestAccounts` | Returns `[derivedAddress]`. No popup. |
| `eth_accounts` | Returns `[derivedAddress]`. |
| `eth_chainId` | Returns configured chain ID. |
| `personal_sign` | Signs with test private key via `viem`. Returns real signature. |
| `eth_signTypedData_v4` | Signs EIP-712 typed data. Needed for Permit2 flows. |
| `wallet_switchEthereumChain` | Updates internal chain ID. Emits `chainChanged` event. |
| `eth_sendTransaction` | Returns a deterministic fake tx hash. Logs the call params so tests can assert on the transaction shape (to, data, value). |
| `eth_getBalance` | Returns configured balance. |
| `eth_estimateGas` | Returns a fixed value (21000 for transfers, 100000 for contract calls). |
| `net_version` | Returns chain ID as string. |

**Events emitted:** `accountsChanged`, `chainChanged`, `connect`, `disconnect` — matching EIP-1193.

**Unlocks:** SIWE auth flow, scan with wallet, connect/disconnect, chain switching, and all flows *up to* transaction submission (tests can assert on the tx params without needing on-chain observation).

**Cost:** ~2–3 days.
**Dependencies:** `viem` (already installed).
**CI impact:** Zero. In-process mock, no external services.

### Layer 3 — Local chain (Anvil)

**What:** A local Foundry Anvil node that the mock provider forwards `eth_sendTransaction` to, so tests can observe actual on-chain state changes.

**Files:**
- `tests/helpers/anvil.ts` — exports `startAnvil()`, `stopAnvil()`, `fundAccount(address, amount)`, `deployTestToken()`, `setAllowance(token, owner, spender, amount)`.
- `tests/fixtures/chain-state.ts` — declarative fixture: "wallet X has allowance Y to spender Z on token T." Seeds both chain (via Anvil) and DB (via Drizzle) from one config.
- `playwright.config.ts` — adds Anvil as a `webServer` entry alongside Next.js, fixed port.

**Interface:**

```
const anvil = await startAnvil({ port: 8545 })
await fundAccount(testWallet, parseEther('10'))
const token = await deployTestToken('TestUSDC', 'TUSDC', 6)
await setAllowance(token, testWallet, maliciousSpender, MaxUint256)
// ... test runs, revokes the allowance ...
const remaining = await getAllowance(token, testWallet, maliciousSpender)
expect(remaining).toBe(0n)
```

**Unlocks:** Revoke observation (did the tx actually clear the allowance?), batch revoke, gas estimation accuracy, tx failure handling.

**Cost:** ~1 week (including fixture setup and DB seeding parity).
**Dependencies:** `anvil` (Foundry CLI). MIT. ~50MB binary. Not an npm dep — installed via `curl -L https://foundry.paradigm.xyz | bash`.
**CI impact:** Moderate. Anvil starts in <1s. CI needs Foundry installed (one `foundryup` step in the GitHub Actions workflow). Tests that don't need Layer 3 skip Anvil entirely.

---

## 5. Adoption order

**Layer 1 → Layer 2 → (pause, write tests) → Layer 3.**

| Week | Deliverable | Tests unlocked |
|---|---|---|
| 1 | Layer 1 (session fixture) | account, settings, billing, API keys, teams, alerts, export |
| 1–2 | Layer 2 (mock provider) | SIWE auth, scan, connect/disconnect, chain switch, feature-gate (connected free-tier) |
| 2–3 | Write tests against Layers 1–2 | Target: 10+ new specs covering the flows above |
| 4+ | Layer 3 (Anvil) — only if the test gap list from weeks 2–3 shows "I need on-chain observation" | Revoke, batch revoke, Permit2 |

**Do not build Layer 3 speculatively.** Write the Layer 2 tests first. If "returns fake tx hash" is sufficient for 80% of revoke tests (it often is — you're testing the UI, not the chain), Layer 3 may be deferred further.

---

## 6. Security model

**#4 Security engineer's requirements — all mandatory:**

1. **Throwaway keypair.** Generate with `viem.generatePrivateKey()`. Store in `.env.test`. Never use a key that has held real funds. Never fund on mainnet.
2. **Build-time isolation.** `wallet-mock.ts` refuses to run unless `process.env.NODE_ENV === 'test'`. The mock code lives in `tests/` only — never imported from `src/`.
3. **No seed phrase in CI logs.** Private key passed via GitHub Actions secret `E2E_WALLET_PRIVATE_KEY`, masked in logs.
4. **Session fixture gitignored.** `tests/fixtures/authed-session.json` in `.gitignore`. Contains a session token, not a key.
5. **Anvil is local-only.** `startAnvil()` binds to `127.0.0.1`. No external RPC access.
6. **Rotate test keypair annually.** Not critical (no real funds), but hygiene.
7. **No Pattern C (Synpress).** Rejected by council. Real MetaMask = seed phrase in CI = unnecessary exposure.

---

## 7. Integration with Playwright MCP Phase 2

This harness is the **precondition** for Playwright MCP Phase 2 (`docs/architecture/playwright-mcp-plan.md` §6).

When Layer 2 lands:
- Playwright MCP Phase 2 activates.
- MCP-driven test authoring extends to wallet-connected flows.
- The MCP operator calls `installMockWallet(page)` at the start of a session, then drives the app normally. Claude sees wallet-connected UI via `browser_snapshot` and writes tests against it.

The harness and the MCP are independent but complementary. The harness is worth building even if MCP is never adopted.

---

## 8. Success criteria

The harness is **done** when:
- [ ] Layer 1: `tests/helpers/auth.ts` exports `loginAs(page)` and at least 3 specs use it.
- [ ] Layer 2: `tests/helpers/wallet-mock.ts` exports `installMockWallet(page)` and at least 5 specs use it.
- [ ] SIWE happy path and failure path are tested end-to-end.
- [ ] Scan-with-wallet is tested (address auto-populates, results load).
- [ ] At least one revoke test exists (Layer 2 fake-hash or Layer 3 real tx).
- [ ] Chain switching is tested.
- [ ] `E2E_WALLET_PRIVATE_KEY` is a GitHub Actions secret, not hardcoded.
- [ ] `.env.test` is in `.gitignore`.
- [ ] `tests/fixtures/authed-session.json` is in `.gitignore`.
- [ ] CI runs all new tests without Anvil (Layer 3 tests marked as needing Anvil can be skipped in CI until Layer 3 ships).
- [ ] No existing tests broken.

---

## 9. Open questions

- Should the mock provider emit Wagmi-compatible events so `useAccount()` / `useChainId()` hooks react naturally, or do we inject at the `window.ethereum` level and let Wagmi discover it? **Recommendation:** inject at `window.ethereum`. Wagmi auto-discovers injected providers. Don't mock above the standard.
- Should Layer 1 (session fixture) support multiple user tiers (free, pro, sentinel) for feature-gate testing? **Recommendation:** yes, three fixture files. One per tier. Each generated by the same script with a different wallet.
- Does the test wallet address need to be deterministic across runs? **Recommendation:** yes. Derived from a fixed private key. Makes DB fixtures and chain fixtures stable.
- Should we add `data-testid` attributes to wallet-related UI elements as part of this work? **Recommendation:** yes, opportunistically. Add `data-testid="connect-wallet"`, `data-testid="revoke-button"`, `data-testid="chain-selector"` to the components touched by the first round of wallet tests.

---

## 10. Relationship to other plans

| Doc | Relationship |
|---|---|
| `docs/architecture/playwright-mcp-plan.md` | Phase 2 of that plan gates on this harness (Layer 2 specifically). |
| `docs/architecture/billing-mcp-plan.md` | Independent. Different domain. |
| `playwright.config.ts` | Layer 3 adds an Anvil `webServer` entry. Layers 1–2 don't touch config. |

---

## 11. Changelog

| Date | Change | Author |
|---|---|---|
| 2026-04-12 | Initial plan. Council unanimous: build. Three-layer architecture with incremental adoption. | Claude Code session |
