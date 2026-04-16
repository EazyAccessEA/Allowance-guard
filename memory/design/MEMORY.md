# memory/design/ — Index

Scoped memory for the Allowance Guard Design managed-agent system. Loaded only when a design skill is running. Sits under `memory/PROCESS.md`, `memory/CONSTRAINTS.md`, and `projects/allowanceguard/DESIGN.md` (canonical design authority).

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `tokens.md` | Ledger + Glass token summary, Noor's contrast floors, protected colour moments |
| `components.md` | Component inventory: `ui/*` primitives + Ledger marketing components |
| `motion.md` | Motion spec, `prefers-reduced-motion` contract, easing + choreography rules |
| `performance-budget.md` | Thane's budget, per-surface bundle targets, anti-patterns |
| `accessibility.md` | Noor's AA gates, focus, keyboard nav, semantic structure |

## Six standing rules

1. **Never mix canons.** Homepage and marketing = Ledger (paper, Fraunces, oxblood). Dashboard, docs, account = Glass (Midnight Amber, legacy tokens). Crossing them breaks the brand.
2. **The Five Laws apply to every surface.** Saturation Over Safety. Strip Then Amplify. Materiality. One Signature Move. Confidence in the Departure. If a surface violates one, the surface is wrong — not the law.
3. **Noor's floor is absolute.** `ink-whisper` is the lowest-contrast text token allowed on paper-deep. On glass: canonical text tokens only — no custom low-contrast strings. WCAG AA is not a target; it's a floor.
4. **Thane's budget is earned, not reset.** Every addition pays for itself with a removal or a measured justification. Vanta / WebGL / heavy canvas never return to marketing.
5. **`prefers-reduced-motion` is honoured everywhere.** Entrance animations, parallax, auto-advance carousels, even the `.ledger-rule::after` amber glow — all disabled under that query.
6. **Tokens are the only vocabulary.** New hex values, new font families, new ad-hoc spacings do not ship. Propose via `design-token` with canon justification.

## Canonical sources (single sources of truth)

- Design authority + canons — `projects/allowanceguard/DESIGN.md`
- Ledger tokens (CSS + Tailwind) — `tailwind.config.js` + `src/app/globals.css`
- Glass tokens (Midnight Amber) — `src/design/tokens.ts`
- Redesign strategy spec — `docs/allowanceguard-1-strategy-spec (3).md`
- Redesign build spec — `docs/allowanceguard-2-build (3).md`
- Tokens handbook (§10 glass historical, §11 Ledger) — `docs/design-tokens-handbook.md`
- Component library — `src/components/ui/*`
- Ledger marketing components — `src/components/Hero.tsx`, `HowItWorks.tsx`, `FeaturesPreview.tsx`, `StatisticsSection.tsx`, `CTABand.tsx`, `Testimonials.tsx`, `ChainLogoCarousel.tsx`
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

- **Level 2 (Assisted).** Design skills produce specs, critiques, audits, and tokens-as-proposals. They never write under `src/` — that's `web-implementation` (marketing surfaces) or `build-feature` / engineering (dashboard/docs/ui primitives).
- **Never Level 4.** No auto-commit, no auto-ship. The user approves every spec and every token; engineering or `web-implementation` lands the change.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand when a canon or token needs verifying.
4. `projects/allowanceguard/DESIGN.md` whenever in doubt — it is the authority.

Do not read every file every time. Conserve tokens.

## Companion skills

Each design skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose Claude Code skills (e.g. `critique`, `polish`, `normalize`, `arrange`, `typeset`, `colorize`, `distill`, `harden`, `audit`, `adapt`, `extract`) the skill may reach for during its workflow. Companions are advisory; they never bypass the Design Council, the Five Laws, or Noor's veto. `frontend-design` is companion — not substitute — for AG's canon. Full map: `docs/design-agents.md`.
