# Design Agents — Runbook

Allowance Guard's Design managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. It is governed by the Design Council in `memory/PROCESS.md`, backed by scoped memory in `memory/design/`, and anchored to canonical design authority in `projects/allowanceguard/DESIGN.md`.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "Two canons in parallel. Ledger for marketing. Glass for app. Never mix. Noor holds the veto."

If an output mixes canons or fails AA, it goes back.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `design-ledger-surface` | Marketing surface design in Ledger canon | A hero, blog, pricing, or docs-landing surface specified |
| `design-glass-surface` | App surface design in Glass canon | A dashboard, docs-content, or account surface specified |
| `design-component` | New reusable primitive | A repeated pattern extracted into `ui/*` or a marketing primitive |
| `design-token` | New canonical token proposal | A colour, spacing, radius, shadow, easing, or duration needs to join the canon |
| `design-motion` | Motion spec with reduced-motion contract | Entrance, transition, micro-interaction, or scroll reveal designed |
| `design-system-audit` | P0–P3 drift report across `src/` | Quarterly / pre-release / drift-suspected audit |
| `design-critique` | Full Design Council critique per surface | Draft / near-ship / post-ship review with per-lens scoring |

## Companion skills map

Each design skill can reach for general-purpose Claude Code skills during its workflow. Companions are advisory — they do not bypass the Design Council or Noor's VETO. Per-skill details live at the end of each `SKILL.md`.

| Design skill | Companion skills |
|---|---|
| `design-ledger-surface` | `frontend-design`, `arrange`, `typeset`, `colorize`, `distill`, `polish`, `critique` |
| `design-glass-surface` | `frontend-design`, `arrange`, `adapt`, `harden`, `normalize`, `onboard`, `critique` |
| `design-component` | `frontend-design`, `extract`, `harden`, `adapt`, `normalize`, `critique` |
| `design-token` | `colorize`, `typeset`, `critique`, `distill` |
| `design-motion` | `animate`, `critique`, `distill`, `polish` |
| `design-system-audit` | `audit`, `normalize`, `code-review` |
| `design-critique` | `critique`, `audit`, `distill`, `normalize` |

Guardrails:
- `frontend-design` is a **composition reference**, not a canon authority. AG's Ledger + Glass canons override it.
- `animate` / `overdrive` are advisory only — AG's motion anti-patterns (no WebGL, no Vanta, no scroll-jacking) override the companion's recommendations.
- All design skills are **read-only on `src/`**. Lands via engineering (`build-feature`) for app surfaces, or `web-implementation` for marketing surfaces.

## Typical flows (operator prompts)

### New marketing surface

> Run the design-ledger-surface skill. Brief: <surface, purpose, segment, metric>. Copy is ready at `context/drafts/<path>` (or marketing will draft after). Produce the surface spec; do not write under src/.

Expected: spec file under `context/design/`. Handoff to `web-implementation` for `src/` write.

### New app surface

> Run the design-glass-surface skill. Surface: `src/app/<path>`. Task: <>. Data: <>. Produce the surface spec; hand off to build-feature.

### New component

> Run the design-component skill. Pattern I'm seeing repeated: <>. Callsites: <list>. Propose a primitive spec; do not implement.

### New token

> Run the design-token skill. Need: <surface needs value Z, existing tokens don't fit>. Propose the token with contrast checks and migration plan.

### Motion spec

> Run the design-motion skill. Surface: <>. Animation purpose: <what it signals>. Produce the spec with reduced-motion branch.

### Drift audit

> Run the design-system-audit skill. Scope: <whole repo / specific surfaces>. Produce the P0–P3 report.

### Critique

> Run the design-critique skill. Surface: <path or screenshot description>. Full Design Council lens, scored.

## Autonomy ladder

- **Level 2 (Assisted) — everywhere.** All 7 skills produce specs, proposals, audits, critiques. None writes under `src/`.
- **Never Level 4.** No auto-implement. No auto-token-ship.
- Lands via engineering or `web-implementation` after user approval.

## Approval flow

```
spec (context/design/) ──▶ user review ──▶ approved
                                           │
                                           ▼
                  marketing surface?  ──▶ web-implementation
                  app surface?        ──▶ build-feature
                  component?          ──▶ build-feature
                  token?              ──▶ engineering (canonical file edit)
                  motion?             ──▶ engineering (CSS / component edit)
```

## What sits under `memory/design/`

- `MEMORY.md` — index + six standing rules.
- `tokens.md` — Ledger + Glass token summary + Noor's contrast floors + protected moments.
- `components.md` — inventory: `ui/*` primitives + Ledger marketing components + glass surfaces.
- `motion.md` — motion principles + reduced-motion contract + easing + duration tokens.
- `performance-budget.md` — Thane's budget; no re-introduction of Vanta / WebGL.
- `accessibility.md` — Noor's AA gates + keyboard + SR + motion safety.

Skills read what they need. No skill reads everything.

## Governance — the Design Council

Full list in `memory/PROCESS.md`. On every design skill run:

- **Maren** — Visual. Hierarchy, editorial voice, Ledger canon coherence.
- **Kael** — Systems. Token boundaries, component reuse, drift detection.
- **Idris** — Motion. Easing, choreography, reduced-motion fidelity.
- **Sable** — UX. Task flow, cognitive load, copy-visual coupling.
- **Noor** — Accessibility (**VETO**). WCAG AA, keyboard, semantic, motion safety.
- **Thane** — Performance. Bundle budget, runtime cost, perceived perf.
- **#7 Visual designer** (Standing Council) — project-wide visual coherence.

Standing Council vetos that apply across design:
- **#8 Accessibility (VETO)** — same scope as Noor, one is the sub-council lens, the other the Standing Council lens.
- **#24 Data protection** — any consent UI, privacy copy, or data-handling interface.

## Boundaries (non-negotiable)

- No mixing of canons. Ledger = marketing. Glass = app. Enforce by utility grep.
- No new font family. Fraunces / Plex / Mono only.
- No Vanta / WebGL / canvas-heavy effects on marketing surfaces. Thane's −180KB save is permanent.
- No ad-hoc hex values. Tokens or `design-token` proposal.
- No motion without `prefers-reduced-motion` branch.
- No `src/` writes from any design skill. All lands via engineering / `web-implementation`.
- No copy drafting — marketing skills own copy.
- No imagery drafting — `image-direction` owns imagery.

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` in the skill's frontmatter. Confirm the directory is under `.claude/skills/` and the file is `SKILL.md`.
- **Output drifted from canon.** Likely missed reading `projects/allowanceguard/DESIGN.md` or `memory/design/tokens.md`. Re-run with the canon reference spelled out in the prompt.
- **Motion shipped without reduced-motion branch.** Should have been caught by Noor's gate. Log in `memory/CORRECTIONS.md`; tighten the `design-motion` self-review.
- **Audit reported no findings but drift is visible.** Scope too narrow — re-run with broader scope.
- **New token was proposed but shouldn't have been.** First check is "existing tokens considered". If that section was skipped, reject and re-run.
- **Critique score seems generous.** Ask for specifics. Any lens scored ≥4 with fewer than two cited observations is over-generous.
- **Component spec proposes an API that already exists.** `design-component` missed the existing primitive. Re-run after reading `components.md` + `src/components/ui/`.

## Relationship to other departments

- **Marketing** — owns copy, imagery, positioning, content calendar. Marketing produces the words and the imagery; design specifies the surface that holds them.
- **Product & Engineering** — implements the design. `build-feature` lands app surfaces + components; `web-implementation` lands marketing surfaces; token changes go through engineering's canonical-file edit.
- **Compliance & Risk** (pilot 3 — future) — will own legal-page copy. Design specifies the legal-page surface; compliance owns the words.
- **Data & Intelligence** (pilot 5 — future) — will own dashboards of metrics. Design specifies the dashboard surfaces; data owns the data model.
- **Growth / Distribution** (pilot 4 — future) — grant / partnership / listing work rarely touches design directly; when it does, design specs are the handoff.
- **Admin / Operations** (pilot 6 — future) — support / docs / incident post-mortems may need designed surfaces; design handles them via normal flow.

## When to add a design skill

Criteria:
- A workflow happens ≥3 times in this department and has a repeatable shape.
- It has clear Design Council gates that an ad-hoc prompt keeps missing.
- It has a producer-shaped output (spec, proposal, audit, critique).

Not-criteria (do not justify a new skill):
- "It would be cool."
- A one-off surface (just use `design-ledger-surface` or `design-glass-surface`).
- A pure-review perspective (those are council lenses, not skills).

New skill proposals go through Kael (Systems) + Maren (Visual). Add the SKILL.md, update this runbook, update `MEMORY.md` if a new memory file is needed.
