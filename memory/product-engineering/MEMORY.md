# memory/product-engineering/ — Index

Scoped memory for the Allowance Guard Product & Engineering managed-agent system. Loaded only when a product-engineering skill is running. Does not replace `memory/PROCESS.md`, `memory/OUTPUT.md`, `memory/CONSTRAINTS.md`, or `memory/TOOLS.md` — it sits under them.

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + six standing rules. Read first. |
| `architecture-rules.md` | Architectural invariants (routes, data access, component boundaries, dependency rules) |
| `chain-support.md` | 27-chain list + process for adding a new chain |
| `test-strategy.md` | Test pyramid, what must have a test, coverage expectations |
| `performance-budget.md` | Core Web Vitals targets, bundle budget, perf anti-patterns |
| `security-posture.md` | Auth, secrets, CSP, webhook verification, rate limiting, CSRF |
| `incident-history.md` | Append-only log of production incidents + root causes |

## Six standing rules

1. **Plan first.** Before any `src/` edit, outline affected files, approach, and steps. No diving into code. Enforced by `memory/PROCESS.md:12-13`.
2. **No code without a test.** Every new route, every bug fix, every new `src/lib/` function ships with at least one automated test. Enforced by `test-strategy.md`.
3. **No ad-hoc SQL in production.** DB changes go through Drizzle migrations, committed and reviewed. #18 DB engineer VETO on migration safety.
4. **No hardcoded secrets.** Environment variables only. No `.env` committed. #4 Security VETO.
5. **No degraded accessibility.** Any `src/` code that renders UI gets the #8 VETO — AA contrast, keyboard nav, motion safety. Enforced by `projects/allowanceguard/DESIGN.md` and the Design Council.
6. **No absolute-security claims in code strings.** Error messages, toast copy, and console output mirror the marketing rule: Allowance Guard reduces risk; it does not remove it. Gatekeeper: #11.

## Canonical sources (single sources of truth)

- Repo layout, tech stack, env vars, commands — `projects/allowanceguard/PROJECT.md`
- API routes, DB schema, chain list, feature gates — `projects/allowanceguard/ARCHITECTURE.md`
- Visual canon (homepage Ledger, dashboard/docs glass) — `projects/allowanceguard/DESIGN.md`
- Tiers, chains, prices — `projects/allowanceguard/BUSINESS.md`
- "Why is it this way?" — `projects/allowanceguard/decisions/` (ADRs)
- Global code conventions — `memory/OUTPUT.md`
- Global "do not" rules — `memory/CONSTRAINTS.md`
- Tool policy + git safety — `memory/TOOLS.md`
- Council + review gates — `memory/PROCESS.md`

## Autonomy levels

Engineering work is riskier than marketing because it touches `src/`, the database, and production systems. Autonomy is tiered.

- **Level 2 (Assisted) — default for most skills.** Draft, plan, show the diff, wait for approval. User approves every commit.
- **Level 1 (Ask-every-time) — migrations, auth/checkout/stripe/webhook paths, infrastructure.** The skill never writes without an explicit confirm-this-exact-action from the user. This is the `hard confirmation step` flagged by #4 Security in council.
- **Never Level 4.** No auto-commit, no auto-deploy, no auto-migrate. Deny list in `.claude/settings.json` enforces.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand when a fact needs verifying.

Do not read every file every time. Conserve tokens.

## Companion skills

Each product-engineering skill's `SKILL.md` ends with a `## Companion skills` block — general-purpose Claude Code skills (e.g. `feature-dev`, `code-review`, `review`, `security-review`, `defi-security`, `simplify`, `audit`) the skill may reach for during its workflow. Companions are advisory; they never bypass the six standing rules above, the Council, or the deny list in `.claude/settings.json`. Full map: `docs/product-engineering-agents.md`.
