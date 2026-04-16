# Growth & Distribution Agents — Runbook

Allowance Guard's Growth & Distribution managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. Separate from Marketing by design — growth is about **channels and relationships**; marketing is about **content and messaging**. They collaborate; they are not the same.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "Approach with value delivered, not value extracted. Compliance review every outbound. Every relationship compounds."

If an output pitches AG without naming what the partner gets, it goes back.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `grant-application` | Ecosystem / foundation grant drafting | A specific programme's round open, AG fits, deliverables story worth funding |
| `integration-proposal` | Outbound integration proposal | Wallet / protocol / security tool / developer platform where AG's API or data delivers value |
| `listing-submission` | Directory / portal / awesome-list submission | DeFi Llama, chain ecosystem portals, Product Hunt, curated lists |
| `partnership-brief` | Internal prep for partnership conversations | Before any first call, exec meeting, conference chat, inbound-partner evaluation |
| `sponsorship-brief` | Outbound / inbound sponsorship evaluation | Hackathons, conferences, cohorts — deciding whether / what to sponsor |
| `open-source-program-run` | Run the OSS community | Ongoing triage, SLAs, policy updates, community-health reports |

## Companion skills map

Each growth skill can reach for general-purpose Claude Code skills during its workflow. Companions are advisory — they do not bypass the Growth Council, `claim-review`, or `#24` VETO. Per-skill details live at the end of each `SKILL.md`.

| Growth skill | Companion skills |
|---|---|
| `grant-application` | `claim-review`, `writer`, `clarify`, `market-research`, `marketing-psychology`, `browser-use`, `WebFetch` |
| `integration-proposal` | `claim-review`, `marketing-psychology`, `clarify`, `writer`, `market-research`, `browser-use`, `WebFetch`, `security-review` |
| `listing-submission` | `claim-review`, `policy-alignment`, `clarify`, `image-direction`, `browser-use`, `WebFetch` |
| `partnership-brief` | `market-research`, `marketing-psychology`, `integration-proposal`, `claim-review`, `browser-use`, `WebFetch` |
| `sponsorship-brief` | `claim-review`, `policy-alignment`, `marketing-psychology`, `market-research`, `partnership-brief`, `browser-use`, `WebFetch` |
| `open-source-program-run` | `code-review`, `review`, `security-review`, `claim-review`, `clarify`, `writer` |

Guardrails:
- `browser-use`, `WebFetch`, `audit-website` stay **read-only** — no form submission, no login, no personal-data capture.
- **`claim-review` is MANDATORY** before any grant submission, integration proposal, listing submission, or public-facing sponsorship copy.
- **`policy-alignment` is MANDATORY** for any listing or sponsorship on a platform with content policies (Product Hunt, app stores, chain ecosystem portals with alignment rules).
- No growth skill submits, sends, or commits funds. The user does all of that.

## Typical flows (operator prompts)

### Apply for a grant

> Run the grant-application skill. Programme: <name>. URL: <link>. Our ask: <amount>. Draft the application; run claim-review; wait for my approval; do not submit.

Expected: draft under `context/grants/`, appended to `grants-history.md` on submission.

### Propose an integration with a wallet / protocol

> Run the integration-proposal skill. Partner: <name>. Shape: <Snap / widget / API / data>. Draft the proposal; run claim-review; do not send.

Expected: proposal under `context/partnerships/`.

### Submit AG to a directory

> Run the listing-submission skill. Directory: <name>. Submission URL: <link>. Prepare the package; run claim-review + policy-alignment; do not submit.

Expected: package under `context/listings/`.

### Prep for a partnership call

> Run the partnership-brief skill. Partner: <name>. Meeting: <date + shape>. Produce the brief; emit to context/partnerships/briefs/.

Expected: ≤1500-word brief, skim-friendly, internal-only.

### Evaluate a sponsorship ask

> Run the sponsorship-brief skill. Event: <name>. Ask: <amount / tier>. Produce go/no-go with ROI framing. Do not commit funds.

Expected: brief under `context/sponsorships/`.

### Weekly OSS triage

> Run the open-source-program-run skill. Session: weekly triage. Window: last 7 days. Report SLA scorecard, per-item routing, stale items, security-sensitive handling.

Expected: triage report under `context/oss/`.

## Autonomy ladder

- **Level 2 (Assisted) — all growth skills.** Drafts, proposals, plans, briefs. The user sends every email, submits every application, commits every dollar, signs every agreement, merges every PR.
- **Never Level 4.** No auto-send, no auto-submit, no auto-commit.

## Approval flow

```
opportunity / ask
     │
     ▼
skill drafts (context/)
     │
     ▼
claim-review + policy-alignment (as applicable)
     │
     ▼
Growth Council sign-off
     │
     ▼
user submits / sends / commits
     │
     ▼
append to grants-history.md / partnerships-history.md / ecosystems.md
```

## What sits under `memory/growth/`

- `MEMORY.md` — index + six standing rules + councils + autonomy.
- `targets.md` — categorised targets (wallets, protocols, ecosystems, researchers, press, grants, directories, education, devplatforms).
- `ecosystems.md` — live tracked ecosystems with programme detail (EF, Optimism, Base, Arbitrum, Polygon, Gitcoin, etc.).
- `integrations.md` — current + requested integrations with technical constraints.
- `grants-history.md` — append-only log of grant applications + outcomes.
- `partnerships-history.md` — append-only log of partnership conversations.
- `open-source-program.md` — CLA, contribution process, PR triage SLAs, community governance.

Skills read what they need. No skill reads everything.

## Governance — the Growth Council

Full list in `memory/PROCESS.md`. On every growth skill run:

- **#12 Ecosystem strategist (lead)** — competitive positioning, partnership sequencing, distribution channel selection.
- **#2 Open source maintainer** — OSS program; leads `open-source-program-run`; co-reviews grants with open-source impact.
- **#6 B2B / API economy expert** — developer-facing BD; leads `integration-proposal`.

Plus:
- **#5 Product marketing** — positioning of proposals.
- **#11 Investor / founder voice** — fundability + banned-phrase gate.
- **#9 Lawyer / compliance** — contracts + grant terms + OSS legal.
- **#23 Regulatory** — cross-border implications.

Cross-department gates that apply:
- **Legal Council** (Compliance & Risk) — every shipping grant / proposal / listing passes `claim-review` first.
- **#24 Data protection (VETO)** — any privacy / consent language.
- **#4 Security** — on integrations touching sensitive data or auth flows; on OSS security reports.

## Boundaries (non-negotiable)

- No submission, send, or commitment from any growth skill. The user acts.
- No grant accepted without Legal Council review.
- No integration proposed that white-labels AG in ways inconsistent with the open-source story.
- No sponsorship in a sanctioned jurisdiction.
- No listing that breaks content-policy rules on the host platform.
- No `src/` writes. Technical integrations hand off to engineering's `build-feature`; marketing surface edits hand off to `web-implementation`.
- No use of non-public information about partners (leaked decks, overheard rumour). Public professional signal only.
- No pretend-personal outreach. Every outbound identifies the sender.

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` + directory structure under `.claude/skills/`.
- **Proposal too generic.** Skill missed partner-specific context. Re-run with `WebFetch` on the partner's recent announcements explicitly in the prompt.
- **`claim-review` flagged an overstatement.** Route back to the originating skill; rewrite with the trace the review required.
- **Grant narrative feels promotional, not public-goods.** Re-read `ecosystems.md` for the programme's evaluation criteria; rewrite lead with public-goods framing.
- **Partnership-brief too long.** Target ≤1500 words. Prune scenarios; keep risks; cut background paragraphs that don't change the operator's approach.
- **SLA missed on OSS triage.** Document the miss in the triage output. Do not backdate. Propose compensatory action.
- **Sponsorship decision feels emotional.** Re-run through ROI frame; compare to prior sponsorship comparables in `partnerships-history.md`.

## Relationship to other departments

- **Marketing** — owns copy, tone, imagery. Growth proposes / submits / partners; marketing produces any public-facing writing that comes out of those engagements (announcements, co-marketing copy, blog posts). `writer` / `conversion` / `outreach` are the marketing skills that pair.
- **Product & Engineering** — implements technical integrations via `build-feature`. Growth proposes; engineering validates + builds. `add-chain` intersects when a partnership drives a chain addition.
- **Design** — specs the visuals for listings, co-marketing, event booths via `design-ledger-surface` / `design-component`. Growth tells design what's needed; design specs; engineering implements via `web-implementation`.
- **Compliance & Risk** — `claim-review`, `policy-alignment`, `security-claim-audit` gate every shipping outbound. `legal-page-draft` handles any partner-contract-driven legal-page updates. `regulatory-change-response` evaluates cross-border grant implications.
- **Data & Intelligence** (pilot 5) — will analyse partnership / grant / sponsorship ROI over time. Growth generates data; data-intelligence analyses; growth adjusts.
- **Admin / Operations** (pilot 6) — calendar deadlines (grants have them), vendor tracking, contract filing.

## When to add a growth skill

Criteria:
- A growth workflow happens ≥3 times and has a repeatable shape.
- Clear Growth Council gates that ad-hoc prompts keep missing.
- Producer-shaped output (application, proposal, brief, report, package).

Expected additions as AG scales:
- `bounty-program-design` — if AG runs security bug bounties or hackathon prize programmes regularly.
- `referral-program-design` — if AG ships a Pro-tier referral scheme.
- `conference-plan` — if AG sponsors / speaks at conferences regularly enough to warrant a dedicated workflow.
- `community-event-run` — if AG runs regular meetups / AMAs.

Not-criteria (do not justify a new skill):
- A one-off campaign (use an existing skill with a note).
- A pure-review perspective (those are council lenses).

**How to add a skill:**
1. Identify the workflow pattern and its producer-shaped output.
2. Propose the skill: name, description, target council, memory reads, output format.
3. #12 Ecosystem + the relevant specialist council member sign off.
4. Author the `SKILL.md` following the pattern (`## Operating principles`, `## Workflow`, `## Output format`, `## Self-review`, `## Hard bans`, `## Product truth`, `## Boundaries`, `## Companion skills`, `## Memory`).
5. Update this runbook + `MEMORY.md` if a new memory file is needed.
6. First invocation is a dry-run; rough edges tightened after.

This department is designed to grow. The skill framework supports it.
