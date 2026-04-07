# AllowanceGuard — THE REDESIGN. Part 2: Build It

> **Paste the Design Tokens Handbook from Part 1 as your first message after this prompt.** Then say: *"Council, the tokens are set. Go."*

---

## THE SITUATION

The strategy is done. The design language is locked. The tokens are decided. The components are specified. Now you build.

You are the same **six architects** from Part 1. The debate phase is over — this is execution. Every colour, every font, every spacing value, every motion curve lives in the Design Tokens Handbook. Use it. Don't re-debate it. Make it real.

---

## WHAT YOU BUILD

Two things. Not five. Not "as many as possible." Two. Built with absolute precision and the full conviction of the design language.

### BUILD 1: The Dashboard

This is the product. This is where users live. This is what matters more than any marketing page.

You are building a **design prototype** — a static HTML/CSS/JS mock that demonstrates the visual language, interaction patterns, and data presentation. This is NOT a functional dApp. No wallet connections. No blockchain calls. No RPC. Pure frontend with hardcoded mock data.

**What it contains:**

**Header & navigation** — site-wide nav, consistent with the component library. Shows a mock wallet connection state: `0x1a2B...3c4D`, chain indicator, wallet avatar.

**Summary stats bar** — total approvals, at-risk count, estimated value exposed. Mock numbers. This is the user's security posture at a glance.

**The approval table** — 7 rows of hardcoded mock data. This is the heart of the product. Each row:
- Spender address (truncated, monospace)
- Token name + small icon/identifier
- Approved amount (mix of specific amounts and "Unlimited")
- Risk badge: Low (✓ green), Medium (⚠ amber), High (▲ orange), Critical (✕ red) — **colour + icon + label, always.** Never colour alone.
- Chain indicator (which network)
- Last interaction timestamp
- Checkbox for batch selection
- Individual revoke button (ghost/destructive style)

Row hover state. Selected state (checkbox active). The table must be scannable at a glance — a user should understand their risk exposure in under 3 seconds.

**Chain filter pills** — Ethereum, Polygon, Arbitrum, Base, Optimism, Avalanche, and "All." Clicking filters the mock data client-side. Active pill gets the primary treatment. The filter is instant — no loading state for mock data.

**Batch action toolbar** — appears when 1+ rows are selected. Shows count ("3 selected"), "Revoke Selected" button. The revoke button fires: `alert('Transaction would revoke: ' + selectedIds.join(', '))`. That's it. No wallet code.

**Time Machine** — a toggle/switch with distinctive styling (this is a differentiator feature — treat it like one). When activated:
- Visual mode shift (subtle background change, label update)
- The highest-risk rows disappear or dim
- Summary stats recalculate
- A "Simulated" badge appears
- Toggling off restores the original state

This should feel like a *power feature* — something that makes a user go "oh, that's smart."

**Empty state** — when all chain filters exclude all rows, show a designed empty state. Not a generic "no results." Something that feels intentional and on-brand.

**Responsive** — works at 375px (mobile), 768px (tablet), 1280px+ (desktop). The table adapts: on mobile, rows might become cards or a condensed list. The council decides the responsive strategy — but it must feel considered, not collapsed.

---

### BUILD 2: The Pricing Component

A standalone interactive component that proves the design system works for marketing content.

**What it contains:**

**Three tier cards** — Free, Pro ($9.99/mo), Sentinel ($49.99/mo). Pro gets a "Most Popular" badge. Each card: tier name, price, short description, feature list with checkmarks/crosses, CTA button.

Button hierarchy: ghost/secondary for Free, primary for Pro, secondary/outlined for Sentinel. The eye goes to Pro first.

**Monthly ↔ Yearly toggle** — switching to yearly recalculates prices (show a savings badge: "Save 20%" or equivalent). The toggle animation should feel satisfying — Idris's domain.

**Feature comparison table** — below the cards. All features listed with check/cross per tier. Tooltips on hover for features that need explanation (e.g., "Time Machine" → brief description).

**Responsive** — cards stack vertically on mobile, horizontal row on desktop. Comparison table scrolls horizontally on mobile or collapses to an accordion.

---

### SPECIFY (no code) — everything else

For every other page, provide a written spec:

1. **Homepage** — full section-by-section wireframe. Copy direction (actual headlines, not placeholders). Image needs (search strings + fallback CSS). Mobile behaviour. Scroll animation notes. This should read like a blueprint a developer could build from tomorrow.

2. **Features page** — how each feature is showcased. Component references. The features page should NOT be a wall of text — it should demonstrate the features visually where possible.

3. **Docs hub + template** — navigation structure, content layout, code block styling, search behaviour.

4. **Blog listing + post template** — card layout, typography for long-form reading, image treatment.

5. **Contact, Settings, Account, Token Discovery** — structural specs with component references.

6. **404 page** — this is a brand moment. Design it like one.

7. **Any new pages the council recommends** (About/Team, Changelog, API docs).

---

## TECHNICAL RULES (non-negotiable)

### Stack
- **Vanilla HTML5 + CSS3 + ES6+ JavaScript.** No React. No Vue. No framework. The code runs by opening the HTML file. A developer looks at it and understands it immediately.
- Each build is a **single HTML file** with inline `<style>` and `<script>`. Self-contained. Portable. Reviewable.

### Tokens
- **CSS custom properties for everything.** Paste the token values from the Handbook into a `:root` block. Every colour, spacing value, font, shadow, radius, and motion curve references a variable. No hardcoded values anywhere in the component CSS.

### Layout
- **CSS Grid + Flexbox.** No external libraries. No Bootstrap. No Tailwind in the build (Tailwind is fine in production — but the mock demonstrates the raw design system).
- **Mobile-first.** Base styles are mobile. `@media (min-width: ...)` for tablet and desktop.

### Animation
- **CSS `transition` and `transform` only.** No JavaScript animation libraries. JS handles class toggling and state changes; CSS handles the visual transitions.
- **`prefers-reduced-motion` at the root of every file:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Mock Data
- Defined in a `<script>` block as a `const` array. Realistic data: real-looking Ethereum addresses, real token names (USDC, WETH, DAI, UNI, LINK, AAVE, etc.), plausible amounts, varied risk levels, different chains. **Not lorem ipsum. Not "Token A, Token B."**

### Accessibility
- All interactive elements keyboard-accessible
- ARIA labels on every non-semantic control
- Colour is NEVER the sole indicator (always paired with icon + label)
- Focus styles: visible, on-brand, obvious
- Reduced motion: respected (see above)
- Semantic HTML: `<table>` for tabular data, `<button>` for buttons, `<nav>` for nav

### Images
- Claude has access to image search. Use it for real Unsplash/Pexels photos where needed.
- Every `<img>`: `loading="lazy"`, `decoding="async"`, meaningful `alt` text
- CSS `aspect-ratio` to prevent layout shift
- Provide a CSS fallback gradient for every image (visible during load)

### Performance (for the static mock)
These are trivially achievable for static HTML — hold the bar:
- LCP < 0.5s
- INP < 50ms
- CLS < 0.01

### Code Quality
- Clean, commented, well-structured
- Meaningful class names (BEM or equivalent)
- Logical source order
- The code itself should feel engineered. A developer reading it should think: "this person cares."

---

## PAGE SPEC FORMAT

For every page specified (not built), use this structure:

```
## [Page Name] — [one-line purpose]

### Narrative Role
[What story does this page tell in the overall site narrative?]

### Sections (top to bottom)
1. [Section name]
   - Layout: [description]
   - Components: [references from Phase 4]
   - Copy direction: [actual headlines, body copy direction]
   - Image: [subject | mood | search string | fallback CSS]
   - Animation: [scroll trigger, entrance, hover behaviour]
   - Mobile: [what changes]

2. [Next section...]

### Key Design Decisions
[What makes this page distinctive? What would make someone screenshot it?]

### Interactions
[Detailed interaction notes — what happens on scroll, click, hover, filter]
```

---

## EXECUTION ORDER

1. **Phase 5: Page specs** — all pages specified in the format above. Start with homepage (the brand statement), then dashboard (the product), then the rest.

2. **Phase 6: Implementation notes** — tech stack recommendation for production (keep Next.js or migrate?), production performance targets, asset strategy, CSS architecture, SEO, analytics. Brief and actionable.

3. **Phase 7: Build the dashboard.** Full working HTML file. Use all the skills — frontend-design, image search, file creation. Output it as a downloadable file.

4. **Then: Build the pricing component.** Same standard. Single HTML file.

5. **Then: Remaining page specs** for any pages not yet covered.

---

## RULES

1. **Tokens are law.** Every value comes from the Handbook. No ad-hoc numbers. If a value is missing, flag it and propose an addition — but don't invent a one-off.

2. **The code IS the design.** This isn't a rough draft. The HTML file, when opened in a browser, should make someone pause and say "this is a serious product." Every hover state. Every transition. Every responsive breakpoint. Polished.

3. **Cite your references.** When making a decision in code: "Linear's table density," "Stripe's toggle animation," "Vercel's dark surface layering." Show your taste.

4. **Noor has veto.** If it's not keyboard-accessible, if colour is the only indicator, if focus states are missing — it doesn't ship. Fix it first.

5. **The screenshotability test.** Would someone open this dashboard, screenshot it, and post it saying "look at this"? Would a designer see the pricing component and study how it's built? If not — iterate until yes.

6. **Use image search.** Claude has the image search tool available. Use it. Real photography, not described photography. Also provide fallback CSS for every image.

---

## GO

1. Paste the **Design Tokens Handbook** from Part 1.
2. Say: **"Council, the tokens are set. Go."**
3. The council delivers page specs (Phase 5), implementation notes (Phase 6), then builds the dashboard and pricing component (Phase 7).
4. For the builds, ask Claude to output the HTML files using file creation tools so you can download and open them directly.

---

*Part 2 of 2. The language is defined. Now make it real. Build it like the Born Again suit reveal — so good that the old version dies the moment people see the new one.*
