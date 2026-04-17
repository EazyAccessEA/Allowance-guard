# Data & Intelligence Agents — Runbook

Allowance Guard's Data & Intelligence managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. Distinct from marketing's `analytics` (which is scoped to marketing surfaces): this dept is **product-wide** — funnels, cohorts, experiments, KPI tree, partnership / grant ROI, engineering & support metrics.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "Aggregated only. Decision-informing only. Hypothesis before measurement. Findings, not fixes."

If a brief reports a number without naming the decision it informs, it goes back.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `define-metric` | Propose a new KPI / event | A recurring question can't be answered with the current metrics; new feature / tier launches |
| `weekly-metrics-brief` | Cross-functional weekly readout | Monday routine, or any time you need a snapshot |
| `experiment-design` | Pre-launch experiment spec | Team wants to test a change rigorously before shipping it everywhere |
| `experiment-readout` | Post-window experiment readout | An experiment's pre-declared window has closed |
| `funnel-analysis` | Per-step drop-off diagnosis | Conversion is below target; a step's drop-off is unexplained; a redesign landed |
| `cohort-retention` | Cohort matrix + churn drivers | Quarterly retention review; pre-pricing-change; post-redesign; churn alert |

## Companion skills map

Each data-intelligence skill can reach for general-purpose Claude Code skills during its workflow. Companions are advisory — they do not bypass the Data Council, `claim-review`, or `#24` VETO. Per-skill details live at the end of each `SKILL.md`.

| Data-intelligence skill | Companion skills |
|---|---|
| `define-metric` | `clarify`, `build-feature` (handoff), `claim-review` |
| `weekly-metrics-brief` | `clarify`, `funnel-analysis` (handoff), `cohort-retention` (handoff), `experiment-readout` (handoff), `claim-review` |
| `experiment-design` | `clarify`, `marketing-psychology`, `define-metric`, `build-feature` / `web-implementation` (handoff), `experiment-readout` |
| `experiment-readout` | `clarify`, `experiment-design` (re-run), `funnel-analysis` (handoff), `claim-review` |
| `funnel-analysis` | `clarify`, `experiment-design` (handoff), `cohort-retention` (handoff), `marketing-psychology`, `claim-review` |
| `cohort-retention` | `clarify`, `experiment-design` (handoff), `funnel-analysis` (handoff), `marketing-psychology`, `claim-review` |

Guardrails:
- All skills are **read-only** against local exports under `context/`. No live API calls. No direct Postgres connection.
- **`claim-review` is MANDATORY** before any brief / readout / spec is shared externally (transparency post, investor update, partner deck).
- **`security-claim-audit` is MANDATORY** if a brief introduces a new security-related metric.
- No data-intelligence skill writes instrumentation. Engineering does, via `build-feature`.

## Typical flows (operator prompts)

### Weekly Monday brief

> Run weekly-metrics-brief for the week of <YYYY-MM-DD>. Exports are in `context/data-intelligence/`. Emit the brief; do not publish.

Expected: brief at `context/data-intelligence/briefs/<YYYY-MM-DD>-week.md`. 3–5 named actions.

### Define a new metric

> Run define-metric. Question we keep asking: "<question>". Decision it would inform: "<decision>". Surface(s): <list>. Emit the proposal; do not append to catalog.

Expected: proposal at `context/data-intelligence/metric-proposals/`. Operator appends to `metric-catalog.md` after sign-off.

### Design an experiment

> Run experiment-design. Proposed change: "<change>". Surface: <surface>. Why now: "<reason>". Emit the design; do not implement.

Expected: design at `context/data-intelligence/experiments/<slug>-design.md`. Append `planned` to `experiment-log.md` on approval.

### Read out an experiment

> Run experiment-readout for <slug>. Window closed <YYYY-MM-DD>. Export at `context/data-intelligence/experiments/<slug>-results-<date>.csv`. Apply the pre-declared decision rule.

Expected: readout at `context/data-intelligence/experiments/<slug>-readout-<date>.md`. Update `experiment-log.md` status.

### Analyse a funnel

> Run funnel-analysis on the <free-tier value | Pro conversion | Sentinel | API> funnel. Window: <date> to <date>. Export under `context/data-intelligence/funnels/<funnel>/`. Emit the analysis.

Expected: brief at `context/data-intelligence/funnels/<funnel>/briefs/<YYYY-MM-DD>-analysis.md` with hypotheses + experiment proposals.

### Cohort retention review

> Run cohort-retention on the <Pro / Sentinel / API Developer / API Growth / scan-return> cohort. Cohorts to read: <list with closure verification>. Export at `context/data-intelligence/cohorts/<name>/`. Emit the analysis.

Expected: brief at `context/data-intelligence/cohorts/<name>/briefs/<YYYY-MM-DD>-analysis.md`. Trend + cliff/fit diagnosis + actions.

## Autonomy ladder

- **Level 2 (Assisted) — all data-intelligence skills.** Briefs, specs, readouts, plans. The user reads every brief, approves every metric definition before engineering instruments, approves every experiment design before it runs.
- **Never Level 4.** No auto-instrumentation. No auto-publish. No live API calls.

## Approval flow

```
question / trigger
     │
     ▼
skill drafts (context/data-intelligence/)
     │
     ▼
Data Council sign-off (#35 lead, #19 + #24 VETO)
     │
     ▼
operator reads brief
     │
     ├── internal use → done
     │
     └── external publication → claim-review
                                     │
                                     ▼
                              operator publishes
```

For a new metric:
```
proposal → sign-off → operator appends to metric-catalog.md → engineering instruments via build-feature
```

For an experiment:
```
design → sign-off → operator commits planned in experiment-log → engineering implements
                                                                       │
                                                                       ▼
                                                              experiment runs to window-end
                                                                       │
                                                                       ▼
                                                              experiment-readout → operator updates log + acts on decision
```

## What sits under `memory/data-intelligence/`

- `MEMORY.md` — index + six standing rules + Data Council + autonomy.
- `kpi-tree.md` — north-star + primaries + secondaries + red lines + anti-patterns.
- `metric-catalog.md` — every metric defined once with owner, formula, source, refresh cadence, target, PII risk.
- `experiment-log.md` — append-only product-wide experiment log (separate from marketing's by scope).
- `data-sources.md` — registered sources + lawful basis + retention + PII fields.
- `data-handling-rules.md` — the 10 rules + #24 VETO scope.

Skills read what they need. No skill reads everything.

## Governance — the Data Council

Full list in `memory/PROCESS.md`. On every data-intelligence skill run:

- **#35 Product analyst (lead)** — evidence-first metrics, experiment rigor, hypothesis discipline, decision-informing only.
- **#19 Privacy / GDPR** — data handling, retention, lawful basis. Co-reviews every export.
- **#24 Data protection (VETO)** — GDPR Article-level accuracy, consent boundaries, retention. **VETO on PII / consent / retention.**

Plus on relevant surfaces:
- **#4 Security** — data source access patterns + key handling.
- **#5 Product marketing** — marketing-surface interpretation.
- **#6 B2B / API economy** — API tier interpretation.
- **#11 Investor / founder voice** — fundability KPIs + banned-phrase gate on external briefs.
- **#15 Staff engineer** — instrumentation realism.
- **#18 Database engineer** — Postgres-derived numbers.
- **#34 Full-stack debugging engineer** — log-based metrics.

Cross-department gates that apply:
- **`claim-review`** (Compliance & Risk) — every external brief, readout, or new metric citation.
- **`security-claim-audit`** (Compliance & Risk) — any new security-related metric.
- **#24 Data protection (VETO)** — any new data source, bucket scheme change, or external brief naming individuals.

## Boundaries (non-negotiable)

- Aggregated only. No PII tied to behaviour. #24 VETO on any breach.
- Read-only against local exports. No live API calls. No direct Postgres.
- Findings, not fixes. Engineering instruments. Marketing rewrites copy. Conversion proposes new tests. Growth re-shapes outreach.
- No metric without a named decision.
- No experiment without a pre-declared primary metric, window, and decision rule.
- No external publication without `claim-review`.
- No `src/` writes. Ever.
- The catalog is the canonical source. Two skills computing the same metric two ways = P0 trust failure.

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` + directory structure under `.claude/skills/`.
- **Brief reports a number not in catalog.** Route to `define-metric` first; do not let the brief introduce metrics ad hoc.
- **Experiment readout decision differs from pre-declared rule.** Refuse to ship. Re-read design. If pressured, escalate to operator + #35.
- **Cohort size below min N.** Report as observation only, with confidence flag. Do not invent significance.
- **Export contains unexpected PII.** Stop, follow R9 in `data-handling-rules.md`. File incident.
- **Two experiments running on the same surface + same primary metric.** Pause one. Decide which has priority. Log the conflict.
- **A brief gets shared externally without `claim-review`.** Treat as P1. Pull the brief. Run `claim-review` retroactively. File a process incident.

## Relationship to other departments

- **Marketing** — owns surface-specific analytics (`memory/marketing/analytics`). Data-intelligence is product-wide; we cross-reference + cross-link, not duplicate. The marketing `analytics` skill is the per-surface specialist; this dept is the cross-surface generalist.
- **Product & Engineering** — instruments via `build-feature`. Data-intelligence specifies, engineering implements. Incident metrics (MTTR) read from `memory/product-engineering/incident-history.md`.
- **Design** — funnel-analysis hypotheses on UX-driven drop hand off to `design-glass-surface` / `design-component`; cohort analysis revealing onboarding cliff hands off to `design-glass-surface` for onboarding redesign.
- **Compliance & Risk** — `claim-review` gates external briefs; `security-claim-audit` gates new security metrics; #24 VETO on data handling.
- **Growth & Distribution** — generates the partnership / grant / sponsorship data; data-intelligence analyses ROI; growth adjusts. Specifically: `grant_pipeline_value` and `listing_referral_sessions_28d` read from `memory/growth/`.
- **Admin / Operations** (pilot 6) — generates support + ops data; data-intelligence categorises trends; operations adjusts process.

## When to add a data-intelligence skill

Criteria:
- A measurement workflow happens ≥3 times and has a repeatable shape.
- Clear Data Council gates that ad-hoc prompts keep missing.
- Producer-shaped output (brief, spec, readout, matrix).

Expected additions as AG scales:
- `dashboard-spec` — design a KPI dashboard for a stakeholder (founder, board, ops).
- `pricing-elasticity-test` — specialised before any pricing-change experiment.
- `incident-rate-analysis` — long-form incident-rate readout when MTTR / incident-count trends shift.
- `support-trend-brief` — categorical support-ticket trends (overlap with admin-ops dept's queue).

Not-criteria:
- A one-off question (use `weekly-metrics-brief` with a custom focus).
- A pure-engineering metric (use `build-feature` + engineering's existing observability).

**How to add a skill:**
1. Identify the workflow pattern + producer-shaped output.
2. Propose the skill: name, description, target council, memory reads, output format.
3. #35 Product analyst + the relevant specialist sign off.
4. Author the `SKILL.md` following the pattern (`## Operating principles`, `## Workflow`, `## Output format`, `## Self-review`, `## Hard bans`, `## Product truth`, `## Boundaries`, `## Companion skills`, `## Memory`).
5. Update this runbook + `MEMORY.md` if a new memory file is needed.
6. First invocation is a dry-run; rough edges tightened after.

This department is designed to grow with AG's measurement maturity.
