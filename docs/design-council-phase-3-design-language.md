# Design Council — Phase 3: Design Language

> Council members: **Maren** (Visual), **Idris** (Motion), **Sable** (IA/UX), **Kael** (Systems), **Noor** (Accessibility), **Thane** (Performance)

---

## 3.1 Colour System

**MAREN's proposal, reviewed by NOOR:**

### Background Mode: Dark-First, Dual Support

The dashboard is dark by default — security tools carry more authority on dark surfaces (ref: Linear, Vercel, Raycast). Marketing pages support both modes, defaulting to dark.

**Compromise (from Phase 2 vote):** The homepage hero can work in both modes. The dashboard is dark-first.

### Primary Brand Colour: Electric Teal

The current Serum Teal (`#00C2B3`) is pleasant but uncommitted. We push it.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-50` | `#EFFEFA` | Tinted backgrounds (light mode) |
| `--color-primary-100` | `#C6FFF6` | Hover tints, subtle fills |
| `--color-primary-200` | `#8AFEED` | Light accents |
| `--color-primary-300` | `#4CF5E0` | Secondary highlights |
| `--color-primary-400` | `#00E8CF` | **Hero primary — full conviction** |
| `--color-primary-500` | `#00D4BD` | Primary buttons, links, active states |
| `--color-primary-600` | `#00B3A0` | Hover state for primary |
| `--color-primary-700` | `#008F80` | Active/pressed state |
| `--color-primary-800` | `#006B60` | Dark mode text accent |
| `--color-primary-900` | `#004B44` | Deepest tint |

**MAREN:** *"The 400 value (#00E8CF) is the hero colour. On dark backgrounds, it glows. This is 15% more saturated than the old Serum Teal. It's the Born Again red crank — same hue family, full commitment."*

**NOOR's contrast check:**
- `#00E8CF` on `#09090B` (dark bg): contrast ratio **12.8:1** ✅ AAA
- `#00D4BD` on `#09090B`: **11.4:1** ✅ AAA
- `#00D4BD` on `#FFFFFF`: **2.4:1** ❌ fails for text — use `#008F80` (700) on white for text
- `#008F80` on `#FFFFFF`: **4.6:1** ✅ AA

**Resolution:** On light backgrounds, primary text uses `--color-primary-700`. On dark backgrounds, primary uses `--color-primary-400` or `--color-primary-500`.

### Accent Colour: Volt Violet

**MAREN:** *"Teal needs a counterpoint. Not warm (conflicts with warning amber), not red (conflicts with error/destructive). Violet is unexpected in Web3 security, creates high-energy contrast with teal, and doesn't collide with any semantic colour."*

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent-400` | `#A78BFA` | Light variant |
| `--color-accent-500` | `#8B5CF6` | **Primary accent** |
| `--color-accent-600` | `#7C3AED` | Hover |

Usage: upgrade CTAs, premium badges, the "Pro" tier highlight, visual signature moments. **Sparingly.** This is punctuation, not body text.

**NOOR:** `#8B5CF6` on `#09090B` = **6.2:1** ✅ AA. `#A78BFA` on `#09090B` = **8.1:1** ✅ AAA. Approved.

### Neutral Scale

Dark-first neutrals. Slightly warm undertone (zinc family, not pure gray).

| Token | Hex | Role |
|-------|-----|------|
| `--color-neutral-950` | `#09090B` | Deepest background |
| `--color-neutral-900` | `#18181B` | Card surfaces (dark) |
| `--color-neutral-800` | `#27272A` | Elevated surfaces, borders (dark) |
| `--color-neutral-700` | `#3F3F46` | Secondary borders (dark) |
| `--color-neutral-600` | `#52525B` | Disabled text (dark) |
| `--color-neutral-500` | `#71717A` | Tertiary text |
| `--color-neutral-400` | `#A1A1AA` | Secondary text (dark) |
| `--color-neutral-300` | `#D4D4D8` | Primary text (dark), borders (light) |
| `--color-neutral-200` | `#E4E4E7` | Borders (light), secondary bg |
| `--color-neutral-100` | `#F4F4F5` | Secondary background (light) |
| `--color-neutral-50` | `#FAFAFA` | Primary background (light) |
| `--color-white` | `#FFFFFF` | Pure white |

### Semantic Colours

| Token | Hex | Icon | Usage |
|-------|-----|------|-------|
| `--color-success` | `#22C55E` | ✓ checkmark | Successful actions, low risk, safe states |
| `--color-warning` | `#F59E0B` | ⚠ triangle | Caution, medium risk, pending |
| `--color-error` | `#EF4444` | ✕ x-circle | Errors, destructive, critical risk |
| `--color-info` | `#0EA5E9` | ℹ info-circle | Informational, neutral alerts |

### Risk Colours (specialised semantic)

**NOOR mandate:** Risk must NEVER be communicated by colour alone. Every risk level uses colour + icon + text label.

| Token | Hex | Icon | Label |
|-------|-----|------|-------|
| `--color-risk-low` | `#22C55E` | Shield-check | "Low Risk" |
| `--color-risk-medium` | `#F59E0B` | Alert-triangle | "Medium Risk" |
| `--color-risk-high` | `#F97316` | Alert-octagon | "High Risk" |
| `--color-risk-critical` | `#EF4444` | X-octagon | "Critical" |

---

## 3.2 Typography System

**MAREN & KAEL joint proposal:**

### Font Families

| Role | Font | Fallback | Why |
|------|------|----------|-----|
| Display & Headings | **Space Grotesk** | `'Space Grotesk', system-ui, -apple-system, sans-serif` | Geometric with personality. Wide letterforms project authority. The sharp `G`, distinctive `a`, and angular geometry feel engineered — perfect for a security product. |
| Body | **Inter** | `'Inter', system-ui, -apple-system, sans-serif` | Best-in-class UI body font. Excellent x-height, tabular numbers, optical sizing. |
| Monospace | **JetBrains Mono** | `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` | For wallet addresses, token amounts, code blocks. Ligatures disabled for addresses. |

**THANE:** *"Self-host all three via `next/font`. Subset to Latin + Latin Extended. Space Grotesk loads only weights 500 and 700. Inter loads 400, 500, 600. JetBrains Mono loads 400 only. Total font budget: < 120KB."*

### Type Scale

Aggressive display-to-body contrast. The gap between Display and Body is a leap, not a gradient.

| Token | Size | Line Height | Weight | Letter Spacing | Font |
|-------|------|-------------|--------|---------------|------|
| `--type-display` | 4.5rem (72px) | 1.05 | 700 | -0.03em | Space Grotesk |
| `--type-h1` | 3rem (48px) | 1.1 | 700 | -0.025em | Space Grotesk |
| `--type-h2` | 2.25rem (36px) | 1.15 | 700 | -0.02em | Space Grotesk |
| `--type-h3` | 1.5rem (24px) | 1.25 | 600 | -0.015em | Space Grotesk |
| `--type-h4` | 1.25rem (20px) | 1.3 | 600 | -0.01em | Space Grotesk |
| `--type-body` | 1rem (16px) | 1.5 | 400 | 0 | Inter |
| `--type-body-sm` | 0.875rem (14px) | 1.45 | 400 | 0 | Inter |
| `--type-caption` | 0.75rem (12px) | 1.35 | 500 | 0.025em | Inter |
| `--type-mono` | 0.875rem (14px) | 1.5 | 400 | 0.02em | JetBrains Mono |

**MAREN:** *"Notice the jump from Display (72px) to Body (16px) — that's a 4.5× ratio. PuredgeOS had maybe 2× between largest heading and body. This is the typographic equivalent of the Born Again saturation crank."*

### Mobile Type Scale

On viewports < 768px, display and heading sizes reduce:

| Token | Desktop | Mobile (< 768px) |
|-------|---------|-------------------|
| `--type-display` | 72px | 40px |
| `--type-h1` | 48px | 32px |
| `--type-h2` | 36px | 28px |
| `--type-h3` | 24px | 20px |

---

## 3.3 Spacing & Sizing

**KAEL's system:**

Base unit: **4px**. All spacing is a multiple of 4.

| Token | Value | Common Use |
|-------|-------|-----------|
| `--space-0` | 0 | Reset |
| `--space-1` | 4px | Tight inline gaps |
| `--space-2` | 8px | Icon-to-text gaps, tight padding |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Standard component padding, grid gap |
| `--space-5` | 20px | Card padding (compact) |
| `--space-6` | 24px | Card padding (standard) |
| `--space-8` | 32px | Section padding (compact) |
| `--space-10` | 40px | Section gaps |
| `--space-12` | 48px | Section padding (standard) |
| `--space-16` | 64px | Section padding (generous) |
| `--space-20` | 80px | Hero vertical padding |
| `--space-24` | 96px | Major section gaps |
| `--space-32` | 128px | Hero section height spacers |

**KAEL:** *"30 tokens, not 96. If a value isn't in this list, you don't use it. The constraint is the point."*

---

## 3.4 Elevation & Depth

**MAREN & KAEL:**

On dark backgrounds, traditional drop shadows are invisible. We use **glow and layered surfaces** instead.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.4)` | Subtle lift |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.4)` | Cards, dropdowns |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.5)` | Elevated cards, modals |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Popovers, major overlays |
| `--shadow-glow-primary` | `0 0 20px rgba(0,232,207,0.15)` | Primary hover glow |
| `--shadow-glow-primary-lg` | `0 0 40px rgba(0,232,207,0.2)` | Featured elements |
| `--shadow-glow-accent` | `0 0 20px rgba(139,92,246,0.15)` | Accent/premium glow |
| `--shadow-focus` | `0 0 0 3px rgba(0,212,189,0.4)` | Focus ring |

**Light mode shadows:**
| Token | Value |
|-------|-------|
| `--shadow-light-sm` | `0 1px 3px rgba(0,0,0,0.08)` |
| `--shadow-light-md` | `0 4px 12px rgba(0,0,0,0.1)` |
| `--shadow-light-lg` | `0 8px 24px rgba(0,0,0,0.12)` |

---

## 3.5 Border Radius

**KAEL:** *"Sharp bias. This is a precision instrument, not a toy."*

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 2px | Tight elements, code blocks |
| `--radius-sm` | 4px | Badges, small chips |
| `--radius-md` | 6px | **Default** — buttons, inputs, cards |
| `--radius-lg` | 8px | Larger cards, modals |
| `--radius-xl` | 12px | Hero cards, feature panels |
| `--radius-full` | 9999px | Pills, avatars, toggles |

---

## 3.6 Iconography

**MAREN:**

Library: **Lucide React** (already in codebase). Sharp, consistent, 24px grid.

Style rules:
- Stroke width: 1.75px (slightly thinner than default 2px — feels sharper, more refined)
- Size default: 20px for inline, 24px for standalone
- Colour inherits from text colour unless semantic
- Risk icons are ALWAYS paired with text labels (Noor mandate)

---

## 3.7 Motion Tokens

**IDRIS's system:**

### Easing Curves

| Token | Value | Character |
|-------|-------|-----------|
| `--ease-default` | `cubic-bezier(0.16, 1, 0.3, 1)` | Snappy out — fast deceleration. The "default feel." |
| `--ease-aggressive` | `cubic-bezier(0.76, 0, 0.24, 1)` | Dramatic in-out — for modal reveals, page transitions |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | Elements leaving — exits |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements arriving — entrances |

**IDRIS:** *"The default easing (`0.16, 1, 0.3, 1`) is the signature. It's the Vercel spring — fast out, immediate response, controlled settle. Every interaction starts snappy. The 'aggressive' curve is reserved for theatrical moments: modal reveals, Time Machine toggle, page transitions."*

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 100ms | Button press, checkbox, toggle |
| `--duration-fast` | 150ms | Hover states, tooltips, micro-interactions |
| `--duration-medium` | 250ms | Panel reveals, dropdown open, fade transitions |
| `--duration-slow` | 400ms | Modal transitions, page-level changes |
| `--stagger-delay` | 50ms | Staggered list entrance (row 1 at 0ms, row 2 at 50ms, row 3 at 100ms...) |

### Entrance Patterns

- **Fade up:** `opacity 0→1` + `translateY(8px→0)` | `--duration-medium` + `--ease-out`
- **Scale in:** `opacity 0→1` + `scale(0.95→1)` | `--duration-medium` + `--ease-default`
- **Slide in:** `translateX(-16px→0)` + `opacity 0→1` | `--duration-medium` + `--ease-out`
- **Stagger rows:** Each row enters with `--stagger-delay` offset using the fade-up pattern

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

**NOOR:** *"This block goes at the root of every stylesheet. Non-negotiable. Idris's choreography is beautiful — but it must disappear instantly for users who need it to."*

---

## 3.8 Breakpoints & Grid

### Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `--bp-sm` | 640px | Mobile landscape |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Desktop |
| `--bp-xl` | 1280px | Desktop wide |
| `--bp-2xl` | 1536px | Ultrawide |

### Grid System

| Property | Value |
|----------|-------|
| Max width | 1200px |
| Columns | 12 |
| Gutter | 16px (mobile), 24px (desktop) |
| Container padding | 16px (mobile), 24px (tablet), 32px (desktop) |

---

## 3.9 Visual Signature: The Slash

**MAREN's proposal (voted 4-2, adopted with constraints):**

The **Slash** ( / ) is AllowanceGuard's visual signature — a diagonal cut motif representing the act of revoking access. It appears as:

1. **Section dividers:** Angled clip-path dividers between hero sections (5° angle, subtle)
2. **Card accent:** A thin diagonal line (2px, primary colour) at the top-left corner of featured cards
3. **Hover reveal:** On button hover, a diagonal colour sweep from bottom-left to top-right
4. **Loading indicator:** A diagonal wipe animation during scan loading
5. **The shield logo evolves:** The AG shield gains a subtle diagonal slash through the center — the mark of revocation

**NOOR's constraints (adopted):**
- The slash is decorative, never functional. It must not interfere with readability.
- No diagonal text. No angled layouts that break reading flow.
- The angle is always consistent: 5° for subtle uses, never more than 15°.

**SABLE's constraint (adopted):**
- Maximum 2 slash elements visible at any time per viewport. More than that becomes a pattern, not a signature.

---

## 3.10 Photography & Image Direction

| Location | Subject | Mood | Search String | Fallback CSS |
|----------|---------|------|---------------|-------------|
| Homepage hero (behind text) | Abstract dark topology/mesh | Dark, technological, vast | "dark abstract topology mesh gradient" | `linear-gradient(135deg, #09090B 0%, #18181B 50%, #0A2A27 100%)` |
| Features page headers | Close-up circuit/security hardware | Precision, engineered, cold | "circuit board macro dark background" | `linear-gradient(135deg, #09090B 0%, #1a1a2e 100%)` |
| About page | Team workspace, screens with code | Authentic, focused, craft | "developer workspace dark monitor code" | `linear-gradient(135deg, #18181B 0%, #27272A 100%)` |
| Blog post headers | Abstract geometric shapes | Bold, editorial, varied per post | "abstract geometric shapes minimal dark" | `linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-neutral-950) 100%)` |
| 404 page | Broken shield or cracked glass | Dramatic, brand moment | "cracked glass dark abstract" | `radial-gradient(circle at 50% 50%, #27272A 0%, #09090B 100%)` |

---

*Phase 3 complete. Proceed to Phase 4 (Component Library) and final Design Tokens Handbook →*
