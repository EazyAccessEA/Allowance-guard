# Phase 4: Component Library

> **Council Leads:** Kael (Systems) & Idris (Interaction)
> **Reviewers:** Noor (Accessibility) & Thane (Performance)

---

## Component Specification Format

Each component specifies: visual design (all states), responsive behaviour, animation, accessibility, and implementation notes.

---

## 1. Navigation: Header

### Visual Design
- **Height:** 64px desktop, 56px mobile
- **Position:** Fixed top, `z-index: 1030`
- **Background:** `var(--bg-surface)` with `backdrop-filter: blur(12px)` — glass effect
- **Border:** 1px bottom border `var(--color-neutral-800)` (dark) / `var(--color-neutral-200)` (light)
- **Logo:** AG shield, primary colour, left-aligned
- **Nav links:** `--text-body-sm`, weight 500, `--color-neutral-400` default, `--color-primary-500` active
- **Active indicator:** 2px bottom line in primary colour with `--ease-default` transition

### States
- **Default:** Semi-transparent background
- **Scrolled:** Increased opacity, subtle shadow `--shadow-sm`
- **Hover (links):** Color shifts to `--color-neutral-100` (dark) / `--color-neutral-900` (light), `--duration-fast`
- **Active (current page):** Primary colour text + underline indicator

### Responsive
- **Desktop (≥1024px):** Full horizontal nav, actions on right
- **Tablet (768-1023px):** Hamburger menu, logo + primary CTA only
- **Mobile (<768px):** Hamburger menu, logo only, full-screen overlay menu

### Animation
- Scroll transition: `background-color` and `border-color` over `--duration-base`
- Mobile menu: Overlay slides in from right, `--duration-medium`, `--ease-default`
- Nav links: Staggered fade-up entrance on mobile menu open, `--stagger-delay: 50ms`

### Accessibility
- `<nav aria-label="Main navigation">`
- Hamburger: `aria-expanded`, `aria-controls`
- Mobile menu: Focus trap when open, ESC to close
- Skip-to-content link as first focusable element
- All interactive elements ≥44px touch target

---

## 2. Navigation: Mobile Menu

### Visual Design
- **Background:** `var(--bg-primary)` full-screen overlay
- **Close button:** Top-right, 44×44px touch target
- **Nav items:** `--text-h3` size, stacked vertically, `--space-6` gap
- **CTA:** Full-width primary button at bottom
- **Social links:** Icon row at bottom, `--color-neutral-500`

### States
- **Open:** Visible, body scroll locked
- **Closed:** Hidden, body scroll restored

### Animation
- Backdrop: Fade in `--duration-base`
- Nav items: Staggered slide-right, `--stagger-delay`, `--ease-default`
- Close: Reverse of open, `--duration-fast`

### Accessibility
- Focus trap: Tab cycles within menu
- ESC key closes
- `aria-modal="true"`, `role="dialog"`
- Return focus to hamburger button on close

---

## 3. Navigation: Footer

### Visual Design
- **Background:** `var(--color-neutral-950)` (always dark, both modes)
- **Text:** `var(--color-neutral-400)` body, `var(--color-neutral-100)` headings
- **Layout:** 4-column grid (logo + 3 link groups), single column on mobile
- **Divider:** The Slash — diagonal `clip-path` separating footer from content
- **Bottom bar:** Copyright, legal links, `--text-caption`

### Columns
1. **Brand:** Logo, one-line description, social icons (GitHub, Discord, X)
2. **Product:** Features, Pricing, Docs, Blog, Changelog
3. **Company:** About, Contact, Networks, Tokens
4. **Legal:** Terms, Privacy, Cookies, SLA, Refund, DPA

### Responsive
- Desktop: 4 columns
- Tablet: 2×2 grid
- Mobile: Single column, collapsible sections (animated accordion)

### Accessibility
- `<footer role="contentinfo">`
- External links: `rel="noopener noreferrer"`, `aria-label` with "opens in new tab"
- Collapsible sections: `aria-expanded`, `aria-controls`

---

## 4. Hero Sections

### Variant A: Homepage Hero
- **Height:** `min-height: 90svh`
- **Background:** Dark topology mesh image + gradient overlay
- **Headline:** `--text-display`, `--font-display`, white text
- **Subheadline:** `--text-body-lg`, `--color-neutral-400`
- **CTA:** Primary button (large) + Ghost button
- **Trust bar:** Stats row below CTA: "50K+ Wallets · 2M+ Approvals · 10 Chains"
- **The Slash:** Large diagonal composition line (135deg) in primary colour at 10% opacity

### Variant B: Page Hero
- **Height:** `auto`, padding `--space-section-md` top/bottom
- **Background:** `var(--bg-secondary)`
- **Headline:** `--text-h1`
- **Subheadline:** `--text-body-lg`, `--color-neutral-500`
- **Breadcrumb:** Above headline, `--text-caption`

### Animation
- Homepage: Headline fades up on load, stats stagger in, CTA fades up last
- Page hero: Simple fade-up, `--duration-medium`

### Accessibility
- Headline: `<h1>`, single per page
- Background images: `role="presentation"`, decorative
- CTA buttons: Descriptive text, no "Click here"

---

## 5. Buttons

### Variants (reduced from 11 to 5)

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| **Primary** | `--color-primary-500` | `--color-neutral-950` | none | Primary actions (Connect, Scan, Upgrade) |
| **Secondary** | transparent | `--color-primary-500` | 1px `--color-primary-500` | Secondary actions (View Docs, Learn More) |
| **Ghost** | transparent | `--color-neutral-400` | none | Tertiary actions (Cancel, Back) |
| **Destructive** | `--color-error-500` | white | none | Dangerous actions (Revoke, Delete) |
| **Outline** | transparent | `--color-neutral-300` | 1px `--color-neutral-700` | Neutral actions (Filter, Sort) |

### Sizes

| Size | Height | Padding (h) | Font Size | Radius |
|------|--------|-------------|-----------|--------|
| **sm** | 32px | 12px | `--text-caption` | `--radius-sm` |
| **md** | 40px | 16px | `--text-body-sm` | `--radius-sm` |
| **lg** | 48px | 24px | `--text-body` | `--radius-sm` |
| **xl** | 56px | 32px | `--text-body-lg` | `--radius-md` |

### States
- **Default:** As specified per variant
- **Hover:** Brightness +10%, The Slash diagonal gradient sweep (primary variant only), `--duration-fast`
- **Active/Pressed:** Scale 0.97, `--duration-fast`, `--ease-aggressive`
- **Focus:** `--shadow-focus` ring (2px gap, 2px ring in primary colour)
- **Disabled:** Opacity 0.4, `cursor: not-allowed`, no transitions
- **Loading:** Text replaced with spinner (16px), same dimensions, `aria-busy="true"`

### Animation
- Hover: `background-position` shift for gradient sweep, `--duration-base`
- Press: `transform: scale(0.97)`, `--duration-fast`, `--ease-aggressive`
- Loading spinner: Continuous rotation, 800ms, linear

### Accessibility
- `<button>` element always (never `<div>` or `<a>` styled as button)
- `aria-disabled` when disabled (not just HTML `disabled`)
- Loading: `aria-busy="true"`, `aria-label` updates to "Loading..."
- Minimum touch target: 44×44px (sm variant uses padding to meet this)

---

## 6. Cards

### Variants (reduced from 12 to 4)

| Variant | Background | Border | Shadow | Use Case |
|---------|-----------|--------|--------|----------|
| **Default** | `--bg-secondary` | 1px `--color-neutral-800` | `--shadow-sm` | General content |
| **Elevated** | `--bg-tertiary` | none | `--shadow-md` | Featured content, pricing |
| **Glass** | `--bg-surface` | 1px `rgba(255,255,255,0.1)` | `--shadow-sm` | Overlays, nav panels |
| **Interactive** | `--bg-secondary` | 1px `--color-neutral-800` | `--shadow-sm` | Clickable cards, links |

### States
- **Default:** As specified
- **Hover (interactive):** Border brightens to `--color-neutral-600`, shadow elevates to `--shadow-md`, `translateY(-2px)`, `--duration-base`
- **Focus (interactive):** `--shadow-focus` ring
- **Active:** Scale 0.99, `--duration-fast`

### Subcomponents
- **CardHeader:** Padding `--space-card-md`, bottom border optional
- **CardTitle:** `--text-h4`, `--font-heading`
- **CardDescription:** `--text-body-sm`, `--color-neutral-500`
- **CardContent:** Padding `--space-card-md`
- **CardFooter:** Padding `--space-card-md`, top border, flex row

### Animation
- Entrance: Fade-up, staggered in grids (`--stagger-delay`)
- Hover: `transform` + `box-shadow` transition, `--duration-base`, `--ease-default`

### Responsive
- Padding reduces to `--space-card-sm` on mobile
- Cards stack to single column below `--bp-md`

### Accessibility
- Interactive cards: `role="link"` or wrapping `<a>`, `tabindex="0"`
- Card title: Appropriate heading level in document flow
- Focus: Visible ring on the card boundary

---

## 7. Data Display: Risk Badges

### Levels (colour is NEVER the sole indicator)

| Level | Colour | Icon | Label | Background |
|-------|--------|------|-------|-----------|
| **Low** | `--color-risk-low` | ✓ (Check) | "Low" | `rgba(34, 197, 94, 0.1)` |
| **Medium** | `--color-risk-medium` | ⚠ (AlertTriangle) | "Medium" | `rgba(245, 158, 11, 0.1)` |
| **High** | `--color-risk-high` | ▲ (TrendingUp) | "High" | `rgba(249, 115, 22, 0.1)` |
| **Critical** | `--color-risk-critical` | ✕ (X) | "Critical" | `rgba(239, 68, 68, 0.1)` |

### Visual Design
- **Shape:** Pill (`--radius-full`), height 24px
- **Typography:** `--text-caption`, weight 600
- **Layout:** Icon (14px) + 4px gap + label text
- **Padding:** 6px horizontal, 2px vertical

### States
- **Default:** As specified
- **Critical pulse:** Subtle glow animation on critical badges, 3s cycle (respects reduced-motion)

### Accessibility
- `role="status"` with `aria-label="Risk level: [level]"`
- Icon: `aria-hidden="true"` (label carries the meaning)
- Not colour-dependent: icon + label always present

---

## 8. Data Display: Approval Table

### Desktop Layout (≥1024px)
Full `<table>` with columns:
1. **Checkbox** — 40px, centered
2. **Token** — icon + name + symbol, flex row
3. **Spender** — truncated address (monospace), copy button on hover
4. **Amount** — number or "Unlimited" badge (amber)
5. **Risk** — RiskBadge component
6. **Chain** — ChainBadge (icon + name)
7. **Last Active** — relative time ("3d ago")
8. **Action** — Revoke button (destructive ghost, sm)

### Mobile Layout (<1024px)
Cards replace table. Each card shows:
- **Top row:** Token icon + name + Risk badge
- **Middle:** Spender (truncated), Amount, Chain
- **Bottom:** Last active + Revoke button (full width)
- Checkbox: Top-right corner of card

### Row States
- **Default:** `--bg-secondary` background
- **Hover:** `--bg-tertiary`, `--duration-fast`
- **Selected:** Primary colour left border (4px), `--bg-primary` tint at 5%
- **Revoking:** Pulsing opacity, revoke button shows spinner
- **Revoked:** Strikethrough text, muted colours, fade out after 2s

### Header
- Sticky header row with sort indicators
- Background: `--bg-tertiary`

### Empty State
- Centered icon (shield-check, 48px, `--color-primary-500`)
- Headline: "All Clear" (`--text-h3`)
- Body: "No active approvals found for this wallet." (`--text-body`, `--color-neutral-500`)
- CTA: "Scan Another Wallet" button

### Accessibility
- `<table>` with `<thead>`, `<tbody>`, `<th scope="col">`
- Sortable columns: `aria-sort="ascending|descending|none"`
- Checkbox: `aria-label="Select [token] approval for [spender]"`
- Revoke button: `aria-label="Revoke [token] approval for [spender]"`
- Row selection announced via `aria-selected`

---

## 9. Chain Filter Pills

### Visual Design
- **Layout:** Horizontal scroll on mobile, flex-wrap on desktop
- **Pill shape:** `--radius-full`, height 36px, padding 12px horizontal
- **Default:** `--bg-tertiary`, `--color-neutral-400`
- **Active:** `--color-primary-500` background, `--color-neutral-950` text
- **"All" pill:** First in row, always visible

### States
- **Default:** As above
- **Hover:** `--bg-elevated`, `--duration-fast`
- **Active:** Primary fill, dark text, `--shadow-glow-sm`
- **Focus:** `--shadow-focus` ring

### Animation
- Active transition: Background colour + glow, `--duration-fast`, `--ease-aggressive`
- Filter result: Table rows fade-out/in, `--duration-base`

### Accessibility
- `role="radiogroup"`, `aria-label="Filter by chain"`
- Each pill: `role="radio"`, `aria-checked`
- Keyboard: Arrow keys to navigate, Space/Enter to select

---

## 10. Batch Action Toolbar

### Visual Design
- **Position:** Sticky bottom of viewport when 1+ rows selected
- **Background:** `--bg-elevated` with `backdrop-filter: blur(12px)`
- **Height:** 64px
- **Content:** "[N] selected" label + "Deselect All" ghost button + "Revoke Selected" destructive button
- **Border:** 1px top `--color-neutral-700`
- **Shadow:** `--shadow-lg` upward

### States
- **Hidden:** No rows selected — toolbar not rendered
- **Visible:** Slides up from bottom, `--duration-medium`, `--ease-default`
- **Revoking:** "Revoke Selected" shows progress ("Revoking 2/5..."), disabled until complete

### Animation
- Entrance: `translateY(100%) → translateY(0)`, `--duration-medium`
- Exit: Reverse, `--duration-fast`

### Accessibility
- `role="toolbar"`, `aria-label="Batch actions"`
- Announced via `aria-live="polite"` when appearing/count changes
- Keyboard: Tab to navigate between buttons

---

## 11. Time Machine Toggle

### Visual Design (This is a differentiator — distinctive treatment)
- **Container:** Card with `--bg-tertiary`, The Slash diagonal accent line in primary colour
- **Toggle:** Custom switch, 48px × 24px, `--radius-full`
- **Off state:** `--color-neutral-700` track, `--color-neutral-400` thumb
- **On state:** `--color-primary-500` track, white thumb, `--shadow-glow-sm` on track
- **Label:** "Time Machine" in `--text-h4`, `--font-heading`
- **Description:** "Simulate revocations before committing" in `--text-body-sm`
- **Active indicator:** "SIMULATED" badge appears (accent colour, pulsing glow)

### States
- **Off:** Default dashboard view
- **On:** Visual mode shift:
  - Background subtly shifts hue (overlay with primary at 3% opacity)
  - High-risk rows dim (opacity 0.4)
  - Summary stats recalculate (animated number transition)
  - "SIMULATED" badge appears top-right
- **Transitioning:** Toggle slides, stats count up/down

### Animation
- Toggle: Thumb slides, `--duration-fast`, `--ease-bounce`
- Mode shift: Background cross-fade, `--duration-medium`
- Stats: Number count animation, `--duration-slow`
- Badge entrance: Scale-in + glow pulse

### Accessibility
- `role="switch"`, `aria-checked`, `aria-label="Toggle Time Machine simulation"`
- Announced: "Time Machine enabled/disabled" via `aria-live`
- Keyboard: Space to toggle

---

## 12. Pricing: Tier Cards

### Layout
- **Desktop:** 3-column grid, Pro card elevated (scaled 1.02, higher shadow)
- **Mobile:** Stacked, Pro card first (re-ordered via `order`)

### Card Structure
- **Header:** Tier name (`--text-h3`), price (`--text-h1` for number, `--text-body-sm` for period)
- **Badge:** "Most Popular" on Pro (accent colour, pill shape)
- **Description:** One line, `--text-body-sm`, `--color-neutral-500`
- **Feature list:** Checkmarks (green) / crosses (neutral-600), `--text-body-sm`
- **CTA:** Full-width button at bottom (ghost for Free, primary for Pro, secondary for Sentinel)

### Billing Toggle
- **Position:** Centered above cards
- **Design:** "Monthly" | toggle | "Yearly" with "Save 20%" badge (accent)
- **Animation:** Toggle slides, prices cross-fade with number animation

### Accessibility
- Cards: `role="region"`, `aria-labelledby` pointing to tier name
- Feature checks/crosses: `aria-label="Included"` / `aria-label="Not included"`
- Toggle: `role="switch"`, `aria-label="Toggle yearly billing"`
- "Most Popular": `aria-label` on the card includes this designation

---

## 13. Forms: Inputs

### Visual Design
- **Height:** 40px (md), 36px (sm), 44px (lg)
- **Background:** `--bg-primary`
- **Border:** 1px `--color-neutral-700` (dark) / `--color-neutral-300` (light)
- **Radius:** `--radius-sm`
- **Text:** `--text-body`, `--font-body`
- **Placeholder:** `--color-neutral-500`
- **Label:** `--text-body-sm`, weight 500, `--space-1.5` margin bottom

### States
- **Default:** As above
- **Focus:** Border `--color-primary-500`, `--shadow-focus`
- **Error:** Border `--color-error-500`, error message below in `--text-caption` red
- **Disabled:** Opacity 0.5, no interaction

### Accessibility
- `<label>` always linked via `for`/`id`
- Error: `aria-invalid="true"`, `aria-describedby` pointing to error message
- Required: `aria-required="true"`

---

## 14. Feedback: Toasts

### Visual Design
- **Position:** Top-right, 16px from edges
- **Width:** 360px max, auto min
- **Background:** `--bg-elevated`
- **Border:** 1px, colour varies by type (success/error/warning/info)
- **Left accent:** 3px left border in semantic colour
- **Content:** Icon + title + message + dismiss X
- **Radius:** `--radius-md`

### Types
- **Success:** Green left border, check icon
- **Error:** Red left border, X icon
- **Warning:** Amber left border, alert-triangle icon
- **Info:** Blue left border, info icon

### Animation
- Entrance: Slide in from right + fade, `--duration-medium`, `--ease-default`
- Exit: Fade out + slide right, `--duration-fast`
- Auto-dismiss: 5s (can be disabled)
- Stack: Multiple toasts stack vertically with `--space-2` gap

### Accessibility
- `role="alert"` for errors, `role="status"` for others
- `aria-live="assertive"` for errors, `aria-live="polite"` for others
- Dismiss button: `aria-label="Dismiss notification"`
- Auto-dismiss respects `prefers-reduced-motion` (paused while hovered)

---

## 15. Layout Primitives

### Container
- `max-width: var(--container-xl)` (1280px)
- `padding: 0 var(--space-6)` desktop, `0 var(--space-4)` mobile
- Centered with `margin: 0 auto`

### Section
- Padding: `var(--space-section-md) 0` default
- Variants: sm (48px), md (80px), lg (128px)

### Stack
- Vertical flex with configurable gap
- Default gap: `--space-4`

### Grid
- CSS Grid, 12-column
- Gap: `--space-6` desktop, `--space-4` mobile

### Divider
- Default: 1px line `--color-neutral-800`
- Slash variant: Diagonal `clip-path` divider (The Slash signature)

---

## 16. Loading Skeletons

### Visual Design
- **Shape:** Matches the element being loaded (rectangle for text, circle for avatars, etc.)
- **Background:** `--color-neutral-800` (dark) / `--color-neutral-200` (light)
- **Animation:** Shimmer — diagonal gradient sweep (The Slash angle, 135deg), 1.5s, infinite
- **Radius:** Matches the component's radius

### Dashboard Skeleton
- Header bar: 2 rectangles (title + actions)
- Stats row: 4 equal rectangles
- Table: Header row + 5 body rows (varied widths per column)
- Sidebar: 3 card-shaped rectangles

### Accessibility
- `aria-busy="true"` on loading container
- `aria-label="Loading content"` on skeleton wrapper
- Screen readers: "Loading" announced once, not per element
