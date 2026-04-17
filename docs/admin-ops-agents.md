# Admin / Operations Agents — Runbook

Allowance Guard's Admin / Operations managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. The back-office department: support triage, docs coherence, finance snapshots, vendor review, internal coordination, incident post-mortems. The job is to keep the rest of the company functioning.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "Trends, not tickets. Pointers, not derivations. Surface, never assign. Operator alone touches money, vendors, contracts."

If a brief reports a number that's not from a canonical source, it goes back. If it names a user, it goes back. If it tries to act on a vendor, it gets stopped.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `support-triage` | Weekly support inbox triage | Categorical mix + spikes + routing handoffs |
| `docs-coherence-audit` | Quarterly docs drift audit | Stale / contradictory / drifted docs surfaced with handoff |
| `finance-snapshot` | Periodic finance + runway snapshot | Cash, MRR, burn, runway, watchlist, action items |
| `vendor-review` | Quarterly vendor review or pre-renewal | Plan-fit, cost reasonableness, lock-in, switching analysis |
| `incident-postmortem` | After-action post-mortem | Blameless timeline + root cause + action items + disclosure recommendation |
| `internal-coordination-brief` | Weekly cross-dept coordination | Surfaces collisions + due-this-week + blocked items |

## Companion skills map

Each admin-ops skill can reach for general-purpose Claude Code skills during its workflow. Companions are advisory — they do not bypass the Ops Council, `claim-review`, or `#24` VETO. Per-skill details live at the end of each `SKILL.md`.

| Admin-ops skill | Companion skills |
|---|---|
| `support-triage` | `clarify`, `funnel-analysis` (handoff), `cohort-retention` (handoff), `debug-prod-incident` (handoff), `claim-review` |
| `docs-coherence-audit` | `audit-website`, `claim-review`, `security-claim-audit` (handoff), `WebFetch`, `writer` (handoff), `legal-page-draft` (handoff), `clarify` |
| `finance-snapshot` | `clarify`, `vendor-review` (handoff), `grant-application` (handoff), `cohort-retention` (handoff), `claim-review`, `writer` |
| `vendor-review` | `WebFetch`, `policy-alignment`, `legal-page-draft` (handoff), `webhook-review`, `claim-review` |
| `incident-postmortem` | `clarify`, `debug-prod-incident` (predecessor), `webhook-review` (handoff), `vendor-review` (handoff), `security-claim-audit` (handoff), `claim-review` |
| `internal-coordination-brief` | `clarify`, `weekly-metrics-brief` (predecessor), `support-triage` (predecessor), `finance-snapshot` (predecessor) |

Guardrails:
- All skills are **read-only** unless writing to `context/`. `incident-postmortem` is the one exception — it appends to `memory/product-engineering/incident-history.md` (a memory file, not `src/`), and only with operator approval per entry.
- **`claim-review` is MANDATORY** before any brief / snapshot / post-mortem goes external (transparency post, investor update, partner deck, public disclosure).
- **`security-claim-audit` is MANDATORY** if a post-mortem invalidates a public security claim.
- **`webhook-review` handoff is MANDATORY** for incident post-mortems touching webhook reliability.
- No admin-ops skill changes a vendor relationship, files a refund, sends a contract, or executes disclosure. The operator does all of that.

## Typical flows (operator prompts)

### Monday morning routine

> Run weekly-metrics-brief, support-triage, and internal-coordination-brief for week of <YYYY-MM-DD>. Exports are in `context/`. Emit each; do not publish anything.

Expected: three briefs in `context/`. The coordination brief reads the other two as predecessors.

### Quarterly docs audit

> Run docs-coherence-audit. Scope: full sweep. Map source: `memory/admin-ops/docs-map.md`. Emit findings; route fixes via the recommended owning skills.

Expected: P0–P3 report at `context/admin-ops/docs/audits/<YYYY-MM-DD>-full.md`.

### Monthly finance snapshot

> Run finance-snapshot for <YYYY-MM-DD>. Cash pointer at `context/admin-ops/finance/cash-<date>.md`. Emit internally; do not publish.

Expected: snapshot at `context/admin-ops/finance/snapshots/<YYYY-MM-DD>-snapshot.md` with action items. Operator decides each.

### Vendor review (quarterly or pre-renewal)

> Run vendor-review on <vendor>. Renewal date: <YYYY-MM-DD>. Contract at `context/admin-ops/contracts/<vendor>/`. Emit recommendation; do not act.

Expected: review at `context/admin-ops/vendors/reviews/<YYYY-MM-DD>-<vendor>.md` with one recommendation (keep / renegotiate / switch / cancel).

### Post-mortem after incident resolution

> Run incident-postmortem for incident <id>. Live debugging artefact at `context/incidents/<id>/`. Emit the post-mortem; propose the incident-history.md entry.

Expected: post-mortem at `context/incidents/<id>/postmortem-<YYYY-MM-DD>.md` + proposed `incident-history.md` append. Operator commits the append after sign-off.

## Autonomy ladder

- **Level 2 (Assisted) — all admin-ops skills.** Briefs, audits, snapshots, reviews, post-mortems. The operator approves every vendor change, every external publication, every disclosure, every `incident-history.md` append.
- **Never Level 4.** No auto-cancel of vendors. No auto-publish of finance snapshots. No auto-disclosure of incidents.

## Approval flows

```
support-triage:
inbox export → categorical mix → spike detection → routing handoffs → operator confirms each

docs-coherence-audit:
map sweep → findings P0–P3 → handoff queue → owning skills (writer / legal-page-draft / build-feature)

finance-snapshot:
canonical sources read → snapshot drafted → council sign-off → operator action items decided

vendor-review:
contract + plan + alternatives → recommendation → council sign-off → operator acts

incident-postmortem:
debug artefact + timeline → root cause + actions → council sign-off → operator commits append → disclosure handoff (if applicable)

internal-coordination-brief:
dept briefs read → collisions surfaced → operator decisions due
```

For external publication of any output:
```
draft → claim-review → writer (if needed for narrative) → operator publishes
```

## What sits under `memory/admin-ops/`

- `MEMORY.md` — index + six standing rules + Ops Council + autonomy.
- `support-categories.md` — taxonomy + per-category routing + spike thresholds.
- `docs-map.md` — every user-facing + internal doc with owner, depends-on, last-reviewed.
- `vendor-register.md` — every paid vendor with plan, cost, lock-in, alternatives, DPA status.
- `finance-baseline.md` — pointers + formulae + thresholds for finance-snapshot. Numbers themselves live in `metric-catalog.md` or operator pointers.
- `ops-calendar.md` — recurring deadlines (vendor renewals, grant deadlines, regulatory cadences, internal review cadences).

Incident post-mortems append to `memory/product-engineering/incident-history.md` (existing engineering-owned file).

Skills read what they need. No skill reads everything.

## Governance — the Ops Council

Full list in `memory/PROCESS.md`. On every admin-ops skill run:

- **#36 Operations manager (lead)** — across the dept.
- **#10 DevOps / SRE** — incident post-mortems; infra-vendor reviews; deploy/rollout coordination.
- **#11 Investor / founder voice** — finance snapshot framing; banned-phrase gate on external snapshots.

Plus on relevant surfaces:
- **#4 Security** — vendor reviews touching auth / data / payments; security-relevant post-mortems.
- **#9 Lawyer / compliance** — vendor contract review; post-mortems with regulatory implications.
- **#19 Privacy / GDPR** — data-processing vendors; support categorisation touching user data flows.
- **#24 Data protection (VETO)** — any new data processor; any post-mortem disclosure naming individuals; legal-doc rewrites.
- **#1 Editor-in-chief** — docs-coherence audits; post-mortem narrative quality.
- **#14 DX engineer** — developer-facing docs coherence; API docs.
- **#35 Product analyst** — finance snapshot numbers cross-checked against `metric-catalog.md`; support trends cross-checked against funnels.

Cross-department gates that apply:

- **`claim-review`** (Compliance & Risk) — every external publication.
- **`security-claim-audit`** (Compliance & Risk) — any post-mortem invalidating a public security claim.
- **`webhook-review`** (Product & Engineering) — incident post-mortems touching webhooks.
- **`weekly-metrics-brief`** (Data & Intelligence) — read for canonical metric numbers.
- **`incident-disclosure`** (Compliance & Risk) — handoff for any user-facing disclosure decision.

## Boundaries (non-negotiable)

- Trends, not tickets. No PII. No quoted user content. No customer names.
- Pointers, not derivations. Every number cites its single source of truth.
- Coordination, not control. Surface; the operator + dept leads assign work.
- Operator alone touches money, vendors, contracts, disclosures.
- `incident-history.md` appends are append-only — no editing prior entries.
- No external publication without `claim-review`.
- No `src/` writes. Action items route to engineering skills.
- Sub-processor changes route through `legal-page-draft` (Level 1, #24 VETO).

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` + directory structure under `.claude/skills/`.
- **Snapshot reports a number not in catalog.** Route to `define-metric` first; do not introduce numbers ad hoc.
- **Vendor review proposes a switch the operator opposes.** Recommendation is a proposal; document the operator's "keep" decision in the review notes for next quarter's review baseline.
- **Post-mortem drafts a non-blameless line.** Re-write systems-first ("the alert routing did not surface this" not "the on-call missed it"). Refuse to ship blame-laden entries.
- **Coordination brief over one page.** Trim. Cross-link to dept briefs; don't duplicate.
- **Support triage spike correlates with no obvious cause.** Hand off to `funnel-analysis` or `debug-prod-incident` — the cause is downstream.
- **Vendor change attempted from the skill.** Stop. The skill recommends; operator acts.

## Relationship to other departments

- **Marketing** — `support-triage` routes `feature-request` aggregates to marketing for blog / social acknowledgement; `docs-coherence-audit` routes marketing-doc drift to `writer`; `finance-snapshot` reads MRR (which marketing campaigns influence).
- **Product & Engineering** — `incident-postmortem` reads `debug-prod-incident` artefacts and appends to `incident-history.md`; `vendor-review` of infra vendors coordinates with engineering; `support-triage` routes engineering-shaped trends to `fix-bug` / `build-feature` / `add-chain`.
- **Design** — `docs-coherence-audit` includes Glass canon docs; collisions between design redesigns and marketing campaigns surface in `internal-coordination-brief`.
- **Compliance & Risk** — `incident-postmortem` hands off disclosure decisions to `incident-disclosure`; `vendor-review` of data processors hands off DPA / Privacy Policy updates to `legal-page-draft`; `docs-coherence-audit` of legal docs routes to `legal-page-draft` (Level 1, #24 VETO).
- **Growth & Distribution** — `finance-snapshot` reads `grants-history.md` for pipeline value; `internal-coordination-brief` surfaces grant deadlines + partnership conversations.
- **Data & Intelligence** — `finance-snapshot` reads `metric-catalog.md` for revenue numbers; `support-triage` cross-references `experiment-log.md` for spike causation; `internal-coordination-brief` cites `weekly-metrics-brief` as predecessor.

## When to add an admin-ops skill

Criteria:
- A back-office workflow happens ≥3 times and has a repeatable shape.
- Clear Ops Council gates that ad-hoc prompts keep missing.
- Producer-shaped output (brief, audit, snapshot, review, post-mortem).

Expected additions as AG scales:
- `runbook-draft` — author / update an internal runbook (deploy, rollback, on-call rotation, payment-flow verification).
- `weekly-checklist` — generate the operator's weekly checklist from `ops-calendar.md` deadlines + dept signals.
- `contract-review` — pre-signature contract review (separate from `vendor-review`'s contract section).
- `compliance-calendar-sweep` — focused regulatory deadline sweep (currently bundled in `ops-calendar.md` + `internal-coordination-brief`).
- `support-knowledge-base-draft` — author canned responses for top support categories (handoff to `writer` + `clarify`).

Not-criteria:
- A one-off operational question (use `internal-coordination-brief` with custom focus).
- A pure-engineering operations task (use `debug-prod-incident` + engineering's existing observability).

**How to add a skill:**
1. Identify the workflow pattern + producer-shaped output.
2. Propose the skill: name, description, target council, memory reads, output format.
3. #36 Operations + the relevant specialist sign off.
4. Author the `SKILL.md` following the pattern (`## Operating principles`, `## Workflow`, `## Output format`, `## Self-review`, `## Hard bans`, `## Product truth`, `## Boundaries`, `## Companion skills`, `## Memory`).
5. Update this runbook + `MEMORY.md` if a new memory file is needed.
6. First invocation is a dry-run; rough edges tightened after.

This department is designed to keep the rest of the company functioning. Skills here exist so the operator can stop tracking them by hand.
