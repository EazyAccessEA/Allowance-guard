# memory/design/ — Index

Scoped memory for the Allowance Guard Design managed-agent system. Loaded only when a design skill is running. Sits under `memory/PROCESS.md`, `memory/CONSTRAINTS.md`, and `projects/allowanceguard/DESIGN.md` (canonical design authority).

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `tokens.md` | Ledger token summary, Noor's contrast floors, protected colour moments, retired Glass notes |
| `components.md` | Component inventory: `ui/*` primitives + Ledger marketing + app components |
| `motion.md` | Motion spec, `prefers-reduced-motion` contract, easing + choreography rules |
| `performance-budget.md` | Thane's budget, per-surface bundle targets, anti-patterns |
| `accessibility.md` | Noor's AA gates, focus, keyboard nav, semantic structure |

## Six standing rules

1. **One canon: Ledger.** Every surface — homepage, marketing, blog, docs, dashboard, account, auth, modals — uses Ledger (paper, Fraunces, oxblood punctuation). Glass / Midnight Amber is retired (ADR 0007, 2026-04-17). Do not reintroduce `.glass-*` utilities, `bg-background-primary`, `text-secondary-*`, or any Midnight Amber token.
2. **The Five Laws apply to every surface.** Saturation Over Safety. Strip Then Amplify. Materiality. One Signature Move. Confidence in the Departure. If a surface violates one, the surface is wrong — not the law.
3. **Noor's floor is absolute.** `ink-whisper` is the lowest-contrast text token allowed on `paper-deep` (5.18:1). Metadata only at that level. `ink-muted` and above for body copy. WCAG AA is not a target; it's a floor.
4. **Thane's budget is earned, not reset.** Every addition pays for itself with a removal or a measured justification. Vanta / WebGL / heavy canvas never return — on any surface.
5. **`prefers-reduced-motion` is honoured everywhere.** Entrance animations, parallax, auto-advance carousels, amber-glow effects — all disabled under that query.
6. **Tokens are the only vocabulary.** New hex values, new font families, new ad-hoc spacings do not ship. Propose via `design-token` with canon justification. The retired Midnight Amber scales (`primary-*`, `secondary-*`, `neutral-*`, `background-*`, `text-*` keys, `border-*` keys, `surface-*`) are being removed from `tailwind.config.js` — do not use them on new work.

## Canonical sources (single sources of truth)

- Design authority + canon — `projects/allowanceguard/DESIGN.md`
- Canon decision ADR — `projects/allowanceguard/decisions/0007-unified-ledger-canon.md` (current), `0005-ledger-aesthetic.md` (superseded by 0007)
- Ledger tokens (CSS + Tailwind) — `tailwind.config.js` + `src/app/globals.css`
- Ledger prose theme — `tailwind.config.js` §`theme.extend.typography.ink`
- Redesign strategy spec — `docs/allowanceguard-1-strategy-spec (3).md`
- Redesign build spec — `docs/allowanceguard-2-build (3).md`
- Tokens handbook — `docs/design-tokens-handbook.md` §11 (Ledger, canonical); §10 (Glass, historical — do not treat as canon)
- Component library — `src/components/ui/*`
- Ledger marketing components — `src/components/{Hero,HowItWorks,FeaturesPreview,StatisticsSection,CTABand,Testimonials,ChainLogoCarousel}.tsx`
- Council + Design Council — `memory/PROCESS.md`

## The Design Council (from PROCESS.md)

Convened on every design skill run, in addition to the Standing Council.

- **Maren** — Visual. Hierarchy, editorial voice, Ledger canon coherence.
- **Idris** — Motion. Easing, choreography, reduced-motion fidelity.
- **Sable** — UX. Task flow, cognitive load, copy-visual coupling.
- **Kael** — Systems. Token boundaries, component reuse, design-system drift.
- **Noor** — Accessibility (**VETO**). WCAG AA, keyboard, semantic structure, motion safety.
- **Thane** — Performance. Bundle budget, runtime cost, perceived perf.

Plus **#7 Visual designer** from the Standing Council for project-wide visual coherence.

## Autonomy level

- **Level 2 (Assisted).** Design skills produce specs, critiques, audits, and tokens-as-proposals. They never write under `src/` — that's `web-implementation` (marketing surfaces) or `build-feature` / engineering (app surfaces + ui primitives).
- **Never Level 4.** No auto-commit, no auto-ship. The user approves every spec and every token; engineering or `web-implementation` lands the change.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand when a canon or token needs verifying.
4. `projects/allowanceguard/DESIGN.md` whenever in doubt — it is the authority.

Do not read every file every time. Conserve tokens.

## Companion skills

Each design skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose Claude Code skills (e.g. `critique`, `polish`, `normalize`, `arrange`, `typeset`, `colorize`, `distill`, `harden`, `audit`, `adapt`, `extract`) the skill may reach for during its workflow. Companions are advisory; they never bypass the Design Council, the Five Laws, or Noor's veto. `frontend-design` is companion — not substitute — for AG's canon. Full map: `docs/design-agents.md`.

**External sources.** Companions come from two external skill repositories tracked in `skills-lock.json`:
- **Impeccable** (`pbakaus/impeccable`) — the verb-family companions above + `teach-impeccable` setup.
- **Taste Skill** (`Leonxlnx/taste-skill`) — eight opinionated aesthetic skills (`minimalist-ui`, `high-end-visual-design`, `design-taste-frontend`, `gpt-taste`, etc.) for creative stretch. **Not bound** — use when an aesthetic insight fits a single surface; never let a Taste skill override a canon decision. Taste skills trained on dark-OLED conventions (`high-end-visual-design`, `gpt-taste`, `industrial-brutalist-ui`) conflict directly with our unified Ledger canon — borrow their anti-pattern lists, ignore their surface prescriptions. `minimalist-ui` is the Taste skill closest to Ledger and the most useful companion.
