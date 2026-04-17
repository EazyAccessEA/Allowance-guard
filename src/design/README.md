# AllowanceGuard Design System

> **Source of truth**: `docs/design-tokens-handbook.md` §11 (Ledger, canonical)
> **Canon decision**: `projects/allowanceguard/decisions/0007-unified-ledger-canon.md`
> **Canon spec**: `projects/allowanceguard/DESIGN.md`

AllowanceGuard runs **one canon: Ledger**. Warm bone paper, ink body, single oxblood beat per purpose. Fraunces italic display + IBM Plex Sans body + JetBrains Mono metadata. Applies to every surface — homepage, blog, pricing, docs, dashboard, account, auth, modals.

The Midnight Amber / Glass canon that previously covered dashboard + docs + account was retired on 2026-04-17 (ADR 0007). `src/design/tokens.ts` — the Midnight Amber token source — has been deleted. `.glass-*` utilities have been removed from `src/app/globals.css`. Legacy `primary-*` / `secondary-*` / `neutral-*` / `background-*` scales in `tailwind.config.js` are being retired after consumer migration (ADR 0007 Phase E).

## Brand Principles

1. **Controlled Aggression** — Bold type scale, confident whitespace, accent colour earns its place.
2. **Earned Trust** — Open-source, on-chain metrics, no fabricated testimonials.
3. **Relentless Clarity** — Dense data, clear hierarchy. Amber = emphasis, crimson = protected destructive moment, oxblood = inverse punctuation.
4. **Tactile Precision** — Letterpress shadows, editorial rules, print textures. Paper feels crafted, not flat.
5. **Zero Compromise** — WCAG AA+, Core Web Vitals, keyboard-first.

## Ledger — quick reference

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

**Utilities**: `.paper`, `.paper-sub`, `.paper-deep`, `.paper-card`, `.paper-card-raised`, `.paper-pill`, `.paper-button`, `.grain`, `.ledger-rule`, `.dotted-leader`, `.deckle-top`, `.font-display-tight`, `.rule-amber-vert`. Prose content uses `className="prose prose-ink"` (theme wired in `tailwind.config.js` §`theme.extend.typography.ink`).

**Fonts**: Fraunces (display, italic), IBM Plex Sans (body + UI chrome), JetBrains Mono (metadata + code).

**State ramps** (canon-agnostic utility palettes, not a second surface system): `semantic-success-*`, `semantic-warning-*`, `semantic-error-*`, `semantic-info-*`, `crimson-*`, `amber-*`, `sky-*`. Use `-600`/`-700` tints for text on paper; `-50`/`-100` for paper-sub-tinted backgrounds.

## Usage

```tsx
// Every surface (homepage + app alike) — Tailwind Ledger tokens
<section className="paper grain">
  <h1 className="font-display-tight text-ink font-bold">Headline</h1>
  <div className="paper-card p-8">
    <p className="font-plex text-ink-muted">…</p>
  </div>
</section>

// Destructive / inverse moment — oxblood punctuation
<button className="bg-oxblood text-cream font-plex font-semibold px-4 py-2">
  Revoke
</button>
```

See `projects/allowanceguard/DESIGN.md` for the full canon spec and rule set.

## Component Library

Located in `src/components/ui/`:
- `Button.tsx` — CVA variants: primary, secondary, ghost, destructive, outline. Ledger-tuned.
- `Card.tsx` — Default paper-deep card; semantic tints via `variant` (success/warning/danger/info/subtle/accent/ghost/elevated/outlined).
- `Input.tsx` — Labels, error states, focus ring on amber-deep.
- `Badge.tsx` — `StatusBadge`, `RiskBadge`, `ChainBadge` — icon + label always.
- `Modal.tsx` — Focus trap; Ledger paper panel on a paper-deep scrim.
- `Alert.tsx` — Semantic alerts + auto-dismiss toasts.
- `SectionHeader.tsx` — Ledger section header with numeral + eyebrow + Fraunces italic title.

## Rules

- **One canon** — Ledger covers every AllowanceGuard surface.
- **No `dark:` variants** — single-theme product.
- **No retired tokens** — don't reintroduce `.glass-*`, `primary-*`/`secondary-*`/`neutral-*`/`background-*`/`text-*`/`surface-*` legacy scales, `bg-gray-*`, `bg-slate-*`, `bg-neutral-*`, `bg-white` on any surface.
- **Colour never sole indicator** — always icon + label alongside.
- **`prefers-reduced-motion`** — all motion must respect this.
- **Inverse moments are purpose-scoped** — the homepage CTABand uses oxblood; authenticated surfaces may use oxblood for destructive confirms and critical errors. One per purpose.
- **Protected crimson accent** — one word per headline may be `text-crimson-paper`. Never more than one.
