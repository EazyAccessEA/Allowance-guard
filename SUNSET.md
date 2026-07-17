# AllowanceGuard — Sunset Runbook

AllowanceGuard is being retired. The blog is preserved as a free static archive on
Cloudflare Pages; everything else (scanner, REST API, browser extension backend,
crons, database) is wound down. **Base burn eliminated: ~$60–135/mo** (up to ~$300+/mo
if a paid RPC plan and/or paid Sentry are in play). **Surviving cost: ~$1/mo** (domain)
plus Cloudflare Pages and GitHub, both free.

> **Do not improvise the order.** The sequence below exists to prevent irreversible
> data loss and consumer-law breach. Three hard gates:
> 1. Don't delete the Neon database until a **final, post-refund** dump is verified restorable **and** the records-retention window has closed.
> 2. Don't kill Vercel until the **www** DNS cutover is verified **and** the extension is delisted.
> 3. Never lapse the **domain**, **Cloudflare Pages**, or the **GitHub repo** — the surviving blog depends on all three.

---

## What's in this branch

- **`scripts/build-static-blog.ts`** — renders the 36-post blog into `out-static/` as
  dependency-free HTML (a sunset landing page, `/blog` archive, every `/blog/<slug>/`
  at its original URL, `styles.css`, `sitemap.xml`, `robots.txt`, `_redirects`,
  `_headers`, `404.html`). Run: `node --experimental-strip-types scripts/build-static-blog.ts`
- **`out-static/`** — the built site, ready to deploy.
- **`production.env.example`** — the leaked Slack webhook + `OPS_DASH_TOKEN` have been
  scrubbed to placeholders. **The real values are still in git history — rotate them (see §5).**

The archive is fully self-contained: local images + one stylesheet, **zero** analytics,
error-reporting, wallet, or Stripe scripts, and no calls to any dead endpoint. Its only
external links are editorial (revoke.cash, etherscan, etc.).

---

## 1. Services — action, cost, and what breaks

Ordered by the safe teardown sequence in §4. "CHECK" = verify a detail in the live
dashboard before acting.

| Service | Action | ~$/mo | Notes / what breaks |
|---|---|---|---|
| **Neon** (Postgres) | **CHECK → delete LAST** | $0–25 | All PII + financial data. Blog needs nothing from it. Delete only after the **final post-refund** dump is verified and retention closes. |
| **Stripe** | **Cancel subs, keep account open** | $0 base (+2.9%+30¢) | Recurring subs **and** one-off donations **and** annual prepaid plans (Pro $79/yr, Sentinel $499/yr, API Growth $1,490/yr). Cancel each sub + prorate refunds first. Keep account open through the ~120-day chargeback window. **Two** webhook endpoints + secrets (see §4.4). |
| **Coinbase Commerce** | **Cancel, keep account open** | $0 base (~1%) | Charges are one-time (nothing auto-recurs). Settle in-flight charges + manually refund unused crypto-paid periods to the payer address; record txns **before** the DB is deleted. |
| **Resend** | **CHECK → cancel** | paid tiers exist | ⚠️ `src/lib/mailer.ts` tries `RESEND_API_KEY` **first**, before Postmark/SMTP — so shutdown/refund emails likely send via Resend, not Postmark. Verify which key is live, send notices through it, then revoke. |
| **Browser extension** (Chrome + Firefox) | **Kill-build → delist** | $0 (Chrome $5 sunk) | See §2 — delisting does **not** uninstall live copies. |
| **Vercel** (hosting + 6 crons) | **Cancel** | $20–60 | Kills scanner, all APIs, extension backend, crons. Remove crons first. Read env for a paid RPC key before it's gone. |
| **cron-job.org** | **Cancel** | — | ⚠️ **Second** external scheduler (`docs/ops-monitoring.md`): health checks every 10 min + daily digest. Survives Vercel; will hammer dead endpoints and email failures forever. |
| **Upstash Redis** | **Cancel** | $0–10 | Rate-limit/cache only (falls back to Postgres). Flush (may hold cached PII), revoke token, delete DB after Vercel is down. |
| **Postmark** | **Cancel after notices** | ~$15 | Keep live long enough to send shutdown/refund notices, then disable/downgrade. Export sending logs. |
| **Microsoft 365** mailboxes | **CHECK → keep 1, then cancel** | $6–15/box | `smtp.office365.com` secondary mail path + human inboxes (support@/legal@). Keep one inbox through the refund window. Preserve inbound MX during the DNS move (§3). |
| **Cloudflare Turnstile** | **Cancel** | $0 | ⚠️ Missed by first pass. Bot protection on the subscribe form (`src/lib/turnstile.ts`). Blog doesn't use it; delete project + secret. |
| **Paid RPC** (Alchemy/Infura/QuickNode) | **CHECK** | $0 or $49–200 | Biggest cost unknown. `src/lib/networks.ts` defaults to **free** public endpoints; a paid key exists only if `ETHEREUM/ARBITRUM/BASE_RPC_URLS` override them in the Vercel env. Check before assuming $0. |
| **Sentry** | **CHECK → delete** | $0 (or ~$26) | Confirm free tier. Disable ingestion/alerts, delete project, revoke `SENTRY_AUTH_TOKEN`, scrub `.sentryclirc`. |
| **Rollbar** | **Cancel** | $0 | Second error path. Disable ingestion, delete project, revoke token. |
| **Reown / WalletConnect** | **Cancel** | $0 | Client-side project id. Delete the project. |
| **Google Analytics** | **Cancel** | $0 | Export history, delete property. Blog ships no GA tag. |
| **Slack webhook** | **Revoke NOW** | $0 | Live secret leaked into the public repo (see §5). Revoke immediately. |
| **npm SDKs** (`@allowance-guard/client`, `/react`) | **CHECK → deprecate** | $0 | If published, `npm deprecate` with a sunset message; email `ag_pub_*` / `api_*` key holders. Consuming dApps break silently otherwise. |
| **Coolify / possible VPS** | **CHECK** | $0–40 | No infra in the repo — only an operator bookmark. Verify no orphan box is billing / burning RPC quota; if found, back up + terminate. |
| **Cloudflare Pages** (blog host) | **KEEP** | $0 | The survivor. Bind to **www** (§3). |
| **Domain** allowanceguard.com | **KEEP long-term (2–3 yr+)** | ~$1 | Registrar lock + auto-renew. If it lapses, an attacker can re-register it and serve malicious "risk" responses to still-installed extensions, and spoof support@ email. Do not let it drop. |
| **GitHub repo** (AGPL) | **KEEP → archive read-only** | $0 | Scrub secrets + add sunset notes + fix Releases/SECURITY.md **before** archiving (§4.11). |

---

## 2. Stop using immediately

- **The extension fails *open*.** The published v2.0.4 calls `www.allowanceguard.com/api/risk/assess`
  at `document_start` on every page. Once the API dies it silently stops warning on
  `approve()` / `permit()` / `setApprovalForAll()` while users still see it installed and
  believe they're protected. Delisting alone does **not** uninstall existing copies.
  **Ship one final self-terminating build to both stores** (hard-disable scanning; show
  an on-page + popup "AllowanceGuard is discontinued — this extension no longer protects
  you, please uninstall" banner that needs no network call), **then** delist from the
  Chrome Web Store and Firefox AMO (gecko id `allowanceguard@allowanceguard.com`).
- **Outbound webhooks** — Sentinel customers registered their own URLs that AG POSTs
  events to. They stop firing with no signal. Notify those customers, then disable the dispatcher.
- **Revoke the leaked Slack webhook + `OPS_DASH_TOKEN` now** — they are real and public (§5).

---

## 3. Deploy the blog + cut over DNS (do this before killing Vercel)

1. **Create a Cloudflare Pages project** from `out-static/` (framework preset: none;
   build output directory: `out-static`). Or drag-and-drop the folder for a direct upload.
2. **Bind the custom domain to `www.allowanceguard.com`** — every canonical URL, the
   sitemap, robots, and JSON-LD use **www**. If Pages binds only the apex, every
   Google-indexed URL 404s. Add a `301 apex → www` (or CNAME apex to www) at the DNS level.
3. **Recreate email DNS on Cloudflare *before* switching nameservers.** A wholesale NS
   move drops `MX` / `TXT(SPF)` / `DKIM` / `DMARC` and breaks inbound `support@`, which
   you need during the refund window. Re-create those records first, remove the old
   Vercel `A`/`CNAME`, then switch.
4. **Verify** `/`, `/blog/`, every `/blog/<slug>/`, `/sitemap.xml`, `/robots.txt`, and a
   sample of the `_redirects` rules (`/dashboard`, `/pricing`, `/privacy`, `/api/x`) all
   resolve on Pages. Confirm the one Google-indexed URL,
   `/blog/what-are-token-allowances/`, renders. **Only then** proceed to Vercel teardown.
5. **After wind-down**, set a strict `DMARC reject` policy (and consider a null `MX`) so
   the retired security brand can't be used to spoof email.

Optional: to degrade the extension gracefully instead of redirecting, replace the
`/api/*` line in `_redirects` with a rewrite to a static JSON
(`/api/risk/assess  /api-discontinued.json  200`) and ship that file — only worth it if
you can match the shape the old extension expects.

---

## 4. Ordered teardown

**First, the duties in §3-below must be done while the systems are still live:**

- **Export (before anything is deleted):** full `pg_dump` of Neon → **verify it restores**;
  export Stripe (customers, subscriptions, invoices) and Coinbase charge history.
- **User self-export window (GDPR portability):** keep `/api/user/export` +
  `/api/compliance/export` reachable until a stated deadline — they die with the API.
  Announce the deadline in the notice.
- **Notice (30+ days advance)** to **four** audiences, via whichever email provider is
  actually live (**verify Resend first**): (1) paying subscribers — refund + deadline;
  (2) free users relying on monitoring/alerts — alerts stop silently; (3) extension users
  — uninstall; (4) SDK / API-key integrators. Include shutdown date, that monitoring
  stops, the data self-export deadline, a data deletion/retention statement, and refund
  terms. Also publish it as a blog post that survives on the static site.
- **Refunds (while Stripe + Coinbase + Neon are all live):** cancel every active Stripe
  subscription; issue **pro-rata refunds sized for annual prepay** (a customer 11 months
  into a year is owed most of it). Settle Coinbase and refund unused crypto periods to the
  payer address. Record every refund. The refund tooling reads customer/subscription IDs
  from Neon, so this must precede DB deletion.

**Then tear down in order:**

1. Ship the extension kill-build → delist Chrome + Firefox.
2. Deploy `out-static/` to Cloudflare Pages, recreate email DNS, repoint **www**, verify (§3).
3. Remove the 6 Vercel crons → **delete the cron-job.org jobs** → check the Vercel env for a paid RPC key → decommission Vercel.
4. **Webhooks — inbound:** delete **both** Stripe endpoints (`/api/stripe/webhook` + `/api/billing/webhook`) and roll **both** secrets (`STRIPE_WEBHOOK_SECRET` + `STRIPE_BILLING_WEBHOOK_SECRET`); delete the Coinbase endpoint + roll its secret. **Outbound:** notify Sentinel webhook customers, then disable the dispatcher.
5. Delete the Upstash Redis database (flush cached PII, revoke token).
6. Wind down email: disable Postmark/Resend/SES tokens after notices are sent; keep one M365 inbox through the refund window, then cancel.
7. **Take the final, post-refund Neon dump → verify restorable → then delete Neon.** Treat all `api_*` / `ag_pub_*` keys as revoked; make sure no residual endpoint validates them. Retain only the **financial** records (invoices/donations) long-term (UK/HMRC ~6 yr); hold the full-PII dump short-term under access control, then purge non-financial PII (GDPR minimisation).
8. Free-tier + secrets tidy-up: revoke the Slack webhook; delete Sentry (+ scrub `.sentryclirc`) and Rollbar; delete the GA property; delete the Reown/WalletConnect **and Turnstile** projects; cancel/rotate any paid RPC key; take down the ops dashboard and any UptimeRobot/BetterUptime/status-page monitors.
9. **Rotate the full secret set** (§5).
10. npm SDKs: `npm deprecate` both packages with a sunset message; email key holders; add a sunset banner to both READMEs.
11. GitHub repo: add sunset notes to `README.md` + `extension/README.md`; the extension `.zip`s are committed and GitHub Releases stay installable, so add a "discontinued — do not install" note to each Release (or remove them); update `SECURITY.md` (its disclosure contact will be unmonitored) → **then archive read-only**.
12. Delist from external directories (Product Hunt, DeFi Llama, chain ecosystem portals, awesome-* lists, the WalletConnect explorer) — prioritise security-tool directories where a dead-but-listed scanner actively misleads.
13. Verify the Coolify/VPS question; terminate any orphan box.

---

## 5. Secret rotation (do before archiving the public repo)

The repo will be archived **public**. Treat every secret that ever lived in the repo or
the Vercel env as **burned** and rotate/revoke it — scrubbing the working tree does not
remove it from git history. At minimum:

- `SLACK_WEBHOOK_URL` and `OPS_DASH_TOKEN` (confirmed real, leaked in `production.env.example`)
- `SENTRY_AUTH_TOKEN`, `ROLLBAR_ACCESS_TOKEN`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_BILLING_WEBHOOK_SECRET`
- `COINBASE_COMMERCE_API_KEY`, `COINBASE_COMMERCE_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `POSTMARK_SERVER_TOKEN`, the office365 `SMTP_PASS`
- `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `OTP_SECRET`, `MAINTENANCE_BYPASS_SECRET`, `ALLOWANCE_GUARD_API_KEY`, `BETTER_AUTH_SECRET`, `NEXTAUTH_SECRET`
- any paid RPC provider key

Run a full history secret scan (e.g. gitleaks or GitHub secret scanning) before archiving.

---

*Generated as part of the project-discontinuation branch. The static archive is verified
rendering; the teardown steps above require operator action in each vendor's dashboard.*
