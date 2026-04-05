# AllowanceGuard — Design Council: Phase 3 Design Language

> The definitive visual language specification. Every surface, every interaction, every typographic choice.

---

## 1. Visual Identity

### Core Aesthetic

AllowanceGuard is a **dark-first, data-dense security tool**. The visual language draws from:

- **Linear** — table density, keyboard-first interactions, minimal chrome
- **Vercel** — dark surface layering, subtle glass effects, clean navigation
- **Stripe** — data clarity, typography precision, trustworthy simplicity

### Brand Anchors

| Element | Value | Purpose |
|---------|-------|---------|
| Primary color | Serum Teal `#00C2B3` | Action, brand, focus, trust |
| Dark base | `#0A0E1A` | Primary background — deep, quiet, professional |
| Glass effect | `backdrop-filter: blur(16px)` on `rgba(17,24,39,0.7)` | Elevation, floating UI |
| Typography | Satoshi bold + Inter regular | Authority + readability |
| Monospace | JetBrains Mono | Technical precision (addresses, amounts) |

### What It Is Not

- Not neon/cyberpunk — teal is calm, not electric
- Not busy — whitespace is a feature, not wasted space
- Not playful — this is a security tool, not a social app
- Not skeuomorphic — flat, layered, functional

---

## 2. Typography System

### Heading Hierarchy

| Level | Size (desktop) | Size (mobile) | Weight | Font | Letter Spacing |
|-------|---------------|---------------|--------|------|---------------|
| h1 | 3rem (48px) | 2.25rem (36px) | 700 | Satoshi | -0.035em |
| h2 | 2.25rem (36px) | 1.875rem (30px) | 700 | Satoshi | -0.03em |
| h3 | 1.875rem (30px) | 1.5rem (24px) | 700 | Satoshi | -0.025em |
| h4 | 1.5rem (24px) | 1.25rem (20px) | 600 | Satoshi | -0.02em |
| h5 | 1.25rem (20px) | 1.125rem (18px) | 600 | Satoshi | -0.01em |
| h6 | 1.125rem (18px) | 1rem (16px) | 600 | Satoshi | -0.01em |

### Body Text

| Use Case | Size | Weight | Font | Line Height |
|----------|------|--------|------|-------------|
| Default body | 1rem (16px) | 400 | Inter | 1.5 |
| Small / UI text | 0.875rem (14px) | 400–500 | Inter | 1.375 |
| Caption / label | 0.75rem (12px) | 500 | Inter | 1.25 |
| Button text | 0.875rem (14px) | 600 | Inter | 1.0 |

### Monospace Usage

Use JetBrains Mono for:
- Wallet addresses: `0x1a2B...3c4D`
- Token amounts: `50.0 WETH`
- API keys and hashes
- Code blocks in docs
- Transaction IDs

Size: typically `0.75rem` (12px) or `0.875rem` (14px). Never larger than body text.

### Responsive Scaling

- Base font: 16px on all devices (never reduce below 16px on mobile — prevents iOS zoom)
- Headings scale down by one step on mobile (h1 desktop → h2 size on mobile)
- Line heights stay consistent — only size and weight change

---

## 3. Color Language

### Semantic Color Map

| Color | Token | Meaning | Use For |
|-------|-------|---------|---------|
| **Serum Teal** | `--color-primary-500` | Action, brand, focus | CTAs, links, active states, focus rings |
| **Green** | `--color-success-500` | Safe, confirmed, success | Low risk, tx confirmed, feature included |
| **Amber** | `--color-warning-500` | Caution, attention | Medium risk, expiring approvals |
| **Orange** | `#F97316` | Warning, elevated risk | High risk approvals |
| **Red** | `--color-error-500` | Danger, critical, destructive | Critical risk, revoke actions, errors |
| **Blue** | `--color-info-500` | Informational, neutral | Tips, docs links, info badges |

### Dark Mode Color Application

| Surface | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | `#FFFFFF` | `#0A0E1A` |
| Card/section | `#F8FAFC` | `#111827` |
| Elevated/hover | `#F1F5F9` | `#1E293B` |
| Popover/dropdown | `#FFFFFF` | `#263244` |
| Primary text | `#0F172A` | `#F1F5F9` |
| Secondary text | `#475569` | `#94A3B8` |
| Muted text | `#64748B` | `#64748B` |
| Border default | `#E2E8F0` | `#1E293B` |
| Border visible | `#CBD5E1` | `#334155` |

### The Never-Color-Alone Rule

**Any information conveyed by color MUST also be conveyed by:**
1. An icon (✓, ⚠, ▲, ✕)
2. A text label ("Low", "Medium", "High", "Critical")

This is non-negotiable. Colorblind users represent ~8% of male users.

---

## 4. Surface System

### Background Layers (Dark Mode)

```
Layer 0: Page       → #0A0E1A  (deepest)
Layer 1: Section    → #111827  (cards, table)
Layer 2: Elevated   → #1E293B  (hover, active)
Layer 3: Floating   → #263244  (popovers, dropdowns)
Layer 4: Overlay    → rgba(0,0,0,0.6)  (modal backdrop)
```

Each layer is visually distinct without needing borders (but borders help).

### Card Styles

| Style | Background | Border | Backdrop | Use Case |
|-------|-----------|--------|----------|----------|
| **Solid** | `#111827` | `1px solid #1E293B` | none | Default cards, table container |
| **Glass** | `rgba(17,24,39,0.7)` | `1px solid rgba(71,85,105,0.4)` | `blur(16px)` | Navigation, floating toolbar, stat cards |
| **Outlined** | `transparent` | `1px solid #334155` | none | Secondary cards, feature lists |

### Interactive States

| State | Visual Change |
|-------|--------------|
| **Hover** | Border brightens (`#334155` → `#475569`), subtle bg shift |
| **Active/Pressed** | Scale `0.98`, border to primary color |
| **Selected** | Left border accent `3px solid #00C2B3`, tinted bg `rgba(0,194,179,0.05)` |
| **Disabled** | `opacity: 0.5`, `pointer-events: none` |
| **Focus** | `box-shadow: 0 0 0 3px rgba(0,194,179,0.15)` — visible teal ring |

---

## 5. Component Language

### Button Hierarchy

Buttons are ordered by visual weight. Only ONE primary button per visible context.

| Variant | Background | Border | Text | Use |
|---------|-----------|--------|------|-----|
| **Primary** | `#00C2B3` solid | none | White | Main CTA — one per screen |
| **Secondary** | Transparent | `#334155` | Primary text | Secondary actions |
| **Ghost** | Transparent | none | Secondary text | Tertiary, in-card actions |
| **Destructive** | `#EF4444` solid | none | White | Delete, revoke (confirmation required) |
| **Outline** | Transparent | `#334155` | Primary text | Alternative secondary |

### Badge System

| Badge Type | Purpose | Example |
|-----------|---------|---------|
| **StatusBadge** | Approval status | "Active", "Revoked", "Expired" |
| **RiskBadge** | Risk level (color + icon + label) | "✕ Critical", "✓ Low" |
| **ChainBadge** | Blockchain network | Colored dot + "Ethereum" |

### Table Design

- **Density**: Compact — `12px` vertical padding per cell (Linear-inspired)
- **Header**: Sticky, uppercase `0.75rem`, muted color, bottom border
- **Rows**: Bottom border only (no vertical dividers)
- **Hover**: Subtle background shift to `#1E293B`
- **Selection**: Checkbox + left border accent + tinted background
- **Monospace cells**: Spender addresses, amounts
- **Action column**: Right-aligned, ghost buttons

---

## 6. Data Visualization

### Stat Cards

- Grid layout: 4 columns desktop, 2×2 tablet/mobile
- Glass background with subtle border
- Label: uppercase, `0.75rem`, muted
- Value: heading font, `1.5rem`, bold
- Optional: icon/badge in top-right corner

### Security Score Gauge

- SVG radial gauge (ring chart)
- Track: `#1E293B` (dark surface)
- Fill: `#00C2B3` (primary), proportional to score
- Score number centered: heading font, bold, primary color
- Animated on load (stroke-dashoffset transition, 500ms)

### Chain Indicators

- Small colored dot (8px) + text label
- Colors: Ethereum `#627EEA`, Polygon `#8247E5`, Arbitrum `#28A0F0`, Base `#0052FF`, Optimism `#FF0420`, Avalanche `#E84142`
- Never dot alone — always paired with chain name text

---

## 7. Motion Language

### When to Animate

| Context | Duration | Easing | Example |
|---------|----------|--------|---------|
| Button hover/press | 150ms | `ease` | Background color, scale |
| Toggle switch | 150ms | `ease-spring` | Slider position |
| Modal open | 250ms | `ease-out` | Fade in + slight scale |
| Modal close | 200ms | `ease-in` | Fade out |
| Batch toolbar appear | 250ms | `ease-out` | Slide up + fade in |
| Filter switch | 0ms | instant | Table re-render (no animation) |
| Stats counter | 500ms | `ease-out` | Number transition |
| Gauge fill | 500ms | `ease` | Stroke dashoffset |

### When NOT to Animate

- **Table re-rendering** after filter changes (instant swap)
- **Loading/skeleton states** (use pulse, not movement)
- **Frequent updates** (live price feeds, real-time data)
- **Error states** (show immediately, don't animate in)

### Reduced Motion

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

This is included at the top of every CSS file. Non-negotiable.

---

## 8. Responsive Strategy

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Standard desktops |
| `2xl` | 1536px | Large displays |

### Mobile-First Rules

- Base CSS = mobile layout
- `@media (min-width: ...)` adds desktop enhancements
- Never `@media (max-width: ...)` — that's desktop-first thinking

### Key Responsive Behaviors

| Component | Mobile (< 768px) | Desktop (≥ 1024px) |
|-----------|-------------------|---------------------|
| Navigation | Logo + hamburger | Full pill nav with links + wallet |
| Stat cards | 2×2 grid | 4-column row |
| Approval table | Stacked cards | Full table with columns |
| Filter pills | Horizontal scroll | Static row |
| Pricing cards | Stacked vertical | 3-column with Pro elevated |
| Feature comparison | Horizontal scroll or accordion | Full table |
| Batch toolbar | Full width, bottom-fixed | Centered pill, bottom-fixed |

### Touch Targets

- Minimum: 48×48px for all tappable elements
- Buttons: minimum height `40px` (desktop), `44px` (mobile)
- Checkboxes: 16px visual, 44px tap area (padding)
- Links in body text: adequate line-height for tap isolation

---

## 9. Iconography

### Library

**Lucide React** — consistent, clean, 24px default grid.

### Sizing Rules

| Context | Size | Example |
|---------|------|---------|
| Inline with text | 16px | Feature list checkmarks |
| Inside buttons | 20px | "Revoke" button icon |
| Standalone / stat cards | 24px | Empty state icons |
| Hero / large display | 32–48px | Feature showcases |

### Pairing Rule

Icons are **always** paired with text unless the meaning is universally understood (close ✕, search 🔍). For any domain-specific icon, add a text label or tooltip.

---

## 10. Brand Voice in UI

### Microcopy Principles

- **Confident, not aggressive**: "Revoke approval" not "DELETE THIS NOW"
- **Technical, not jargon-heavy**: "Token approval" not "ERC-20 allowance delegation"
- **Helpful, not condescending**: "No approvals found on Polygon" not "Error: empty result set"

### Empty States

Every empty state includes:
1. A relevant icon (subtle, not oversized)
2. A clear title explaining what's empty
3. A helpful suggestion or action

**Example**: "No approvals found on Base — try scanning a different wallet or switch chains."

### Error Messages

Pattern: **What happened** + **What to do**

- ✅ "Transaction failed — gas price too low. Try increasing gas limit."
- ❌ "Error: 0x3f28a1bc"

### Button Labels

Always action verbs:
- ✅ "Revoke", "Scan Wallet", "Export Report", "Start Trial"
- ❌ "Submit", "OK", "Next", "Click Here"

---

## 11. Page Templates

### Dashboard Layout

```
┌─────────────────────────────────┐
│  [Glass Nav Bar]                │
├─────────────────────────────────┤
│  [Stats Grid: 4 cards]         │
├─────────────────────────────────┤
│  [Chain Filters] [Time Machine] │
├─────────────────────────────────┤
│  [Approval Table]               │
│  ┌──┬───────┬──────┬────┬─────┐ │
│  │☐ │ Token │ Risk │ ...│ Act │ │
│  ├──┼───────┼──────┼────┼─────┤ │
│  │  │ rows  │      │    │     │ │
│  └──┴───────┴──────┴────┴─────┘ │
├─────────────────────────────────┤
│  [Batch Action Toolbar]         │
└─────────────────────────────────┘
```

### Marketing Page Layout

```
┌─────────────────────────────────┐
│  [Glass Nav Bar]                │
├─────────────────────────────────┤
│  [Hero: headline + CTA]        │
├─────────────────────────────────┤
│  [Feature Grid: 3-up cards]    │
├─────────────────────────────────┤
│  [Social Proof / Stats]        │
├─────────────────────────────────┤
│  [Pricing Section]             │
├─────────────────────────────────┤
│  [Final CTA]                   │
├─────────────────────────────────┤
│  [Footer]                      │
└─────────────────────────────────┘
```

### Documentation Layout

```
┌────────┬────────────────────────┐
│ Sidebar│  Content Area          │
│ [Nav]  │  [Breadcrumbs]         │
│        │  [H1 Title]            │
│  TOC   │  [Body + code blocks]  │
│        │  [Prev/Next nav]       │
└────────┴────────────────────────┘
```

---

## 12. Screenshotability Checklist

A page is screenshot-worthy when it passes ALL of these:

- [ ] **Visual hierarchy is instant** — you know where to look in < 1 second
- [ ] **Dark aesthetic is polished** — no gray-on-gray accidents, surfaces are distinct
- [ ] **Data is scannable** — table rows, stat cards, badges tell a story at a glance
- [ ] **Unique interaction** — Time Machine, batch toolbar, gauge — something novel
- [ ] **Typography is tight** — headings are bold and tracked, body is crisp
- [ ] **Spacing is deliberate** — nothing feels cramped or lost in space
- [ ] **Color is purposeful** — teal pops, red warns, green reassures
- [ ] **Glass effects add depth** — nav and stats feel layered, not flat
- [ ] **Responsive is considered** — mobile isn't a broken desktop, it's its own layout
- [ ] **Accessibility is invisible** — focus rings, ARIA labels, skip links — present but unobtrusive

**The test**: Would a designer screenshot this and study how it's built? If not, iterate.
