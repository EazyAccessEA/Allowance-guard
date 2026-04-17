# memory/data-intelligence/ — Index

Scoped memory for the Allowance Guard Data & Intelligence managed-agent system. Loaded only when a data-intelligence skill is running. Separate from marketing's `analytics` skill by design — `analytics` is scoped to **marketing surfaces** (homepage, blog, pricing, social, outreach); data-intelligence is **product-wide** (funnels, cohorts, retention, experiments, KPI tree, partnership / grant ROI, engineering & support metrics). They share evidence; they are not the same lane.

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `kpi-tree.md` | Canonical KPI tree — north-star + primaries + secondaries, by surface and by department |
| `metric-catalog.md` | Every metric defined with name, formula, source, owner, refresh cadence, target |
| `experiment-log.md` | Append-only product-wide experiment log (separate from marketing's `experiments.md`) |
| `data-sources.md` | Registered data sources (Vercel Analytics, Stripe, Postgres, GitHub, support inbox) — access pattern + retention + lawful basis |
| `data-handling-rules.md` | Aggregation requirements, PII handling, consent boundaries, retention. The law for the dept |

## Six standing rules

1. **Aggregated only.** No skill in this department processes wallet addresses, IP addresses, individual session traces, or any PII alongside behavioural data. If the export contains row-level identifiers, the first step is to aggregate or refuse. #24 has VETO on any breach of this rule.
2. **Every metric pairs with a decision.** A metric "for awareness" is not a metric — it's a vanity number. If we cannot name the decision a metric informs, we don't ship it. #35 Product analyst gates this.
3. **Hypothesis before measurement.** Every experiment has a written hypothesis, a pre-declared primary metric, a minimum observation window, and a decision rule. We do not stop early. We do not chase significance. Inconclusive is a valid outcome.
4. **Single source of truth per metric.** A metric has one definition, one formula, one owner, one refresh cadence — recorded in `metric-catalog.md`. Two skills computing the same metric two ways is a P0 trust failure.
5. **Read-only against local exports.** No skill in this department calls live analytics APIs, hits Postgres directly, or pulls from Stripe. The user provides the export under `context/`. This bounds blast radius and respects the lawful-basis chain.
6. **Findings, not fixes.** Data-intelligence emits briefs, specs, readouts. Engineering instruments. Marketing rewrites copy. Conversion proposes new tests. Growth re-shapes outreach. The action handoff is named in every brief — never executed in this dept.

## Canonical sources (single sources of truth)

- Product truth — `projects/allowanceguard/BUSINESS.md`, `ARCHITECTURE.md`
- Tier + pricing — `BUSINESS.md:49-54`
- Marketing primary metrics (per surface) — `memory/marketing/metrics.md`
- Marketing experiment log — `memory/marketing/experiments.md` (do not duplicate; cross-reference)
- Privacy posture — Privacy Policy at `src/app/privacy/**`, plus `memory/compliance-risk/MEMORY.md`
- Security posture — `memory/product-engineering/security-posture.md`
- Voice + banned phrases — `memory/VOICE.md`
- Council — `memory/PROCESS.md`

## The Data Council (from PROCESS.md)

Convened on every data-intelligence skill run, in addition to the Standing Council:

- **#35 Product analyst (lead)** — evidence-first metrics, experiment rigor, funnel analysis, hypothesis discipline, aggregated-only data handling.
- **#19 Privacy / GDPR specialist** — data handling, retention, user rights, cross-border transfer mechanism. Co-reviews every export.
- **#24 Data protection / privacy lawyer (VETO)** — GDPR Article-level accuracy on data use, cookie consent boundaries, lawful basis. **VETO on any analysis that touches PII, consent, or retention.**

Plus these Standing Council members on relevant surfaces:

- **#4 Security** — data source access patterns; key handling for any export pipeline.
- **#5 Product marketing** — interpretation of marketing-surface movement.
- **#6 B2B / API economy** — interpretation of API tier metrics + developer funnel.
- **#11 Investor / founder voice** — the KPIs that matter for fundability; banned-phrase gate on any externally-shared brief.
- **#15 Staff engineer** — instrumentation realism; what's actually measurable from current code.
- **#18 Database engineer** — query plans / sampling correctness if a brief leans on Postgres-derived data.
- **#34 Full-stack debugging engineer** — log-based metrics; trace correctness.

Cross-department gates that apply:

- **`claim-review` (Compliance & Risk)** — MANDATORY before any brief, readout, or metric ships to a public surface (transparency post, blog, investor update, partner deck).
- **`security-claim-audit` (Compliance & Risk)** — convened if a brief introduces a new security-related metric (e.g., "we flag X% of malicious approvals").
- **#24 Data protection (VETO)** — on any data-handling change a brief proposes (new event, new retention, new aggregation tier).

## Autonomy levels

- **Level 2 (Assisted) — default for all data-intelligence skills.** Briefs, specs, readouts, plans. The user reads every brief, approves every metric definition before engineering instruments it, approves every experiment design before it runs.
- **Never Level 4.** No auto-instrumentation. No auto-shipping briefs. No live API calls.
- **Never publish a brief externally without `claim-review`.** Internal briefs are Level 2; external (transparency post, investor update, partner deck) re-routes through `writer` + `claim-review`.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand.
4. `data-handling-rules.md` before any analysis touches a new data source.

Do not read every file every time. Conserve tokens.

## Companion skills

Each data-intelligence skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose skills (e.g. `clarify`, `audit-website`, `claim-review`, `marketing-psychology`) the skill may reach for during its workflow. Companions are advisory; they never bypass the Data Council, `claim-review`, or `#24` VETO. Full map: `docs/data-intelligence-agents.md`.
