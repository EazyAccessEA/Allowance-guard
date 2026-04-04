# DESIGN TOKENS HANDBOOK — AllowanceGuard Redesign

> Output of the Design Council, Phases 1–4. This document is the handoff to Part 2 (Build).
> All prior design systems (PuredgeOS) are deprecated. These tokens are the single source of truth.

---

## Brand Principles

1. **Controlled Aggression**: Bold but precise — every element hits hard and serves a purpose. No whisper, no random shout. Every choice is deliberate and pushed to full conviction.
2. **Earned Trust**: Authority through craft and transparency. Open-source code, on-chain stats, ENS identity, and engineering quality ARE the trust signals. No fabricated testimonials.
3. **Relentless Clarity**: Information is power. The user always knows where they are, what they're looking at, what the risk is, and what to do. Achieved through hierarchy and density control, not by stripping away identity.
4. **Tactile Precision**: Surfaces have weight. Interactions have texture. Hover states respond with energy. Transitions feel mechanical and precise. The interface is a precision instrument, not a web page.
5. **Zero Compromise**: Accessibility, performance, and beauty coexist. Trading one for another is failure. Every proposal must pass all three tests.

---

## Colours

### Primary — Electric Teal

```css
--color-primary-50:  #EFFEFA;
--color-primary-100: #C6FFF6;
--color-primary-200: #8AFEED;
--color-primary-300: #4CF5E0;
--color-primary-400: #00E8CF;  /* Hero primary — full conviction, dark surfaces */
--color-primary-500: #00D4BD;  /* Buttons, links, active states */
--color-primary-600: #00B3A0;  /* Hover state */
--color-primary-700: #008F80;  /* Primary text on light backgrounds */
--color-primary-800: #006B60;
--color-primary-900: #004B44;
```

Usage rules:
- Dark backgrounds: use 400 or 500 (glows against dark)
- Light backgrounds: use 700 for text (AA contrast on white)
- Never use 400 for text on light backgrounds (fails contrast)

### Accent — Volt Violet

```css
--color-accent-400: #A78BFA;
--color-accent-500: #8B5CF6;  /* Primary accent — upgrade CTAs, premium badges */
--color-accent-600: #7C3AED;  /* Accent hover */
```

Usage: Sparingly. Upgrade CTAs, "Pro" tier highlights, visual signature moments. This is punctuation, not body text.

### Neutral Scale (Zinc)

```css
--color-neutral-950: #09090B;  /* Deepest background (dark mode) */
--color-neutral-900: #18181B;  /* Card surfaces (dark) */
--color-neutral-800: #27272A;  /* Elevated surfaces, borders (dark) */
--color-neutral-700: #3F3F46;  /* Secondary borders (dark) */
--color-neutral-600: #52525B;  /* Disabled text (dark) */
--color-neutral-500: #71717A;  /* Tertiary text */
--color-neutral-400: #A1A1AA;  /* Secondary text (dark) */
--color-neutral-300: #D4D4D8;  /* Primary text (dark), borders (light) */
--color-neutral-200: #E4E4E7;  /* Borders (light), secondary bg (light) */
--color-neutral-100: #F4F4F5;  /* Secondary background (light) */
--color-neutral-50:  #FAFAFA;  /* Primary background (light) */
--color-white:       #FFFFFF;
```

### Semantic

```css
--color-semantic-success: #22C55E;
--color-semantic-warning: #F59E0B;
--color-semantic-error:   #EF4444;
--color-semantic-info:    #0EA5E9;
```

### Risk Levels

```css
--color-risk-low:      #22C55E;  /* Icon: shield-check,    Label: "Low Risk"    */
--color-risk-medium:   #F59E0B;  /* Icon: alert-triangle,  Label: "Medium Risk" */
--color-risk-high:     #F97316;  /* Icon: alert-octagon,   Label: "High Risk"   */
--color-risk-critical: #EF4444;  /* Icon: x-octagon,       Label: "Critical"    */
```

**Mandatory:** Risk is NEVER communicated by colour alone. Always: colour + icon + text label.

### Background Mode

**Dark-first, dual support.** Dashboard defaults to dark. Marketing pages support both, defaulting to dark.

---

## Typography

### Font Families

```css
--font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
--font-heading: 'Space Grotesk', system-ui, -apple-system, sans-serif;
--font-body:    'Inter', system-ui, -apple-system, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

Self-host all three via `next/font`. Subset to Latin + Latin Extended.
- Space Grotesk: weights 500, 700
- Inter: weights 400, 500, 600
- JetBrains Mono: weight 400 (ligatures disabled for addresses)
- Total font budget: < 120KB

### Scale

| Token | Size | Line Height | Weight | Letter Spacing | Font |
|-------|------|-------------|--------|---------------|------|
| Display | 4.5rem (72px) | 1.05 | 700 | -0.03em | Space Grotesk |
| H1 | 3rem (48px) | 1.1 | 700 | -0.025em | Space Grotesk |
| H2 | 2.25rem (36px) | 1.15 | 700 | -0.02em | Space Grotesk |
| H3 | 1.5rem (24px) | 1.25 | 600 | -0.015em | Space Grotesk |
| H4 | 1.25rem (20px) | 1.3 | 600 | -0.01em | Space Grotesk |
| Body | 1rem (16px) | 1.5 | 400 | 0 | Inter |
| Body-sm | 0.875rem (14px) | 1.45 | 400 | 0 | Inter |
| Caption | 0.75rem (12px) | 1.35 | 500 | 0.025em | Inter |
| Mono | 0.875rem (14px) | 1.5 | 400 | 0.02em | JetBrains Mono |

### Mobile Scale (< 768px)

| Token | Desktop | Mobile |
|-------|---------|--------|
| Display | 72px | 40px |
| H1 | 48px | 32px |
| H2 | 36px | 28px |
| H3 | 24px | 20px |

---

## Spacing

Base unit: **4px**

```css
--space-0:  0;
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

Rule: if a value isn't in this list, you don't use it.

---

## Elevation

### Dark Mode (primary)

```css
--shadow-xs:  0 1px 2px rgba(0,0,0,0.4);
--shadow-sm:  0 2px 8px rgba(0,0,0,0.4);
--shadow-md:  0 4px 16px rgba(0,0,0,0.5);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.6);
--shadow-glow-primary:    0 0 20px rgba(0,232,207,0.15);
--shadow-glow-primary-lg: 0 0 40px rgba(0,232,207,0.2);
--shadow-glow-accent:     0 0 20px rgba(139,92,246,0.15);
--shadow-focus:           0 0 0 3px rgba(0,212,189,0.4);
```

### Light Mode

```css
--shadow-light-sm: 0 1px 3px rgba(0,0,0,0.08);
--shadow-light-md: 0 4px 12px rgba(0,0,0,0.1);
--shadow-light-lg: 0 8px 24px rgba(0,0,0,0.12);
```

---

## Border Radius

Sharp bias — precision instrument aesthetic.

```css
--radius-xs:   2px;
--radius-sm:   4px;
--radius-md:   6px;   /* Default — buttons, inputs, cards */
--radius-lg:   8px;
--radius-xl:   12px;
--radius-full: 9999px;
```

---

## Motion

### Easing

```css
--ease-default:    cubic-bezier(0.16, 1, 0.3, 1);    /* Snappy out — the signature feel */
--ease-aggressive: cubic-bezier(0.76, 0, 0.24, 1);   /* Dramatic — modals, page transitions */
--ease-in:         cubic-bezier(0.55, 0, 1, 0.45);    /* Elements leaving */
--ease-out:        cubic-bezier(0, 0, 0.2, 1);        /* Elements arriving */
```

### Durations

```css
--duration-instant: 100ms;  /* Button press, toggle, checkbox */
--duration-fast:    150ms;  /* Hover states, tooltips */
--duration-medium:  250ms;  /* Panel reveals, dropdowns, fades */
--duration-slow:    400ms;  /* Modal transitions, page changes */
--stagger-delay:    50ms;   /* Staggered list entrances */
```

### Entrance Patterns

- **Fade up:** `opacity 0→1` + `translateY(8px→0)` — `--duration-medium` + `--ease-out`
- **Scale in:** `opacity 0→1` + `scale(0.95→1)` — `--duration-medium` + `--ease-default`
- **Slide in:** `translateX(-16px→0)` + `opacity 0→1` — `--duration-medium` + `--ease-out`
- **Stagger:** Each item offset by `--stagger-delay` using fade-up

### Mandatory Reduced Motion

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

---

## Breakpoints

```css
--bp-sm:  640px;   /* Mobile landscape */
--bp-md:  768px;   /* Tablet */
--bp-lg:  1024px;  /* Desktop */
--bp-xl:  1280px;  /* Desktop wide */
--bp-2xl: 1536px;  /* Ultrawide */
```

---

## Grid

```
Max width: 1200px
Columns:   12
Gutter:    16px (mobile) / 24px (desktop)
Container padding: 16px (mobile) / 24px (tablet) / 32px (desktop)
```

---

## Iconography

- **Library:** Lucide React
- **Stroke width:** 1.75px
- **Default size:** 20px inline, 24px standalone
- **Colour:** Inherits from text unless semantic
- **Rule:** Risk icons always paired with text label

---

## Component Inventory

Each component lists its key states. All components support dark mode as primary, light mode as secondary.

### Navigation
- **Header**: default, scrolled (compact), mobile-menu-open
- **MobileNav**: closed, open (slide-in from right), transitioning
- **Footer**: default (responsive column layout)

### Hero
- **HeroSection**: default (dark cinematic), with-image, compact (inner pages)
- States: loading (skeleton), loaded, reduced-motion (static gradient)

### Buttons
- **Button**: default, hover (glow + slight scale), active (pressed), focus (ring), disabled (dimmed), loading (spinner)
- Variants: primary (teal solid), secondary (outlined), ghost (transparent), destructive (red — for revoke), accent (violet — for upgrade)
- Sizes: sm (32px), md (40px — default), lg (48px)

### Cards
- **Card**: default, hover (subtle lift + glow), focus-within (ring), loading (skeleton)
- Variants: surface (neutral-900 bg), elevated (with shadow), outlined (border), featured (primary glow border)
- Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Forms
- **Input**: default, hover, focused (primary ring), error (red ring + message), disabled, filled
- **Select**: default, open (dropdown visible), focused, error, disabled
- **Checkbox**: unchecked, checked (primary fill), indeterminate, focused, disabled
- **Toggle**: off, on (primary fill), focused, disabled
- **ValidationMessage**: error, success, info

### Typography Components
- **Heading**: h1–h4 (Space Grotesk, mapped to type scale)
- **Body**: default, small, caption
- **AddressDisplay**: monospace, truncated (0x1a2B...3c4D), copyable (hover shows copy icon), copied (checkmark flash)
- **AmountDisplay**: monospace, with token symbol, "Unlimited" variant (warning-styled)
- **CodeBlock**: dark surface, syntax highlighting, copy button

### Data Display
- **DataTable**: header (sticky), row (default, hover, selected), empty state, loading (skeleton rows)
- **RiskBadge**: low (green + shield-check), medium (amber + alert-triangle), high (orange + alert-octagon), critical (red + x-octagon). Always: colour + icon + label.
- **StatCard**: value, label, trend-indicator (up/down/neutral), loading
- **ChainIndicator**: icon + name, compact (icon only), with-count
- **ProgressBar**: default, segmented (by risk level), animated fill

### Feedback
- **Toast**: success, error, warning, info — auto-dismiss (5s), with close button, stacked (max 3)
- **Alert**: success, error, warning, info — inline, dismissible, with action
- **EmptyState**: icon, headline, description, optional CTA
- **LoadingSkeleton**: rectangular, circular, table-row, card-shaped — pulsing animation
- **TransactionStatus**: pending (spinner), confirming (progress), success (checkmark), failed (x-mark)

### Layout
- **Container**: default (1200px), narrow (800px), wide (1400px)
- **Grid**: 12-column, responsive gutter
- **Stack**: vertical spacing, horizontal spacing
- **Divider**: horizontal, with-label, angled (slash motif — 5°)

### CTAs & Conversion
- **UpgradePrompt**: inline (within feature), modal (full upgrade pitch), banner (persistent)
- **FeatureLock**: blurred preview + upgrade button overlay
- **TrustSignal**: GitHub stars badge, open-source badge, ENS badge, on-chain stat

### Pricing
- **PricingCard**: free, pro (featured — primary glow), sentinel — each with: tier name, price, description, feature list, CTA
- **PricingToggle**: monthly ↔ yearly, with savings badge ("Save 20%"), satisfying toggle animation
- **ComparisonTable**: full feature list, check/cross per tier, tooltip on hover for feature explanation

### FAQ
- **Accordion**: closed, open (smooth height transition), focused, group (only one open at a time)
- **AccordionItem**: header (with chevron rotation), content (fade-in on open)

### Dashboard-Specific
- **ApprovalRow**: default, hover (slight highlight), selected (checkbox active + left border accent), revoking (loading state on row), revoked (strikethrough + success flash)
- **BatchActionToolbar**: hidden (0 selected), visible (slide-up entrance), count display, "Revoke Selected" destructive button
- **TimeMachineToggle**: off (default view), on (simulation mode — background tint shift, "Simulated" badge, high-risk rows dim/disappear, stats recalculate). Distinctive styling — this is a differentiator feature.
- **ChainFilterPills**: all, ethereum, polygon, arbitrum, base, optimism, avalanche — active pill gets primary fill, inactive gets ghost style, horizontal scroll on mobile
- **WalletConnectionState**: disconnected (connect button), connecting (spinner), connected (truncated address + chain + avatar), wrong-network (warning badge)
- **SummaryStatsBar**: total approvals, at-risk count, estimated value exposed — 3 stat cards in a row, responsive to stacked on mobile

---

## Visual Signature

**The Slash** — a diagonal cut motif ( / ) representing the act of revoking unauthorized access.

Manifestations:
1. **Section dividers**: Angled `clip-path` between hero sections (5° angle)
2. **Card accent**: 2px diagonal line in primary colour at top-left of featured cards
3. **Button hover**: Diagonal colour sweep from bottom-left to top-right
4. **Loading**: Diagonal wipe animation during wallet scan
5. **Logo evolution**: AG shield gains a subtle diagonal slash — the mark of revocation

Constraints:
- Decorative only — never interferes with readability
- Angle: 5° for subtle uses, max 15°
- Maximum 2 slash elements per viewport at any time

---

## Image Direction

| Location | Subject | Mood | Search String | Fallback CSS |
|----------|---------|------|---------------|-------------|
| Homepage hero | Abstract dark topology/mesh | Dark, technological, vast | "dark abstract topology mesh gradient" | `linear-gradient(135deg, #09090B 0%, #18181B 50%, #0A2A27 100%)` |
| Features headers | Close-up circuit/security hardware | Precision, engineered | "circuit board macro dark background" | `linear-gradient(135deg, #09090B 0%, #1a1a2e 100%)` |
| About page | Developer workspace, screens | Authentic, focused | "developer workspace dark monitor code" | `linear-gradient(135deg, #18181B 0%, #27272A 100%)` |
| Blog headers | Abstract geometric shapes | Editorial, varied | "abstract geometric shapes minimal dark" | `linear-gradient(135deg, #004B44 0%, #09090B 100%)` |
| 404 page | Broken shield / cracked glass | Dramatic, brand moment | "cracked glass dark abstract" | `radial-gradient(circle at 50% 50%, #27272A 0%, #09090B 100%)` |
| Empty states | Minimal abstract void | Calm, intentional | "minimal dark void abstract" | `radial-gradient(circle, #18181B 0%, #09090B 100%)` |

---

*End of Design Tokens Handbook. This document is the complete handoff for Part 2 (Build). Paste it as context and say: "Council, the tokens are set. Go."*
