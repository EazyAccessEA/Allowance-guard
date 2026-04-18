# data-sources.md — Registered data sources

Every source a data-intelligence skill may reference, with access pattern, retention, and lawful basis. Skills are read-only against local exports under `context/`. **No skill calls a live API or hits Postgres directly.**

Format:

```
### <source name>
- Owner (operational): <person / role>
- Owner (council): <#>
- Access pattern from this dept: read-only via local export under `context/<path>`
- Export cadence: <how often the operator drops a fresh export>
- Retention (in source): <how long the source retains the underlying data>
- Retention (in `context/`): <≤30 days unless otherwise pinned>
- Lawful basis: <legitimate interest | consent | contract | legal obligation>
- PII present in raw export: <yes / no — fields enumerated>
- Aggregation required before analysis: <yes / no — minimum bucket size>
- Privacy Policy reference: <section / line>
```

---

## Vercel Analytics
- Owner (operational): operator
- Owner (council): #35 + #19
- Access pattern: CSV export from Vercel dashboard → `context/data-intelligence/vercel/<YYYY-MM-DD>-<window>.csv`
- Export cadence: weekly (Mondays)
- Retention (in source): per Vercel terms
- Retention (in `context/`): 30 days; rolled to aggregated weekly summary in `metric-catalog.md` numbers
- Lawful basis: legitimate interest (analytics with no cross-site tracking, consistent with cookie consent)
- PII present in raw export: no (Vercel Analytics is cookie-less by configuration; verify on each export)
- Aggregation required: not strictly required at row level (no PII), but reports always summarise by route + week
- Privacy Policy reference: cookie + analytics section

## Stripe export
- Owner (operational): operator
- Owner (council): #35 + #30 + #11
- Access pattern: Stripe dashboard CSV export → `context/data-intelligence/stripe/<YYYY-MM-DD>.csv`
- Export cadence: weekly (Mondays); month-end canonical for MRR
- Retention (in source): per Stripe terms; we mirror only what we need
- Retention (in `context/`): 30 days
- Lawful basis: contract (the user signed up for a paid plan)
- PII present in raw export: yes (customer email, customer ID, billing country)
- Aggregation required: **YES** before analysis. Drop email + customer ID columns at import. Use customer ID only as a hashed cohort key.
- Privacy Policy reference: payments + billing section

## Postgres (production scan + indexer data)
- Owner (operational): operator (no direct read by data-intelligence skills)
- Owner (council): #18 + #35
- Access pattern: **engineering generates aggregated exports**; data-intelligence does not connect.
  - Scan logs: aggregated weekly export → `context/data-intelligence/scans/<YYYY-MM-DD>-weekly.csv` with bucket counts only
  - Wallet-address-level data NEVER leaves Postgres for this dept
- Export cadence: weekly
- Retention (in source): per `memory/product-engineering/security-posture.md`
- Retention (in `context/`): 30 days
- Lawful basis: legitimate interest (operating the service); aggregation is the hard requirement
- PII present in raw export to `context/`: **no — engineering pre-aggregates**
- Aggregation required: enforced at export by engineering; bucket size ≥ 100
- Privacy Policy reference: scan + service operation section

## API access log
- Owner (operational): operator
- Owner (council): #6 + #35 + #19
- Access pattern: aggregated weekly export → `context/data-intelligence/api/<YYYY-MM-DD>.csv`
- Export cadence: weekly
- Retention (in source): per service operations
- Retention (in `context/`): 30 days
- Lawful basis: contract (API customers under terms) + legitimate interest (capacity planning)
- PII present in raw export: no — aggregated by tier + endpoint, never by API key string
- Aggregation required: yes (tier × endpoint × day buckets; bucket size ≥ 5)
- Privacy Policy reference: API customer section

## GitHub (open-source program metrics)
- Owner (operational): operator + #2
- Owner (council): #2 + #35
- Access pattern: GitHub API → operator-generated weekly export → `context/data-intelligence/github/<YYYY-MM-DD>.json`
- Export cadence: weekly
- Retention (in source): public; no separate retention
- Retention (in `context/`): 30 days
- Lawful basis: public information
- PII present: yes (GitHub usernames)
- Aggregation required: usernames retained at handle level (public) but never joined to behavioural data outside GitHub
- Notes: handles are public; `claim-review` gate applies if any handle is named in a public brief

## Support inbox / ops queue
- Owner (operational): operator + #36
- Owner (council): #36 + #19 + #35
- Access pattern: aggregated weekly export of categorised tickets → `context/data-intelligence/support/<YYYY-MM-DD>.csv`
- Export cadence: weekly
- Retention (in source): per support tooling + privacy policy
- Retention (in `context/`): 30 days; aggregated trends (count by category) may be pinned longer
- Lawful basis: legitimate interest (improving the service); user content stays in support tool
- PII present in raw export: **NO — categories + counts only.** No quotes from user messages, no email addresses.
- Aggregation required: yes; bucket = category × week
- Privacy Policy reference: support + contact section

## Incident log
- Owner (operational): operator + #10
- Owner (council): #10 + #35
- Access pattern: read `memory/product-engineering/incident-history.md`
- Export cadence: live (file is canonical)
- Retention: append-only; never deleted
- Lawful basis: internal records; no PII
- PII present: no (incidents are described without exposing user data)

## Grants + partnerships logs
- Owner (operational): operator + #12
- Owner (council): #12 + #35
- Access pattern: read `memory/growth/grants-history.md` + `memory/growth/partnerships-history.md`
- Export cadence: live
- Lawful basis: internal records; B2B contact information governed by separate B2B outreach lawful-basis chain
- PII present: B2B contact names + emails — **never quoted in a public brief**

## Structured application logs (OTP + Stripe funnel events)

- Owner (operational): operator
- Owner (council): #35 + #30 + #34
- Access pattern: operator pulls from Vercel log drain / Rollbar / any future log aggregator into `context/data-intelligence/logs/<YYYY-MM-DD>-<surface>.ndjson`, filtered to the event names below, dropping request IDs and IP addresses before drop-off.
- Export cadence: weekly (for the Monday brief); on-demand during incidents.
- Retention (in source): Rollbar / Vercel per their terms (typically 30-90 days)
- Retention (in `context/`): 14 days; aggregates only after that.
- Lawful basis: legitimate interest for service monitoring + quality.
- PII present in raw: email addresses appear in `otp.request.fake_email` (dev only) and as Stripe customer email. **Strip before export.**
- Aggregation required before analysis: yes, counts only. Never join an email to any downstream metric.

Registered events:

| Event name | Source route | Feeds metric |
|---|---|---|
| `otp.request.ok` | `src/app/api/auth/otp-request/route.ts` (apiLogger.info) | `otp_verification_rate` denominator |
| `otp.verify.ok` | `src/app/api/auth/otp-verify/route.ts` | `otp_verification_rate` numerator + `post_otp_checkout_reach` denominator |
| `otp.verify.failed` | same | abuse / deliverability signal |
| `stripe.checkout.created` | `src/app/api/billing/create-subscription/route.ts` | `post_otp_checkout_reach` numerator + `upgrade_flow_completion_rate` numerator |
| `upgrade_clicked` | client-side, `src/hooks/useUpgradeFlow.ts` → Vercel Analytics | `upgrade_flow_completion_rate` denominator |
| `siwe.verify.ok` | `src/app/api/auth/siwe/route.ts` | residual wallet-first sign-ins (secondary funnel) |

## Upstash Redis dashboard

- Owner (operational): operator
- Owner (council): #35 + #10
- Access pattern: operator screenshots the Upstash console's Commands / Bandwidth / Storage counters into `context/data-intelligence/upstash/<YYYY-MM-DD>.png` or pastes the numbers into `context/data-intelligence/upstash/<YYYY-MM-DD>.md`.
- Export cadence: weekly; on-demand during capacity incidents.
- Retention (in `context/`): 30 days.
- Lawful basis: internal operational; no user data.
- PII present: none (aggregate command counts only).
- Feeds metric: `upstash_commands_mtd` in `metric-catalog.md`. Added after the 2026-04-18 quota-exhaustion incident so future capacity pressure is visible before it 429s every paying user.

## Chrome Web Store + Firefox AMO dashboards

- Owner (operational): operator
- Owner (council): #35 + #5 + #9 (legal for any policy-status field)
- Access pattern: operator pulls weekly installs / uninstalls / active users / rating from each developer console into `context/data-intelligence/extension/<YYYY-MM-DD>-{chrome,firefox}.md`.
- Export cadence: weekly.
- Retention (in source): each store retains per their TOS.
- Retention (in `context/`): 90 days; aggregate to monthly after.
- Lawful basis: platform publisher data; no per-user identifiers surfaced.
- PII present: no (installs / ratings aggregated by store).
- Feeds metrics: `extension_install_active_rate`, and the platform-compliance health signals on the listing status (Active / Disabled / In appeal). Added 2026-04-18 — Firefox listing was disabled same day and status now needs weekly monitoring through the 6-month appeal window.

---

## Banned sources

- Live Postgres connection from a data-intelligence skill.
- Live Stripe API call from a data-intelligence skill.
- Any third-party tracking pixel data.
- Any source whose data was collected outside the live Privacy Policy's scope.
- Any source that requires de-anonymising a wallet address to be useful.

## Onboarding a new source

1. Operator + #35 propose the source.
2. #19 + #24 review for lawful-basis fit + Privacy Policy alignment.
3. If approved, register here with the full template.
4. Engineering builds the export pipeline if needed.
5. First export is treated as a dry-run; aggregation correctness verified before brief writing.
