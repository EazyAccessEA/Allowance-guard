# tokens.md

Token summary for both canons. Canonical values live in `tailwind.config.js` + `src/app/globals.css` (Ledger) and `src/design/tokens.ts` (Glass). This file is the reminder + council's floors, not the source of truth.

## Ledger canon (homepage + marketing)

**Use where:** homepage, blog, pricing, docs marketing landing, any `src/app/page.tsx` and `src/components/{Hero,HowItWorks,FeaturesPreview,StatisticsSection,CTABand,Testimonials,ChainLogoCarousel}.tsx`.

### Surface tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-paper` | `#F7F5F0` | Default paper section |
| `bg-paper-sub` | `#EFECE3` | Subtle divider / secondary section |
| `bg-paper-deep` | `#E6E2D5` | Tertiary section |
| `bg-oxblood` | `#2D0A0A` | The single inverse moment (CTABand only) |
| `bg-cream` | `#F7F5F0` | Type colour on oxblood |

### Text tokens

| Token | Contrast on paper | Usage |
|-------|-------------------|-------|
| `text-ink` | 17:1 | Body default |
| `text-ink-soft` | ~12:1 | Secondary body |
| `text-ink-muted` | ~7.4:1 | Tertiary / captions |
| `text-ink-whisper` | 5.18:1 on paper-deep | Metadata only — **Noor's floor** |

### Accents (all AA on paper)

| Token | Hex | Where |
|-------|-----|-------|
| `text-amber-deep` | `#854F08` | Display emphasis |
| `text-crimson-paper` | `#B3151F` | **Protected** — the word "approved." and equivalent headline accents |
| `text-ink-blue` | `#0B2545` | Links, strong citations |

### Rules + hairlines

- `border-ink-rule` = `rgba(15,17,21,0.14)` — default hairline
- `.ledger-rule` — strong ink hairline + amber hairline (signature divider)
- `.ledger-rule-short` — short variant for section intros
- `.dotted-leader` — "label ………… value" editorial row

### Type

| Token | Family | Usage |
|-------|--------|-------|
| `font-fraunces` | Fraunces (italic) | Display — signature move is oversized italic numerals |
| `font-plex` | IBM Plex Sans | Body, UI chrome |
| `font-mono` | JetBrains Mono | Metadata, code |

### Utilities (`src/app/globals.css`)

- `.paper` / `.paper-sub` / `.paper-deep` — section surfaces
- `.paper-card` — light card, letterpress drop shadow, no blur
- `.paper-card-raised` — elevated variant
- `.paper-pill` / `.paper-button` — chips and secondary CTAs
- `.grain` — SVG noise overlay (printed-paper texture)
- `.deckle-top` / `.deckle-bottom` — torn-paper transitions
- `.font-display-tight` / `.font-display-black` — Plex display tuning
- `.rule-amber-vert` — vertical amber column rule

### Protected moments (never change without council + user approval)

- The word **"approved."** (or equivalent headline accent) in `text-crimson-paper`. Everything else is ink on paper.
- The **single inverse moment** on the homepage: the CTABand oxblood section. Nowhere else.
- The **signature move**: oversized Fraunces italic numerals / Roman numerals as margin notation paired with `.ledger-rule`. One per major section.

## Glass canon (dashboard + docs + account)

**Use where:** `src/app/(dashboard)/**`, `src/app/docs/**`, `src/app/account/**`. Never on the homepage.

### Tokens (source: `src/design/tokens.ts`)

Midnight Amber palette. Canonical values in-repo. Standing rule: do not duplicate them here — always read from the file. Referencing them here would let them rot.

### Utilities (`src/app/globals.css`)

- `.glass-card` / `.glass-pill` / `.glass-button` / `.glass-drift` — active on dashboard/docs/account
- Not for use on homepage or any marketing surface

### Glass canon is deprecated-but-active

The glass system is the legacy PuredgeOS system kept operational for app surfaces. No new tokens should be added to it. New work on those surfaces still uses the existing token set; major overhauls are deferred pending the app redesign.

## Contrast + accessibility floors (Noor)

- Body copy on `bg-paper-deep`: minimum `text-ink-whisper` (5.18:1). Metadata only at that level.
- Body copy on `bg-paper`, `bg-paper-sub`: `text-ink-muted` or darker.
- Interactive elements: AA for focus ring, AA for text, AAA preferred on primary CTAs.
- Error text: accent red that holds AA on its container.
- No text on image without a scrim that brings contrast to AA.
- No colour-only meaning. Every colour-coded signal has a second cue (icon, label, pattern).

## Performance floors (Thane)

Full budget in `performance-budget.md`. Token-level notes:

- Icons inline as SVG. Import from a file only if reused in ≥3 components.
- Fonts: three families only (Fraunces, IBM Plex Sans, JetBrains Mono). Subset where possible.
- `.grain` is an inline SVG, not a raster. Do not swap for a PNG.

## Proposing a new token

Every new token goes through `design-token`. The proposal carries:
- Name + proposed value
- Surface(s) + use case
- Contrast check at all sizes
- Canon fit (Ledger or Glass)
- Replaces what (if anything)
- Migration plan for existing usage

Council review: Maren (visual), Kael (systems), Noor (AA VETO). If approved, the token ships in the canonical file (`tailwind.config.js` / `globals.css` / `src/design/tokens.ts`) and this file is updated to name it. Ad-hoc hex values do not ship.
