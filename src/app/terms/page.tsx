'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import Link from 'next/link'

export default function TermsPage() {

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
            Legal &middot; Terms of Service
          </span>
          <H1 className="mb-6 text-ink">Terms of Service</H1>
          <p className="text-lg text-ink-soft max-w-reading">
            The rules of the road for using AllowanceGuard &mdash; written in plain English wherever the law allows, and in precise English wherever it does not. These terms apply to every tier: Free, Pro, Sentinel, and B2B API.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* Terms Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="max-w-none text-ink-soft">

              {/* Introduction */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">1. Agreement to These Terms</H2>
                <p className="text-ink-soft leading-relaxed">
                  By accessing or using AllowanceGuard &mdash; the website, scanner, dashboard, browser extension, or B2B API &mdash; you agree to be bound by these Terms of Service and by every document they incorporate by reference (Privacy Policy, Cookie Policy, SLA, Refund Policy, and, where applicable, the Data Processing Agreement). If you do not agree, do not use the service. If you are using AllowanceGuard on behalf of an organisation, you represent that you have authority to bind that organisation to these terms.
                </p>
              </div>

              {/* Service Description */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">What Allowance Guard Does</H2>
                <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg mb-6">
                  <p className="text-ink-soft">
                    Allowance Guard is a Web3 wallet security platform. The core scanner is free and open source. Premium services are available via paid subscriptions.
                  </p>
                  <ul className="mt-4 space-y-2 text-ink-soft">
                    <li>• View and manage token approvals across 27 blockchain networks</li>
                    <li>• Identify risky, unlimited, and Permit2 approvals</li>
                    <li>• Revoke token approvals with one-click transactions</li>
                    <li>• <strong>Pro/Sentinel:</strong> Continuous monitoring, email/Telegram alerts, batch revocation, historical timeline, export reports</li>
                    <li>• <strong>Sentinel:</strong> Team dashboards, automated revocation rules, webhook integrations, compliance audit logs</li>
                    <li>• <strong>B2B API:</strong> Programmatic access to scanning, risk scoring, and allowance data</li>
                  </ul>
                </div>
              </div>

              {/* Tier-Specific Terms */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Service Tiers</H2>
                <div className="space-y-6">

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Free Tier</h3>
                    <p className="text-ink-soft text-sm mb-2">
                      The free tier provides core scanning and revocation for up to 3 wallets on a single chain.
                      No account required for basic scans. The free tier is provided on a best-effort basis with no uptime guarantee.
                    </p>
                    <p className="text-ink-soft text-sm">
                      Features: manual scanning, single-chain view, basic risk labels, manual revocation.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Pro Tier ($9.99/month or $79/year)</h3>
                    <p className="text-ink-soft text-sm mb-2">
                      Pro unlocks unlimited wallets, multi-chain portfolio view, continuous monitoring with alerts,
                      batch revocation, historical risk timeline, and export capabilities (PDF/CSV).
                    </p>
                    <p className="text-ink-soft text-sm">
                      Service availability: best effort. No formal SLA. See our{' '}
                      <Link href="/sla" className="text-amber-deep hover:underline">SLA page</Link> for details.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Sentinel Tier ($49.99/month or $499/year)</h3>
                    <p className="text-ink-soft text-sm mb-2">
                      Sentinel includes everything in Pro plus: monitoring up to 50 wallets, automated revocation rules,
                      team dashboard with role-based access, compliance-ready audit logs, webhook integrations, and priority support.
                    </p>
                    <p className="text-ink-soft text-sm">
                      Service availability: 99.5% uptime target, 4-hour response time for critical issues. See our{' '}
                      <Link href="/sla" className="text-amber-deep hover:underline">SLA page</Link> for full details.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">B2B API Tiers</h3>
                    <p className="text-ink-soft text-sm mb-2">
                      API access is available at four tiers: Free (100 calls/day), Developer ($39/month, 10,000 calls/day),
                      Growth ($149/month, 100,000 calls/day), and Enterprise (custom pricing with SLA).
                    </p>
                    <p className="text-ink-soft text-sm">
                      API keys must not be shared. Usage is subject to rate limits per tier. Prohibited uses include:
                      scraping for competitive intelligence, reselling data without permission, and automated abuse of blockchain networks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Terms */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Subscription &amp; Billing</H2>
                <div className="space-y-4 text-ink-soft">
                  <p>
                    <strong>Billing cycle:</strong> Subscriptions are billed monthly or annually, depending on the plan selected.
                    Billing begins at the end of any trial period or immediately if no trial applies.
                  </p>
                  <p>
                    <strong>Auto-renewal:</strong> All subscriptions automatically renew at the end of each billing period
                    unless you cancel before the renewal date. You will be charged the then-current price for your plan.
                  </p>
                  <p>
                    <strong>Cancellation:</strong> You may cancel your subscription at any time through your{' '}
                    <Link href="/account" className="text-amber-deep hover:underline">account dashboard</Link>{' '}
                    or via the Stripe Customer Portal. Cancellation takes effect at the end of the current billing period.
                    You retain access to paid features until then.
                  </p>
                  <p>
                    <strong>Free trials:</strong> Pro subscribers may receive a 7-day free trial. If you cancel during the trial,
                    you will not be charged. If you do not cancel, your subscription converts to a paid plan automatically.
                  </p>
                  <p>
                    <strong>Price changes:</strong> We may adjust pricing with 30 days&apos; notice. Existing subscribers are
                    grandfathered at their current rate until the end of their billing period.
                  </p>
                  <p>
                    <strong>Failed payments:</strong> If a payment fails, we will retry automatically via Stripe Smart Retries.
                    If payment cannot be collected after retries, your subscription may be downgraded to the free tier.
                  </p>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Refund Policy</H2>
                <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                  <div className="space-y-3 text-ink-soft text-sm">
                    <p>
                      <strong>14-day money-back guarantee:</strong> If you are unsatisfied with your first subscription
                      (any paid tier), request a full refund within 14 days of your first payment.
                    </p>
                    <p>
                      <strong>Annual plans:</strong> Pro-rated refund available if cancelled within 30 days of purchase.
                    </p>
                    <p>
                      <strong>Monthly plans:</strong> No refunds for partial billing periods after the 14-day window.
                    </p>
                    <p>
                      <strong>API tiers:</strong> Refunds are pro-rated based on usage within the billing period.
                    </p>
                    <p>
                      <strong>Process:</strong> Request a refund via your account dashboard or by emailing{' '}
                      <span className="text-amber-deep">billing@allowanceguard.com</span>.
                    </p>
                    <p>
                      <strong>Donations:</strong> Donations are non-refundable once processed, except for technical errors.
                    </p>
                    <p className="mt-2">
                      For full details, see our{' '}
                      <Link href="/refund" className="text-amber-deep hover:underline">Refund Policy</Link>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Disclaimers */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">6. Important Disclaimers</H2>
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-400 pl-6 py-4 rounded-r-lg bg-amber-400/5">
                    <h3 className="text-lg font-semibold mb-2 text-amber-deep">Not Financial or Legal Advice</h3>
                    <p className="text-ink-soft text-sm leading-relaxed">
                      AllowanceGuard is a security monitoring tool. It is not a broker, dealer, investment adviser, custodian, lawyer, or accountant. Risk scores, labels, and alerts are informational signals, not recommendations. Every decision to approve, hold, or revoke a token permission is yours, and the consequences of that decision are yours alone.
                    </p>
                  </div>

                  <div className="border-l-4 border-crimson-500 pl-6 py-4 rounded-r-lg bg-red-500/5">
                    <h3 className="text-lg font-semibold mb-2 text-red-800">Service Provided &ldquo;As Is&rdquo;</h3>
                    <p className="text-ink-soft text-sm leading-relaxed">
                      To the fullest extent permitted by law, the service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, completeness, or uninterrupted availability. We do not warrant that the scanner will detect every approval, that risk scores are correct, or that revocation transactions will succeed.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6 py-4 rounded-r-lg bg-blue-500/5">
                    <h3 className="text-lg font-semibold mb-2 text-blue-800">Blockchain &amp; Wallet Risks</h3>
                    <p className="text-ink-soft text-sm leading-relaxed">
                      Blockchain transactions are irreversible once confirmed. You are solely responsible for verifying every transaction your wallet signs, including the spender address, token contract, amount, and network. Gas fees, RPC availability, mempool congestion, and reorgs may affect whether a transaction succeeds. We do not control, and are not liable for, the behaviour of any blockchain network, node operator, wallet provider, or third-party contract.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Handling */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Data Handling</H2>
                <div className="space-y-3 text-ink-soft">
                  <p>
                    <strong>What we store:</strong> Account email, wallet addresses you scan or monitor, approval data retrieved
                    from blockchains, monitoring preferences, team membership data, and usage metrics.
                  </p>
                  <p>
                    <strong>Payment data:</strong> All payment processing is handled by Stripe. We store only your Stripe customer ID
                    and subscription status. We never see or store your card details.
                  </p>
                  <p>
                    <strong>Retention:</strong> Active account data is retained while your account exists. Audit logs are retained
                    for 90 days. Technical logs are purged after 30 days. You may request full data export or deletion at any time.
                  </p>
                  <p>
                    For complete details, see our{' '}
                    <Link href="/privacy" className="text-amber-deep hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>

              {/* User Responsibilities */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Your Responsibilities</H2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Wallet Security</h3>
                    <p className="text-ink-soft text-sm">
                      You are responsible for keeping your wallet secure. Never share your private keys
                      or seed phrases with anyone, including us.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Transaction Verification</h3>
                    <p className="text-ink-soft text-sm">
                      Always review transaction details before confirming. Verify token addresses,
                      amounts, and gas fees.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Compliance</h3>
                    <p className="text-ink-soft text-sm">
                      Ensure your use of Allowance Guard complies with applicable laws and regulations
                      in your jurisdiction.
                    </p>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Account &amp; API Key Security</h3>
                    <p className="text-ink-soft text-sm">
                      Keep your account credentials and API keys secure. You are responsible for all activity
                      under your account. Report unauthorized access immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptable Use */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Acceptable Use</H2>
                <div className="text-ink-soft space-y-3">
                  <p>You agree not to:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• Use the service for illegal activities or to facilitate fraud</li>
                    <li>• Attempt to bypass rate limits, feature gates, or authentication</li>
                    <li>• Share API keys or allow unauthorized third-party access to your account</li>
                    <li>• Scrape or harvest data for competitive intelligence without written permission</li>
                    <li>• Resell API data or build competing products using our API without a commercial license</li>
                    <li>• Interfere with the operation of the service or overload our infrastructure</li>
                    <li>• Reverse-engineer proprietary components (open-source components are governed by GPL-3.0)</li>
                  </ul>
                </div>
              </div>

              {/* Termination */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Termination</H2>
                <div className="text-ink-soft space-y-3">
                  <p>
                    <strong>By you:</strong> You may cancel your subscription and close your account at any time.
                    Contact <span className="text-amber-deep">legal.support@allowanceguard.com</span> or use the account dashboard.
                  </p>
                  <p>
                    <strong>By us:</strong> We may suspend or terminate your account if you violate these terms,
                    engage in abusive behavior, fail to pay after reasonable notice, or if required by law.
                    We will provide 7 days&apos; notice where possible, except in cases of severe abuse.
                  </p>
                  <p>
                    <strong>Effect of termination:</strong> Upon termination, your access to paid features is immediately revoked.
                    You may request a data export before account closure. Active subscriptions will be cancelled in Stripe.
                  </p>
                </div>
              </div>

              {/* Service Availability */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Service Availability</H2>
                <p className="text-ink-soft mb-4">
                  Service availability varies by tier. Free and Pro tiers are provided on a best-effort basis.
                  Sentinel tier has a 99.5% uptime target. B2B API Growth+ has a 99.9% uptime target.
                </p>
                <p className="text-ink-soft">
                  We cannot guarantee continuous uptime, accuracy of blockchain data (which depends on RPC providers),
                  success of all transactions, or compatibility with all wallets or browsers.
                  See our <Link href="/sla" className="text-amber-deep hover:underline">SLA page</Link> for tier-specific details.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Changes to These Terms</H2>
                <p className="text-ink-soft">
                  We may update these terms occasionally. Significant changes will be announced
                  on our website and via email to registered users with at least 30 days&apos; notice.
                  Continued use after changes take effect constitutes acceptance of the new terms.
                  If you disagree, you may cancel your subscription before the changes take effect.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">14. Limitation of Liability</H2>
                <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-lg">
                  <p className="text-red-800 font-semibold mb-3 text-sm uppercase tracking-wider">Please read carefully.</p>
                  <p className="text-ink-soft text-sm leading-relaxed mb-3">
                    To the maximum extent permitted by applicable law, in no event shall AllowanceGuard, its operators, contributors, affiliates, or licensors be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of funds, tokens, profits, revenue, goodwill, data, or business opportunities, whether in contract, tort (including negligence), strict liability, or any other legal theory, and whether or not we have been advised of the possibility of such damages.
                  </p>
                  <p className="text-ink-soft text-sm leading-relaxed mb-3">
                    Our total aggregate liability for any and all claims arising out of or relating to these terms or the service shall not exceed the greater of (a) the fees you paid us in the twelve (12) months immediately preceding the event giving rise to the claim, or (b) one hundred US dollars (US$100). This cap applies in aggregate across all claims and all tiers, including free users.
                  </p>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited, including liability for fraud, fraudulent misrepresentation, death or personal injury caused by our negligence, or any statutory rights that cannot be waived under the law of your jurisdiction.
                  </p>
                </div>
              </div>

              {/* Indemnity */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">15. Indemnity</H2>
                <p className="text-ink-soft leading-relaxed">
                  You agree to indemnify and hold harmless AllowanceGuard and its operators and contributors from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with (a) your use of the service, (b) your violation of these terms, (c) your violation of any third-party right, or (d) any transaction you sign or authorise from a wallet connected to the service.
                </p>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">16. Governing Law &amp; Dispute Resolution</H2>
                <p className="text-ink-soft leading-relaxed mb-3">
                  These terms are governed by the laws of England and Wales, without regard to conflict-of-laws principles. Before bringing any formal claim, you agree to first contact us at <span className="text-amber-deep font-medium">legal.support@allowanceguard.com</span> and attempt to resolve the dispute in good faith for at least thirty (30) days.
                </p>
                <p className="text-ink-soft leading-relaxed">
                  If the dispute cannot be resolved through negotiation, it shall be submitted to binding arbitration seated in London, United Kingdom, conducted in English under the rules of the London Court of International Arbitration (LCIA) by a single arbitrator. Judgment on the award may be entered in any court of competent jurisdiction. Nothing in this section prevents either party from seeking injunctive relief in a court of competent jurisdiction to protect intellectual property or confidential information.
                </p>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Questions About These Terms?</H2>
                <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                  <p className="text-ink-soft mb-4">
                    If you have questions about these terms or need clarification, contact us:
                  </p>
                  <ul className="space-y-2 text-ink-soft text-sm">
                    <li>General &amp; Legal: <span className="text-amber-deep font-medium">legal.support@allowanceguard.com</span></li>
                    <li>Billing: <span className="text-amber-deep font-medium">billing@allowanceguard.com</span></li>
                  </ul>
                </div>
              </div>

              {/* Related Documents */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Related Documents</H2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy" className="text-amber-deep hover:underline text-sm bg-paper-sub border border-ink-rule px-4 py-2 rounded-lg">
                    Privacy Policy
                  </Link>
                  <Link href="/sla" className="text-amber-deep hover:underline text-sm bg-paper-sub border border-ink-rule px-4 py-2 rounded-lg">
                    Service Level Agreement
                  </Link>
                  <Link href="/refund" className="text-amber-deep hover:underline text-sm bg-paper-sub border border-ink-rule px-4 py-2 rounded-lg">
                    Refund Policy
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
              <div className="text-center text-sm text-ink-muted border-t border-ink-rule pt-8">
                <p>Last updated: April 2, 2026</p>
                <p className="mt-2">
                  These terms are governed by applicable law and are subject to change with 30 days&apos; notice.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
