# AllowanceGuard Design System

> **Source of truth**: `docs/design-tokens-handbook.md`
> **Palette**: Monochrome Pro — "The Institutional Authority"
> Old systems (PuredgeOS, Serum Teal, Crimson Signal) are deprecated.

## Brand Principles

1. **Controlled Aggression** — Bold type scale, confident whitespace, monochrome authority.
2. **Earned Trust** — Open-source, on-chain metrics, no fabricated testimonials.
3. **Relentless Clarity** — Dense data, clear hierarchy. Red = danger, white = action.
4. **Tactile Precision** — Depth, grain, engineered layering on true black.
5. **Zero Compromise** — WCAG AA+, Core Web Vitals, keyboard-first.

## Visual Signature — The Slash

A 5-degree diagonal element that brands every page:
- Card accents (3px diagonal stripe, left edge)
- Section dividers (angled clip-path)
- Button hover (diagonal sweep reveal)
- Max 2 per viewport

## Key Colours — Monochrome Pro

| Role | Token | Hex | Why |
|------|-------|-----|-----|
| Background | `--surface-base` | `#000000` | True Black canvas |
| Primary Action | `--primary` | `#FFFFFF` | Pure White — commands action |
| Secondary Border | `--border-strong` | `#3F3F46` | Zinc 700 outline buttons |
| Danger | `--destructive` | `#FF4B4B` | Vibrant Crimson — the ONLY color |
| Accent/Neutral | `--muted` | `#A1A1AA` | Cool Grey — labels, muted text |

> By keeping the site monochrome, the red "Revoke" button carries 10x
> more weight because it's the only color on the page.

## Typography

| Role | Font | Usage |
|------|------|-------|
| Display | Space Grotesk | Headings, hero |
| Body | Inter | UI text, paragraphs |
| Mono | JetBrains Mono | Addresses, amounts, code |

## Usage

```tsx
import { colors, typography, spacing } from '@/design/tokens'
```

Use Tailwind classes with CSS custom properties for all token values. See the full handbook at `docs/design-tokens-handbook.md`.

## Component Library

Located in `src/components/ui/`:
- `Button.tsx` — CVA variants: primary, secondary, ghost, destructive, outline
- `Card.tsx` — With glass variants, Slash accent
- `Input.tsx` — Labels, error states, focus ring
- `Badge.tsx` — StatusBadge, RiskBadge, ChainBadge (icon + label always)
- `Modal.tsx` — Focus trap, bottom sheet on mobile
- `Alert.tsx` — Semantic alerts + auto-dismiss toasts

## Rules

- **Colour never sole indicator** — always icon + label alongside
- **`prefers-reduced-motion`** — all motion must respect this
- **Dark-first** — design for dark mode, light as alternate
- **The Slash** — max 2 per viewport, restraint = impact
