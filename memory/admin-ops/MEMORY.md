# memory/admin-ops/ — Index

Scoped memory for the Allowance Guard Admin / Operations managed-agent system. Loaded only when an admin-ops skill is running. The back-office department: support triage, docs coherence, finance snapshots, vendor review, internal coordination, incident post-mortems.

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `support-categories.md` | Taxonomy of support categories + per-category routing rules |
| `docs-map.md` | Every user-facing doc with owner, last-reviewed date, depends-on |
| `vendor-register.md` | Every paid vendor — plan, monthly cost, lock-in, alternatives |
| `finance-baseline.md` | Current cash + burn + runway formula + grant pipeline source |
| `ops-calendar.md` | Recurring deadlines — grant rounds, vendor renewals, audit dates, regulatory filings |

Incident post-mortems append to `memory/product-engineering/incident-history.md` (existing file owned by engineering).

## Six standing rules

1. **Operator alone touches money, vendors, and contracts.** Skills propose, snapshot, recommend. The operator approves every cancellation, every plan change, every vendor onboarding, every refund.
2. **No PII in any brief.** Support trends are categorical counts. Vendor reviews never quote a customer email. Finance snapshots are aggregated. #19 + #24 enforce.
3. **Trends, not tickets.** A support brief reports "32% of tickets in week N were 'why is my Pro plan not active?'", not "user X had an issue with…". Tickets stay in the support tool; only categorical aggregates leave.
4. **Single-source-of-truth for every recurring number.** MRR/ARR from `metric-catalog.md`. Cash from one operator-maintained pointer. Vendor spend from one vendor register. No skill derives these independently.
5. **Post-mortems are blameless and append-only.** Once written, never edited (corrections go in a follow-up entry). Action items have owners + due dates; un-owned action items are bugs in the post-mortem itself.
6. **Coordination, not control.** The internal coordination brief surfaces what's running across departments — it does not assign work. Departments own their work; ops surfaces collisions.

## Canonical sources (single sources of truth)

- Product truth — `projects/allowanceguard/BUSINESS.md`, `ARCHITECTURE.md`, `STATUS.md`
- Tier + pricing — `BUSINESS.md:49-54`
- Metrics — `memory/data-intelligence/metric-catalog.md` (MRR, ARR, retention, scan metrics)
- Incident history — `memory/product-engineering/incident-history.md`
- Security posture — `memory/product-engineering/security-posture.md`
- Privacy posture — Privacy Policy at `src/app/privacy/**`
- Compliance claims — `memory/compliance-risk/claims-register.md`
- Growth pipeline — `memory/growth/grants-history.md`, `memory/growth/partnerships-history.md`
- Voice + banned phrases — `memory/VOICE.md`
- Council — `memory/PROCESS.md`

## The Ops Council (from PROCESS.md)

Convened on every admin-ops skill run, in addition to the Standing Council:

- **#36 Operations manager (lead)** — support triage, docs coherence, finance snapshots, vendor review, internal coordination, incident post-mortems.
- **#10 DevOps / SRE** — incident post-mortems; vendor reviews touching infra (Vercel, Neon, Cloudflare); deploy/rollout coordination.
- **#11 Investor / founder voice** — finance snapshot framing; banned-phrase gate on any external snapshot.

Plus these Standing Council members on relevant surfaces:

- **#4 Security** — vendor reviews touching auth / data / payments; incident post-mortems on security-relevant incidents.
- **#9 Lawyer / compliance** — vendor contract review; post-mortems with regulatory implications.
- **#19 Privacy / GDPR** — vendor reviews of data-processing vendors (Stripe, Neon, Vercel Analytics); support categorisation that touches user data flows.
- **#24 Data protection (VETO)** — any new data processor in vendor register; any post-mortem disclosure that names individuals.
- **#1 Editor-in-chief** — docs-coherence audits; post-mortem narrative quality.
- **#14 DX engineer** — developer-facing docs coherence; API docs.
- **#35 Product analyst** — finance-snapshot numbers cross-checked against metric-catalog; support trends cross-checked against funnel-analysis.

Cross-department gates that apply:

- **`claim-review`** (Compliance & Risk) — every external publication of a snapshot or post-mortem.
- **`security-claim-audit`** (Compliance & Risk) — any post-mortem that includes a security claim.
- **`webhook-review`** (Product & Engineering) — incident post-mortems touching webhook reliability.
- **`weekly-metrics-brief`** (Data & Intelligence) — read for the metric numbers; do not re-derive.

## Autonomy levels

- **Level 2 (Assisted) — default for all admin-ops skills.** Briefs, snapshots, audits, drafts, post-mortems. The operator approves every vendor change, every contract action, every external publication.
- **`incident-postmortem` writes to `memory/product-engineering/incident-history.md`** (a memory file, not `src/`) — append-only with operator approval per entry. Engineering co-signs.
- **Never Level 4.** No auto-cancel. No auto-renew. No vendor onboarding from a skill. No external publication without `claim-review`.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand.
4. `data-handling-rules.md` (Data & Intelligence) before any analysis touches a new data source.

Do not read every file every time. Conserve tokens.

## Companion skills

Each admin-ops skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose skills (e.g. `clarify`, `claim-review`, `audit-website`, `weekly-metrics-brief`) the skill may reach for during its workflow. Companions are advisory; they never bypass the Ops Council, `claim-review`, or `#24` VETO. Full map: `docs/admin-ops-agents.md`.
