import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Privacy Policy — Ledger aesthetic, server component.
 *
 * Council:
 *  Design: SectionHeader, CascadingScrollAnimation, paper-card, grain, font-display-tight. No video.
 *  Copy #20 Brand: Editorial voice — "Privacy isn't a feature. It's the architecture."
 *  Copy #21 Technical: No duplicate sections, claims match implementation.
 *  Copy #22 Conversion: Trust signals first, strongest reassurances above the fold.
 *  Legal #9: Retention table, third-party disclosures, no false promises.
 *  Legal #23: Explicit legal bases, controller identity.
 *  Legal #24 (veto): Art 6 bases, supervisory authority, right to complain, legitimate interest for server-side ops.
 *  Noor: AA contrast, semantic headings, accessible table.
 */

export const metadata: Metadata = {
  title: 'Privacy Policy — AllowanceGuard',
  description: 'How AllowanceGuard collects, uses, and protects your data. GDPR-compliant, transparent, minimal.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* ── Hero ── */}
      <section className="paper grain relative py-24 sm:py-32 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.10) 0%, transparent 55%),' +
              'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
          }}
        />
        <Container className="relative z-10">
          <SectionHeader
            number="§"
            eyebrow="Legal · Privacy Policy"
            title="Privacy isn&rsquo;t a feature. It&rsquo;s the architecture."
            lede="We collect the minimum we need, we don&rsquo;t sell anything to anyone, and we tell you exactly what is stored, where, and for how long."
          />
        </Container>
      </section>

      {/* ── Data Controller ── */}
      <section className="paper-sub grain py-16 sm:py-20">
        <Container>
          <div className="max-w-4xl">
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <h2 className="font-display-tight text-ink text-xl mb-4">Data Controller</h2>
                <p className="font-plex text-ink-soft leading-relaxed mb-3">
                  AllowanceGuard is operated by EazyAccess Ltd, registered in England &amp; Wales.
                  We are the data controller for personal data processed through this service.
                </p>
                <p className="font-plex text-ink-muted text-sm">
                  Contact: <span className="text-amber-deep">legal.support@allowanceguard.com</span>
                </p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── What We Collect ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="01"
                eyebrow="Data collection"
                title="What we collect and why."
                lede="Every data point earns its place. If we don&rsquo;t need it to run the service, we don&rsquo;t collect it."
              />
            </div>

            <div className="space-y-6">
              {DATA_COLLECTED.map((item, i) => (
                <CascadingScrollAnimation key={item.title} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8">
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-amber-deep uppercase">{item.basis}</span>
                    </div>
                    <h3 className="font-display-tight text-ink text-lg mb-2">{item.title}</h3>
                    <p className="font-plex text-ink-muted text-[15px] leading-relaxed">{item.description}</p>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── How We Use It ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="02"
                eyebrow="Data usage"
                title="How your data works for you."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <ul className="space-y-4">
                  {USAGE_LIST.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                      <span className="font-plex text-ink-soft text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Retention ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="03"
                eyebrow="Retention"
                title="How long we keep it."
                lede="Data has a shelf life. When the purpose ends, the data goes."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-paper-sub border-b border-ink-rule">
                      <th className="text-left p-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Data type</th>
                      <th className="text-left p-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="font-plex text-ink-soft">
                    {RETENTION.map((row, i) => (
                      <tr key={i} className="border-b border-ink-rule last:border-b-0">
                        <td className="p-4">{row.type}</td>
                        <td className="p-4 text-ink-muted">{row.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Your Rights ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="04"
                eyebrow="Your rights"
                title="What you can do about it."
                lede="Under GDPR and equivalent global frameworks, you have the following rights. Exercise them at any time."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {RIGHTS.map((right, i) => (
                <CascadingScrollAnimation key={right.title} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8 h-full">
                    <h3 className="font-display-tight text-ink text-base mb-2">{right.title}</h3>
                    <p className="font-plex text-ink-muted text-sm leading-relaxed">{right.description}</p>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>

            <CascadingScrollAnimation direction="up" distance={30} delay={0}>
              <div className="mt-8 paper-card p-6 sm:p-8 border-l-2 border-amber-deep">
                <h3 className="font-display-tight text-ink text-base mb-2">Right to lodge a complaint</h3>
                <p className="font-plex text-ink-muted text-sm leading-relaxed">
                  If you believe we have not handled your data correctly, you have the right to lodge a complaint
                  with your local supervisory authority. In the UK, this is the{' '}
                  <a href="https://ico.org.uk" className="text-amber-deep hover:underline" target="_blank" rel="noopener noreferrer">
                    Information Commissioner&rsquo;s Office (ICO)
                  </a>.
                </p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Cookies ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="05"
                eyebrow="Cookies"
                title="What we set and why."
                lede="Two essential cookies. No third-party trackers. No advertising pixels."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-6">
                <div>
                  <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">
                    We set two cookies, both essential for the service to function:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <code className="font-mono text-xs bg-paper-sub border border-ink-rule px-2 py-1 shrink-0 mt-0.5">ag_sess</code>
                      <span className="font-plex text-ink-muted text-sm">Session authentication. HttpOnly, Secure, SameSite=Lax. 30-day expiry.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="font-mono text-xs bg-paper-sub border border-ink-rule px-2 py-1 shrink-0 mt-0.5">ag_csrf</code>
                      <span className="font-plex text-ink-muted text-sm">Cross-site request forgery protection. Secure, SameSite=Lax, 30-day expiry. Readable by JavaScript so the client can echo the token in an x-csrf-token header.</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-plex text-ink-soft text-[15px] leading-relaxed">
                    The &ldquo;Analytics&rdquo; toggle in our cookie banner controls server-side database tracking, not cookies.
                    If you select &ldquo;Essential only,&rdquo; no behavioural events are recorded. Server-side operational events
                    (scan requests, error rates) run under legitimate interest and are not gated by consent — they contain
                    no personal identifiers.
                  </p>
                </div>
                <p className="font-plex text-ink-muted text-sm">
                  Full details: <Link href="/cookies" className="text-amber-deep hover:underline">Cookie Policy</Link>
                </p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Third Parties ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="06"
                eyebrow="Third parties"
                title="Who else touches your data."
                lede="We share only what each service needs to function. No data is sold. No marketing partners."
              />
            </div>

            <div className="space-y-4">
              {THIRD_PARTIES.map((tp, i) => (
                <CascadingScrollAnimation key={tp.name} direction="up" distance={20} delay={i * 60}>
                  <div className="paper-card p-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span className="font-display-tight text-ink text-base shrink-0 w-40">{tp.name}</span>
                    <span className="font-plex text-ink-muted text-sm leading-relaxed">{tp.purpose}</span>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── International Transfers ── */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="07"
                eyebrow="Transfers"
                title="Where your data goes."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">
                  Your data may be processed in the United States and European Union, where our
                  infrastructure providers operate. We ensure appropriate safeguards for international
                  transfers, including standard contractual clauses (SCCs) where required.
                </p>
                <p className="font-plex text-ink-soft text-[15px] leading-relaxed">
                  Sentinel and Enterprise customers may request a{' '}
                  <Link href="/dpa" className="text-amber-deep hover:underline">Data Processing Agreement (DPA)</Link>.
                </p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Contact + Related ── */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="08"
                eyebrow="Contact"
                title="Questions about privacy?"
              />
            </div>

            <div className="space-y-6">
              <CascadingScrollAnimation direction="up" distance={40} delay={0}>
                <div className="paper-card p-8 sm:p-10">
                  <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">
                    We&rsquo;re committed to transparency. If you have questions or want to exercise your rights:
                  </p>
                  <ul className="space-y-2 font-plex text-sm text-ink-muted">
                    <li>Privacy inquiries: <span className="text-amber-deep font-medium">legal.support@allowanceguard.com</span></li>
                    <li>Data export / deletion: <Link href="/account" className="text-amber-deep hover:underline">Account dashboard</Link> or API endpoints</li>
                    <li>DPA requests: <span className="text-amber-deep font-medium">legal.support@allowanceguard.com</span></li>
                  </ul>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={40} delay={100}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/terms" className="paper-button text-sm">Terms of Service</Link>
                  <Link href="/cookies" className="paper-button text-sm">Cookie Policy</Link>
                  <Link href="/dpa" className="paper-button text-sm">Data Processing Agreement</Link>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={40} delay={200}>
                <p className="font-plex text-xs text-ink-whisper text-center pt-8 border-t border-ink-rule">
                  Last updated: April 13, 2026. We notify registered users of significant changes via email with at least 30 days&rsquo; notice.
                </p>
              </CascadingScrollAnimation>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
 * Data — kept inline to avoid a separate file for a single page.
 * ═══════════════════════════════════════════════════════════════════════ */

const DATA_COLLECTED = [
  {
    title: 'Wallet addresses',
    basis: 'Contract · Legitimate interest',
    description:
      'When you scan a wallet, we query public blockchain data to retrieve your token approvals. ' +
      'Free-tier addresses are not stored beyond the session. Pro/Sentinel addresses are stored to ' +
      'enable continuous monitoring, alerts, and historical tracking. SIWE sign-in links your wallet ' +
      'to your account — this may constitute personal data under GDPR. You can remove wallets at any time.',
  },
  {
    title: 'Email address',
    basis: 'Contract · Consent',
    description:
      'Used for subscription billing, monitoring alerts (Pro/Sentinel), security notifications, and ' +
      'team invitations. Authentication uses SIWE — no email required for login. Never shared with ' +
      'third parties for marketing.',
  },
  {
    title: 'Payment data',
    basis: 'Contract · Legal obligation',
    description:
      'All payment processing is handled by Stripe (PCI DSS Level 1). We never see or store your card ' +
      'number, CVV, or full card details. We store: Stripe customer ID, subscription plan, status, and ' +
      'billing period dates.',
  },
  {
    title: 'Analytics events',
    basis: 'Consent',
    description:
      'If you accept analytics in the cookie banner, we collect anonymous usage events (scan started, ' +
      'wallet connected) in our own database — not via third-party services. If you select "Essential ' +
      'only," no analytics events are recorded. Change your preference at any time by clearing browser storage.',
  },
  {
    title: 'Monitoring & usage data (Pro/Sentinel)',
    basis: 'Contract',
    description:
      'Approval snapshots, monitoring events, risk score history, revocation rule configurations, ' +
      'webhook settings, and team membership. This data enables the monitoring, alerting, and ' +
      'compliance features you subscribe to.',
  },
  {
    title: 'API usage (B2B)',
    basis: 'Contract · Legitimate interest',
    description:
      'API key prefix (not the full key), endpoint called, response status, request duration, and ' +
      'daily call counts. Used for rate limiting, usage metering, and billing.',
  },
  {
    title: 'Server logs',
    basis: 'Legitimate interest',
    description:
      'IP address, user agent, request ID, and timestamp. Collected for security monitoring, abuse ' +
      'prevention, and incident response. Automatically purged after 30 days. No personal identifiers ' +
      'are extracted or stored beyond this period.',
  },
]

const USAGE_LIST = [
  'Process wallet scans and display token approvals with risk assessments',
  'Deliver monitoring alerts via email, Slack, or Telegram (Pro/Sentinel)',
  'Process subscription payments and send billing communications',
  'Enforce rate limits and usage quotas per subscription tier',
  'Generate compliance audit reports (Sentinel)',
  'Detect and prevent abuse, fraud, and security threats',
  'Improve the service through aggregated, anonymised analytics (never sold)',
]

const RETENTION = [
  { type: 'Account profile', period: 'Until account deletion' },
  { type: 'Wallet monitoring data', period: 'Until wallet removed or account deletion' },
  { type: 'Subscription & billing records', period: '7 years (legal/tax requirement)' },
  { type: 'Audit logs', period: '90 days, then deleted' },
  { type: 'API usage records', period: '90 days (aggregated thereafter)' },
  { type: 'Server logs (IP, user agent)', period: '30 days' },
  { type: 'Webhook delivery logs', period: '30 days' },
  { type: 'Session tokens', period: '30 days (auto-expire)' },
]

const RIGHTS = [
  {
    title: 'Access (Art. 15)',
    description: 'Request a copy of all personal data we hold. Use the data export feature in your account dashboard or call GET /api/user/export.',
  },
  {
    title: 'Portability (Art. 20)',
    description: 'Export your data in structured, machine-readable JSON — profile, wallets, monitoring settings, rules, and usage.',
  },
  {
    title: 'Deletion (Art. 17)',
    description: 'Request complete deletion of your account and all associated data. Active subscriptions will be cancelled. Some billing records retained for legal obligations.',
  },
  {
    title: 'Rectification (Art. 16)',
    description: 'Update your email or profile via account settings. Contact us to correct any other inaccurate data.',
  },
  {
    title: 'Restrict processing (Art. 18)',
    description: 'Disable monitoring for specific wallets or pause your account. Contact legal.support@allowanceguard.com for broader restrictions.',
  },
  {
    title: 'Object to processing (Art. 21)',
    description: 'Object to processing based on legitimate interest. We will cease processing unless we demonstrate compelling legitimate grounds.',
  },
]

const THIRD_PARTIES = [
  { name: 'Vercel', purpose: 'Hosting and CDN. SOC 2 compliant. Processes requests and serves assets.' },
  { name: 'Neon Database', purpose: 'PostgreSQL data storage. Encrypted at rest and in transit.' },
  { name: 'Stripe', purpose: 'Payment processing. PCI DSS Level 1. Handles all card data — we never see it.' },
  { name: 'Postmark (ActiveCampaign)', purpose: 'Transactional email delivery (alerts, billing, magic links). Receives recipient email and message content only.' },
  { name: 'Rollbar', purpose: 'Error monitoring. Receives anonymised error data and stack traces.' },
  { name: 'Reown (WalletConnect)', purpose: 'Wallet connection protocol. Facilitates wallet sign-in.' },
  { name: 'Blockchain RPCs', purpose: 'Public blockchain data queries. Only wallet addresses sent — no personal data.' },
]
