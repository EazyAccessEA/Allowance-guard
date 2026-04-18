# Imported skills — attribution notice

Sixteen marketing skills under `.claude/skills/` were imported verbatim from an external open-source repository on 2026-04-18. They are distinguishable from AllowanceGuard-authored skills by the absence of any `projects/allowanceguard/` references in their SKILL.md bodies.

## Source

- **Upstream repository:** [github.com/coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- **Upstream SHA at import:** `9125d8216e38945bcca5e712287cec06e9e96523`
- **Upstream license:** MIT (see [LICENSE](https://github.com/coreyhaines31/marketingskills/blob/main/LICENSE))
- **Imported by:** operator, 2026-04-18

## Imported skills

| Skill | Why kept |
|-------|----------|
| `product-marketing-context` | Foundation the other 15 reference. Structured product-positioning doc. |
| `programmatic-seo` | Directly applies to AG's 27-chain × N-token page matrix opportunity. |
| `paywall-upgrade-cro` | Directly applies to the OTP upgrade funnel shipped 2026-04-18. |
| `free-tool-strategy` | The free scanner is AG's wedge; this planning skill fits the model. |
| `signup-flow-cro` | Optimises the new OTP signup path. |
| `onboarding-cro` | AG had no dedicated post-signup activation skill before this. |
| `churn-prevention` | Gap before this import; needed once Pro users land. |
| `email-sequence` | Drip / lifecycle email gap before this import. |
| `community-marketing` | Wallet-security community building gap before this import. |
| `competitor-alternatives` | "vs Revoke.cash", "vs Rabby" page strategy. |
| `referral-program` | Post-Pro-user referral mechanics. |
| `marketing-psychology` | Persuasion principles the writer / conversion skills lean on. |
| `pricing-strategy` | For future Pro / Sentinel pricing revisits. |
| `schema-markup` | Technical-SEO gap before this import. |
| `ai-seo` | LLM-visibility + citations — emerging channel, not covered before. |
| `lead-magnets` | Dedicated acquisition skill, gap before this import. |

## Skills we deliberately did NOT import

From the upstream's 36 skills, 20 were skipped either as duplicates of existing AG skills or because they don't fit our current state:

Duplicates of existing AG skills: `ab-test-setup` (we have `experiment-design`), `analytics-tracking` (we have `analytics`), `cold-email` (we have `outreach`), `content-strategy`, `copy-editing` / `copywriting` (we have `writer`), `customer-research` (we have `market-research`), `form-cro` / `page-cro` / `popup-cro` (we have `conversion`), `launch-strategy` (we have `campaign-manager`), `seo-audit` (we have `seo`), `site-architecture` (we have `web-implementation`), `social-content` (we have `social`).

Out-of-scope: `ad-creative` + `paid-ads` (crypto-ad policy review needed first — revisit when paid is on the table), `aso-audit` (no mobile app), `marketing-ideas` (too vague), `revops` (solo operator), `sales-enablement` (no sales team).

## Maintenance rules

- **Do not specialise imported skills with AG-specific product truth.** They stay generic so future re-syncs from upstream are clean.
- **If an AG specialisation is needed for any of these areas, author an AG-prefixed wrapper skill that reads this one.** Don't edit the imported file.
- **Audit quarterly.** Re-sync from upstream on a cadence — if upstream has meaningful updates, pull them. If they've drifted in a direction we don't like, freeze.
- **No attribution block inside each imported SKILL.md.** An earlier import added an HTML comment at the top of each file which broke the YAML frontmatter and caused the skill loader to render the comment as the description. Keep SKILL.md files bit-for-bit upstream; put attribution here.

## License compliance

MIT permits copying + modification with attribution preserved. This file is the attribution. The AllowanceGuard repo is dual-licensed (AGPL-3.0 + commercial); the imported skills remain under MIT within this repo per MIT's permissive terms.
