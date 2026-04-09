# AllowanceGuard Design System

> **Source of truth**: `docs/design-tokens-handbook.md`
> **Homepage palette**: Ledger aesthetic — warm bone paper, ink body, single oxblood beat (handbook §11)
> **Dashboard / docs / account palette**: Midnight Amber — deep navy canvas, amber = scanning, red = danger (handbook §2)
> Old systems (PuredgeOS, Serum Teal, Crimson Signal, Monochrome Pro) are deprecated.

AllowanceGuard runs **two active palettes** in parallel:

1. **Ledger aesthetic (homepage)** — light-first editorial publication. Paper / ink / oxblood. Fraunces italic display + IBM Plex Sans body + JetBrains Mono metadata. Ships in `Hero`, `HowItWorks`, `StatisticsSection`, `FeaturesPreview`, `CTABand`, `Testimonials`, `ChainLogoCarousel`.
2. **Midnight Amber (app surfaces)** — deep navy dashboard. Amber CTAs, sky-blue safe/links, red danger. Ships in `AppArea`, `AllowanceTable`, docs pages, account/billing pages.

The two palettes share a handful of primitives (crimson for destructive, amber hairlines as accent, `prefers-reduced-motion` respect) but are otherwise independent. Do not mix them on a single page.

## Brand Principles (apply to both palettes)

1. **Controlled Aggression** — Bold type scale, confident whitespace, accent colour earns its place.
2. **Earned Trust** — Open-source, on-chain metrics, no fabricated testimonials.
3. **Relentless Clarity** — Dense data, clear hierarchy. Amber = scanning, Red = danger only.
4. **Tactile Precision** — On dark: depth, grain, engineered layering. On paper: letterpress shadows, editorial rules, print textures.
5. **Zero Compromise** — WCAG AA+, Core Web Vitals, keyboard-first.

## Ledger Aesthetic (homepage) — quick reference

| Role           | Token                 | Hex                   | Contrast       |
|----------------|-----------------------|-----------------------|----------------|
| Paper surface  | `paper`               | `#F7F5F0`             | canvas         |
| Tinted surface | `paper-sub`           | `#EFECE3`             | canvas         |
| Strong tint    | `paper-deep`          | `#E6E2D5`             | canvas         |
| Body text      | `ink`                 | `#0F1115`             | 17:1 AAA       |
| Secondary text | `ink-soft`            | `#2A2D33`             | 12:1 AAA       |
| Tertiary text  | `ink-muted`           | `#4A4D54`             | 7.4:1 AAA      |
| Metadata       | `ink-whisper`         | `#585C64`             | 6.16–5.18 AA   |
| Hairlines      | `ink-rule`            | `rgba(15,17,21,0.14)` | —              |
| Amber accent   | `amber-deep`          | `#854F08`             | 6.18–5.19 AA   |
| Protected red  | `crimson-paper`       | `#B3151F`             | 6.33–5.32 AA   |
| CTABand bg     | `oxblood`             | `#2D0A0A`             | —              |
| Type on oxblood| `cream`               | `#F7F5F0`             | 12.4:1 AAA     |

**Utilities**: `.paper`, `.paper-sub`, `.paper-deep`, `.paper-card`, `.paper-card-raised`, `.paper-pill`, `.paper-button`, `.grain`, `.ledger-rule`, `.dotted-leader`, `.deckle-top`, `.font-display-tight`, `.rule-amber-vert`.

**Fonts**: Fraunces (display, italic), IBM Plex Sans (body), JetBrains Mono (metadata).

## Midnight Amber (dashboard/docs/account) — quick reference

| Role           | Token                  | Hex       | Contrast on Navy |
|----------------|------------------------|-----------|------------------|
| Background     | `--surface-base`       | `#0F172A` | —                |
| Primary Action | `--primary`            | `#F59E0B` | 6.4:1 AA         |
| Safe/Links     | `--accent`             | `#38BDF8` | 7.2:1 AA         |
| Danger         | `--destructive`        | `#EF4444` | 4.6:1 AA (large) |
| Headings       | white                  | `#FFFFFF` | 17:1 AAA         |
| Body text      | `--muted-foreground`   | `#CBD5E1` | 10.6:1 AAA       |
| Muted          | `--muted`              | `#94A3B8` | 6.4:1 AA         |

**Utilities (legacy glass canon)**: `.glass-card`, `.glass-pill`, `.glass-button`, `.glass-drift`. Still in `src/app/globals.css` for use on dashboard/docs surfaces only.

**Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (mono).

## Usage

```tsx
// Homepage (Ledger) — use Tailwind tokens directly
<section className="paper grain">
  <h1 className="font-plex text-ink font-bold">Headline</h1>
  <div className="paper-card p-8">…</div>
</section>

// Dashboard / docs (Midnight Amber) — use tokens + legacy glass
import { colors, typography, spacing } from '@/design/tokens'

<div className="bg-surface-base">
  <div className="glass-card p-6">…</div>
</div>
```

See the full handbook at `docs/design-tokens-handbook.md`.

## Component Library

Located in `src/components/ui/`:
- `Button.tsx` — CVA variants: primary, secondary, ghost, destructive, outline. Paper-theme variants for Ledger surfaces.
- `Card.tsx` — Legacy dashboard card (glass canon)
- `Input.tsx` — Labels, error states, focus ring
- `Badge.tsx` — StatusBadge, RiskBadge, ChainBadge (icon + label always)
- `Modal.tsx` — Focus trap, bottom sheet on mobile
- `Alert.tsx` — Semantic alerts + auto-dismiss toasts
- `SectionHeader.tsx` — Ledger section header with numeral + eyebrow + Fraunces italic title

## Rules (both palettes)

- **Colour never sole indicator** — always icon + label alongside
- **`prefers-reduced-motion`** — all motion must respect this
- **Light-first on homepage, dark-first on app** — do not mix surface treatments within a single page
- **Protected crimson accent** — one word per headline may be `text-crimson-paper` (Ledger) or `text-crimson-500` (Midnight Amber). Never more than one.
