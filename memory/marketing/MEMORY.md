# memory/marketing/ — Index

Scoped memory for the Allowance Guard marketing managed-agent system. Loaded only when a marketing skill is running. Does not replace `memory/VOICE.md`, `memory/PROCESS.md`, or any other global behaviour memory — it sits under them.

## Files

| File | Purpose |
|------|---------|
| `MEMORY.md` | This index + five standing rules. Read first. |
| `brand.md` | Voice, banned phrases (mirrors `memory/VOICE.md`), preferred phrasing, proof standards |
| `audiences.md` | Four segments with pains, objections, desired outcomes |
| `positioning-history.md` | Append-only log of positioning decisions |
| `content-history.md` | Append-only log of shipped content |
| `seo.md` | Priority keyword clusters + content-gap notes |
| `outreach.md` | Target categories + append-only outreach log |
| `experiments.md` | Append-only hypothesis/result log |
| `metrics.md` | What success looks like per surface |
| `imagery.md` | Line-art canon + photoreal canon + prompt library |

## Five standing rules

1. **Never promise absolute safety.** Allowance Guard reduces risk; it does not remove it. Language reflects that.
2. **No hype-crypto register.** No "degen", no "moon", no "wagmi", no "gm". This is security tooling, not a memecoin drop.
3. **Education > fear.** Lead with how approvals work, not with a body count. Evidence-first, always.
4. **Distinguish visibility, monitoring, revocation.** Three different capabilities. Do not blur them. Free tier = visibility + manual revoke; Pro/Sentinel add monitoring + automation.
5. **Evidence-first.** Every claim traces to `BUSINESS.md`, `ARCHITECTURE.md`, or an ADR. If a fact isn't there, fact-check before writing.

## Canonical sources (single sources of truth)

- Banned phrases & voice — `memory/VOICE.md`
- Product truth (tiers, chains, prices) — `projects/allowanceguard/BUSINESS.md`
- Technical truth (APIs, chains, envs) — `projects/allowanceguard/ARCHITECTURE.md`
- Visual canon — `projects/allowanceguard/DESIGN.md`
- Review gates — `memory/PROCESS.md` (Standing Council + sub-councils)

## Autonomy level

- **Level 2 (Assisted).** Skills draft, research, plan, analyse. The user approves anything that publishes, sends, or edits `src/`.
- **Never Level 4.** No auto-publish, no auto-email, no auto-deploy. Deny list in `.claude/settings.json` enforces.

## Load order (for skills)

1. This file.
2. The skill-specific files named in its `## Memory` block.
3. Canonical sources on demand when a fact needs verifying.

Do not read every file every time. Conserve tokens.
