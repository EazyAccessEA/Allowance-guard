# Product & Engineering Agents — Runbook

Allowance Guard's Product & Engineering managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. It is governed by the Standing Council in `memory/PROCESS.md`, backed by scoped memory in `memory/product-engineering/`, and fenced by deny rules in `.claude/settings.json`.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "Plan before code. Test before ship. Stop before deploy."

If an output skips any of those, it goes back.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `build-feature` | Feature development end-to-end | A new capability landed in `src/` with a plan, tests, diff |
| `fix-bug` | Reproduce → root-cause → fix → regression-test | A reported defect correctly diagnosed and minimally fixed |
| `write-migration` | Drizzle migration authoring | A schema change committed safely, reversibly, with rollback |
| `debug-prod-incident` | Trace-first incident investigation | A live or recent production incident analysed with evidence |
| `refactor-component` | Behaviour-preserving refactor | A file hitting the 600-line limit split, or duplication consolidated |
| `add-chain` | Onboard a new EVM chain | Chain #N wired through config, indexer, scanner, tests |
| `implement-checkout-flow` | Payment flow implementation | Stripe / Coinbase checkout, upgrade, downgrade, cancel flows changed |
| `webhook-review` | Webhook handler review | A Stripe / Coinbase handler audited before or after production |

## Companion skills map

Each engineering skill can reach for general-purpose Claude Code skills during its workflow. Companions are advisory — they do not bypass any Council gate or the deny list. Per-skill details live at the end of each `SKILL.md`.

| Engineering skill | Companion skills |
|---|---|
| `build-feature` | `feature-dev`, `code-review`, `security-review`, `defi-security`, `simplify`, `audit` |
| `fix-bug` | `code-review`, `security-review`, `review`, `simplify` |
| `write-migration` | `feature-dev`, `code-review`, `security-review` |
| `debug-prod-incident` | `review`, `security-review`, `code-review` |
| `refactor-component` | `simplify`, `extract`, `code-review`, `normalize` |
| `add-chain` | `feature-dev`, `code-review`, `security-review`, `defi-security` |
| `implement-checkout-flow` | `feature-dev`, `security-review`, `code-review` |
| `webhook-review` | `security-review`, `code-review`, `review` |

Guardrails:
- `security-review` and `code-review` companions are advisory; they do not substitute the Engineering Council or Payment Sub-council gates.
- `write-migration` and `implement-checkout-flow` run at **Autonomy Level 1** — every write requires a fresh user confirm.
- Payment-touching skills convene the Payment Sub-council (**#30 Payment systems**, **#31 Crypto payments**, **#4 Security**) before any implementation.

## Typical flows (operator prompts)

### New feature, start-to-end

Paste from the repo root:

> Run the build-feature skill. Read the brief at `context/<path>` (or the prompt below). Produce a plan, wait for my approval, then implement and write tests. Do not commit.

Expected: a plan file under `context/plans/`, then a diff + tests after approval.

### Fix a production bug

> Run the fix-bug skill. The symptom: <what users see>. Log line: <paste>. Reproduce, root-cause, write a regression test, fix. Do not commit.

### Add a new chain

> Run the add-chain skill. Chain: <name>. Demand signal: <what you have>. Verify inclusion criteria, draft the plan, wait for my approval before wiring anything.

### Stripe / Coinbase checkout change

> Run the implement-checkout-flow skill. Change: <describe>. Convene the Payment Sub-council in the plan. Level 1 — wait for my confirm on each write.

### Investigate a live incident

> Run the debug-prod-incident skill. Reports: <summary>. Build the timeline, form hypotheses, recommend mitigation, append to `incident-history.md`. Do not ship fixes.

## Autonomy ladder

- **Level 2 (Assisted) — default.** Skills plan, draft, show the diff. You approve every commit. Covers `build-feature`, `fix-bug`, `refactor-component`, `add-chain`, `debug-prod-incident` (recommendations only), `webhook-review` (read-only).
- **Level 1 (Ask-every-time) — migrations and payments.** `write-migration` and `implement-checkout-flow` require a fresh user confirm on each write. No infer-approval-from-context.
- **Never Level 4.** No auto-commit, no auto-migrate, no auto-deploy. Enforced at the harness by `.claude/settings.json`.

## Approval flow

```
plan (context/) ──▶ user review ──▶ approved
                                    │
                                    ▼
                  skill drafts diff ──▶ user review ──▶ user commits
```

For features / bugs / refactors: plan → diff → user commits.
For migrations: plan → confirm per write → user runs apply (staging first, then prod).
For payments: plan → Payment Sub-council sign-off → confirm per write → user commits.
For incidents: report → user decides on mitigation → handoff to fix skill.

## What sits under `memory/product-engineering/`

- `MEMORY.md` — index + six standing rules.
- `architecture-rules.md` — routes, components, data access, deps, naming, file-size rules.
- `chain-support.md` — 27-chain list + add-new-chain process.
- `test-strategy.md` — test pyramid, coverage expectations, what must have a test.
- `performance-budget.md` — Core Web Vitals targets, bundle budget, anti-patterns.
- `security-posture.md` — auth, secrets, CSP, CSRF, rate-limits, webhook verification.
- `incident-history.md` — append-only log of P0 / P1 incidents.

Skills read what they need. No skill reads everything.

## Governance — the Standing Council

Full list in `memory/PROCESS.md`. Hard gates that apply across engineering:

- **#4 Security (VETO)** — auth, secrets, webhook verification, input validation.
- **#8 Accessibility (VETO)** — any `src/` code rendering UI. WCAG AA, keyboard nav, motion safety.
- **#15 Staff engineer** — design quality, smallest-change discipline, abstraction costs.
- **#16 QA** — coverage, regression test required on every fix.
- **#17 Performance** — Core Web Vitals, bundle budget (with Thane as secondary veto).
- **#18 Database engineer (VETO)** — migration safety, lock duration, rollback.
- **#24 Data protection (VETO)** — any migration or feature touching PII or consent data.
- **Payment Sub-council (#30, #31, #4)** — every payment change. #4 holds security veto.

Each SKILL.md runs its subset of these gates before emit.

## Boundaries (non-negotiable)

- No auto-commit. The user commits.
- No auto-deploy. The user deploys.
- No auto-migrate. The user runs `drizzle-kit` commands.
- No edits to `memory/marketing/` from engineering skills. Marketing owns its lane.
- No edits to legal pages (`src/app/privacy/`, `src/app/terms/`, `src/app/dpa/`, cookies) from engineering skills. Compliance & Risk department will own these when pilot 3 ships.
- No bypassing the deny list. If a skill needs something the harness blocks, the user runs it themselves.

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` in the skill's frontmatter. Confirm the directory is under `.claude/skills/` and the file is `SKILL.md`.
- **Plan skipped.** Any skill that skipped planning violated the first standing rule. Reject the output; re-run with the plan-first requirement spelled out.
- **Test skipped.** Second standing rule. Reject. The regression test (for `fix-bug`) or the new-route test (for `build-feature`) must ship with the diff.
- **Write without confirm on Level 1.** `write-migration` or `implement-checkout-flow` wrote without a fresh confirm. Log in `memory/CORRECTIONS.md`; tighten the skill's Level 1 language.
- **Payment change without Sub-council.** `implement-checkout-flow` shipped without #30/#31/#4 sign-off in the plan file. Roll back; re-run with the sub-council convened explicitly.
- **Hook didn't fire.** Check `.claude/hooks/session-start.sh` is executable. Check `.claude/settings.json` points at it.
- **Deny list blocked the skill.** That's the system working. If legitimate, the user runs it; if not, rewrite the ask.

## Relationship to other departments

- **Marketing** (shipped) — never edits `src/` except via `web-implementation`. Any engineering work that changes user-facing copy hands off the copy change to marketing's `writer` or `conversion` skills.
- **Design** (pilot 2) — will own component / token / motion / canon work. Engineering implements; design directs.
- **Compliance & Risk** (pilot 3) — will own legal pages + claim reviews + policy alignment. Engineering does not touch legal surfaces.
- **Growth / Distribution** (pilot 4) — owns grant applications, integrations, listings. Engineering implements technical integrations at Growth's direction.
- **Data & Intelligence** (pilot 5) — will own analytics + experiment design. Marketing's `analytics` skill moves here when the department ships.
- **Admin / Operations** (pilot 6) — owns support, docs coherence, incident post-mortems (deep-write), finance snapshots.

## When to add an engineering skill

Criteria:
- A workflow happens ≥3 times and has a repeatable shape.
- It has clear council gates that an ad-hoc prompt keeps missing.
- It has a producer-shaped output (plan, diff, report), not just "think about X".

Not-criteria (do not justify a new skill):
- "It would be cool."
- A one-off task.
- A pure-review perspective (those are council lenses, not skills).

New skill proposals go through #15 Staff engineer + whichever domain owner applies. Add the SKILL.md, update this runbook, update `MEMORY.md` if a new memory file is needed.
