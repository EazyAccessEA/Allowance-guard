# CLAUDE.md — Entry Point

Behaviour rules and pointers for Claude. Full project knowledge lives in `projects/allowanceguard/`. Global behaviour rules live in `memory/`.

## Startup routine

At the start of every session or task:

1. **Read this file first.** It's the load map.
2. **Read anything in `context/`** (gitignored). Current-task notes. If empty, skip.
3. **Load on demand.** Pull the `memory/` or `projects/` files relevant to the task — not all of them.

Together: `context/` explains the present. `memory/` holds how Claude behaves. `projects/` holds what we're building. Use all three to produce consistent, accurate work.

## Triage (which file does this belong in?)

- **How I work** → `memory/`
- **What I'm building** → `projects/`
- **Right now** → `context/` (gitignored)
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
| Anything non-trivial | `memory/PROCESS.md` (Workflow rules + Standing Council) |
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

### Marketing managed-agent system — `memory/marketing/` + `.claude/skills/`

| When working on... | Read |
|--------------------|------|
| Marketing, content, growth, outreach, imagery | `memory/marketing/MEMORY.md` + `docs/marketing-agents.md` |

Skills live under `.claude/skills/` (market-research, positioning, content-strategy, writer, seo, social, outreach, conversion, analytics, campaign-manager, image-direction, web-implementation). Autonomy level 2 — user approves every publish, send, and `src/` edit.

### Product & Engineering managed-agent system — `memory/product-engineering/` + `.claude/skills/`

| When working on... | Read |
|--------------------|------|
| Features, bugs, migrations, chain onboarding, refactors, payments, webhooks, incidents | `memory/product-engineering/MEMORY.md` + `docs/product-engineering-agents.md` |

Skills live under `.claude/skills/` (build-feature, fix-bug, write-migration, debug-prod-incident, refactor-component, add-chain, implement-checkout-flow, webhook-review). Autonomy level 2 for most, **level 1 (fresh confirm per write)** for `write-migration` and `implement-checkout-flow`. Payment-touching skills convene the Payment Sub-council (#30, #31, #4). Plan → diff → tests; user commits and deploys.

### Design managed-agent system — `memory/design/` + `.claude/skills/`

| When working on... | Read |
|--------------------|------|
| Marketing surfaces (Ledger), app surfaces (Glass), components, tokens, motion, drift audits, critiques | `memory/design/MEMORY.md` + `docs/design-agents.md` |

Skills live under `.claude/skills/` (design-ledger-surface, design-glass-surface, design-component, design-token, design-motion, design-system-audit, design-critique). Autonomy level 2 across the board — design skills produce specs/proposals/audits/critiques; they never write under `src/`. Marketing surfaces land via `web-implementation`; app surfaces and components land via `build-feature`. Design Council (Maren/Kael/Idris/Sable/Noor-VETO/Thane) + #7 convenes on every skill run. Noor holds the **VETO** on accessibility.

### Compliance & Risk managed-agent system — `memory/compliance-risk/` + `.claude/skills/`

| When working on... | Read |
|--------------------|------|
| Claim review, legal pages, platform-policy alignment, security-claim audits, regulatory change, user disclosure | `memory/compliance-risk/MEMORY.md` + `docs/compliance-risk-agents.md` |

Skills live under `.claude/skills/` (claim-review, legal-page-draft, policy-alignment, security-claim-audit, regulatory-change-response). Autonomy level 2 for review skills; **level 1 (fresh confirm per write)** for `legal-page-draft` with #24 VETO on the draft before any `src/app/<legal-page>/**` or `SECURITY.md` write. Legal Council (#9, #23, #24-VETO) + #4 + #11 + #19 convenes on every skill run. No skill in this department ships copy directly; rewrites route to `legal-page-draft`, marketing's `writer` / `conversion`, or engineering.

### Growth & Distribution managed-agent system — `memory/growth/` + `.claude/skills/`

| When working on... | Read |
|--------------------|------|
| Grants, integrations (wallets / protocols / tools), listings / directories, partnerships, sponsorships, open-source community | `memory/growth/MEMORY.md` + `docs/growth-agents.md` |

Skills live under `.claude/skills/` (grant-application, integration-proposal, listing-submission, partnership-brief, sponsorship-brief, open-source-program-run). Autonomy level 2 across the board — skills draft, propose, brief, triage; the user submits / sends / commits funds / merges PRs. Growth Council (#12 Ecosystem lead, #2 Open source maintainer, #6 B2B/API) + #5 + #11 + #9 + #23 convenes on every skill run. `claim-review` is **MANDATORY** before any grant / integration / listing ships public; `policy-alignment` is **MANDATORY** for platform-policy-sensitive submissions.

## The four workflow rules (full text in `memory/PROCESS.md`)

1. **Plan first.** Outline files, approach, steps before writing code.
2. **600-line limit.** No file over 600 lines. Split if needed.
3. **Conserve tokens.** Terse. No re-reads. Batch independent tool calls. Prefer `Edit` over `Write`.
4. **Convene the Standing Council.** Reason through every non-trivial change through the relevant members' lenses.

## Vetos (active on every change)

- **#8 Accessibility** and Design Council's **Noor** — WCAG AA, contrast, motion safety.
- **#24 Data protection lawyer** — privacy policy, consent copy, data handling language.
- **#11 Investor / founder voice** — gatekeeper for the banned-phrase list.

## Changelog

- 2026-04-14: Rewritten as slim entry point. Project knowledge moved to `projects/allowanceguard/`. Behaviour rules moved to `memory/`. Startup routine preserved at the top.
- 2026-04-16: Added Product & Engineering managed-agent system (pilot 1 of 6 new departments). 8 skills + 7 scoped memory files + runbook. Council members #35 Product analyst and #36 Operations manager added in `memory/PROCESS.md` for future pilots.
- 2026-04-16: Added Design managed-agent system (pilot 2). 7 project-scoped skills (Ledger + Glass surfaces, component / token / motion proposals, drift audit, per-surface critique) + 6 scoped memory files + runbook. Design Council leads; Noor holds VETO on accessibility.
- 2026-04-17: Added Compliance & Risk managed-agent system (pilot 3). 5 skills (claim-review, legal-page-draft L1, policy-alignment, security-claim-audit, regulatory-change-response) + 6 scoped memory files (claims-register, platform-rules, regulatory-matrix, jurisdictions, incident-disclosure) + runbook. Legal Council leads; #24 holds VETO on privacy / consent / data-handling copy.
- 2026-04-17: Added Growth & Distribution managed-agent system (pilot 4). 6 skills (grant-application, integration-proposal, listing-submission, partnership-brief, sponsorship-brief, open-source-program-run) + 7 scoped memory files (targets, ecosystems, integrations, grants-history, partnerships-history, open-source-program) + runbook. Growth Council leads (#12 Ecosystem, #2 OSS maintainer, #6 B2B/API). Separate from Marketing by design — channels and relationships, not content and messaging.
