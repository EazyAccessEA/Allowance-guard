# Phase 1: Audit & Deconstruction

> **Council Leads:** Sable (IA & UX) & Kael (Systems & Components)
> **Contributors:** All six architects

---

## 1. PuredgeOS — Post-Mortem

### What It Tried to Solve (Valid Goals)
- **Readability**: 8th-grade reading level microcopy, clean sans-serif typography
- **Cognitive accessibility**: Maximum 3 visual hierarchy levels, 5-second comprehension rule
- **System feedback**: Immediate response to user actions, loading states
- **Information hierarchy**: Intentional visual weight distribution

### Where It Failed

| Goal | PuredgeOS Approach | Outcome |
|------|-------------------|---------|
| Readability | Generic Inter/Satoshi pairing, standard weights | Readable but forgettable — could be any SaaS product |
| Low cognitive load | Safe muted palette, #00C2B3 teal at conservative saturation | Zero emotional conviction — projects no authority |
| Convention = comfort | Standard hero → stats → features → CTA → footer | Convention = invisible. Users can't recall the site 5 minutes later |
| Reliability | Standard card grids, standard pricing tables, standard FAQ | Functional, interchangeable with 10,000 other products |
| "Don't distract" | Minimal-to-zero motion, no scroll animation | Site feels static, unengineered, lifeless |
| "Clarity-first" | Zero photography, zero illustration, text-only | Flat, textureless, no emotional impact |

**The Core Failure:** PuredgeOS treats design as **information delivery**. The redesign treats design as **identity expression** that delivers information. Both achieve clarity — only one is memorable.

### Inherited Naming Confusion
The codebase carries three naming layers simultaneously:
- **PuredgeOS names**: `.fireart-button`, `.fireart-card`, `.fireart-input` (in globals.css)
- **Mobbin names**: `.mobbin-card`, `.mobbin-hover-lift`, `.mobbin-focus-ring` (in Tailwind safelist)
- **Semantic names**: `--color-primary`, `--shadow-focus` (in tokens.ts)

This triple-naming creates confusion. The new system uses **one naming convention** — semantic tokens only.

---

## 2. Component & Pattern Catalogue

### Current Component Inventory (src/components/ui/)

| Component | Variants | States | Issues |
|-----------|----------|--------|--------|
| Button | 11 variants (primary, secondary, ghost, destructive, outline, link, success, warning, info, subtle, accent) | loading, disabled, focused | Over-engineered — 11 variants is decision fatigue. Most pages use 2-3. |
| Card | 12 variants (default, elevated, outlined, ghost, success, warning, danger, info, subtle, accent, glass, glass-accent) | interactive, hover | Bloated. Glass variants are used in 1-2 places. |
| Badge | 8 base + 3 specialized (StatusBadge, RiskBadge, ChainBadge) | removable, interactive | Good specialization for the domain, but base variants overlap |
| Alert | 7 variants | dismissible, priority levels | Reasonable |
| Input | 2 variants, 4 states | error, success, warning | Clean |
| Modal | 1 variant | — | Needs focus trap improvements |
| Heading | 3 variants (H1, H2, H3) | — | Too few — no display or caption level |

### Dashboard Components

| Component | Purpose | Issues |
|-----------|---------|--------|
| AppArea | Main dashboard layout (sidebar + content) | Sidebar is 33% width on desktop — too wide for its content |
| AllowanceTable | Token approval list with bulk actions | Card layout on mobile is good. Desktop table lacks visual density hierarchy |
| WalletSecurity | Security score with radial gauge | Gauge is functional but generic. No distinctive visual treatment |

### Page-Level Patterns

| Pattern | Where Used | Issue |
|---------|-----------|-------|
| Hero + Stats + Features + CTA | Homepage | Generic SaaS template. Nothing memorable |
| Video background hero | Features, Contact, FAQ, Settings | Overused. 4 pages with video hero = diminishing impact |
| Tab navigation | Docs, Dashboard | Functional but unstyled — no active state energy |
| Accordion FAQ | Pricing, FAQ, Docs | Standard. No interaction delight |
| Card grid (3-col) | Pricing, Features, Contact, Account | Reliable but visually identical everywhere |

---

## 3. Information Architecture Critique

### Navigation Inconsistencies
- **Desktop header**: Scan, Features, Pricing, Docs, Blog
- **Mobile menu**: Home, Blog, Documentation, Discover Tokens, Features, Settings
- **These don't match.** Mobile has Settings and Tokens; desktop doesn't. Desktop has Pricing and Scan; mobile doesn't.

### Competing CTAs
- "Connect Wallet" (primary action — the product)
- "Upgrade" (revenue action — the business)
- These compete for attention. The user's primary intent (scan my wallet) and the business intent (upgrade) fight for the same visual weight.

### Content Duplication
- Stats (50K+ wallets, 2M+ approvals) appear in both hero and "Trusted by" section
- Feature descriptions repeat between Features page and Docs
- Pricing details exist on /pricing AND /account/billing

### Structural Issues
- Footer differs between pages (inconsistent sections)
- Docs sidebar navigation doesn't match docs page tab navigation
- Settings page requires wallet connection but doesn't communicate this until after navigation

---

## 4. User Task Analysis

### Tasks That Are Currently Hard or Slow

| Task | Problem | Severity |
|------|---------|----------|
| Understanding risk at a glance | Risk badges use color + icon but table density makes scanning hard | High |
| Finding the revoke button on mobile | Card layout buries the action below the fold of each card | High |
| Switching chains | Chain filter exists but is not prominent in the dashboard | Medium |
| Understanding what "Time Machine" does | Feature is mentioned but not visually differentiated from other features | Medium |
| Knowing which plan gives which feature | Must scroll between pricing cards — no side-by-side at mobile | Medium |
| First-time scan experience | Connect wallet → scan → wait → results. Loading state is generic | Low |

---

## 5. Visual Identity Assessment

### What Does a Visitor Remember After Leaving?
**Answer: Nothing.**

- No signature color (teal is everywhere in Web3)
- No signature typeface (Inter + Satoshi = invisible)
- No signature interaction (no distinctive hover, scroll, or transition pattern)
- No signature visual element (no motif, no pattern, no recurring shape)
- The AG shield logo is the closest to a brand asset but it's small, muted, and generic

### The Logo
The AG shield has potential — shields = security = on-brand. But the current execution is:
- Low contrast
- Soft geometry
- No brand color assertion
- Could be any fintech logo

**Council recommendation:** Evolve the shield. Sharpen geometry. Apply the new primary color at full saturation. Add the visual signature element (see Phase 3).

---

## 6. Gap Analysis: Current State vs. "Design With Conviction"

| Dimension | Current | Target | Gap |
|-----------|---------|--------|-----|
| Color conviction | Muted teal, safe neutrals | Full-saturation brand color that declares identity | Large |
| Typography character | Generic sans-serif pairing | Display type that feels like a declaration | Large |
| Motion & interaction | Near zero | Choreographed, purposeful, impossible to ignore | Large |
| Visual signature | None | One recurring motif on every page | Total |
| Layout aggression | Standard vertical scroll | Purposeful grid breaks, spatial contrast | Medium |
| Dashboard identity | Functional table | World-class data visualization with brand conviction | Large |
| Risk communication | Color badges | Multi-signal (color + icon + label + position) | Small |
| Empty states | Generic "no results" | Designed, on-brand moments | Medium |
| Imagery | Zero | Editorial, art-directed, or confident abstraction | Total |
| Brand recall | Zero | "Oh, that's AllowanceGuard" within 3 seconds | Total |
