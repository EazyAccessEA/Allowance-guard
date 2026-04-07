# Phase 5 — Page Specs

> Dense format. All tokens from the Handbook. ~150–200 words per page.

---

## Homepage — Convert visitors into connected wallets

**Narrative role:** First impression. Prove competence in 3 seconds, convert in 10.

**Sections:**
1. **Hero** — Full-width, `min-h-[85vh]`. Dark bg (`--color-dark-bg-primary`). Oversized `7xl` heading: "Know what you've approved." Subhead in `secondary-400`, `lg`. Two CTAs: "Connect Wallet" (primary, `xl`) + "Scan Address" (outline, `xl`). Animated particle mesh background (canvas, `prefers-reduced-motion: reduce` → static gradient). Stats bar below: wallets scanned, approvals revoked, value protected — `mono` font, `primary-500` numbers. Mobile: stack CTAs, `5xl` heading, stats 2×2 grid.

2. **Trust strip** — Logos/chain icons row. `secondary-300` on dark. Infinite scroll, paused on hover. 8 chains + "10 chains supported" pill badge.

3. **Three-value props** — 3-col grid, `Card` variant `glass`. Icon (`primary-500`, 48px) + `2xl` heading + `base` body. "Scan" / "Assess" / "Revoke". Stagger `slideUp` on scroll. Mobile: single column.

4. **Live demo preview** — `Card` variant `elevated`, mock dashboard screenshot with hover-zoom. Overlay gradient bottom-to-top. CTA: "Try it free" (primary). Image: editorial crop of dashboard UI.

5. **Social proof** — Testimonial cards (3), `Card` variant `subtle`. Avatar, name, role, quote. Carousel on mobile.

6. **CTA band** — Full-width `primary-700` bg. White text `3xl`: "Your approvals are waiting." Single button: "Get Started Free" (white bg, `primary-700` text).

**Key decision:** The particle mesh hero — ambient, dark, technical. Screenshotable.

---

## Features — Justify the upgrade path

**Narrative role:** Show free value, make Pro/Sentinel irresistible.

**Sections:**
1. **Hero** — Compact, `py-20`. `5xl` heading: "Security tools that work while you sleep." `secondary-400` subhead. No CTA — page IS the CTA.

2. **Feature grid** — 2-col on desktop (icon-left, text-right alternating). Each: Lucide icon (48px, `primary-500`), `2xl` title, `base` description, tier badge (`Badge` variant: `primary` for Pro, `warning` for Sentinel, none for Free). Features: Multi-chain scan, Risk scoring, Batch revoke, Continuous monitoring, Email alerts, Time Machine, Gas savings, Automated rules, Team dashboard, Compliance export, Webhook integrations, API access. `fadeIn` staggered. Mobile: single column, icon above text.

3. **Comparison table** — `Card` variant `default`. Sticky header row. Columns: Feature / Free / Pro / Sentinel. Check/cross icons + text. Alternating row bg. Responsive: horizontal scroll with frozen first column.

4. **CTA** — "Start with Free. Upgrade when ready." Two buttons: "Connect Wallet" (primary) + "View Pricing" (outline).

**Key decision:** Alternating layout breaks monotony. Tier badges create visual upgrade pressure.

---

## Docs Hub — Make developers self-serve

**Narrative role:** Reduce support load. Prove API quality.

**Sections:**
1. **Sidebar nav** — Fixed left, `sidebarWidth`. Grouped: Getting Started, Guides, API Reference, SDK, Webhooks, Changelog. Active item: `primary-100` bg + `primary-700` text + left border `primary-500`. Collapsible groups with `rotate` chevron. Mobile: sheet overlay.

2. **Content area** — `containerMaxWidthNarrow`. Prose styling: `base` body, `2xl` h2, `xl` h3. Code blocks: `mono`, `secondary-800` bg, syntax highlighting. Inline code: `primary-50` bg, `primary-800` text, `sm` radius. Copy button top-right of code blocks.

3. **On-page ToC** — Right rail, sticky. `sm` text, `secondary-400`. Active section: `primary-500` text. Scroll-spy linked.

4. **Prev/Next nav** — Bottom of content. `Card` variant `ghost`, arrow icons.

**Key decision:** Three-panel layout (sidebar + content + ToC) signals API maturity.

---

## Blog Listing + Post — Build organic traffic

**Narrative role:** SEO vehicle. Thought leadership on Web3 security.

**Listing sections:**
1. **Featured post** — Full-width `Card` variant `elevated`. Large image left (aspect 16:9), title `3xl` + excerpt `base` + author + date right. Hover lift.

2. **Grid** — 3-col, `Card` variant `default`. Image top (aspect 3:2, fallback gradient `primary-900` → `secondary-900`), title `xl`, excerpt `sm` truncated 2 lines, author avatar + name + date. Pagination at bottom.

**Post layout:**
1. **Header** — `4xl` title, author row (avatar, name, date, read time), hero image full-width with `md` radius.
2. **Body** — Prose, `containerMaxWidthNarrow`. Same styling as docs content area.
3. **Share bar** — Sticky left rail on desktop, bottom bar on mobile. Twitter, copy link.
4. **Related posts** — 3-col grid at bottom.

**Key decision:** Featured post hero treatment. Editorial image quality.

---

## Contact — Reduce friction for enterprise leads

**Narrative role:** Enterprise conversion + support fallback.

**Sections:**
1. **Split layout** — Left: `3xl` heading "Let's talk security." Body text + direct email link + response time ("< 24 hours"). Right: form `Card` variant `elevated`. Fields: Name, Email, Company (optional), Subject (select: General / Enterprise / Bug Report / Partnership), Message (textarea). Submit: primary button, loading state. Success: inline `Alert` variant `success`.

2. **FAQ accordion** — Below form. 5–6 common questions. `Card` variant `ghost`, chevron toggle, `slideUp` content.

**Key decision:** Split layout with form on the right. Clean, enterprise-grade.

---

## Token Discovery — Search and explore token approvals

**Narrative role:** Utility page for direct token/contract lookup.

**Sections:**
1. **Search bar** — Centered, `containerMaxWidthNarrow`. Large `Input` with search icon, placeholder "Search token or contract address...". Debounced, 300ms. Results dropdown with token icon + name + chain badge.

2. **Popular tokens** — Grid of `Badge` variant `primary`, interactive. USDC, WETH, DAI, UNI, LINK, AAVE. Click → pre-fills search.

3. **Results** — `Card` variant `default` per token. Token name + icon, contract address (`mono`, truncated), chain badge, total approvals count, highest risk level badge. Click → detailed view.

4. **Detail panel** — Slide-in from right (desktop) or full-page (mobile). All approvals for that token: table with spender, amount, risk, date. Revoke buttons per row.

**Key decision:** Search-first UX. No clutter on load — just the search bar and popular tokens.

---

## Settings — User control center

**Narrative role:** Configuration for alerts, policies, wallet management.

**Sections:**
1. **Tab nav** — Horizontal pills: General / Alerts / Security Policies / Wallets / API Keys. Active: `primary-500` bg, white text.

2. **General** — Email, display name, timezone select, theme toggle (light/dark/system).

3. **Alerts** — Toggle switches per alert type (high risk detected, new unlimited approval, monitoring report). Email + Telegram channels. Frequency select.

4. **Security Policies** — Auto-revoke rules. Risk threshold slider. Whitelist/blacklist spender addresses in `Input` with add/remove.

5. **Wallets** — Connected wallets list. Each: address (`mono`), chain badges, "Primary" badge, remove button (destructive ghost). "Add Wallet" button (outline).

6. **API Keys** — Table: key prefix (`mono`), label, created date, last used, status badge, revoke button. "Generate Key" button (primary).

**Key decision:** Tab-based single page. No page reloads. Everything accessible.

---

## Account — Billing and usage dashboard

**Narrative role:** Subscription management. Reduce churn.

**Sections:**
1. **Plan card** — `Card` variant `accent`. Current plan name (`2xl`), renewal date, usage summary (wallets used / limit). "Upgrade" or "Manage" button. If free: prominent upgrade prompt.

2. **Usage meters** — 3-col grid. API calls (bar chart), wallets monitored (radial gauge), alerts sent (count). Each in `Card` variant `default`. Period selector: 7d / 30d / 90d.

3. **Billing history** — Table: date, description, amount, status badge (paid/pending/failed), invoice link. `Card` variant `default`.

4. **Payment method** — `Card` variant `subtle`. Last-4 digits, expiry, brand icon. "Update" button (outline). Stripe-managed.

5. **Danger zone** — `Card` variant `danger`. "Cancel Subscription" with confirmation modal. "Delete Account" — double confirmation.

**Key decision:** Usage meters front and center. Show value delivered to prevent churn.

---

## 404 — Recover lost visitors

**Narrative role:** Brand moment. Don't lose the visitor.

**Sections:**
1. **Center layout** — `min-h-[60vh]` flex center. `8xl` "404" in `primary-500`, `mono` weight `800`. Below: `2xl` "This page doesn't exist." `secondary-400` subhead: "But your approvals still do."

2. **Actions** — Two buttons: "Go Home" (primary) + "Scan a Wallet" (outline). Below: search input for docs.

3. **Subtle animation** — Floating shield icon with gentle bob animation. `prefers-reduced-motion` → static.

**Key decision:** "But your approvals still do." — turns error into brand moment.
