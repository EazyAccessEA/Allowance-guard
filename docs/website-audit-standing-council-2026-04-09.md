# AllowanceGuard — Website audit & execution playbook

**Purpose:** Give leadership and operators a **single document** to run improvements end-to-end: what to do, in what order, who owns it (Standing Council roles), and how you know you are done.

**Live site:** https://www.allowanceguard.com  
**Last updated:** 2026-04-09  

**Important:** Part of this audit used **repository and live header review**. A full **SquirrelScan** run (230+ rules, scores, broken links) requires the `squirrel` CLI on your machine ([install](https://squirrelscan.com/download)). Commands are in **Section 2** — run them first if you want a numeric baseline.

---

## 1. How to use this document

| If you are… | Start here |
|-------------|------------|
| **CEO / PM** | Read **Section 3** (scores) and **Section 5** (90-day plan). Approve Phase 1. |
| **Operator running the work** | Do **Section 2** this week, then **Section 6** (Week-1 checklist). |
| **Engineering lead** | **Section 7** (code touchpoints) + **Section 6** task owners. |
| **Legal / compliance** | **Section 8** (seats 9, 11, 19) and JSON-LD / cookie tasks in Section 6. |

---

## 2. Copy-paste runbook (baseline measurements)

**Prerequisite:** Install SquirrelScan and verify:

```bash
squirrel --version
```

**One-time project setup** (from repo root or a dedicated audit folder):

```bash
squirrel init -n allowance-guard-audit
```

**Audits** — run in this order (quick → deeper):

```bash
# A) Fast health check (~25 pages)
squirrel audit https://www.allowanceguard.com -C quick --format llm

# B) Default breadth (~100 pages, pattern sampling)
squirrel audit https://www.allowanceguard.com -C surface --format llm

# C) Pre-launch / award push (up to ~500 pages)
squirrel audit https://www.allowanceguard.com -C full --format llm
```

**Save a baseline for regressions** (after your first “good” audit, note the audit ID from the tool output):

```bash
squirrel report --list
# Later:
squirrel report --diff <baseline-audit-id> --format llm
```

**Sanity-check production config** (wrong URL breaks sitemap + metadata base):

```bash
# In Vercel / local env: must match your canonical public URL
echo "$NEXT_PUBLIC_APP_URL"
```

**Manual checks (free tools):**

- Chrome DevTools → **Lighthouse** → Mobile + Desktop on `/`, `/pricing`, `/docs`, `/features`.
- **Keyboard:** Tab through header, cookie banner, connect flow; no traps.
- **axe DevTools** (browser extension) on the same URLs.

---

## 3. At-a-glance assessment (indicative)

Use this until SquirrelScan numbers replace it. Grades are directional, not a substitute for the CLI.

| Area | Grade | In plain English |
|------|-------|------------------|
| Baseline security headers | **B+** | HTTPS hardening and framing protections look solid on live HTML responses. |
| Content Security Policy (CSP) | **Gap** | No CSP found in repo; plan report-only CSP, then enforce (Seat 4). |
| Social / SEO snippets | **C+** | Titles and descriptions exist; **social preview images** are underpowered (see `layout.tsx`). |
| Structured data (JSON-LD) | **C** | `Offer` / “free” framing may not match **freemium + API** reality (Seats 9, 11). |
| Crawlability | **B−** | `robots.txt` and `sitemap.xml` exist; sitemap list **misses important pages** (e.g. `/pricing`, `/networks`). |
| Performance | **B− (risk)** | Many font preloads on live responses — validate LCP/CLS on real phones (Seat 17). |
| Accessibility | **Unverified** | Skip link is good; wallet UI + tables + modals need a formal **WCAG AA** pass (Seat 8 **veto**). |
| Messaging & fundability | **Review** | Align global meta/schema with **core free + paid services** — avoid banned “charity / 100% free” vibes (Seat 11). |

---

## 4. Standing Council — who does what (quick map)

Your council has **19** seats (see `CLAUDE.md`). For **execution**, use this as a RACI-style guide: each work stream has a **primary** seat you ping first.

| # | Role | Primary use in this audit |
|---|------|---------------------------|
| 1 | Editor-in-chief | Page-level story; avoid copy-paste meta everywhere. |
| 2 | Open source maintainer | Repo links, contributing, disclosure paths. |
| 3 | Web3 / DeFi expert | Chain lists accurate everywhere (no drift vs product). |
| 4 | Security engineer | CSP, headers, key/session narrative. |
| 5 | Product marketing | Homepage/pricing narrative, segments. |
| 6 | B2B / API | Docs, OpenAPI, `ag_pub_*` integrator story. |
| 7 | Visual designer | Hierarchy, One Signature Move, less noise. |
| **8** | **Accessibility (veto)** | **Ship blocker if AA fails** — motion, contrast, keyboard. |
| 9 | Lawyer / compliance | JSON-LD claims, terms/privacy/cookies truth. |
| 10 | DevOps / SRE | Synthetic uptime, env correctness, caching clarity. |
| 11 | Investor / founder voice | Messaging guardrails, no banned phrases. |
| 12 | Ecosystem | Proof, partners, distribution, E-E-A-T. |
| 13 | UX writer | Errors, empty states, microcopy in app + emails. |
| 14 | DX engineer | Copy-paste quickstarts that work first try. |
| 15 | Staff engineer | What is static vs dynamic; perf architecture. |
| 16 | QA / test | Playwright smoke, regression pyramid. |
| 17 | Performance | Budgets, fonts, bundles, CWV. |
| 18 | Database / DBA | Retention story for scans/logs (trust for teams). |
| 19 | Privacy / GDPR | Cookie/tracker inventory, consent, DPIA readiness. |

---

## 5. ninety-day plan (award trajectory)

**Rule of thumb:** Fix **all SquirrelScan errors** before chasing a “95+” polish score. Use **quick** in CI or weekly ops; use **surface/full** before launches and award submissions.

| Phase | Time | Goal | Done when… |
|-------|------|------|------------|
| **Phase 1 — Baseline** | Week 1 | Numbers + prioritized backlog | Squirrel quick + surface saved; Lighthouse 4 URLs; P0 list agreed. |
| **Phase 2 — Trust & crawl** | Weeks 2–3 | Honest snippets + discoverability | Meta/schema aligned with freemium; sitemap includes key URLs; OG images live. |
| **Phase 3 — Security** | Weeks 4–6 | CSP path | Report-only CSP + clean reports → enforcement toggled with rollback plan. |
| **Phase 4 — Access & perf** | Weeks 4–8 (parallel) | AA + speed | axe + manual screen reader on critical paths; LCP/CLS budgets met on mobile. |
| **Phase 5 — Proof** | Ongoing | Awards / SEO authority | Flagship article, disclosure history, “used by” / integrations (truthful). |

---

## 6. Week-1 checklist (printable)

Check these in order. **Do not skip Seat 8** before claiming “award ready.”

### A. Measurement (Owner: Operator + Seat 16)

- [ ] `squirrel` installed; `squirrel audit … -C quick --format llm` completed  
- [ ] `squirrel audit … -C surface --format llm` completed  
- [ ] Lighthouse mobile: `/`, `/pricing`, `/docs`, `/features` — scores written down  
- [ ] Record **audit IDs** / report files for regression diffs  

### B. Configuration hygiene (Owner: Seat 10)

- [ ] `NEXT_PUBLIC_APP_URL` in production matches **canonical** site (fixes sitemap + `metadataBase`)  
- [ ] Open `https://www.allowanceguard.com/robots.txt` — confirm `Sitemap:` line uses correct host  
- [ ] Open `https://www.allowanceguard.com/sitemap.xml` — confirm key marketing URLs present  

### C. Crawl & SEO quick wins (Owner: Seats 1, 5, 6)

- [ ] Add missing high-value URLs to sitemap (`src/app/sitemap.xml/route.ts`), at least **`/pricing`**, **`/networks`** (and other public marketing pages you want indexed)  
- [ ] Plan **OG + Twitter images** for default layout and priority pages (`src/app/layout.tsx` and/or per-route `metadata`)  

### D. Messaging & schema honesty (Owner: Seats 11, 9 — review together)

- [ ] Replace single “free tool only” story in **default description, OG, Twitter, JSON-LD** with **accurate** open-core + paid monitoring/API framing (see `CLAUDE.md` “Key Messaging Rules”)  
- [ ] Remove or rewrite JSON-LD `Offer` / price claims that imply **everything** is free if paid tiers exist (`layout.tsx` script block)  

### E. Security roadmap (Owner: Seat 4)

- [ ] Open ticket: **CSP** report-only → enforce; list required third-party domains (wallet, monitoring, analytics)  
- [ ] Confirm no secrets in client bundles (Squirrel “leaked secrets” rule helps once run)  

### F. Accessibility gate (Owner: Seat 8 — veto)

- [ ] Keyboard-only pass: header, mobile nav, cookie banner, primary modals  
- [ ] Screen reader spot-check: focus order, announcements on wallet connect  
- [ ] `prefers-reduced-motion` respected on hero / motion surfaces  

---

## 7. Code touchpoints (where to edit)

Use this when assigning engineering tasks.

| File | Why it matters |
|------|----------------|
| `src/app/layout.tsx` | Default `metadata`, Open Graph, Twitter, JSON-LD, skip link, resource hints |
| `next.config.ts` | Global security headers (CSP would land here or in middleware) |
| `src/app/sitemap.xml/route.ts` | URL inventory for Google — keep complete and fresh |
| `src/app/robots.txt/route.ts` | Crawl hints; `Sitemap` URL must match production |

---

## 8. Detailed findings by council seat (reference)

_Use this for depth; **Section 6** is what you execute first._

1. **Editorial:** One global description is brittle — vary **page-level** metadata where it helps conversion and SEO.  
2. **Open source:** Robots/layout GitHub signals are good; keep contribution + security paths obvious.  
3. **Web3:** Align chain lists across `robots.txt` comments, meta, and real product support — no contradictions.  
4. **Security:** Strong HSTS / framing / nosniff on live sample; **add CSP** as a phased program, not a one-line gamble.  
5. **Product marketing:** Pricing and segments must be visible in nav, meta strategy, and schema story.  
6. **B2B/API:** Docs/sitemap are a start; integrators need a **single** “start here” path with public keys and CORS expectations.  
7. **Visual:** Award sites feel intentional — fewer competing fonts/effects unless they earn their cost (Seat 17).  
8. **Accessibility (veto):** Tables, wallet flows, and cookie UI must meet **WCAG AA** before awards or enterprise credibility.  
9. **Legal:** JSON-LD and cookies must match actual behavior and paid positioning.  
10. **DevOps:** Env-driven URLs and synthetics for API health reduce preventable incidents.  
11. **Investor voice:** Purge banned phrases everywhere, including **meta and structured data**.  
12. **Ecosystem:** Build E-E-A-T: integrations, audits, responsible disclosure, credible backlinks.  
13. **UX writing:** Tighten meta to **outcomes** users feel (without over-claim).  
14. **DX:** Every docs code block should be CI-verifiable where possible.  
15. **Architecture:** `force-dynamic` is fine — document what must stay client-side vs streamable.  
16. **QA:** Package tests ≠ browser E2E — schedule Playwright smoke on production or staging.  
17. **Performance:** Font preload count on live HTML is high — measure before adding more.  
18. **DB/trust:** Institutional buyers care about retention and audit logs — surface a clear policy.  
19. **Privacy:** Cookie banner and third-party list must be accurate and minimal.

---

## 9. Live sample (headers) — 2026-04-09

A sample `GET https://www.allowanceguard.com/` showed useful baseline headers (`strict-transport-security`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy`, `permissions-policy`). **No `content-security-policy`** was observed on that response. Re-verify after you ship CSP.

---

## Disclaimer

This playbook supports **go-to-market and quality execution**. It is **not** legal advice, a full security assessment, or a substitute for SquirrelScan/Lighthouse/axe runs on your schedule.
