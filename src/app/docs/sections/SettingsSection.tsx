/**
 * Settings section (sidebar label: "API & Settings").
 *
 * Covers the dashboard-side configuration surfaces. The API endpoints that
 * used to live here are redundant with ArchitectureSection and the full
 * /docs/api-reference page — so this section links out instead of
 * duplicating content.
 *
 * Council:
 *  Kael: No cards. Grid of unframed feature blocks.
 *  #22 Conversion: Each block has a single follow-on link, not a button.
 *  Noor: amber-deep links on paper are AA.
 */

import Link from 'next/link'

export default function SettingsSection() {
  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h2 id="settings-configuration" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
          Settings.
        </h2>
        <p className="font-plex text-lg text-ink-muted leading-[1.6]">
          The controls that actually matter for monitoring. For programmatic equivalents, see the{' '}
          <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2">API reference</Link>.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="email-alerts" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Email alerts.
        </h3>
        <p className="font-plex text-base text-ink-muted leading-[1.6]">
          Get notified when a new high-risk approval appears on any wallet you monitor. Daily digests filter to the approvals that cross your risk threshold; risk-only mode suppresses routine low-score changes. HTML templates, configurable per wallet.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="risk-policy" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Risk policy.
        </h3>
        <p className="font-plex text-base text-ink-muted leading-[1.6]">
          Define what counts as alert-worthy for you. Set a minimum risk score threshold, narrow to unlimited approvals only, allow-list or block-list specific spender addresses, filter by token contract, and scope policies per chain. The default policy catches the obvious risks out of the box.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="slack" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Slack integration.
        </h3>
        <p className="font-plex text-base text-ink-muted leading-[1.6]">
          Webhook-driven notifications routed to any channel. Rich formatting shows the spender, the token, the risk score, and the recommended action. Team collaboration on incidents without leaving Slack.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="public-share-links" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Public share links.
        </h3>
        <p className="font-plex text-base text-ink-muted leading-[1.6]">
          Read-only links to a wallet&rsquo;s approval status. Optionally censor addresses or amounts, filter to risky approvals only, set an expiry, or rotate the link in one click. Useful for auditors, security reviewers, or sharing a clean report.
        </p>
      </section>

      <section className="space-y-6">
        <h3 id="authentication" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          API keys.
        </h3>
        <p className="font-plex text-base text-ink-muted leading-[1.6]">
          Create an <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">ag_live_*</code> key for server-side use or an <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">ag_pub_*</code> key for read-only browser use. Each key has a plan-dependent{' '}
          <Link href="/docs/api-reference#rate-limits" className="text-amber-deep hover:underline underline-offset-2">rate limit</Link>{' '}
          and can be rotated or revoked independently. Keys never leave the settings page on creation; you copy once and store them yourself.
        </p>
      </section>
    </div>
  )
}
