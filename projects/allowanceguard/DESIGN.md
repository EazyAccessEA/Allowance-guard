# AllowanceGuard — Design System

## TL;DR

Two canons run in parallel:

- **Ledger aesthetic** (active — homepage canon): warm paper, ink body, single oxblood beat. Fraunces + IBM Plex Sans. Paper utilities in `src/app/globals.css`.
- **Midnight Amber / glass canon** (active — dashboard/docs/account): dark canvas, glass cards, legacy PuredgeOS tokens in `src/design/tokens.ts`.

Never mix. Homepage uses paper. App surfaces use glass. Both respect WCAG AA (Noor's veto).

## Authority

The design system is governed by the redesign specs in `docs/`. The old "PuredgeOS" system is deprecated for new work. All new UI work must follow the redesign process.

### Design Spec Documents (source of truth)

- `docs/allowanceguard-1-strategy-spec (3).md` — Part 1: Strategy & Design Language (Phases 1–4)
- `docs/allowanceguard-2-build (3).md` — Part 2: Build specifications (Phases 5–7)
- `docs/design-tokens-handbook.md` — the Design Tokens Handbook (§10 glass historical, §11 Ledger)

## The Five Laws

1. **Saturation Over Safety** — whatever the colours, OWN them. Push saturation. Push contrast.
2. **Strip, Then Amplify** — kill everything that doesn't earn space. Make what survives impossible to ignore.
3. **Materiality** — surfaces feel crafted. Subtle grain, engineered depth, tactile quality. Not flat.
4. **One Signature Move** — one recurring visual element that brands every page without a logo.
5. **Confidence in the Departure** — break clean from PuredgeOS. No soft transition. Own the new identity.

## Design Directives

- **Type**: Display = declarations. Aggressive scale contrast. Body with backbone.
- **Colour**: Every colour earns its place. Accent = punctuation (rare, powerful). Council decides palette.
- **Motion**: Sharp easing, choreographed entrances, scroll as revelation. `prefers-reduced-motion` mandatory.
- **Imagery**: Editorial, not stock. Bold cropping. No filler.
- **Layout**: Break the grid with purpose. Whitespace as confidence. Density contrast.

## Design Council Process

Colours, typography, spacing, and component specs are produced through the Design Council process (see `memory/PROCESS.md` for members). Output is a **Design Tokens Handbook** with CSS custom properties that becomes the implementation spec.

## Ledger Aesthetic (active — homepage canon)

> **"Editorial financial publication."** — warm bone paper, ink body, a single oxblood beat.

The homepage uses the **Ledger aesthetic** — a light-first editorial redesign applied across the marketing surface. It establishes a light → dark → light rhythm (paper sections broken only by the single oxblood CTABand) and replaces all glass treatments on the homepage with paper surfaces, ink line-art, and Fraunces italic display type.

### Tokens (Tailwind)

- Surfaces: `bg-paper` (#F7F5F0), `bg-paper-sub` (#EFECE3), `bg-paper-deep` (#E6E2D5), `bg-oxblood` (#2D0A0A), `bg-cream` (#F7F5F0 — type on oxblood)
- Text: `text-ink` (body 17:1), `text-ink-soft` (~12:1), `text-ink-muted` (~7.4:1), `text-ink-whisper` (metadata, AA)
- Rules: `border-ink-rule` (rgba(15,17,21,0.14)) for hairlines
- Accents: `text-amber-deep` (#854F08, AA on paper), `text-crimson-paper` (#B3151F, AA on paper), `text-ink-blue` (#0B2545)
- Type: `font-fraunces` (display, italic), `font-plex` (IBM Plex Sans body), `font-mono` (JetBrains Mono metadata)

### Utilities (`src/app/globals.css`)

- `.paper` / `.paper-sub` / `.paper-deep` — section surfaces
- `.paper-card` — light card with letterpress drop shadow, no blur
- `.paper-card-raised` — elevated variant for featured content
- `.paper-pill` / `.paper-button` — chips and secondary CTAs
- `.grain` — inline SVG noise overlay for printed-paper texture
- `.ledger-rule` — double separator (strong ink hairline + amber hairline)
- `.ledger-rule-short` — short variant for section intros
- `.dotted-leader` — editorial "label ………… value" table row
- `.deckle-top` — torn-paper transition between dark and paper sections
- `.font-display-tight` / `.font-display-black` — Plex display tuning
- `.rule-amber-vert` — vertical amber column rule

### Rules

1. Homepage sections use `.paper` / `.paper-sub` / `.paper-deep` with `.grain` for texture. Do not introduce `bg-white`, `bg-slate-*`, or the glassmorphism utilities on homepage surfaces.
2. The signature move is oversized Fraunces italic numerals / roman numerals as margin notation, paired with `.ledger-rule`. One per major section.
3. The **single inverse moment** on the homepage is the CTABand (oxblood background, cream Fraunces, protected crimson accent word). No other dark sections.
4. Protected colour moment: the word "approved." (or equivalent headline accent) stays `text-crimson-paper`. Everything else is ink on paper.
5. Accessibility (Noor's veto): `ink-whisper` is the lowest-contrast text token allowed on paper (5.18:1 on paper-deep). `ink-muted` and above are required for body copy.
6. Performance (Thane): Vanta NET has been removed from the homepage (−180KB bundle). Do not re-introduce WebGL backgrounds on marketing pages.
7. Motion: all entrance animations respect `prefers-reduced-motion`. `.ledger-rule::after` amber glow is also disabled under that query.

### Where Ledger lives (homepage)

- `Hero.tsx` — `.paper .grain .deckle-bottom`, compass SVG watermark, Fraunces/Plex headline, `.paper-card-raised` connected-wallet panel
- `HowItWorks.tsx` — `.paper .grain`, featured + compact steps in `.paper-card`/`.paper-card-raised`, ink line-art icons
- `FeaturesPreview.tsx` — `.paper .grain`, alternating editorial rows with ink line-art diagrams in `.paper-card-raised`
- `StatisticsSection.tsx` — `.paper-sub`, giant Fraunces italic display metric, `.dotted-leader` supporting rows
- `CTABand.tsx` — `bg-oxblood` (the single inverse moment)
- `Testimonials.tsx` — `.paper .grain`, featured Fraunces pull-quote + grid of `.paper-card` quotes
- `ChainLogoCarousel.tsx` — `.paper-sub` closing bookend

## Legacy glass canon (dashboard/docs/account)

The `.glass-card` / `.glass-pill` / `.glass-button` / `.glass-drift` utilities remain in `src/app/globals.css` for the app dashboard, docs, and account pages which still run on the dark Midnight Amber canvas. They are **not** to be used on the homepage. See `docs/design-tokens-handbook.md` §10 (historical) and §11 (Ledger).

`src/design/tokens.ts` holds the Midnight Amber token set which remains the source of truth for the dark app surfaces. The homepage does not consume these tokens — it uses the Ledger tokens defined in `tailwind.config.js` and `src/app/globals.css`.

## Component Library

Located in `src/components/ui/`:

- `Button.tsx` — CVA variants: primary, secondary, ghost, destructive, outline
- `Card.tsx` — With CardHeader, CardTitle, CardContent, CardFooter
- `Input.tsx` — Labels, error states, icons
- `Badge.tsx` — StatusBadge, RiskBadge, ChainBadge
- `Modal.tsx` — Accessible dialogs with focus trap
- `Alert.tsx` — Semantic alerts + auto-dismiss toasts

## Changelog

- 2026-04-14: Split from `CLAUDE.md`. Design Council members deduplicated (now lives only in `memory/PROCESS.md`).
