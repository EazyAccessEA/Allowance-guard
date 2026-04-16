# memory/compliance-risk/ — Index

Scoped memory for the Allowance Guard Compliance & Risk managed-agent system. Loaded only when a compliance-risk skill is running. Sits under `memory/PROCESS.md`, `memory/VOICE.md`, `memory/CONSTRAINTS.md`.

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `claims-register.md` | Append-only log of every public claim + its source of truth |
| `platform-rules.md` | External platform policy constraints (Google, Meta, Stripe, Cloudflare, app stores) |
| `regulatory-matrix.md` | Regulations that apply by jurisdiction × product surface + status |
| `jurisdictions.md` | Where Allowance Guard operates, primary law that governs each surface |
| `incident-disclosure.md` | Playbook for regulatory + user disclosure post-incident (GDPR 72h, etc.) |

## Six standing rules

1. **Never claim absolute security.** Language is "reduces risk", "lowers exposure", "flags", "surfaces" — never "protects", "guarantees", "secures". AG is non-custodial; users sign every transaction.
2. **Never promise regulatory compliance.** "Designed to comply with UK GDPR" — not "GDPR compliant." Compliance is a state at a point in time; claims in copy outlive that state.
3. **#24 Data protection holds a VETO.** Every privacy / consent / data-handling sentence gets #24 sign-off before ship. No exceptions for time pressure.
4. **Platform rules evolve faster than code.** Re-verify Google Ads / Meta Ads / Stripe acceptable-use policies before any campaign push. Old clearance does not equal current clearance.
5. **Every user-facing claim traces to a source.** `projects/allowanceguard/BUSINESS.md`, `ARCHITECTURE.md`, an ADR, or an external citation. If it doesn't trace, it doesn't ship.
6. **Errors disclose less than they know.** No stack traces, DB column names, internal path prefixes, or provider identifiers in user-facing error strings. 4xx/5xx bodies are sanitised.

## Canonical sources (single sources of truth)

- Product truth (tiers, chains, prices, feature gates) — `projects/allowanceguard/BUSINESS.md`
- Technical truth (APIs, chains, envs, webhooks) — `projects/allowanceguard/ARCHITECTURE.md`
- Security posture — `memory/product-engineering/security-posture.md`
- Voice + banned phrases — `memory/VOICE.md` (gatekeeper: #11)
- Global "do not" rules — `memory/CONSTRAINTS.md`
- Existing legal pages — `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/dpa/page.tsx`, `src/app/cookies/page.tsx` (verify paths in-repo)
- Council + Legal Council — `memory/PROCESS.md`

## The Legal Council (from PROCESS.md)

Convened on every compliance-risk skill run, in addition to the Standing Council.

- **#9 Lawyer / compliance counsel** — license accuracy, no false promises, securities exposure, GDPR at an article level.
- **#23 Regulatory / compliance counsel** — securities law, AML/KYC exposure, advertising standards, jurisdictional risk.
- **#24 Data protection / privacy lawyer (VETO)** — GDPR article-level accuracy, cookie consent language, DPA enforceability, cross-border transfer mechanisms.

Plus these Standing Council members on any compliance-risk surface:
- **#4 Security engineer** — all security claims, error-message disclosure, webhook + secret handling.
- **#11 Investor / founder voice** — banned-phrase gate; commercial claim register.
- **#19 Privacy / GDPR specialist** — data handling, retention, user rights.

## Autonomy levels

- **Level 2 (Assisted) — default.** Review skills (`claim-review`, `policy-alignment`, `security-claim-audit`, `regulatory-change-response`) produce reports + proposals. They never ship.
- **Level 1 (fresh confirm per write) — `legal-page-draft`.** Every edit to `src/app/privacy/**`, `src/app/terms/**`, `src/app/dpa/**`, `src/app/cookies/**`, or `SECURITY.md` requires a fresh user confirm per file. #24 VETO on the draft before the write.
- **Never Level 4.** No auto-publish, no auto-filing to any regulator, no auto-send of disclosure notices.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand.
4. External regulations / platform policies verified fresh — do not trust cached summaries for any shipping claim.

Do not read every file every time. Conserve tokens.

## Companion skills

Each compliance-risk skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose Claude Code skills the skill may reach for during its workflow. Companions are advisory; they never bypass the Legal Council, #24 VETO, or the deny list in `.claude/settings.json`. `audit-website` and `browser-use` stay **read-only** — no form submission, no login. Full map: `docs/compliance-risk-agents.md`.
