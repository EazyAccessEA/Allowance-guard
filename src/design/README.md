# AllowanceGuard Design System

> **Source of truth**: `docs/design-tokens-handbook.md`
> Old systems (PuredgeOS, Serum Teal) are deprecated.

## Brand Principles

1. **Controlled Aggression** — Bold colour, aggressive type scale, confident whitespace.
2. **Earned Trust** — Open-source, on-chain metrics, no fabricated testimonials.
3. **Relentless Clarity** — Dense data, clear hierarchy.
4. **Tactile Precision** — Depth, grain, engineered layering.
5. **Zero Compromise** — WCAG AA+, Core Web Vitals, keyboard-first.

## Visual Signature — The Slash

A 5-degree diagonal element that brands every page:
- Card accents (3px diagonal stripe, left edge)
- Section dividers (angled clip-path)
- Button hover (diagonal sweep reveal)
- Max 2 per viewport

## Key Colours

| Role | Token | Hex |
|------|-------|-----|
| Primary | `--color-primary-500` | `#E53E3E` (Crimson Signal) |
| Accent | `--color-accent-500` | `#00F0C8` (Volt Mint) |
| Dark bg | `--surface-base` | `#0B1120` |
| Light bg | `--surface-base` | `#FFFFFF` |

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
