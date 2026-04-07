# AllowanceGuard — THE REDESIGN. Part 2: Build It

> Paste the **Design Tokens Handbook** from Part 1 as your first message. Then: *"Council, the tokens are set. Go."*

---

## THE SITUATION

Strategy is done. Language is locked. Tokens decided. Components specified. Now you build.

Same six architects, execution mode. Every value comes from the Handbook. Don't re-debate. Make it real.

---

## OUTPUT DISCIPLINE

The same rules from Part 1 apply here — **concise, dense, precise.**

- **Page specs:** Use the structured format below. No prose preambles. Section → components → copy → image → animation → mobile. Table format where possible.
- **Code:** Clean and commented, but don't narrate what you're building while building it. Minimal preamble, then the artifact.
- **Don't restate the Handbook.** It's in context. Reference variables, don't redefine them.
- **Phase 5 (all page specs):** ≈2000 words total. Not per page — total.
- **Phase 6 (implementation):** ≈500 words.
- **Phase 7 (each build):** Focus tokens on code quality, not explanation. Brief intro → artifact.

---

## TECHNOLOGY: React (JSX Artifacts)

All builds are **React JSX** rendered as Claude artifacts. This means:

### Why React, not vanilla
- AllowanceGuard is already Next.js/React — components port directly to production
- Artifacts render live in the conversation — you see and interact immediately, no file downloads
- State management (filtering, batch select, Time Machine) is cleaner with hooks than manual DOM manipulation
- Closer to production code = less throwaway work

### Technical rules

**Framework:**
- React functional components with hooks (`useState`, `useMemo`, `useCallback`)
- Default export, no required props
- Single-file `.jsx` artifacts — everything in one file

**Styling:**
- **Tailwind utility classes** for layout, spacing, responsive (available in artifacts)
- **CSS custom properties** for all design tokens — define in a `<style>` tag or inline style block on the root element. Every colour, font, shadow, radius, and motion value from the Handbook goes here.
- When Tailwind doesn't cover a token (e.g., custom easing curves, brand colours), use inline styles referencing CSS variables: `style={{ color: 'var(--color-primary)' }}`
- No external CSS files. Everything self-contained.

**Available imports:**
```jsx
import { useState, useMemo, useCallback } from "react";
import { Shield, AlertTriangle, Check, X, Filter, Clock, Zap } from "lucide-react"; // icons
import * as d3 from "d3"; // if data viz needed
```

**Mock data:**
- Define as a `const` array at the top of the component
- Realistic: real token names (USDC, WETH, DAI, UNI, LINK, AAVE, CRV), real-looking addresses (`0x1a2B...3c4D`), plausible amounts, varied risk levels, mixed chains
- NOT "Token A, Token B" or lorem ipsum

**Accessibility (non-negotiable):**
- Semantic HTML: `<table>` for data, `<button>` for actions, `<nav>` for nav
- `aria-label` on every icon-only button and non-semantic control
- Colour never the sole indicator — always icon + label alongside
- Focus styles: visible, on-brand (use `focus-visible:` Tailwind classes)
- `prefers-reduced-motion`: wrap all motion in a check or use CSS with the media query

**Responsive:**
- Mobile-first with Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test mentally at 375px, 768px, 1280px before writing

**Images:**
- Claude has the image search tool. Use it for real Unsplash photos where needed.
- Include `alt` text. Use Tailwind `aspect-ratio` utilities.
- Provide a fallback background (gradient/colour) visible during load.

---

## WHAT YOU BUILD

### BUILD 1: The Dashboard

The core product. A **design prototype** — interactive React component with mock data. Not a dApp. No wallet connections. No blockchain.

**Required elements:**

**1. Header** — site nav consistent with component library. Mock wallet state: connected address (`0x1a2B...3c4D`), chain indicator, disconnect button (no-op).

**2. Summary stats** — total approvals, at-risk count, estimated value exposed. Mock numbers. Scannable at a glance.

**3. Chain filter pills** — All / Ethereum / Polygon / Arbitrum / Base / Optimism / Avalanche. `useState` to track active filter. Filters the approval list. Active pill = primary treatment.

**4. Approval table** — 7–8 rows of mock data. Each row:

| Column | Content | Notes |
|---|---|---|
| Checkbox | Batch select | Controlled by state |
| Token | Name + small icon/emoji | e.g., "USDC", "WETH" |
| Spender | Truncated address, monospace | `0x7a25...8f3D` |
| Amount | Number or "Unlimited" | Unlimited = risk signal |
| Risk | Badge: Low ✓ / Medium ⚠ / High ▲ / Critical ✕ | Colour + icon + label always |
| Chain | Chain name or icon | |
| Last active | Relative time | "3 days ago", "2 months ago" |
| Action | Revoke button (ghost/destructive) | `onClick` → alert |

Hover state on rows. Selected state when checkbox active.

**5. Batch toolbar** — appears when ≥1 row selected. Count + "Revoke Selected" button → `alert('Would revoke: ' + ids)`.

**6. Time Machine** — toggle with distinctive styling. When on:
- Subtle visual mode shift (border, label, background tint)
- Highest-risk rows dim/disappear
- Stats recalculate
- "Simulation" indicator visible
- Toggle off → restore

**7. Empty state** — when filters exclude everything. On-brand, designed, not generic.

**8. Responsive** — mobile: table rows become cards or condensed list. Filters scroll horizontally. Toolbar fixed at bottom.

---

### BUILD 2: Pricing Component

Standalone interactive component. Proves the system works for marketing.

**Required:**
- Three tier cards: Free / Pro ($9.99) / Sentinel ($49.99). Pro = "Most Popular."
- Monthly ↔ Yearly toggle with savings badge. Satisfying animation.
- Button hierarchy: ghost (Free), primary (Pro), secondary (Sentinel).
- Feature comparison below cards — checkmarks/crosses per tier. Hover tooltips for complex features.
- Responsive: stack on mobile, row on desktop.

---

### SPECIFY (no code) — everything else

For each page, use this exact format. **Be dense. ≈150–200 words per page max.**

```
## [Page] — [purpose in one line]

**Narrative role:** [one sentence]

**Sections:**
1. [Name] — [layout] — [components from Phase 4] — [copy direction] — [image: subject | mood | search string | fallback] — [animation] — [mobile change]
2. ...

**Key decision:** [what makes this page screenshot-worthy]
```

**Pages to spec:** Homepage, Features, Docs hub + template, Blog listing + post, Contact, Token Discovery, Settings, Account, 404.

---

## EXECUTION ORDER

Run these as separate messages. Don't try to output everything at once.

**Message 1:** "Begin Phase 5" → Page specs (all pages, dense format)

**Message 2:** "Phase 6" → Implementation notes (≈500 words: tech stack, production performance, asset strategy, SEO)

**Message 3:** "Build the dashboard" → Full React JSX artifact

**Message 4:** "Build pricing" → Full React JSX artifact

This pacing keeps each response focused and avoids token exhaustion.

---

## RULES

1. **Tokens from the Handbook are law.** No ad-hoc values. If something's missing, flag it in one line and propose — don't invent silently.

2. **The code IS the design.** When someone opens the dashboard artifact, they should pause. Every hover state. Every transition. Every risk badge. Polished.

3. **Noor has veto.** Not keyboard-accessible? Colour-only indicator? Missing focus states? It doesn't ship.

4. **Screenshotability test.** Would someone screenshot this dashboard and share it? Would a designer study the pricing toggle? If no — iterate.

5. **Respect the token budget.** Specs are dense. Code is clean and commented but not narrated. No preamble essays. Brief intro → deliver.

6. **Use image search.** The tool is available. Real photography, not described photography. Plus fallback CSS.

---

## GO

1. Paste the **Design Tokens Handbook**.
2. *"Council, the tokens are set. Go."*
3. Follow the execution order above — one phase per message.
4. For builds, the artifacts render live. Review, interact, then request iterations.

---

*Part 2 of 2. React. Live artifacts. Dense specs. Clean code. Build it like the Born Again suit reveal — so good the old version dies on sight.*
