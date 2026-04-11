'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import Link from 'next/link'

export default function PrivacyPage() {

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden bg-paper-deep">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div
          className="absolute inset-0 z-10"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to right, rgba(247,245,240,0.92) 0%, rgba(247,245,240,0.78) 60%, rgba(247,245,240,0.65) 100%)'
          }}
        />

        <Container className="relative text-left max-w-4xl z-20">
          <span className="inline-block mb-4 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep">
            Legal &middot; Privacy Policy
          </span>
          <H1 className="mb-6 text-ink">Privacy Policy</H1>
          <p className="text-lg text-ink-soft max-w-reading">
            Privacy isn’t a feature. It’s the architecture. We collect the minimum we need to run the service, we don’t sell anything to anyone, and we tell you exactly what is stored, where, and for how long.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* Privacy Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="max-w-none text-ink-soft">

              {/* Introduction */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Our Privacy Commitment</H2>
                <p className="text-ink-soft leading-relaxed">
                  Allowance Guard is built with privacy-first principles. We don&apos;t sell your data,
                  don&apos;t track your on-chain activity beyond scans you explicitly trigger, and
                  maintain minimal server logs for security purposes only. This policy covers both
                  free and paid tiers, including Pro, Sentinel, and B2B API access.
                </p>
              </div>

              {/* Data Collection */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Data We Collect</H2>
                <div className="space-y-6">
                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Account Information</h3>
                    <p className="text-ink-soft">
                      When you create an account: email address and optional display name.
                      Used for authentication, billing communications, and alert delivery.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Wallet Addresses</h3>
                    <p className="text-ink-soft">
                      <strong>Free tier:</strong> Wallet addresses are used to fetch approvals from blockchain
                      networks during scans. Not stored permanently unless you create an account.
                    </p>
                    <p className="text-ink-soft mt-2">
                      <strong>Pro/Sentinel:</strong> Wallet addresses you add for monitoring are stored in our
                      database to enable continuous scanning, alerts, and historical tracking. You can remove
                      wallets at any time from your dashboard.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Payment Data</h3>
                    <p className="text-ink-soft">
                      All payment processing is handled by <strong>Stripe</strong>. We never see or store your
                      credit card number, CVV, or full card details. We store only: your Stripe customer ID,
                      subscription plan, subscription status, and billing period dates.
                      Stripe&apos;s privacy policy governs their handling of your payment data.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Email Addresses</h3>
                    <p className="text-ink-soft">
                      Used for: subscription billing notifications,
                      monitoring alerts (Pro/Sentinel), trial expiration notices, security notifications,
                      and team invitations. Account authentication uses SIWE (Sign-In with Ethereum) &mdash;
                      you sign a message with your wallet, no email required for login.
                      Never shared with third parties for marketing.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Wallet Addresses</h3>
                    <p className="text-ink-soft">
                      When you scan a wallet (with or without signing in), we store the wallet address to retrieve
                      and display your token approvals. When you sign in via SIWE (Sign-In with Ethereum), your
                      wallet address is linked to your account and may constitute personal data under GDPR if it
                      can be associated with you. We use wallet addresses solely for providing the scanning,
                      monitoring, and alerting services you requested.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Analytics Events</h3>
                    <p className="text-ink-soft">
                      If you accept analytics in the cookie banner, we collect anonymous usage events
                      (e.g. scan started, wallet connected) stored in our own database &mdash; not via
                      third-party analytics services and not via cookies. These events are gated by your
                      consent: if you select &ldquo;Essential only,&rdquo; no analytics events are recorded.
                      You can change your preference at any time by clearing your browser storage.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Monitoring &amp; Usage Data</h3>
                    <p className="text-ink-soft">
                      <strong>Pro/Sentinel:</strong> Approval snapshots, monitoring events, risk score history,
                      revocation rule configurations, webhook settings, and team membership data.
                      This data enables the monitoring, alerting, and compliance features you subscribe to.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">API Usage (B2B)</h3>
                    <p className="text-ink-soft">
                      API key prefix (not the full key), endpoint called, response status, request duration,
                      and daily call counts. Used for rate limiting, usage metering, and billing.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6">
                    <h3 className="text-lg font-semibold mb-2 text-ink">Technical Logs</h3>
                    <p className="text-ink-soft">
                      Minimal server logs (IP addresses, user agent, request IDs) for security and abuse prevention.
                      Automatically purged after 30 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">How We Use Your Data</H2>
                <ul className="space-y-3 text-ink-soft">
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Process wallet scans to display token allowances and risk assessments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Deliver monitoring alerts via email, Slack, or Telegram (Pro/Sentinel)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Process subscription payments and send billing communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Enforce rate limits and usage quotas per subscription tier</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Generate compliance audit reports (Sentinel)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Monitor for abuse and security threats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-deep mr-3">•</span>
                    <span>Improve the service through aggregated, anonymized analytics</span>
                  </li>
                </ul>
              </div>

              {/* Data Retention */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Data Retention Periods</H2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-ink-soft border border-ink-rule rounded-lg">
                    <thead className="bg-paper-sub border border-ink-rule">
                      <tr>
                        <th className="text-left p-3 font-medium">Data Type</th>
                        <th className="text-left p-3 font-medium">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Account profile</td>
                        <td className="p-3">Until account deletion</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Wallet monitoring data</td>
                        <td className="p-3">Until wallet removed or account deletion</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Subscription &amp; billing records</td>
                        <td className="p-3">7 years (legal/tax requirement)</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Audit logs</td>
                        <td className="p-3">90 days, then deleted</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">API usage records</td>
                        <td className="p-3">90 days (aggregated thereafter)</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Technical/server logs</td>
                        <td className="p-3">30 days</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Webhook delivery logs</td>
                        <td className="p-3">30 days</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-3">Session tokens</td>
                        <td className="p-3">30 days (auto-expire)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GDPR Rights */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Your Privacy Rights (GDPR &amp; Global)</H2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Right to Access (Article 15)</h3>
                    <p className="text-ink-soft text-sm">
                      You may request a copy of all personal data we hold about you.
                      Use the data export feature in your{' '}
                      <Link href="/account" className="text-amber-deep hover:underline">account dashboard</Link>{' '}
                      or call the <code className="text-xs bg-paper-sub border border-ink-rule px-1 py-0.5 rounded">GET /api/user/export</code> endpoint.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Right to Portability (Article 20)</h3>
                    <p className="text-ink-soft text-sm">
                      Export your data in a structured, machine-readable JSON format via the data export endpoint.
                      This includes your profile, wallets, monitoring settings, rules, and usage data.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Right to Deletion (Article 17)</h3>
                    <p className="text-ink-soft text-sm">
                      Request complete deletion of your account and all associated data. Active subscriptions
                      will be cancelled. Use the account dashboard or call the{' '}
                      <code className="text-xs bg-paper-sub border border-ink-rule px-1 py-0.5 rounded">DELETE /api/user/delete</code> endpoint.
                      Some data may be retained for legal obligations (billing records).
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Right to Rectification (Article 16)</h3>
                    <p className="text-ink-soft text-sm">
                      Update your email or profile information via the account settings page.
                      Contact us to correct any other inaccurate data.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Right to Restrict Processing</h3>
                    <p className="text-ink-soft text-sm">
                      You may disable monitoring for specific wallets or pause your account.
                      Contact us at <span className="text-amber-deep">legal.support@allowanceguard.com</span> for
                      broader processing restrictions.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Email Management</h3>
                    <p className="text-ink-soft text-sm">
                      Unsubscribe from marketing or alert emails anytime using the link in any email.
                      Transactional emails (billing, security) cannot be unsubscribed while your account is active.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Cookies &amp; Session Management</H2>
                <div className="text-ink-soft space-y-3">
                  <p>
                    We use cookies for session management (<code className="text-xs bg-paper-sub border border-ink-rule px-1 py-0.5 rounded">ag_sess</code>),
                    CSRF protection, and user preferences. Analytics cookies are optional and require your consent.
                  </p>
                  <p>
                    For full details on cookie types, retention, and controls, see our{' '}
                    <Link href="/cookies" className="text-amber-deep hover:underline">Cookie Policy</Link>.
                  </p>
                </div>
              </div>

              {/* Third Parties */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Third-Party Services</H2>
                <p className="text-ink-soft mb-4">
                  We use the following third-party services, each with their own privacy protections:
                </p>
                <ul className="space-y-2 text-ink-soft">
                  <li>• <strong>Vercel:</strong> Hosting and CDN (privacy-focused, SOC 2 compliant)</li>
                  <li>• <strong>Neon Database:</strong> Data storage (encrypted at rest and in transit)</li>
                  <li>• <strong>Stripe:</strong> Payment processing (PCI DSS Level 1 compliant) — handles all card data</li>
                  <li>• <strong>Coinbase Commerce:</strong> Cryptocurrency donations</li>
                  <li>• <strong>Upstash:</strong> Redis caching (encrypted, serverless)</li>
                  <li>• <strong>Postmark / SMTP:</strong> Email delivery (enterprise-grade security)</li>
                  <li>• <strong>Alchemy/Infura:</strong> Blockchain RPC data (no personal data shared, only wallet addresses for queries)</li>
                  <li>• <strong>Rollbar:</strong> Error monitoring (receives anonymized error data)</li>
                  <li>• <strong>Reown (WalletConnect):</strong> Wallet connection protocol</li>
                </ul>
                <p className="text-ink-soft mt-4 text-sm">
                  We do not share personal data with these services beyond what is necessary for their function.
                  No data is sold to third parties.
                </p>
              </div>

              {/* International Transfers */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">International Data Transfers</H2>
                <p className="text-ink-soft">
                  Your data may be processed in the United States and European Union, where our infrastructure
                  providers operate. We ensure appropriate safeguards are in place for international transfers,
                  including standard contractual clauses where applicable. Sentinel and Enterprise customers
                  may request a{' '}
                  <Link href="/dpa" className="text-amber-deep hover:underline">Data Processing Agreement (DPA)</Link>.
                </p>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Questions About Privacy?</H2>
                <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                  <p className="text-ink-soft mb-4">
                    We&apos;re committed to transparency. If you have questions about our privacy practices
                    or want to exercise your rights, contact us:
                  </p>
                  <ul className="space-y-2 text-ink-soft text-sm">
                    <li>Privacy inquiries: <span className="text-amber-deep font-medium">legal.support@allowanceguard.com</span></li>
                    <li>Data export/deletion: Use your <Link href="/account" className="text-amber-deep hover:underline">account dashboard</Link> or the API endpoints</li>
                    <li>DPA requests: <span className="text-amber-deep font-medium">legal.support@allowanceguard.com</span></li>
                  </ul>
                </div>
              </div>

              {/* Related Documents */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Related Documents</H2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/terms" className="text-amber-deep hover:underline text-sm bg-paper-sub border border-ink-rule px-4 py-2 rounded-lg">
                    Terms of Service
                  </Link>
                  <Link href="/cookies" className="text-amber-deep hover:underline text-sm bg-paper-sub border border-ink-rule px-4 py-2 rounded-lg">
                    Cookie Policy
                  </Link>
                  <Link href="/dpa" className="text-amber-deep hover:underline text-sm bg-paper-sub border border-ink-rule px-4 py-2 rounded-lg">
                    Data Processing Agreement
                  </Link>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center text-sm text-ink-soft border-t border-ink-rule pt-8">
                <p>Last updated: April 2, 2026</p>
                <p className="mt-2">
                  This privacy policy may be updated to reflect changes in our practices.
                  We&apos;ll notify registered users of significant changes via email with at least 30 days&apos; notice.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
