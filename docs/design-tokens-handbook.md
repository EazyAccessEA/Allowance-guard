# AllowanceGuard Design Tokens Handbook

Canonical reference for all design tokens used in the AllowanceGuard platform.
Source of truth: `src/design/tokens.ts`.

---

## 1. Introduction

Design tokens are the primitive values that drive every visual decision in AllowanceGuard -- colors, typography, spacing, motion, and layout. They are defined once in TypeScript (`src/design/tokens.ts`), consumed by components via direct import or CSS custom properties, and mapped to Tailwind utilities where applicable.

**How tokens flow:**

```
tokens.ts  -->  CSS custom properties (:root)  -->  Tailwind config / component styles
```

All components use the `cn()` helper from `src/lib/utils.ts` for conditional class merging and CVA (class-variance-authority) for variant definitions.

---

## 2. Color System — Midnight Amber

> **"The Warning System"** — Deep navy canvas. Amber = scanning/caution.
> Red = danger only. Sky blue = safe/links.
> Amber is the universal color for "Caution" and "Scanning."

### 2.1 Core Palette

| Token              | Hex       | Contrast on Navy | Role                        |
|--------------------|-----------|------------------|-----------------------------|
| Background         | `#0F172A` | —                | **Deep Navy** — the canvas  |
| Primary Action     | `#F59E0B` | 6.4:1 AA         | **Vivid Amber** — CTAs      |
| Safe/Links         | `#38BDF8` | 7.2:1 AA         | **Sky Blue** — links, safe  |
| Danger             | `#EF4444` | 4.6:1 AA (lg)    | **Red** — revoke, threats   |
| Headings           | `#FFFFFF` | 17:1 AAA         | White — headlines            |
| Secondary Text     | `#CBD5E1` | 10.6:1 AAA       | Slate 300 — body text       |
| Muted Text         | `#94A3B8` | 6.4:1 AA         | Slate 400 — tertiary        |
| Background Glow    | `#1E293B` | —                | Faint raised surfaces       |

### 2.2 Neutral Scale (Slate)

| Step | Hex       | Usage                    |
|------|-----------|--------------------------|
| 50   | `#F8FAFC` | Lightest (inverse bg)    |
| 100  | `#F1F5F9` | Light accents            |
| 200  | `#E2E8F0` | Light borders            |
| 300  | `#CBD5E1` | **Secondary text** (10.6:1) |
| 400  | `#94A3B8` | **Muted text** (6.4:1)  |
| 500  | `#64748B` | Decorative only (3.6:1) |
| 600  | `#475569` | Elevated surfaces       |
| 700  | `#334155` | Card borders            |
| 800  | `#1E293B` | **Raised surface**      |
| 900  | `#0F172A` | **Base background**     |
| 950  | `#0A0F1E` | Deepest                 |

### 2.3 Background, Text, and Border

| Token                  | Hex       | Role                 |
|------------------------|-----------|----------------------|
| `background.primary`   | `#0F172A` | Deep Navy base       |
| `background.secondary` | `#1E293B` | Raised surface       |
| `background.tertiary`  | `#334155` | Overlay/cards        |
| `background.inverse`   | `#FFFFFF` | White inverse        |
| `text.primary`         | `#FFFFFF` | White on navy (17:1) |
| `text.secondary`       | `#CBD5E1` | Slate 300 (10.6:1)  |
| `text.tertiary`        | `#94A3B8` | Slate 400 (6.4:1)   |
| `text.inverse`         | `#0F172A` | Navy on light bg     |
| `border.default`       | `#1E293B` | Subtle borders       |
| `border.strong`        | `#334155` | Visible borders      |
| `border.focus`         | `#F59E0B` | Amber focus ring     |

### 2.4 Primary Scale (Vivid Amber)

> The brand action color. Used for CTAs, scanning states, active indicators.

| Step | Hex       | Usage                  |
|------|-----------|------------------------|
| 50   | `#FFFBEB` | Amber tint             |
| 100  | `#FEF3C7` | Light amber bg         |
| 200  | `#FDE68A` | Amber accents          |
| 300  | `#FCD34D` | Highlight              |
| 400  | `#FBBF24` | Hover state            |
| 500  | `#F59E0B` | **Primary action**     |
| 600  | `#D97706` | Pressed state          |
| 700  | `#B45309` | Active/dark            |
| 800  | `#92400E` | High contrast          |
| 900  | `#78350F` | Darkest amber          |

### 2.5 Danger Scale (Red)

> Reserved exclusively for threats, revocations, and risk.

| Step | Hex       | Usage                  |
|------|-----------|------------------------|
| 500  | `#EF4444` | **Danger primary**     |
| 600  | `#DC2626` | Pressed state          |
| 700  | `#B91C1C` | Active/dark            |

### 2.6 Semantic Colors

| Token   | Hex       | Contrast | Use |
|---------|-----------|----------|-----|
| Success | `#22C55E` | 5.1:1    | Safe approvals, connected |
| Warning | `#F59E0B` | 6.4:1    | Caution states |
| Error   | `#EF4444` | 4.6:1    | Danger, revoke |
| Info    | `#0EA5E9` | 5.8:1    | Informational |

### 2.6 Semantic Backgrounds

| Token              | Hex       |
|--------------------|-----------|
| `danger`           | `#FEF2F2` |
| `success`          | `#F0FDF4` |
| `info`             | `#F0F9FF` |
| `warning`          | `#FFFBEB` |
| `dangerSubtle`     | `#FEF7F7` |
| `successSubtle`    | `#F7FEF7` |
| `infoSubtle`       | `#F7FBFF` |
| `warningSubtle`    | `#FFFDF7` |

### 2.7 Dark Mode Surfaces

| Token                 | Value                          | Role                |
|-----------------------|--------------------------------|---------------------|
| `dark.bg.primary`     | `#0A0E1A`                      | Deepest background  |
| `dark.bg.secondary`   | `#111827`                      | Card / section bg   |
| `dark.bg.tertiary`    | `#1E293B`                      | Elevated surfaces   |
| `dark.bg.elevated`    | `#263244`                      | Popovers, dropdowns |
| `dark.bg.overlay`     | `rgba(0, 0, 0, 0.6)`          | Modal backdrop      |

### 2.8 Dark Mode Text and Borders

| Token                  | Value     | Role                  |
|------------------------|-----------|-----------------------|
| `dark.text.primary`    | `#F1F5F9` | High-emphasis text    |
| `dark.text.secondary`  | `#94A3B8` | Medium-emphasis text  |
| `dark.text.tertiary`   | `#64748B` | Low-emphasis text     |
| `dark.text.inverse`    | `#0F172A` | Text on light bg      |
| `dark.border.primary`  | `#1E293B` | Subtle borders        |
| `dark.border.secondary`| `#334155` | Visible borders       |
| `dark.border.tertiary` | `#475569` | High-contrast borders |
| `dark.border.focus`    | `#00C2B3` | Focus ring            |

### 2.9 Glassmorphism

| Token                   | Value                          |
|-------------------------|--------------------------------|
| `dark.surface.glass`       | `rgba(17, 24, 39, 0.7)`       |
| `dark.surface.glassHover`  | `rgba(30, 41, 59, 0.8)`       |
| `dark.surface.glassBorder` | `rgba(71, 85, 105, 0.4)`      |

---

## 3. Typography

### 3.1 Font Families

| Role     | Stack                                              |
|----------|----------------------------------------------------|
| Heading  | `Satoshi, Inter, system-ui, sans-serif`            |
| Display  | `Satoshi, Inter, system-ui, sans-serif`            |
| Body     | `Inter, system-ui, sans-serif`                     |
| Button   | `Inter, system-ui, sans-serif`                     |
| Caption  | `Inter, system-ui, sans-serif`                     |
| Mono     | `JetBrains Mono, Menlo, Monaco, monospace`         |

Fonts are self-hosted via `next/font/local` from `public/fonts/`.

### 3.2 Type Scale

| Token | Size (rem) | Size (px) | Line Height   | Weight | Letter Spacing | Mobile Size | Mobile LH  |
|-------|-----------|-----------|---------------|--------|----------------|-------------|------------|
| xs    | 0.75      | 12        | 1.25rem (20px)  | 500    | 0.025em        | 0.75rem     | 1.25rem    |
| sm    | 0.875     | 14        | 1.375rem (22px) | 400    | 0.01em         | 0.875rem    | 1.375rem   |
| base  | 1         | 16        | 1.5rem (24px)   | 400    | 0              | 0.875rem    | 1.375rem   |
| lg    | 1.125     | 18        | 1.625rem (26px) | 400    | -0.01em        | 1rem        | 1.5rem     |
| xl    | 1.25      | 20        | 1.75rem (28px)  | 600    | -0.01em        | 1.125rem    | 1.625rem   |
| 2xl   | 1.5       | 24        | 2rem (32px)     | 600    | -0.02em        | 1.25rem     | 1.75rem    |
| 3xl   | 1.875     | 30        | 2.25rem (36px)  | 700    | -0.025em       | 1.5rem      | 2rem       |
| 4xl   | 2.25      | 36        | 2.5rem (40px)   | 700    | -0.03em        | 1.875rem    | 2.25rem    |
| 5xl   | 3         | 48        | 1.1 (52.8px)   | 700    | -0.035em       | 2.25rem     | 2.5rem     |
| 6xl   | 3.75      | 60        | 1.1 (66px)     | 700    | -0.04em        | 2.5rem      | 1.2        |
| 7xl   | 4.5       | 72        | 1.05 (75.6px)  | 800    | -0.045em       | 3rem        | 1.1        |
| 8xl   | 6         | 96        | 1 (96px)       | 800    | -0.05em        | 3.75rem     | 1.1        |

### 3.3 Letter Spacing Presets

| Preset  | Value    |
|---------|----------|
| heading | -0.02em  |
| body    | 0        |
| display | -0.03em  |
| caption | 0.025em  |
| button  | 0.01em   |

### 3.4 Font Weights

| Name     | Value |
|----------|-------|
| light    | 300   |
| normal   | 400   |
| medium   | 500   |
| semibold | 600   |
| bold     | 700   |
| extrabold| 800   |
| black    | 900   |

---

## 4. Spacing

4px base grid. All values in rem (1rem = 16px).

| Token | rem      | px  | | Token | rem     | px  | | Token | rem     | px  |
|-------|----------|-----|-|-------|---------|-----|-|-------|---------|-----|
| 0     | 0        | 0   | | 7     | 1.75    | 28  | | 28    | 7       | 112 |
| 0.5   | 0.125    | 2   | | 8     | 2       | 32  | | 32    | 8       | 128 |
| 1     | 0.25     | 4   | | 9     | 2.25    | 36  | | 36    | 9       | 144 |
| 1.5   | 0.375    | 6   | | 10    | 2.5     | 40  | | 40    | 10      | 160 |
| 2     | 0.5      | 8   | | 11    | 2.75    | 44  | | 44    | 11      | 176 |
| 2.5   | 0.625    | 10  | | 12    | 3       | 48  | | 48    | 12      | 192 |
| 3     | 0.75     | 12  | | 14    | 3.5     | 56  | | 52    | 13      | 208 |
| 3.5   | 0.875    | 14  | | 16    | 4       | 64  | | 56    | 14      | 224 |
| 4     | 1        | 16  | | 18    | 4.5     | 72  | | 60    | 15      | 240 |
| 5     | 1.25     | 20  | | 20    | 5       | 80  | | 64    | 16      | 256 |
| 6     | 1.5      | 24  | | 24    | 6       | 96  | | 72    | 18      | 288 |
|       |          |     | |       |         |     | | 80    | 20      | 320 |
|       |          |     | |       |         |     | | 96    | 24      | 384 |

**Semantic aliases:** xs = 0.5rem (8px), sm = 1rem (16px), md = 2rem (32px), lg = 4rem (64px), xl = 8rem (128px).

---

## 5. Layout

### 5.1 Container Widths

| Token                    | Value    |
|--------------------------|----------|
| `containerMaxWidth`      | 1200px   |
| `containerMaxWidthNarrow`| 800px    |
| `containerMaxWidthWide`  | 1400px   |

### 5.2 Navbar

| Token                | Value  | px  |
|----------------------|--------|-----|
| `navbarHeight`       | 4rem   | 64  |
| `navbarHeightMobile` | 3.5rem | 56  |

### 5.3 Sidebar

| Token                    | Value  | px  |
|--------------------------|--------|-----|
| `sidebarWidth`           | 16rem  | 256 |
| `sidebarWidthCollapsed`  | 4rem   | 64  |

### 5.4 Card Padding

| Token              | Value   | px  |
|--------------------|---------|-----|
| `cardPadding`      | 1.5rem  | 24  |
| `cardPaddingSmall` | 1rem    | 16  |
| `cardPaddingLarge` | 2rem    | 32  |
| `cardGap`          | 1rem    | 16  |
| `cardGapLarge`     | 1.5rem  | 24  |

### 5.5 Mobile

| Token            | Value    | px  |
|------------------|----------|-----|
| `mobileMargin`   | 1rem     | 16  |
| `mobilePadding`  | 1rem     | 16  |
| `mobileGap`      | 0.75rem  | 12  |

### 5.6 Grid

| Token          | Value  |
|----------------|--------|
| `gridColumns`  | 12     |
| `gridGap`      | 1rem   |
| `gridGapLarge` | 1.5rem |

### 5.7 Breakpoints

| Token | Width  | Target              |
|-------|--------|---------------------|
| xs    | 320px  | Mobile small        |
| sm    | 640px  | Mobile large        |
| md    | 768px  | Tablet              |
| lg    | 1024px | Desktop small       |
| xl    | 1280px | Desktop large       |
| 2xl   | 1536px | Desktop extra large |

### 5.8 Z-Index

| Token          | Value |
|----------------|-------|
| dropdown       | 1000  |
| sticky         | 1020  |
| fixed          | 1030  |
| modalBackdrop  | 1040  |
| modal          | 1050  |
| popover        | 1060  |
| tooltip        | 1070  |
| toast          | 1080  |

---

## 6. Border Radius

| Token | Value     | px  |
|-------|-----------|-----|
| sm    | 0.125rem  | 2   |
| base  | 0.5rem    | 8   |
| md    | 0.75rem   | 12  |
| lg    | 1rem      | 16  |
| xl    | 1.5rem    | 24  |
| full  | 9999px    | --  |

---

## 7. Shadows

| Token        | Value                                      |
|--------------|--------------------------------------------|
| subtle       | `0 1px 3px rgba(0, 0, 0, 0.1)`            |
| medium       | `0 4px 6px rgba(0, 0, 0, 0.1)`            |
| large        | `0 10px 15px rgba(0, 0, 0, 0.1)`          |
| focus        | `0 0 0 3px rgba(0, 194, 179, 0.1)`        |
| focusDanger  | `0 0 0 3px rgba(239, 68, 68, 0.1)`        |
| focusSuccess | `0 0 0 3px rgba(34, 197, 94, 0.1)`        |
| focusInfo    | `0 0 0 3px rgba(14, 165, 233, 0.1)`       |

---

## 8. Motion

### 8.1 Durations

| Token   | Value  | Use Case                |
|---------|--------|-------------------------|
| instant | 0ms    | Instant transitions     |
| fast    | 150ms  | Button clicks, toggles  |
| base    | 250ms  | Modal open, tab switch  |
| slow    | 500ms  | Page transitions        |
| slower  | 750ms  | Complex animations      |
| slowest | 1000ms | Onboarding sequences    |

### 8.2 Easing Curves

| Name             | Group    | Value                                     |
|------------------|----------|-------------------------------------------|
| ease             | Standard | `cubic-bezier(0.4, 0, 0.2, 1)`           |
| easeIn           | Standard | `cubic-bezier(0.4, 0, 1, 1)`             |
| easeOut          | Standard | `cubic-bezier(0, 0, 0.2, 1)`             |
| easeInOut        | Standard | `cubic-bezier(0.4, 0, 0.2, 1)`           |
| easeInQuart      | Quart    | `cubic-bezier(0.5, 0, 0.75, 0)`          |
| easeOutQuart     | Quart    | `cubic-bezier(0.25, 1, 0.5, 1)`          |
| easeInOutQuart   | Quart    | `cubic-bezier(0.76, 0, 0.24, 1)`         |
| easeInCubic      | Cubic    | `cubic-bezier(0.32, 0, 0.67, 0)`         |
| easeOutCubic     | Cubic    | `cubic-bezier(0.33, 1, 0.68, 1)`         |
| easeInOutCubic   | Cubic    | `cubic-bezier(0.65, 0, 0.35, 1)`         |
| sketchEase       | Sketch   | `cubic-bezier(0.25, 0.46, 0.45, 0.94)`   |
| sketchEaseIn     | Sketch   | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` |
| sketchEaseOut    | Sketch   | `cubic-bezier(0.215, 0.61, 0.355, 1)`    |
| sketchEaseInOut  | Sketch   | `cubic-bezier(0.645, 0.045, 0.355, 1)`   |

### 8.3 Animation Presets

| Preset      | Duration | Easing                            | Properties             |
|-------------|----------|-----------------------------------|------------------------|
| fadeIn      | 250ms    | `cubic-bezier(0.4, 0, 0.2, 1)`   | opacity                |
| slideUp     | 300ms    | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | transform, opacity |
| scaleIn     | 200ms    | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | transform, opacity |
| buttonPress | 150ms    | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | transform          |
| splitText   | 500ms    | `cubic-bezier(0.25, 0.1, 0.25, 1)` | transform, opacity (per word, 80ms stagger) |
| blurReveal  | 700ms    | `cubic-bezier(0.25, 0.1, 0.25, 1)` | opacity, filter        |
| countUp     | 1200ms   | ease-out cubic | numeric value (scroll-triggered) |
| drawIn      | 600ms    | `cubic-bezier(0.25, 0.1, 0.25, 1)` | transform scaleX       |

Always respect `prefers-reduced-motion`. Disable non-essential animations when the user preference is set.

### 8.4 Animation Philosophy

Motion serves **choreography, not decoration**. Every animation earns its place.

**Core principles:**
1. **Scroll as revelation** — sections reveal as the user scrolls. The page unfolds as a narrative.
2. **Choreographed entrances** — elements appear in sequence, not simultaneously. Headlines first, supporting content after. This creates rhythm.
3. **Restraint over spectacle** — 2–3 effects per page maximum. More effects ≠ more polish.
4. **Engineered confidence** — this is a security tool. Interactions feel precise and deliberate. No sparkles, no bounce, no whimsy.
5. **100% commitment** — if it animates, it animates with intention. Tentative animation is worse than none.

**Animation components** (framer-motion, `src/components/ui/`):
- `SplitText` — word-by-word staggered headline entrance
- `BlurText` — blur-to-clear text materialisation
- `CountUp` — scroll-triggered animated number counter

**Use:** SplitText on headlines, BlurText on subheadings, CountUp on stats, fade-up scroll wrappers, aurora/mesh backgrounds (muted), draw-in brand lines.

**Avoid:** Hyperspeed/warp/3D scenes, particle explosions, click sparks, parallax on content, hover animations on text, auto-playing loops on content elements.

---

## 9. CSS Custom Properties

Complete `:root` block mapping all key tokens to CSS variables. Paste into your global stylesheet or use as a reference for the theme provider.

```css
:root {
  /* ---- Primary (Serum Teal) ---- */
  --color-primary-50: #F0FDFA;
  --color-primary-100: #CCFBF1;
  --color-primary-200: #99F6E4;
  --color-primary-300: #5EEAD4;
  --color-primary-400: #2DD4BF;
  --color-primary-500: #00C2B3;
  --color-primary-600: #00A896;
  --color-primary-700: #008B7A;
  --color-primary-800: #006B5F;
  --color-primary-900: #004B44;
  --color-primary-foreground: #FFFFFF;

  /* ---- Secondary (Slate) ---- */
  --color-secondary-50: #F8FAFC;
  --color-secondary-100: #F1F5F9;
  --color-secondary-200: #E2E8F0;
  --color-secondary-300: #CBD5E1;
  --color-secondary-400: #94A3B8;
  --color-secondary-500: #64748B;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-800: #1E293B;
  --color-secondary-900: #0F172A;

  /* ---- Neutral ---- */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-300: #D4D4D4;
  --color-neutral-400: #A3A3A3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* ---- Backgrounds ---- */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-tertiary: #F1F5F9;
  --bg-inverse: #0F172A;

  /* ---- Text ---- */
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #64748B;
  --text-inverse: #FFFFFF;

  /* ---- Borders ---- */
  --border-primary: #E2E8F0;
  --border-secondary: #CBD5E1;
  --border-tertiary: #F1F5F9;
  --border-focus: #00C2B3;

  /* ---- Semantic (full 50-900 scales follow the same --color-{name}-{step} pattern) ---- */
  /* Only base (500) values shown; generate 50-900 from Section 2.5 tables above */
  --color-success-500: #22C55E;
  --color-warning-500: #F59E0B;
  --color-error-500: #EF4444;
  --color-info-500: #0EA5E9;

  /* ---- Semantic Backgrounds ---- */
  --bg-danger: #FEF2F2;
  --bg-success: #F0FDF4;
  --bg-info: #F0F9FF;
  --bg-warning: #FFFBEB;

  /* ---- Dark Mode Surfaces ---- */
  --dark-bg-primary: #0A0E1A;
  --dark-bg-secondary: #111827;
  --dark-bg-tertiary: #1E293B;
  --dark-bg-elevated: #263244;
  --dark-bg-overlay: rgba(0, 0, 0, 0.6);
  --dark-text-primary: #F1F5F9;
  --dark-text-secondary: #94A3B8;
  --dark-text-tertiary: #64748B;
  --dark-border-primary: #1E293B;
  --dark-border-secondary: #334155;
  --dark-border-tertiary: #475569;

  /* ---- Glassmorphism ---- */
  --glass-bg: rgba(17, 24, 39, 0.7);
  --glass-bg-hover: rgba(30, 41, 59, 0.8);
  --glass-border: rgba(71, 85, 105, 0.4);

  /* ---- Typography ---- */
  --font-heading: 'Satoshi', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, Monaco, monospace;
  --font-display: 'Satoshi', 'Inter', system-ui, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-7xl: 4.5rem;
  --text-8xl: 6rem;

  /* ---- Spacing ---- */
  --space-0: 0;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --space-40: 10rem;
  --space-48: 12rem;
  --space-64: 16rem;
  --space-80: 20rem;
  --space-96: 24rem;

  /* ---- Layout ---- */
  --container-max: 1200px;
  --container-narrow: 800px;
  --container-wide: 1400px;
  --navbar-height: 4rem;
  --navbar-height-mobile: 3.5rem;
  --sidebar-width: 16rem;
  --sidebar-width-collapsed: 4rem;
  --card-padding: 1.5rem;
  --card-padding-sm: 1rem;
  --card-padding-lg: 2rem;
  --card-gap: 1rem;
  --grid-columns: 12;
  --grid-gap: 1rem;

  /* ---- Border Radius ---- */
  --radius-sm: 0.125rem;
  --radius-base: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* ---- Shadows ---- */
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-large: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-focus: 0 0 0 3px rgba(0, 194, 179, 0.1);
  --shadow-focus-danger: 0 0 0 3px rgba(239, 68, 68, 0.1);
  --shadow-focus-success: 0 0 0 3px rgba(34, 197, 94, 0.1);
  --shadow-focus-info: 0 0 0 3px rgba(14, 165, 233, 0.1);

  /* ---- Motion ---- */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 500ms;
  --duration-slower: 750ms;
  --duration-slowest: 1000ms;

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sketch: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* ---- Z-Index ---- */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```
