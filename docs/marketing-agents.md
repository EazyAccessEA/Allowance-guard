# Marketing Agents — Runbook

Allowance Guard's marketing managed-agent system runs as a set of Claude Code skills under `.claude/skills/`. It is governed by the Standing Council and sub-councils in `memory/PROCESS.md`, backed by scoped memory in `memory/marketing/`, and fenced by deny rules in `.claude/settings.json`.

This runbook is for the operator. The skills know how to operate; this page tells you how to drive them.

## One principle

> "We educate, clarify, and guide. We do not exaggerate, promise absolute safety, or manipulate fear without evidence."

If an output conflicts with that, it goes back. Every time.

## The team

| Skill | Role | Invoked when you want… |
|-------|------|------------------------|
| `market-research` | Competitive + audience research | A briefing before you commit to an angle |
| `positioning` | Pick a message for a segment + moment | "How should we frame this?" |
| `content-strategy` | Weekly or monthly calendar | "What are we publishing this week?" |
| `writer` | Blog, docs, explainers, newsletter | Finished long-form prose |
| `seo` | Keyword + SERP briefs | A structured brief before writer writes |
| `social` | X, Farcaster, LinkedIn drafts | Platform-native posts |
| `outreach` | PECR/GDPR-safe cold outreach | One email per target, never blasts |
| `conversion` | Landing + CTA + experiment copy | "Make this surface convert" |
| `analytics` | Aggregated-only metrics briefs | Weekly / monthly read on what moved |
| `image-direction` | Line-art SVG + photoreal prompts | Imagery that matches Ledger canon |
| `campaign-manager` | Orchestrates all of the above | The weekly cycle as one run |
| `web-implementation` | Lands approved copy / SVG into `src/` | After you've approved a draft |

## The weekly cycle (one prompt)

Paste this into Claude Code from the repo root:

> Run the campaign-manager skill. Execute a weekly Allowance Guard marketing cycle for the topic "wallet approval risk." Start with market-research, then positioning, then content-strategy. Produce one article brief, three social posts, one homepage improvement recommendation, and one outreach angle. Update `memory/marketing/` with any durable decisions. Do not publish, send, or edit site files — produce drafts only.

Expected output: a `# Campaign Plan` file plus drafts under `context/` and appended decisions in `memory/marketing/`. Nothing under `src/` changes.

## Applying approved site changes

When you have a draft you want to ship:

> Run the web-implementation skill. Apply the approved copy in `context/drafts/<slug>.md` to `src/components/Hero.tsx` (and any other component named in the draft). Show me the diff before writing.

`web-implementation` is fenced: it only touches marketing surfaces and never touches payment, auth, DB, dashboard, or API code.

## Imagery

Two modes on the same skill.

### Line-art (default)

> Run the image-direction skill. Produce a three-icon SVG set for the "wallet hygiene" blog post. Match the `HowItWorks.tsx` stroke canon. Include alt text for each.

The skill emits JSX under `context/imagery/`. Hand the approved output to `web-implementation` to land it.

### Photoreal blog header

> Run the image-direction skill in prompt mode. Draft a photoreal Nano Banana 2 prompt for the header image of `<blog slug>`. Add it to the prompt library in `memory/marketing/imagery.md` with alt text and a suggested `public/blog/...` path.

Then run the existing `scripts/generate-blog-images.py` yourself to render.

## Autonomy ladder

- **Today — Level 2 (Assisted).** Skills draft, research, plan, analyse. You approve everything that publishes, sends, or touches `src/`.
- **After 4–6 stable cycles — Level 3 (Semi-autonomous).** `campaign-manager` runs the weekly cycle on a schedule. You still approve anything that publishes, sends, or edits `src/`.
- **Never Level 4.** No auto-publish. No auto-email. No auto-deploy. The deny list in `.claude/settings.json` enforces this at the harness.

## Approval flow

```
draft (context/) ──▶ user review ──▶ approved (context/…-approved.md)
                                    │
                                    ▼
                  user ships post / sends email / runs web-implementation
```

For copy: the user marks the file with an `-approved` suffix.
For social: the user copy-pastes into the platform.
For outreach: the user sends from their own inbox.
For site: `web-implementation` lands the approved file.

## What sits under `memory/marketing/`

- `MEMORY.md` — index + five standing rules.
- `brand.md` — voice, banned phrases, preferred phrasing, proof standards.
- `audiences.md` — four segments with pains / objections / outcomes.
- `positioning-history.md` — append-only decision log.
- `content-history.md` — append-only publication log.
- `seo.md` — seven priority clusters + fact guardrails.
- `outreach.md` — target categories + append-only outreach log.
- `experiments.md` — append-only hypothesis / result log.
- `metrics.md` — one primary metric per surface.
- `imagery.md` — line-art canon + photoreal canon + prompt library.

Skills read what they need. No skill reads everything.

## Governance — the Standing Council

The "managed" in managed-agent. Full list in `memory/PROCESS.md`. Hard gates that apply across marketing:

- **#8 Accessibility (VETO)** — alt text, contrast, heading hierarchy.
- **#11 Investor / founder voice (gatekeeper)** — banned-phrase enforcement.
- **#24 Data protection lawyer (VETO)** — privacy / consent / data handling.
- **Copy Council (#20 + #21 + #22)** — three lenses on every sentence: voice, accuracy, conversion.
- **Legal Council (#9 + #23 + #24)** — every claim about security, compliance, or data handling.
- **Design Council (Maren / Noor / Thane)** — homepage canon, AA contrast, bundle budget.
- **Image Council (#25 / #26 / #28 / #29)** — imagery direction; #29 effective veto on set cohesion.

The `campaign-manager` runs these gates at Step 9 before any deliverable is emitted.

## Boundaries (non-negotiable)

- No auto-publishing anywhere.
- No skill except `web-implementation` edits `src/`.
- `web-implementation` never touches payment, auth, DB, dashboard, or API code.
- No live-API analytics calls. `analytics` reads local exports only.
- No Runware calls from skills. `image-direction` emits prompts; you run the script.
- No pretend-personal outreach. Every email identifies the sender and the purpose.

## When to build the deferred departments (Admin, Growth, Data, Compliance, Product/Eng)

See the "Trigger conditions" table in the plan at `/root/.claude/plans/proud-singing-candy.md`. Short version: build when volume or evidence justifies it, not before. The Standing Council covers the governance function until then.

## Troubleshooting

- **Skill wasn't picked up.** Check `allowed-tools` in the skill's frontmatter. Confirm the skill directory is under `.claude/skills/` and the file is named `SKILL.md`.
- **Hook didn't fire.** Check it's executable: `ls -l .claude/hooks/session-start.sh`. Check `.claude/settings.json` points at `$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh`.
- **Skill tried to do something blocked by the deny list.** That's the system working. Rewrite the ask so it stays on the marketing side of the fence.
- **Draft contained a banned phrase.** Step 9 should have caught it. If it shipped anyway, log the miss in `memory/CORRECTIONS.md` and tighten the skill's review gate.
