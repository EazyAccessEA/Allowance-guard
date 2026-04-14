# CLAUDE.md — Entry Point

Behaviour rules and pointers for Claude. Full project knowledge lives in `projects/allowanceguard/`. Global behaviour rules live in `memory/`.

## Startup routine

At the start of every session or task:

1. **Read this file first.** It's the load map.
2. **Read anything in `context/`** (gitignored). Current-task notes. If empty, skip.
3. **Load on demand.** Pull the `memory/`, `projects/`, or `docs/` files relevant to the task — not all of them.

Together: `context/` explains the present, `memory/` holds how Claude behaves, `projects/` holds what we're building, `docs/` holds reference specs (redesign briefs, design system, setup guides). Use all four to produce consistent, accurate work.

## Triage (which file does this belong in?)

- **How I work** → `memory/`
- **What I'm building** → `projects/`
- **Right now** → `context/` (gitignored)
- **Reference specs** (redesign briefs, design system canon, setup guides) → `docs/`
- **How Claude behaves** → this file

## Precedence (highest → lowest)

1. User instruction in the current turn.
2. `context/` — active task notes.
3. `projects/<name>/` — project-specific rules.
4. `memory/` — global behaviour rules.
5. This file — defaults and load map.

Project-specific always beats global. Current turn always wins.

## Load map (read on demand)

Do not read all of these on every session. Read the one(s) relevant to the task at hand.

### Global behaviour — `memory/`

| When working on... | Read |
|--------------------|------|
| Anything non-trivial | `memory/PROCESS.md` (workflow rules + Standing Council + sub-councils) |
| User-facing copy | `memory/VOICE.md` (banned phrases, tone) |
| Writing/editing code | `memory/OUTPUT.md` (conventions, file naming, scope discipline) |
| Choosing a tool | `memory/TOOLS.md` (tool policy, git safety) |
| Before shipping anything | `memory/CONSTRAINTS.md` (hard "Do Not" rules) |
| Hit a lesson worth keeping | `memory/CORRECTIONS.md` (append-only) |

Index: `memory/README.md`. Maintenance rules (replace-over-accumulate) also live there.

### Project — `projects/allowanceguard/`

| When working on... | Read |
|--------------------|------|
| Repo layout, tech stack, env vars, commands | `PROJECT.md` |
| API routes, DB rules, chain list, feature gates | `ARCHITECTURE.md` |
| Homepage or app UI | `DESIGN.md` |
| Pricing, tiers, messaging, positioning | `BUSINESS.md` |
| "Why is it this way?" | `decisions/` (ADRs) |
| Phase status / what's shipped | `STATUS.md` |

## The four workflow rules (full text in `memory/PROCESS.md`)

1. **Plan first.** Outline files, approach, steps before writing code.
2. **600-line limit.** No file over 600 lines. Split if needed.
3. **Conserve tokens.** Terse. No re-reads. Batch independent tool calls. Prefer `Edit` over `Write`.
4. **Convene the Standing Council.** Reason through every non-trivial change through the relevant members' lenses.

## Standing Council (summary)

**34 members.** Minimum size 17. Members are added when a domain is missing; never removed. Full roster and domains in `memory/PROCESS.md`.

Three sub-councils convene **in addition to** the Standing Council for their domains:

- **Design Council (6)** — Maren (visual), Idris (motion), Sable (UX), Kael (systems), Noor (accessibility, **veto**), Thane (performance).
- **Copy Council (3)** — #20 Brand, #21 Technical, #22 Conversion. Every sentence must survive all three.
- **Legal Council (3)** — #9 Lawyer/compliance, #23 Regulatory, #24 Data protection (**veto** on privacy/consent).

## Vetos (active on every change)

- **#8 Accessibility** and Design Council's **Noor** — WCAG AA, contrast, motion safety.
- **#24 Data protection lawyer** (Legal Council) — privacy policy, consent copy, data handling language.
- **#11 Investor / founder voice** — gatekeeper for the banned-phrase list (`memory/VOICE.md`).

## Changelog

- 2026-04-14: Added `docs/` to triage and startup. Added Standing Council summary + sub-councils (Design, Copy, Legal) at entry point. Noted Legal Council on the #24 veto.
- 2026-04-14: Rewritten as slim entry point. Project knowledge moved to `projects/allowanceguard/`. Behaviour rules moved to `memory/`. Startup routine preserved at the top.
