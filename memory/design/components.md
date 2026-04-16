# components.md

Component inventory and canonical patterns. This file tells you what already exists; `src/components/` is the source of truth for implementation.

## UI primitives — `src/components/ui/`

Neutral, both-canon-compatible. Consumed by marketing + dashboard.

| Component | File | Key variants |
|-----------|------|--------------|
| `Button` | `Button.tsx` | CVA: `primary`, `secondary`, `ghost`, `destructive`, `outline` |
| `Card` | `Card.tsx` | + `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` |
| `Input` | `Input.tsx` | Labels, error states, icon slot |
| `Badge` | `Badge.tsx` | `StatusBadge`, `RiskBadge`, `ChainBadge` |
| `Modal` | `Modal.tsx` | Accessible dialog with focus trap |
| `Alert` | `Alert.tsx` | Semantic alerts + auto-dismiss toasts |

### Rules for `ui/*`

- Tokens only. No ad-hoc hex, no ad-hoc spacing. If the token doesn't exist, propose it via `design-token`.
- Canon-agnostic where possible. If a variant must differ between Ledger and Glass, express it as a variant, not a fork.
- Focus-ring visible in both canons. Test both.
- Every interactive element has a keyboard path. Modal + focus trap tested.

## Ledger marketing components — `src/components/`

| Component | File | Role | Canon details |
|-----------|------|------|---------------|
| `Hero` | `Hero.tsx` | Homepage hero | `.paper .grain .deckle-bottom`; compass SVG watermark; Fraunces/Plex headline; connected-wallet panel uses `.paper-card-raised` |
| `HowItWorks` | `HowItWorks.tsx` | Three-step explainer | `.paper .grain`; featured + compact steps in `.paper-card` / `.paper-card-raised`; ink line-art icons (stroke canon: `strokeWidth="1.5"`, `strokeLinecap="round"`) |
| `FeaturesPreview` | `FeaturesPreview.tsx` | Feature rows | `.paper .grain`; alternating editorial rows with ink line-art diagrams in `.paper-card-raised` |
| `StatisticsSection` | `StatisticsSection.tsx` | Numbers / stats | `.paper-sub`; giant Fraunces italic display metric; `.dotted-leader` supporting rows |
| `CTABand` | `CTABand.tsx` | The single inverse moment | `bg-oxblood`; cream Fraunces; protected crimson accent word |
| `Testimonials` | `Testimonials.tsx` | Social proof | `.paper .grain`; featured Fraunces pull-quote + grid of `.paper-card` quotes |
| `ChainLogoCarousel` | `ChainLogoCarousel.tsx` | Closing bookend | `.paper-sub`; logo strip; `prefers-reduced-motion` halts scroll |

### Rules for Ledger components

- Never introduce `bg-white`, `bg-slate-*`, or glassmorphism utilities on any of these.
- Never re-introduce Vanta / WebGL backgrounds on marketing. Thane's −180KB savings are permanent unless re-argued via ADR.
- Icons and diagrams inline as JSX SVG, not separate `.svg` files — unless reused in ≥3 components.
- Headlines use `.font-display-tight` or Fraunces italic. Body uses Plex. Metadata uses JetBrains Mono.
- The signature move (oversized Fraunces italic numerals + `.ledger-rule`) appears once per major section. Not every section.

## Glass surfaces — dashboard + docs + account

| Area | Location | Notes |
|------|----------|-------|
| Dashboard | `src/app/(dashboard)/**` (verify in-repo) | `.glass-card`, `.glass-pill`, `.glass-button`, `.glass-drift` on Midnight Amber canvas |
| Docs | `src/app/docs/**` | Docs pages redesigned recently (see commit `86d86ee`). Quiet-bold Ledger layout with extracted sections + Turnstile |
| Account | `src/app/account/**` (verify) | Glass canon |

### Rules for glass surfaces

- Glass utilities only. Homepage paper utilities never appear here.
- Canon is deprecated-but-active. Do not expand glass tokens; maintain with what exists.
- Dashboard performance is separate from marketing budget — still tight, but measured against app UX expectations.

## Section extraction (docs recent work — commit `86d86ee`)

Docs content was extracted into `src/app/docs/sections/`:
- `ArchitectureSection.tsx`
- `SettingsSection.tsx`
- `TeamsSection.tsx`
- `TroubleshootingSection.tsx`

Pattern to replicate when a docs page grows past the 600-line limit: extract named sections into a sibling `sections/` folder, re-import into the page.

## Shared primitives

| Component | File | Purpose |
|-----------|------|---------|
| `SectionHeader` | `src/components/SectionHeader.tsx` | Consistent H2 headings across marketing |
| `Container` | `src/components/Container.tsx` | Content width constraint |
| `Highlight` | `src/components/Highlight.tsx` | Inline accent wrapper |
| `TurnstileWidget` | `src/components/TurnstileWidget.tsx` | Cloudflare Turnstile integration (docs + signup) |

## Adding a new component

Design skill handoff flow:

1. `design-component` emits a spec (TSX sketch, props API, states, tokens, test strategy).
2. Council review — Kael (systems), Maren (visual), Noor (AA).
3. User approves the spec.
4. Engineering picks it up via `build-feature` — lands it in `src/components/ui/` if primitive, or in the domain folder if feature-specific.
5. Tests ship with the component (see `memory/product-engineering/test-strategy.md`).

## Deprecations

- Old PuredgeOS system — deprecated for new work. Glass canon is the retained subset used only on dashboard/docs/account.
- `bg-white`, `bg-slate-*` utilities on marketing — banned (enforced by DESIGN.md rule 1 under Ledger).
- Vanta NET on homepage — removed, do not restore.

## Where to look first

- Canon question? `projects/allowanceguard/DESIGN.md`.
- Token question? `tokens.md` in this folder, then `tailwind.config.js` / `src/design/tokens.ts` for authoritative values.
- Component pattern? This file + the actual component source. Read both.
- Motion / animation? `motion.md`.
- Accessibility? `accessibility.md`.
