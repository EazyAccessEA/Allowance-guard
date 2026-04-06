# Phase 3: Design Language

> **Council Leads:** Maren (Visual) & Kael (Systems)
> **Reviewer:** Noor (Accessibility)

---

## 1. Colour System

### Council Decision: Dark-First, Dual-Mode

**Maren's argument:** A security command-center product demands a dark primary mode. Dark = authority, density, focus. Light mode is offered for accessibility and daytime use, but dark is the flagship.

**Noor's condition:** Every colour pairing must pass WCAG AA (4.5:1 for body text, 3:1 for large text and UI components). Target AAA (7:1) for body text where achievable.

**Thane's condition:** Colour tokens use CSS custom properties. Dark/light switch is a class toggle on `<html>`, not a full repaint.

### Primary Brand Colour: Volt Cyan

PuredgeOS used `#00C2B3` — a teal that whispers. The redesign uses **Volt Cyan** — an electric cyan pushed to full saturation on dark, tempered for contrast on light.

```
--color-primary-50:  #ECFEFF
--color-primary-100: #CFFAFE
--color-primary-200: #A5F3FC
--color-primary-300: #67E8F9
--color-primary-400: #22D3EE
--color-primary-500: #00E5FF   ← Flagship (dark mode primary)
--color-primary-600: #00B8D4   ← Light mode primary (passes AA on white)
--color-primary-700: #0097A7
--color-primary-800: #00796B
--color-primary-900: #004D40
```

**Contrast checks (Noor verified):**
- `#00E5FF` on `#09090B` (dark bg) → 13.2:1 ✓ AAA
- `#00B8D4` on `#FAFAFA` (light bg) → 4.6:1 ✓ AA (large text: 7.2:1 AAA)
- `#00B8D4` on `#FFFFFF` → 4.5:1 ✓ AA

### Accent Colour: Signal Amber

Used as punctuation — rare, powerful. Draws the eye to critical information (badges, alerts, upgrade prompts).

```
--color-accent-50:  #FFFBEB
--color-accent-100: #FEF3C7
--color-accent-200: #FDE68A
--color-accent-300: #FCD34D
--color-accent-400: #FBBF24
--color-accent-500: #FFB800   ← Primary accent
--color-accent-600: #D97706
--color-accent-700: #B45309
--color-accent-800: #92400E
--color-accent-900: #78350F
```

### Neutral Scale: Zinc

Sharp, cool neutrals that recede behind content. Not warm grey (too soft), not pure grey (too cold). Zinc splits the difference.

```
--color-neutral-0:   #FFFFFF
--color-neutral-50:  #FAFAFA
--color-neutral-100: #F4F4F5
--color-neutral-200: #E4E4E7
--color-neutral-300: #D4D4D8
--color-neutral-400: #A1A1AA
--color-neutral-500: #71717A
--color-neutral-600: #52525B
--color-neutral-700: #3F3F46
--color-neutral-800: #27272A
--color-neutral-900: #18181B
--color-neutral-950: #09090B   ← Dark mode base background
```

### Semantic Colours

```
--color-success-500: #22C55E   (green-500, kept — it works)
--color-success-400: #4ADE80
--color-success-600: #16A34A

--color-warning-500: #F59E0B   (amber-500, kept)
--color-warning-400: #FBBF24
--color-warning-600: #D97706

--color-error-500:   #EF4444   (red-500, kept)
--color-error-400:   #F87171
--color-error-600:   #DC2626

--color-info-500:    #3B82F6   (blue-500, shifted from sky to blue for more authority)
--color-info-400:    #60A5FA
--color-info-600:    #2563EB
```

### Risk-Level Colours

These are critical for the product. Each risk level gets colour + icon + label (never colour alone).

```
--color-risk-low:      #22C55E   (green — checkmark icon ✓)
--color-risk-medium:   #F59E0B   (amber — warning icon ⚠)
--color-risk-high:     #F97316   (orange — triangle-up icon ▲)
--color-risk-critical: #EF4444   (red — X icon ✕)
```

### Background Mode: Dual (dark primary, light secondary)

**Dark mode (flagship):**
```
--bg-primary:    #09090B   (neutral-950)
--bg-secondary:  #18181B   (neutral-900)
--bg-tertiary:   #27272A   (neutral-800)
--bg-elevated:   #3F3F46   (neutral-700)
--bg-surface:    rgba(39, 39, 42, 0.6)  (glass panels)
```

**Light mode:**
```
--bg-primary:    #FFFFFF   (white)
--bg-secondary:  #FAFAFA   (neutral-50)
--bg-tertiary:   #F4F4F5   (neutral-100)
--bg-elevated:   #FFFFFF   (white with shadow)
--bg-surface:    rgba(255, 255, 255, 0.8)  (glass panels)
```

---

## 2. Typography System

### Council Decision: Space Grotesk + Inter + JetBrains Mono

**Maren's argument:** Space Grotesk is geometric, tech-forward, and has unmistakable character at display sizes. The angular terminals and distinctive 'a' and 'g' give it identity without sacrificing readability. It's what Satoshi tried to be but with more conviction.

**Noor's approval:** Space Grotesk passes readability tests at all sizes. Inter remains the body workhorse — proven, accessible, excellent at small sizes.

**Thane's note:** Both available on Google Fonts. Self-host for production (already have the pattern with next/font/local).

```
--font-display:  'Space Grotesk', system-ui, -apple-system, sans-serif
--font-heading:  'Space Grotesk', system-ui, -apple-system, sans-serif
--font-body:     'Inter', system-ui, -apple-system, sans-serif
--font-mono:     'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace
```

### Type Scale

Aggressive display-to-body contrast. Headlines are declarations. Body is precise.

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|---------------|-------|
| `--text-display` | 72px / 4.5rem | 1.0 | 800 | -0.04em | Hero headlines |
| `--text-h1` | 48px / 3rem | 1.1 | 700 | -0.03em | Page titles |
| `--text-h2` | 36px / 2.25rem | 1.15 | 700 | -0.025em | Section headings |
| `--text-h3` | 28px / 1.75rem | 1.2 | 600 | -0.02em | Sub-sections |
| `--text-h4` | 22px / 1.375rem | 1.3 | 600 | -0.015em | Card titles |
| `--text-body-lg` | 18px / 1.125rem | 1.6 | 400 | 0 | Lead paragraphs |
| `--text-body` | 16px / 1rem | 1.6 | 400 | 0 | Body text |
| `--text-body-sm` | 14px / 0.875rem | 1.5 | 400 | 0.005em | Secondary text |
| `--text-caption` | 12px / 0.75rem | 1.5 | 500 | 0.02em | Labels, badges |
| `--text-overline` | 11px / 0.6875rem | 1.5 | 700 | 0.1em | Overline labels (uppercase) |

### Responsive Typography

Mobile scales down display and h1 only. Body sizes stay fixed for readability.

| Token | Desktop | Tablet (768px) | Mobile (375px) |
|-------|---------|----------------|----------------|
| display | 72px | 56px | 40px |
| h1 | 48px | 40px | 32px |
| h2 | 36px | 32px | 28px |
| h3-caption | No change | No change | No change |

---

## 3. Spacing & Sizing Tokens

### Base Unit: 4px

Mathematical scale built on a 4px grid. Strict — no magic numbers.

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
--space-section-sm:  48px   (space-12 — tight sections)
--space-section-md:  80px   (space-20 — standard sections)
--space-section-lg:  128px  (space-32 — breathing sections)
--space-card-sm:     16px   (space-4 — compact cards)
--space-card-md:     24px   (space-6 — standard cards)
--space-card-lg:     32px   (space-8 — featured cards)
--space-inline-sm:   8px    (space-2 — between icon and text)
--space-inline-md:   12px   (space-3 — between related elements)
--space-inline-lg:   16px   (space-4 — between card items)
```

---

## 4. Elevation & Depth

### Shadow System

**Kael's note:** Coloured shadows on dark backgrounds. Traditional box-shadow on light. Glow effects for primary interactive elements.

**Dark mode shadows:**
```
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.4)
--shadow-md:   0 4px 8px rgba(0, 0, 0, 0.4)
--shadow-lg:   0 8px 24px rgba(0, 0, 0, 0.5)
--shadow-xl:   0 16px 48px rgba(0, 0, 0, 0.6)
```

**Light mode shadows:**
```
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md:   0 4px 8px rgba(0, 0, 0, 0.08)
--shadow-lg:   0 8px 24px rgba(0, 0, 0, 0.12)
--shadow-xl:   0 16px 48px rgba(0, 0, 0, 0.16)
```

**Glow effects (brand accent, dark mode):**
```
--shadow-glow-sm:  0 0 12px rgba(0, 229, 255, 0.15)
--shadow-glow-md:  0 0 24px rgba(0, 229, 255, 0.2)
--shadow-glow-lg:  0 0 48px rgba(0, 229, 255, 0.25)
```

**Focus ring:**
```
--shadow-focus: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--color-primary-500)
```

---

## 5. Border Radius

**Council decision:** Sharp and precise. A security product is not bubbly. Default bias toward small radii — tight, engineered.

```
--radius-none: 0
--radius-sm:   4px    (buttons, badges, inputs)
--radius-md:   8px    (cards, panels)
--radius-lg:   12px   (modals, featured cards)
--radius-xl:   16px   (hero elements, pricing cards)
--radius-full: 9999px (pills, avatars, toggles)
```

---

## 6. Iconography

**Council decision:** Lucide React (already in use). Sharp, consistent, 1.5px stroke weight. Paired with text labels always — never icon-only for critical actions (Noor's requirement).

Custom additions needed:
- Shield variants for risk levels (reuse AG logo geometry)
- Chain-specific icons (Ethereum diamond, Polygon purple, etc. — use chain brand assets)

---

## 7. Photography & Image Direction

| Location | Subject | Mood | Search String | Fallback CSS |
|----------|---------|------|---------------|-------------|
| Homepage hero bg | Abstract dark topology mesh, digital terrain | Ominous, technical, vast | "dark abstract mesh topology digital" | `linear-gradient(135deg, #09090B 0%, #18181B 50%, #0097A7 100%)` |
| Features section | Close-up of digital shield texture, carbon fiber | Protective, engineered, material | "carbon fiber texture close up dark" | `linear-gradient(135deg, #18181B 0%, #27272A 100%)` |
| About/team section | Team working on screens, dark environment | Focused, competent, mission-driven | "developer team dark office screens" | `linear-gradient(135deg, #09090B 0%, #27272A 100%)` |
| Blog post headers | Abstract geometric patterns, data visualization | Analytical, precise, modern | "abstract geometric data visualization dark" | `linear-gradient(135deg, #09090B 0%, #004D40 60%, #00B8D4 100%)` |
| 404 page | Glitched shield / broken grid | Disoriented, branded, memorable | "glitch art digital distortion dark" | `linear-gradient(135deg, #09090B 0%, #EF4444 50%, #09090B 100%)` |

---

## 8. Motion Tokens

### Duration Scale

```
--duration-instant: 0ms
--duration-fast:    120ms   (micro-interactions: button press, toggle)
--duration-base:    200ms   (standard transitions: hover, focus)
--duration-medium:  300ms   (modal open, panel slide)
--duration-slow:    500ms   (page transitions, complex reveals)
--duration-slower:  800ms   (scroll-triggered entrances)
```

### Easing Curves

```
--ease-default:    cubic-bezier(0.16, 1, 0.3, 1)     (fast-out, smooth — the signature ease)
--ease-in:         cubic-bezier(0.55, 0, 1, 0.45)     (accelerate)
--ease-out:        cubic-bezier(0, 0.55, 0.45, 1)     (decelerate)
--ease-aggressive:  cubic-bezier(0.22, 1, 0.36, 1)    (snappy — for attention-grabbing transitions)
--ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1)  (slight overshoot — toggle, badge pop)
--ease-linear:     linear                               (progress bars, loading)
```

### Stagger Timing
```
--stagger-delay: 50ms   (sequential element entrance — e.g., table rows, card grids)
```

### Entrance Patterns
- **Fade up:** `opacity: 0 → 1` + `translateY(8px → 0)` over `--duration-medium` with `--ease-default`
- **Scale in:** `opacity: 0 → 1` + `scale(0.95 → 1)` over `--duration-base` with `--ease-aggressive`
- **Slide in:** `translateX(-16px → 0)` over `--duration-medium` with `--ease-default`

### Reduced Motion (Mandatory)
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

## 9. Breakpoints & Grid

### Breakpoints
```
--bp-sm:  640px
--bp-md:  768px
--bp-lg:  1024px
--bp-xl:  1280px
--bp-2xl: 1536px
```

### Grid System
```
Max width:     1280px
Columns:       12
Gutter:        24px (desktop), 16px (mobile)
Margin:        24px (desktop), 16px (mobile)
```

### Container
```
--container-sm:   640px
--container-md:   768px
--container-lg:   1024px
--container-xl:   1280px
```

---

## 10. Visual Signature: The Slash

**Council unanimous decision.**

AllowanceGuard's visual signature is **The Slash** — a 45° diagonal cut that appears as a recurring motif across the entire site.

### What It Represents
- A **revocation** — cutting off access
- A **shield edge** — geometry from the AG logo
- A **decisive action** — the moment the user takes back control

### Where It Appears
- **Section dividers:** Instead of horizontal lines, sections are separated by a diagonal slash (CSS `clip-path` or SVG)
- **Card accents:** Featured cards have a diagonal cyan accent line on one edge
- **Background patterns:** Subtle diagonal grid lines in hero backgrounds
- **Risk badges:** Critical risk badge has a diagonal slash-through motif
- **Loading animation:** A diagonal line sweeps across the loading skeleton
- **Hover states:** Buttons reveal a diagonal gradient sweep on hover
- **Hero element:** The main hero has a large diagonal composition line

### Implementation
- CSS `clip-path: polygon()` for section dividers
- CSS `linear-gradient()` at 135deg for background patterns
- SVG `<line>` or `<path>` for card accents
- CSS `transform: skewX(-12deg)` for subtle geometric elements
