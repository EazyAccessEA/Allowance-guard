# AllowanceGuard Design System

> **Source of truth**: `docs/design-tokens-handbook.md`
> **Palette**: Midnight Amber — "The Warning System"
> Old systems (PuredgeOS, Serum Teal, Crimson Signal, Monochrome Pro) are deprecated.

## Brand Principles

1. **Controlled Aggression** — Bold type scale, confident whitespace, amber authority.
2. **Earned Trust** — Open-source, on-chain metrics, no fabricated testimonials.
3. **Relentless Clarity** — Dense data, clear hierarchy. Amber = scanning, Red = danger only.
4. **Tactile Precision** — Depth, grain, engineered layering on deep navy.
5. **Zero Compromise** — WCAG AA+, Core Web Vitals, keyboard-first.

## Visual Signature — The Slash

A 5-degree diagonal element that brands every page:
- Card accents (3px diagonal stripe, left edge)
- Section dividers (angled clip-path)
- Button hover (diagonal sweep reveal)
- Max 2 per viewport

## Key Colours — Midnight Amber

| Role | Token | Hex | Contrast on Navy | Why |
|------|-------|-----|-----------------|-----|
| Background | `--surface-base` | `#0F172A` | — | Deep Navy canvas |
| Primary Action | `--primary` | `#F59E0B` | 6.4:1 AA | Vivid Amber — scanning, CTAs |
| Safe/Links | `--accent` | `#38BDF8` | 7.2:1 AA | Sky Blue — safe states, links |
| Danger | `--destructive` | `#EF4444` | 4.6:1 AA | Red — revoke, threats only |
| Headings | white | `#FFFFFF` | 17:1 AAA | Pure white on navy |
| Body Text | `--muted-foreground` | `#CBD5E1` | 10.6:1 AAA | Slate 300 — secondary text |
| Muted | `--muted` | `#94A3B8` | 6.4:1 AA | Slate 400 — tertiary text |

> Amber is the universal color for "Caution" and "Scanning."
> It tells the user: "We are currently scanning and identifying risks."

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
