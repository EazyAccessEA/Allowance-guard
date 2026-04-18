# platform-rules.md

External platform policy constraints. These rules are not ours; they belong to the platforms we depend on. They change without notice, so every pre-ship check re-verifies against the current policy.

`policy-alignment` is the skill that uses this file. Other skills consult it.

## Platforms in scope

| Platform | Why we care | Policy risk |
|----------|-------------|-------------|
| **Google Ads** | Any paid acquisition via Google (Search, Display, YouTube) | Crypto / financial services restrictions; cryptocurrency wallet ads require certification |
| **Meta Ads** (Facebook / Instagram) | Any paid acquisition via Meta | Cryptocurrency ad policy; evolving allowlist of approved advertisers |
| **Stripe** | Our primary subscription payments | Restricted Businesses list; cryptocurrency-related services have conditions |
| **Coinbase Commerce / Business** | Crypto checkout | Terms of service; supported currencies; settlement mechanics |
| **Cloudflare** | CDN, Turnstile, DNS | AUP — certain content prohibited; rate-limit enforcement interaction |
| **Vercel** | Hosting | ToS + AUP — compute quotas; acceptable content |
| **Neon** | Database | Data residency; backup retention |
| **GitHub** | Code hosting + CI | Community guidelines; export control |
| **Apple / Google Play** | Future mobile | (Currently N/A — note if we go mobile) |
| **Firefox Add-ons (AMO)** | Distribution of the browser extension | Acceptable Use policy — "Deceptive or misleading" applied proactively by Mozilla's review team against crypto-adjacent extensions |
| **Chrome Web Store** | Distribution of the browser extension | Developer Program Policies — deceptive behaviour, misleading functionality; same triggers as AMO typically apply |

## Known constraint patterns

### Google Ads — cryptocurrency

- Cryptocurrency exchanges, wallets, trading services: **require certification** in most jurisdictions.
- Allowance Guard: not an exchange, not a wallet custodian, not a trading service. We are a **security tool for wallet approvals**. But the copy, the landing page, and the broader product category can trigger pre-approval review.
- Pre-launch action: review the landing page under Google's current crypto ads policy. Flag any copy that reads as "crypto services" instead of "security tooling".
- Authoritative source: <https://support.google.com/adspolicy/answer/9662160> (verify current URL before each campaign).

### Meta Ads — cryptocurrency

- Meta operates an advertiser allowlist for cryptocurrency products.
- Non-allowlist advertisers can still run ads about blockchain-adjacent educational content, but the line is strict.
- Pre-launch action: decide whether we go via allowlist (requires KYC on the company) or run only education-classified content.
- Authoritative source: <https://transparency.meta.com/policies/ad-standards/restricted-content/cryptocurrency> (verify current URL).

### Stripe — restricted businesses

- Stripe's Restricted Businesses list includes "cryptocurrency-related services" with conditions.
- Allowance Guard is on the supported side: we are not a custodial wallet, not an exchange, not a cryptocurrency merchant. We sell a subscription to a security tool.
- Pre-launch action (already done): confirmed Stripe account approved for our business model. If the model ever shifts toward custodial / trading / money-transmission, re-verify.
- Authoritative source: <https://stripe.com/restricted-businesses> (verify current URL).

### Cloudflare Turnstile

- Turnstile is integrated on subscribe / contact forms and certain docs flows (`src/components/TurnstileWidget.tsx`, `src/lib/turnstile.ts`).
- Policy: Turnstile requires reasonable efforts not to present challenges in a way that creates accessibility barriers.
- Pre-launch action: confirm keyboard + screen-reader path through Turnstile challenge. Noor's accessibility review applies.

### App stores (future)

- Not currently in scope. If AG goes mobile, review:
    - Apple: cryptocurrency app policy, in-app purchase rules, "financial services" categorisation.
    - Google Play: similar plus geo-restriction handling.
- Record the review outcome in this file before any mobile launch.

### Firefox Add-ons (AMO) — Acceptable Use: Deceptive or misleading

Mozilla's review team actively audits crypto-adjacent extensions on their own initiative, not only in response to user reports. They permanently disable on a single finding of "deceptive or misleading" content. Reinstatement is via a 6-month appeal window; there is no informal reviewer dialogue.

**Triggers we confirmed on 2026-04-18 when AllowanceGuard was disabled** (reference: `context/compliance/2026-04-18-mozilla-amo-appeal.md`):

1. **Absolute "protection" framing on a non-blocking tool.** The manifest `name` was "AllowanceGuard — Wallet Protection" and the description said "protects your crypto wallet" / "alerts you before you sign anything risky." Mozilla reads *protect* as prevention. An advisory tool that only warns must never use *protect / protection / secure / defend* as first-line framing. Honest replacements: *warn, alert, screen, flag, surface*.

2. **Reassurance UI on every transaction.** The overlay rendered green checkmarks next to *"Exploit DB Match: No match"* and *"Similar Scam Patterns: None detected"* for every approval. Mozilla treats a cleared-safe-looking row as a verification claim, even when the code was checking a small curated list. **Rule: absence of a positive finding must be rendered as absence of a row, not a cleared-safe stamp.** Only surface findings, never reassurance.

3. **Differentiated paid-tier detection claims without the code to back them.** The free → Pro step promised *"Enhanced Analysis: exploit database, contract audit status, scam pattern detection"* in the warning overlay. The backend's detection is identical for every tier; paid differs on dashboard features (email alerts, batch, exports), not on-page detection. **Rule: never advertise tier-differentiated risk analysis unless the code computes meaningfully different output for paid users.**

4. **Revenue CTA on a safety surface.** An *"Upgrade to Pro"* card inside the warning overlay. **Rule: do not render upgrade prompts on any screen whose primary purpose is a safety alert.** Upsells belong on the pricing page.

5. **Manifest `data_collection_permissions` mismatch with description.** The manifest declared `financialAndPaymentInfo` as required collected data; the description said we collect "no personal data." Reviewers diff these two. **Rule: the manifest permission list is a truth source for the listing copy. If the description says "we don't collect X" and the manifest declares X, the listing is deceptive by definition.**

6. **Dead support / website URLs on the listing.** Listing showed `support@allowancegurad.com` / `www.allowancegurad.com` (typos: missing the `a`). A reviewer who Googles the listed domain and finds nothing treats the listing as fraudulent on its face. **Rule: every URL and email on a store listing is a live audit target. Verify before submission.**

**What the reinstatement path looks like:**

- AMO's appeal URL is issued per-incident in Mozilla's decision email.
- The appeal form accepts a written statement; it does not let you upload a new version while the listing is disabled.
- Evidence that actually moves Mozilla: public commit SHA on an open-source repo showing specific fixes, paired with the proposed new listing copy inline in the appeal letter.
- Typical turnaround: 5–10 business days on first-round appeal. A second tier ("Independent Review" by a third-party neutral arbiter) is available if the first response is negative.

**Fallback if reinstatement fails:** signed unlisted XPI distribution from `allowanceguard.com`. Not auto-updating, louder install prompt, but possible. Treat as Plan C.

### Chrome Web Store

Chrome hasn't actioned AllowanceGuard at the time of writing, but their Developer Program Policies overlap AMO's on the same axes (deceptive functionality, overclaimed security, misleading screenshots). Treat Chrome as a parallel risk: every listing fix for AMO ships to Chrome at the same time to prevent the second disable.

**Chrome-specific constraints we hit on 2026-04-18:**

- Manifest `description` field: **132-character hard limit** (AMO allows longer). The upload dialog rejects over-long descriptions with "The description field in manifest is too long." Plan around this.
- Manifest `name` field drives the Chrome store title on upload; you can override in the listing UI but changing `name` is the cleanest channel.

## How this file is maintained

- **Update on: **
    - A platform changes its policy (we find out via news, platform email, account warning).
    - An AG campaign is blocked or rejected.
    - A new platform enters our dependency graph.
- **Do not update on:**
    - Speculation about future policy.
    - Internet rumours.
    - "I think they changed the rule" without a link.

Every update cites a link + a date. Old policy versions are retained; do not overwrite them — append a new note.

## When a platform's policy blocks us

1. `policy-alignment` identifies the block.
2. Produce a finding: which surface, which rule, what changed.
3. Route to the owning skill:
    - Marketing copy → `writer` + `conversion`.
    - Legal pages → `legal-page-draft`.
    - Engineering behaviour (e.g., data residency change) → `build-feature`.
    - Payment provider change → `implement-checkout-flow`.
4. Track in an issue; note the resolution date.
5. Update this file with the lesson.

## Policy-driven copy patterns

Some platform rules are best satisfied at the copy layer. Examples:

- **Google Ads crypto gate:** lead with "security tool" not "crypto tool". Describe the value as reducing approval risk, not as managing crypto.
- **Meta restricted content:** educational framing > promotional framing for cryptocurrency-adjacent creatives.
- **Stripe AML cues:** never describe AG as "helping users avoid KYC" or "protecting privacy from regulators" (catastrophic misread).
- **General banking / finance tone:** avoid "your money", "your assets", "your funds" as first-person direct address. Use "your wallet", "your approvals", "your token permissions".

These patterns are not banned phrases from `memory/VOICE.md` — they are platform-specific patterns to apply on top. Marketing skills consult this file when drafting surfaces that could trigger ad review.
