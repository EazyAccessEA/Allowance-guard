# Compliance & Risk Agents — Runbook

Allowance Guard's Compliance & Risk managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. It is governed by the Legal Council in `memory/PROCESS.md`, backed by scoped memory in `memory/compliance-risk/`, and operates at the highest review discipline in the department stack.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "Every claim traces. Every user-facing sentence passes the Legal Council. Silence can mislead."

If an output ships a claim without a trace, or ships privacy/consent language without #24 sign-off, it goes back.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `claim-review` | Per-content compliance review | A single piece of content checked before it ships to any public surface |
| `legal-page-draft` | Legal page draft / update | A Privacy Policy, ToS, DPA, Cookie Policy, or SECURITY.md change prepared |
| `policy-alignment` | External platform policy check | Before an ad campaign, before a new directory listing, before a checkout or distribution change |
| `security-claim-audit` | Systemic audit of all security claims | Quarterly, before fundraising, before major product announcement, after an incident |
| `regulatory-change-response` | Response to a new regulation | MiCA secondary leg, FCA guidance, US state privacy law, SEC / CFTC action, new jurisdiction |

## Companion skills map

Each compliance-risk skill can reach for general-purpose Claude Code skills during its workflow. Companions are advisory — they do not bypass the Legal Council or #24 VETO. Per-skill details live at the end of each `SKILL.md`.

| Compliance skill | Companion skills |
|---|---|
| `claim-review` | `audit-website`, `browser-use`, `clarify`, `marketing-psychology` |
| `legal-page-draft` | `clarify`, `simplify`, `claim-review` |
| `policy-alignment` | `browser-use`, `audit-website`, `claim-review` |
| `security-claim-audit` | `audit`, `audit-website`, `claim-review`, `review` |
| `regulatory-change-response` | `browser-use`, `claim-review`, `policy-alignment`, `legal-page-draft` |

Guardrails:
- `browser-use` and `audit-website` stay **read-only** — no form submission, no login, no capture of personal data.
- All compliance-risk review skills produce findings or proposals; **none ship copy directly**. Rewrites and edits route to `legal-page-draft` (for legal pages) or to marketing's `writer` / `conversion` / engineering's skills (for their respective surfaces).
- `legal-page-draft` operates at **Autonomy Level 1** — every `src/app/<legal-page>/**` or `SECURITY.md` write requires a fresh user confirm, with #24 VETO on the draft before the write.

## Typical flows (operator prompts)

### Before shipping marketing copy

> Run the claim-review skill. Content: `context/drafts/<path>`. Surface: homepage hero (or wherever). Produce the pass/fail report with per-claim findings. Do not ship.

Expected: review file under `context/compliance/reviews/`. If REWRITE, route back to `writer` / `conversion`.

### Drafting or updating a legal page

> Run the legal-page-draft skill. Page: Privacy Policy. Trigger: <new processor / new jurisdiction / new regulation / routine review>. Draft the update. Level 1 — wait for my confirm before any src/ write.

Expected: draft `.mdx` file under `context/compliance/legal-drafts/`. After council + user sign-off, the user confirms the `src/app/privacy/page.tsx` edit.

### Before launching an ad campaign

> Run the policy-alignment skill. Content: <landing page draft + ad creative>. Platforms: Google Ads + Meta Ads. Produce the alignment report; do not ship.

Expected: alignment report in `context/compliance/policy-alignment/`. If BLOCK, route to `writer` for reframe.

### Quarterly security-claim sweep

> Run the security-claim-audit skill. Scope: all public surfaces. Produce the P0–P3 findings report with fix handoff per finding.

Expected: audit report in `context/compliance/security-audits/`. Each P0 routes to the owning skill immediately.

### New regulation lands

> Run the regulatory-change-response skill. Trigger: <regulation / guidance / enforcement action + URL>. Produce the impact assessment, gap analysis, remediation plan, and regulatory-matrix update.

Expected: response file under `context/compliance/regulatory/`. Updates to `regulatory-matrix.md` upon user approval.

## Autonomy ladder

- **Level 2 (Assisted) — default for review skills.** `claim-review`, `policy-alignment`, `security-claim-audit`, `regulatory-change-response` produce reports and proposals. They never ship.
- **Level 1 (fresh confirm per write) — `legal-page-draft`.** Every edit to `src/app/privacy/**`, `src/app/terms/**`, `src/app/dpa/**`, `src/app/cookies/**`, or `SECURITY.md` requires an explicit user confirm per file. #24 VETO on the draft before the write.
- **Never Level 4.** No auto-publish of legal pages, no auto-filing to regulators, no auto-send of disclosure notices.

## Approval flow

```
content / trigger
     │
     ▼
review skill emits report (context/compliance/...)
     │
     ▼
Legal Council sign-off — #9, #23, #24 (VETO)
     │
     ▼
rewrite / remediation hands off to owning skill:
  - legal page     → legal-page-draft (L1)
  - marketing copy → writer / conversion (marketing dept)
  - UI / error     → build-feature / fix-bug (engineering)
  - platform copy  → writer (+ re-run policy-alignment)
  - reg filing     → retained human lawyer
```

## What sits under `memory/compliance-risk/`

- `MEMORY.md` — index + six standing rules + councils + autonomy.
- `claims-register.md` — append-only log of every public claim + source of truth.
- `platform-rules.md` — external platform policy constraints (Google, Meta, Stripe, Cloudflare, Vercel, Neon, GitHub, future app stores).
- `regulatory-matrix.md` — regulations by category × jurisdiction × status × surface.
- `jurisdictions.md` — where AG operates, primary law per surface, sanctions exclusions.
- `incident-disclosure.md` — GDPR-triggered regulatory + user disclosure playbook.

Skills read what they need. No skill reads everything.

## Governance — the Legal Council

Full list in `memory/PROCESS.md`. On every compliance-risk skill run:

- **#9 Lawyer / compliance counsel** — license accuracy, no false promises, securities exposure, GDPR article-level.
- **#23 Regulatory / compliance counsel** — securities law, AML/KYC exposure, advertising standards, jurisdictional risk.
- **#24 Data protection / privacy lawyer (VETO)** — GDPR Article-level accuracy, cookie consent language, DPA enforceability, cross-border transfers.

Plus these Standing Council members where relevant:
- **#4 Security** — all security claims, error disclosure, webhook + secret handling.
- **#11 Investor / founder voice** — banned-phrase gate; commercial claim register.
- **#19 Privacy / GDPR specialist** — data handling, retention, user rights.
- **#1 Editor-in-chief** — plain-language discipline on user-facing legal pages.

Cross-department vetoes that apply:
- **#8 Accessibility (VETO)** — any UI touch, including legal-page design.
- **Noor (Design Council, VETO)** — AA on any legal-page surface.

## Boundaries (non-negotiable)

- No skill in this department ships copy directly to public surfaces. Routes via:
    - `legal-page-draft` → `src/app/<legal-page>/**` (Level 1)
    - Marketing skills → their own lanes
    - Engineering skills → `src/`
- No regulatory filing from any skill. The user + retained lawyer file.
- No legal opinions binding on the entity. Council members are lenses; a retained human lawyer is the authority on material interpretations.
- No overriding #24 VETO.
- No `claims-register.md` update until content ships.
- No `regulatory-matrix.md` update without a citation to the regulation.
- No `platform-rules.md` update without a link + retrieval date.

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` in the skill's frontmatter. Confirm the directory is under `.claude/skills/` and the file is `SKILL.md`.
- **`claim-review` passed a claim that's wrong.** The source-of-truth cited was itself wrong. Update the canonical file first (`BUSINESS.md`, `ARCHITECTURE.md`, or the ADR), then re-run.
- **`legal-page-draft` wrote without confirm.** Level 1 violation. Log in `memory/CORRECTIONS.md`; tighten the skill's Level 1 language. Revert the commit.
- **`policy-alignment` using stale platform rules.** The skill should re-fetch per run; if not, `platform-rules.md` policy URL is out of date. Update the URL + retrieval date.
- **`security-claim-audit` missed a surface.** Vocabulary list in the skill should enumerate trigger words. If a surface uses non-standard vocabulary (e.g., "shield" instead of "protect"), add the term to the skill.
- **`regulatory-change-response` misclassified scope.** Human legal review catches this. The skill is a lens; the retained lawyer's read is the final call on scope.
- **`claims-register.md` is out of sync with shipped surfaces.** Run `security-claim-audit` quarterly; it lists unregistered claims as a P1 finding.

## Relationship to other departments

- **Marketing** — largest producer of claims. Every marketing content ship runs through `claim-review` for public-facing surfaces. Material security or regulatory claims in marketing also route through `security-claim-audit` (systemic) or `regulatory-change-response` (if a reg drove the claim).
- **Product & Engineering** — UI + error messages + API docs are claims. `claim-review` applies. Engineering's `fix-bug` and `build-feature` route material claims via `claim-review` before ship.
- **Design** — legal-page surfaces use Design Council's Ledger canon (with Noor's VETO on accessibility). `legal-page-draft` specifies content; `design-ledger-surface` can spec the visual if the page is reshaped.
- **Growth / Distribution** (pilot 4 — future) — grant applications, partnership announcements, listings all create claims. Compliance reviews each before ship.
- **Data & Intelligence** (pilot 5 — future) — experiments must comply with privacy policy; `regulatory-change-response` + `legal-page-draft` coordinate when new tracking is proposed.
- **Admin / Operations** (pilot 6 — future) — support responses are claims by our operator. Templates live in admin-ops memory but pass `claim-review` at template creation.

## When to add a compliance-risk skill

Criteria:
- A compliance workflow happens ≥3 times in this department and has a repeatable shape.
- Clear Legal Council gates that ad-hoc prompts keep missing.
- Producer-shaped output (review, proposal, plan).

Not-criteria (do not justify a new skill):
- A one-off regulatory event (use `regulatory-change-response`).
- A single document review (use `claim-review`).
- Ongoing operational compliance tasks (usually belong in admin-ops when that ships).

New skill proposals go through #9 + #23 + #24. Add the SKILL.md, update this runbook, update `MEMORY.md` if a new memory file is needed.
