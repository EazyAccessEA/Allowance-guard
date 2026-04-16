# memory/growth/ — Index

Scoped memory for the Allowance Guard Growth & Distribution managed-agent system. Loaded only when a growth skill is running. Separate from `memory/marketing/` by design — growth is about **channels and relationships**; marketing is about **content and messaging**. They collaborate; they are not the same.

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `targets.md` | Categorised list of ecosystems, wallets, protocols, researchers, press, grant programmes |
| `ecosystems.md` | Live tracked ecosystems + their funding programmes / deadlines / contacts |
| `integrations.md` | Current integrations + requested integrations + integration partners' technical constraints |
| `grants-history.md` | Append-only log of grant applications + outcomes |
| `partnerships-history.md` | Append-only log of partnership + integration conversations |
| `open-source-program.md` | Contribution process, CLA, PR triage SLAs, community governance |

## Six standing rules

1. **Approach with value delivered, not value extracted.** Outbound says what AG can do for the partner before asking for anything. A wallet does not care about our user count; they care whether AG makes their users safer.
2. **Every claim in an outbound runs `claim-review` before send.** Grant applications, integration proposals, partnership decks — all reviewed. The Legal Council gates apply.
3. **PECR + UK GDPR discipline on every B2B outreach.** Sender identified in first two lines, commercial intent disclosed, opt-out offered, lawful basis stated. No pretend-personal tone.
4. **Never paid endorsement as organic.** If we pay for a placement or a review, we label it. ASA / FTC rules govern.
5. **Reciprocity, not transaction.** When a partner supports us (listing, integration, grant), we invest in their ecosystem (educational content, user flows, bug reports). The relationship outlasts the ask.
6. **Compliance and security claims are loaded.** Any grant / partnership / listing that describes AG's security posture runs through `security-claim-audit` first. Over-stating in an application creates the same exposure as over-stating in marketing copy.

## Canonical sources (single sources of truth)

- Product truth — `projects/allowanceguard/BUSINESS.md`, `ARCHITECTURE.md`
- Tier + pricing + non-custodial statement — `BUSINESS.md:49-54`, `BUSINESS.md:22`
- Jurisdictions + sanctions exclusions — `memory/compliance-risk/jurisdictions.md`
- Security posture — `memory/product-engineering/security-posture.md`
- Claims register — `memory/compliance-risk/claims-register.md`
- Voice + banned phrases — `memory/VOICE.md`
- Council — `memory/PROCESS.md`
- Marketing memory (for coordination) — `memory/marketing/`

## The Growth Council (from PROCESS.md)

Convened on every growth skill run, in addition to the Standing Council:

- **#12 Ecosystem strategist (lead)** — competitive positioning, partnership sequencing, distribution channel selection.
- **#2 Open source maintainer** — contribution pathways, licensing, community health, CLA, governance. Leads `open-source-program-run`.
- **#6 B2B / API economy expert** — developer-facing BD, API tier positioning, SDK ergonomics as an integration surface.

Plus these Standing Council members on any growth surface:

- **#5 Product marketing** — positioning of proposals (not copy; positioning).
- **#11 Investor / founder voice** — fundability signal in grant / partnership copy; banned-phrase gate.
- **#9 Lawyer / compliance** — contract terms, grant conditions, joint-venture implications. Lead on any contract.
- **#23 Regulatory** — cross-border grant implications, jurisdiction mismatch risk.

Cross-department gates that apply:

- **Legal Council (Compliance & Risk dept)** — every shipping grant / proposal / listing passes `claim-review` first. #24 VETO on any privacy / consent / data-handling language.
- **#4 Security** — any security claim in a proposal audits through `security-claim-audit`.

## Autonomy levels

- **Level 2 (Assisted) — default for all growth skills.** Drafts, plans, proposals, briefs. The user sends every email, submits every application, signs every agreement.
- **Never Level 4.** No auto-send, no auto-submit, no auto-commit on partnership terms.
- Special case: `open-source-program-run` can make non-substantive repo hygiene edits (CONTRIBUTING.md wording, issue-template fields) at Level 2 with user sign-off per file. Substantive governance changes stay at Level 2 with explicit approval.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand.
4. `memory/compliance-risk/claims-register.md` + `memory/compliance-risk/jurisdictions.md` before any cross-border proposal.

Do not read every file every time. Conserve tokens.

## Companion skills

Each growth skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose skills (e.g. `clarify`, `marketing-psychology`, `claim-review`, `browser-use`, `audit-website`) the skill may reach for during its workflow. Companions are advisory; they never bypass the Legal Council, `claim-review`, or `#24` VETO. Full map: `docs/growth-agents.md`.
