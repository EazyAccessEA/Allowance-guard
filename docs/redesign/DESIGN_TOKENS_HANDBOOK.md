# DESIGN TOKENS HANDBOOK — AllowanceGuard Redesign

> Produced by The Design Council (Phases 1–4). This is the handoff document for Part 2 (Build).

---

## Brand Principles
1. **Controlled Aggression**: Every bold choice serves communication. The site speaks with absolute certainty — never loud for shock, never timid for safety.
2. **Earned Trust**: Trust comes from competence and transparency, not softness. Show the data. Show the risk. Show the open-source code.
3. **Relentless Clarity**: Information hierarchy is razor-sharp. Every element earns its space. Clarity doesn't mean boring — it means zero wasted seconds.
4. **Signature Presence**: Every page is unmistakably AllowanceGuard. Recognisable from a screenshot of any page, even without the logo.
5. **Power to the User**: The user is in control. The UI communicates agency — "you can see everything, you can act on anything."
6. **100% Commitment**: Every design decision goes to full intensity or doesn't happen at all. A tentative animation is worse than none. A half-styled divider undermines more than a missing one. If an element exists, it earns its space with conviction.

---

## Colours — Midnight Amber

> **"The Warning System"** — Deep navy canvas. Amber = scanning/caution.
> Red = danger only. Sky blue = safe/links.

### Core Palette
```
Background:       #0F172A  (Deep Navy)
Primary Action:   #F59E0B  (Vivid Amber — CTAs, scanning)
Safe/Links:       #38BDF8  (Sky Blue — replaces teal)
Danger:           #EF4444  (Red — revoke, threats only)
Headings:         #FFFFFF  (White — 17:1 contrast on navy)
Body Text:        #CBD5E1  (Slate 300 — 10.6:1 contrast)
Muted Text:       #94A3B8  (Slate 400 — 6.4:1 contrast)
Background Glow:  #1E293B  (Faint — geometric lines)
```

### Neutral — Slate
```
--color-neutral-0:   #FFFFFF
--color-neutral-50:  #F8FAFC
--color-neutral-100: #F1F5F9
--color-neutral-200: #E2E8F0
--color-neutral-300: #CBD5E1   (Secondary text — 10.6:1)
--color-neutral-400: #94A3B8   (Muted text — 6.4:1)
--color-neutral-500: #64748B   (Decorative only — 3.6:1)
--color-neutral-600: #475569
--color-neutral-700: #334155   (Card borders)
--color-neutral-800: #1E293B   (Raised surface)
--color-neutral-900: #0F172A   (Base background)
--color-neutral-950: #0A0F1E
```

### Primary — Vivid Amber
```
--color-primary-50:  #FFFBEB
--color-primary-100: #FEF3C7
--color-primary-200: #FDE68A
--color-primary-300: #FCD34D
--color-primary-400: #FBBF24
--color-primary-500: #F59E0B   (Primary action)
--color-primary-600: #D97706
--color-primary-700: #B45309
--color-primary-800: #92400E
--color-primary-900: #78350F
```

### Danger — Red (threats only)
```
--color-danger-500: #EF4444
--color-danger-600: #DC2626
--color-danger-700: #B91C1C
```

### Semantic
```
--color-semantic-success: #22C55E
--color-semantic-warning: #F59E0B
--color-semantic-error:   #EF4444
--color-semantic-info:    #0EA5E9
```

### Risk Levels (always paired with icon + label)
```
--color-risk-low:      #22C55E   (✓ Check icon)
--color-risk-medium:   #F59E0B   (⚠ AlertTriangle icon)
--color-risk-high:     #F97316   (▲ TrendingUp icon)
--color-risk-critical: #EF4444   (✕ X icon)
```

### Background Mode: Dual (dark primary, light secondary)

**Dark mode (flagship):**
```
--bg-primary:   #09090B
--bg-secondary: #18181B
--bg-tertiary:  #27272A
--bg-elevated:  #3F3F46
--bg-surface:   rgba(39, 39, 42, 0.6)
```

**Light mode:**
```
--bg-primary:   #FFFFFF
--bg-secondary: #FAFAFA
--bg-tertiary:  #F4F4F5
--bg-elevated:  #FFFFFF
--bg-surface:   rgba(255, 255, 255, 0.8)
```

---

## Typography

```
--font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif
--font-heading: 'Space Grotesk', system-ui, -apple-system, sans-serif
--font-body:    'Inter', system-ui, -apple-system, sans-serif
--font-mono:    'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace
```

### Scale

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|---------------|
| display | 72px / 4.5rem | 1.0 | 800 | -0.04em |
| h1 | 48px / 3rem | 1.1 | 700 | -0.03em |
| h2 | 36px / 2.25rem | 1.15 | 700 | -0.025em |
| h3 | 28px / 1.75rem | 1.2 | 600 | -0.02em |
| h4 | 22px / 1.375rem | 1.3 | 600 | -0.015em |
| body-lg | 18px / 1.125rem | 1.6 | 400 | 0 |
| body | 16px / 1rem | 1.6 | 400 | 0 |
| body-sm | 14px / 0.875rem | 1.5 | 400 | 0.005em |
| caption | 12px / 0.75rem | 1.5 | 500 | 0.02em |
| overline | 11px / 0.6875rem | 1.5 | 700 | 0.1em |

### Responsive Overrides (mobile < 768px)
- display: 40px
- h1: 32px
- h2: 28px
- All others: unchanged

---

## Spacing

Base unit: **4px**

```
--space-0:   0
--space-0.5: 2px
--space-1:   4px
--space-1.5: 6px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
--space-24:  96px
--space-32:  128px
```

### Semantic Spacing
```
--space-section-sm: 48px
--space-section-md: 80px
--space-section-lg: 128px
--space-card-sm:    16px
--space-card-md:    24px
--space-card-lg:    32px
```

---

## Elevation

### Dark Mode Shadows
```
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4)
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5)
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.6)
```

### Light Mode Shadows
```
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12)
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16)
```

### Glow (dark mode, brand accent)
```
--shadow-glow-sm: 0 0 12px rgba(0, 229, 255, 0.15)
--shadow-glow-md: 0 0 24px rgba(0, 229, 255, 0.2)
--shadow-glow-lg: 0 0 48px rgba(0, 229, 255, 0.25)
```

### Focus
```
--shadow-focus: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--color-primary-500)
```

---

## Border Radius
```
--radius-none: 0
--radius-sm:   4px
--radius-md:   8px
--radius-lg:   12px
--radius-xl:   16px
--radius-full: 9999px
```

---

## Motion

### Durations
```
--duration-instant: 0ms
--duration-fast:    120ms
--duration-base:    200ms
--duration-medium:  300ms
--duration-slow:    500ms
--duration-slower:  800ms
```

### Easing
```
--ease-default:    cubic-bezier(0.16, 1, 0.3, 1)
--ease-in:         cubic-bezier(0.55, 0, 1, 0.45)
--ease-out:        cubic-bezier(0, 0.55, 0.45, 1)
--ease-aggressive: cubic-bezier(0.22, 1, 0.36, 1)
--ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-linear:     linear
```

### Stagger
```
--stagger-delay: 50ms
```

### Entrance Patterns
- **Fade up:** opacity 0→1 + translateY(8px→0), `--duration-medium`, `--ease-default`
- **Scale in:** opacity 0→1 + scale(0.95→1), `--duration-base`, `--ease-aggressive`
- **Slide in:** translateX(-16px→0), `--duration-medium`, `--ease-default`
- **Split text:** Words stagger in from below (translateY 100%→0 + opacity), `--duration-slow`, `--ease-default`, 80ms stagger per word
- **Blur reveal:** opacity 0→1 + filter blur(12px→0px), `--duration-slow`, `--ease-default`
- **Count up:** Number animates from 0→target with ease-out cubic, `--duration-slower`, scroll-triggered
- **Draw in:** scaleX(0→1) with transformOrigin left, `--duration-slow`, `--ease-default`

### Animation Philosophy

Motion in AllowanceGuard serves **choreography, not decoration**. Every animation must earn its place.

**Core principles:**
1. **Scroll as revelation** — sections reveal as the user scrolls, not everything visible at once. The page unfolds like a narrative.
2. **Choreographed entrances** — elements appear in sequence, not simultaneously. Headlines land first, supporting content materialises after. This creates rhythm.
3. **Restraint over spectacle** — pick 2–3 effects per page and apply them with precision. More effects ≠ more polish. A page with six animations feels like a demo site, not a product.
4. **Engineered confidence, not playfulness** — this is a security tool. Every interaction should feel precise and deliberate. No sparkles, no bounce, no whimsy.
5. **100% commitment** — if an element animates, it animates with intention. If it's static, it's confidently static. No half-measures — a tentative animation is worse than none at all.

### Animation Components (framer-motion)

Reusable components in `src/components/ui/`:

| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| SplitText | `SplitText.tsx` | Word-by-word staggered headline reveal | `delay`, `stagger`, `renderWord` |
| BlurText | `BlurText.tsx` | Blur-to-clear text materialisation | `delay`, `duration` |
| CountUp | `CountUp.tsx` | Scroll-triggered animated number counter | `value`, `suffix`, `prefix`, `delay`, `duration` |

All components respect `prefers-reduced-motion` via framer-motion's `useReducedMotion()` hook. When reduced motion is preferred, content renders instantly with no animation.

### What to Use vs. What to Avoid

**Use — effects that project trust and precision:**
- **SplitText** on hero headlines — the best copy deserves an entrance
- **BlurText** on subheadings — materialises after the headline lands, creates sequence
- **CountUp** on stats/metrics — numbers that animate on scroll are a baseline expectation
- **Fade up / Fade content** as scroll wrappers — sections reveal progressively
- **Aurora / mesh gradients** as subtle hero backgrounds — muted, brand-coloured, adds materiality without distraction
- **Draw-in lines** for brand dividers — the crimson signature line draws from left

**Avoid — effects that undermine credibility:**
- **Hyperspeed / warp / 3D scenes** — "portfolio site" energy, not security product energy
- **Particle explosions / Ballpit** — spectacle without substance
- **ClickSpark / confetti / playful interactions** — wrong tone for a tool that protects wallets
- **Parallax scrolling** on content — creates motion sickness risk, adds complexity without value
- **Hover-triggered animations on text** — text should be readable, not reactive
- **Auto-playing loops on content elements** — background meshes can loop; content elements should animate once and settle

### Reduced Motion (mandatory root-level)
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
```
--bp-sm:  640px
--bp-md:  768px
--bp-lg:  1024px
--bp-xl:  1280px
--bp-2xl: 1536px
```

---

## Grid

```
Max width: 1280px
Columns:   12
Gutter:    24px (desktop), 16px (mobile)
Margin:    24px (desktop), 16px (mobile)
```

---

## Component Inventory

### Navigation
- **Header**: default, scrolled, mobile-collapsed | hover (links), active (current page), focus
- **MobileMenu**: open, closed
- **Footer**: default (always dark) | collapsible sections on mobile

### Heroes
- **HomepageHero**: default (with mesh bg, headline, stats, CTA)
- **PageHero**: default (simple heading + breadcrumb)

**Homepage Hero — Entrance Choreography:**

The hero loads as a sequenced performance, not a static render. Each element has a precise entrance delay:

| Delay | Element | Animation | Component |
|-------|---------|-----------|-----------|
| 0.0s | Eyebrow label | Fade up | `motion.div` |
| 0.2s | Headline words | Stagger in word-by-word | `SplitText` |
| 0.8s | Subheading | Blur-to-clear materialisation | `BlurText` |
| 1.1s | CTA buttons | Fade up | `motion.div` |
| 1.3s | Crimson divider | Draws in from left (scaleX) | `motion.div` |
| 1.4–1.6s | Stats (50K+, 2M+, 10) | Count up from zero | `CountUp` |
| 1.7s | Trust indicators | Fade up | `motion.div` |

**Hero design rules:**
- The headline is the centrepiece. It gets the most dramatic entrance (SplitText). The "approved." word retains its crimson gradient during animation.
- Background mesh animates independently (CSS keyframes, not JS) — always subtle, never competing with content.
- The crimson divider line is a **brand signature element**: thick enough to notice, drawn in from left to right. Either bold and deliberate or removed entirely — never tentative.
- Stats should hit with authority: large display type, CountUp animation, generous vertical space. These are credibility numbers, not metadata.
- Alignment must be committed: left-aligned content stays left-aligned. CTAs match the content alignment. No Z-shape eye paths.

### Buttons
- **Button**: primary, secondary, ghost, destructive, outline
- Sizes: sm (32px), md (40px), lg (48px), xl (56px)
- States: default, hover, active, focus, disabled, loading

### Cards
- **Card**: default, elevated, glass, interactive
- Subcomponents: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- States: default, hover (interactive), focus (interactive), active

### Risk Badges
- **RiskBadge**: low (green ✓), medium (amber ⚠), high (orange ▲), critical (red ✕)
- Critical: glow pulse animation

### Data Table (Approval Table)
- **TableHeader**: default, sortable (ascending, descending, none)
- **TableRow**: default, hover, selected, revoking, revoked
- **EmptyState**: icon + headline + body + CTA
- Desktop: full table | Mobile: card layout

### Chain Filter Pills
- **ChainPill**: default, hover, active, focus
- Layout: horizontal scroll (mobile), flex-wrap (desktop)

### Batch Action Toolbar
- **Toolbar**: hidden, visible, revoking
- Position: sticky bottom, glass background

### Time Machine
- **TimeMachineToggle**: off, on, transitioning
- "SIMULATED" badge on activation
- Mode shift: background tint, rows dim, stats recalculate

### Pricing
- **TierCard**: free, pro (elevated/featured), sentinel
- **BillingToggle**: monthly, yearly (with savings badge)
- **FeatureComparisonTable**: check/cross per tier per feature

### Forms
- **Input**: default, focus, error, disabled
- Sizes: sm (36px), md (40px), lg (44px)
- With label, description, error message

### Feedback
- **Toast**: success, error, warning, info
- Auto-dismiss 5s, stacking, slide-in from right

### Layout
- **Container**: centered, max-width 1280px
- **Section**: sm (48px), md (80px), lg (128px) padding
- **Stack**: vertical flex with configurable gap
- **Grid**: 12-column CSS grid
- **Divider**: line (default), slash (diagonal clip-path)

### Loading
- **Skeleton**: shimmer animation at 135° (The Slash angle)
- Dashboard skeleton: header + stats + table + sidebar

---

## Visual Signature

### The Slash

A 45° diagonal cut motif that appears across the entire site. Represents revocation (cutting off access), the AG shield edge, and decisive action.

**Where it appears:**
- **Section dividers**: Diagonal `clip-path` instead of horizontal lines
- **Card accents**: Diagonal cyan line on featured card edges
- **Background patterns**: Subtle diagonal grid lines in hero sections
- **Loading skeletons**: Shimmer sweeps at 135°
- **Button hover**: Diagonal gradient sweep on primary buttons
- **Hero composition**: Large diagonal line at 10% primary opacity
- **Footer separator**: Slash divider above footer

**Implementation:** CSS `clip-path: polygon()`, `linear-gradient(135deg, ...)`, `transform: skewX(-12deg)`

---

## Image Direction

| Location | Subject | Mood | Search String | Fallback CSS |
|----------|---------|------|---------------|-------------|
| Homepage hero bg | Dark topology mesh, digital terrain | Ominous, technical, vast | "dark abstract mesh topology digital" | `linear-gradient(135deg, #09090B 0%, #18181B 50%, #0097A7 100%)` |
| Features section | Carbon fiber shield texture | Protective, engineered | "carbon fiber texture close up dark" | `linear-gradient(135deg, #18181B 0%, #27272A 100%)` |
| About page | Team at screens, dark environment | Focused, mission-driven | "developer team dark office screens" | `linear-gradient(135deg, #09090B 0%, #27272A 100%)` |
| Blog headers | Geometric data visualization | Analytical, precise | "abstract geometric data visualization dark" | `linear-gradient(135deg, #09090B 0%, #004D40 60%, #00B8D4 100%)` |
| 404 page | Glitched shield / broken grid | Disoriented, branded | "glitch art digital distortion dark" | `linear-gradient(135deg, #09090B 0%, #EF4444 50%, #09090B 100%)` |

---

*End of Design Tokens Handbook. Paste this into Part 2 (Build) conversation as context.*
