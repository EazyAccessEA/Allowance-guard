'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import Link from 'next/link'

export default function TermsPage() {

  return (
    <div className="min-h-screen bg-white text-ink">

      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />

        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Terms of Service</H1>
          <p className="text-xl text-stone max-w-reading mb-8">
            Clear, straightforward terms for using Allowance Guard. Covers free and paid tiers, API access, and your responsibilities.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Terms Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">

              {/* Introduction */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Agreement to Terms</H2>
                <p className="text-stone leading-relaxed">
                  By using Allowance Guard, you agree to these terms. We&apos;ve written them in plain English
                  to be as clear as possible. If you don&apos;t agree with any part of these terms,
                  please don&apos;t use our service. These terms apply to all tiers: Free, Pro, Sentinel, and B2B API.
                </p>
              </div>

              {/* Service Description */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">What Allowance Guard Does</H2>
                <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg mb-6">
                  <p className="text-stone">
                    Allowance Guard is a Web3 wallet security platform. The core scanner is free and open source. Premium services are available via paid subscriptions.
                  </p>
                  <ul className="mt-4 space-y-2 text-stone">
                    <li>• View and manage token approvals across 15 blockchain networks</li>
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
                <H2 className="text-2xl font-semibold mb-4">Service Tiers</H2>
                <div className="space-y-6">

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Free Tier</h3>
                    <p className="text-stone text-sm mb-2">
                      The free tier provides core scanning and revocation for up to 3 wallets on a single chain.
                      No account required for basic scans. The free tier is provided on a best-effort basis with no uptime guarantee.
                    </p>
                    <p className="text-stone text-sm">
                      Features: manual scanning, single-chain view, basic risk labels, manual revocation.
                    </p>
                  </div>

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Pro Tier ($9.99/month or $79/year)</h3>
                    <p className="text-stone text-sm mb-2">
                      Pro unlocks unlimited wallets, multi-chain portfolio view, continuous monitoring with alerts,
                      batch revocation, historical risk timeline, and export capabilities (PDF/CSV).
                    </p>
                    <p className="text-stone text-sm">
                      Service availability: best effort. No formal SLA. See our{' '}
                      <Link href="/sla" className="text-cobalt hover:underline">SLA page</Link> for details.
                    </p>
                  </div>

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Sentinel Tier ($49.99/month or $499/year)</h3>
                    <p className="text-stone text-sm mb-2">
                      Sentinel includes everything in Pro plus: monitoring up to 50 wallets, automated revocation rules,
                      team dashboard with role-based access, compliance-ready audit logs, webhook integrations, and priority support.
                    </p>
                    <p className="text-stone text-sm">
                      Service availability: 99.5% uptime target, 4-hour response time for critical issues. See our{' '}
                      <Link href="/sla" className="text-cobalt hover:underline">SLA page</Link> for full details.
                    </p>
                  </div>

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">B2B API Tiers</h3>
                    <p className="text-stone text-sm mb-2">
                      API access is available at four tiers: Free (100 calls/day), Developer ($39/month, 10,000 calls/day),
                      Growth ($149/month, 100,000 calls/day), and Enterprise (custom pricing with SLA).
                    </p>
                    <p className="text-stone text-sm">
                      API keys must not be shared. Usage is subject to rate limits per tier. Prohibited uses include:
                      scraping for competitive intelligence, reselling data without permission, and automated abuse of blockchain networks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Terms */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Subscription &amp; Billing</H2>
                <div className="space-y-4 text-stone">
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
                    <Link href="/account" className="text-cobalt hover:underline">account dashboard</Link>{' '}
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
                <H2 className="text-2xl font-semibold mb-4">Refund Policy</H2>
                <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                  <div className="space-y-3 text-stone text-sm">
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
                      <span className="text-cobalt">billing@allowanceguard.com</span>.
                    </p>
                    <p>
                      <strong>Donations:</strong> Donations are non-refundable once processed, except for technical errors.
                    </p>
                    <p className="mt-2">
                      For full details, see our{' '}
                      <Link href="/refund" className="text-cobalt hover:underline">Refund Policy</Link>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Disclaimers */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Important Disclaimers</H2>
                <div className="space-y-6">
                  <div className="border-l-4 border-amber-400 pl-6 bg-amber-50 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-2 text-amber-800">No Financial Advice</h3>
                    <p className="text-amber-700">
                      Allowance Guard is a monitoring and security tool, not a financial advisor.
                      All decisions about your wallet and tokens are your responsibility. We are not responsible
                      for losses from missed approvals, delayed alerts, or actions taken based on our risk scores.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-6 bg-red-50 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-2 text-red-800">Use at Your Own Risk</h3>
                    <p className="text-red-700">
                      This tool is provided &quot;as is&quot; without warranties of any kind, express or implied.
                      We cannot guarantee the accuracy of on-chain data, completeness of approval scanning,
                      or the success of revocation transactions.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6 bg-blue-50 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-2 text-blue-800">Blockchain Risks</h3>
                    <p className="text-blue-700">
                      Blockchain transactions are irreversible. Always verify transaction details
                      before confirming. Gas fees and network congestion may affect transaction success.
                      Revocation transactions require gas fees paid by you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Handling */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Data Handling</H2>
                <div className="space-y-3 text-stone">
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
                    <Link href="/privacy" className="text-cobalt hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>

              {/* User Responsibilities */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Your Responsibilities</H2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Wallet Security</h3>
                    <p className="text-stone text-sm">
                      You are responsible for keeping your wallet secure. Never share your private keys
                      or seed phrases with anyone, including us.
                    </p>
                  </div>

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Transaction Verification</h3>
                    <p className="text-stone text-sm">
                      Always review transaction details before confirming. Verify token addresses,
                      amounts, and gas fees.
                    </p>
                  </div>

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Compliance</h3>
                    <p className="text-stone text-sm">
                      Ensure your use of Allowance Guard complies with applicable laws and regulations
                      in your jurisdiction.
                    </p>
                  </div>

                  <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Account &amp; API Key Security</h3>
                    <p className="text-stone text-sm">
                      Keep your account credentials and API keys secure. You are responsible for all activity
                      under your account. Report unauthorized access immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptable Use */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Acceptable Use</H2>
                <div className="text-stone space-y-3">
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
                <H2 className="text-2xl font-semibold mb-4">Termination</H2>
                <div className="text-stone space-y-3">
                  <p>
                    <strong>By you:</strong> You may cancel your subscription and close your account at any time.
                    Contact <span className="text-cobalt">legal.support@allowanceguard.com</span> or use the account dashboard.
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
                <H2 className="text-2xl font-semibold mb-4">Service Availability</H2>
                <p className="text-stone mb-4">
                  Service availability varies by tier. Free and Pro tiers are provided on a best-effort basis.
                  Sentinel tier has a 99.5% uptime target. B2B API Growth+ has a 99.9% uptime target.
                </p>
                <p className="text-stone">
                  We cannot guarantee continuous uptime, accuracy of blockchain data (which depends on RPC providers),
                  success of all transactions, or compatibility with all wallets or browsers.
                  See our <Link href="/sla" className="text-cobalt hover:underline">SLA page</Link> for tier-specific details.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Changes to These Terms</H2>
                <p className="text-stone">
                  We may update these terms occasionally. Significant changes will be announced
                  on our website and via email to registered users with at least 30 days&apos; notice.
                  Continued use after changes take effect constitutes acceptance of the new terms.
                  If you disagree, you may cancel your subscription before the changes take effect.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Limitation of Liability</H2>
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <p className="text-red-800 font-medium mb-2">Important Legal Notice:</p>
                  <p className="text-red-700 text-sm mb-3">
                    To the maximum extent permitted by law, Allowance Guard and its contributors
                    shall not be liable for any direct, indirect, incidental, special, consequential,
                    or punitive damages, including but not limited to loss of funds, data, or profits,
                    arising from your use of this service.
                  </p>
                  <p className="text-red-700 text-sm mb-3">
                    Our total aggregate liability for any claim arising from or related to the service
                    shall not exceed the total fees paid by you in the 12 months preceding the claim.
                  </p>
                  <p className="text-red-700 text-sm">
                    This limitation applies to all tiers, including paid subscriptions. Allowance Guard is a
                    monitoring tool and does not guarantee protection against all smart contract risks.
                  </p>
                </div>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Governing Law</H2>
                <p className="text-stone">
                  These terms are governed by and construed in accordance with applicable law.
                  Any disputes arising from these terms shall be resolved through good-faith negotiation first.
                  If unresolved, disputes will be submitted to binding arbitration.
                </p>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Questions About These Terms?</H2>
                <div className="bg-background-secondary dark:bg-secondary-800 p-6 rounded-lg">
                  <p className="text-stone mb-4">
                    If you have questions about these terms or need clarification, contact us:
                  </p>
                  <ul className="space-y-2 text-stone text-sm">
                    <li>General &amp; Legal: <span className="text-cobalt font-medium">legal.support@allowanceguard.com</span></li>
                    <li>Billing: <span className="text-cobalt font-medium">billing@allowanceguard.com</span></li>
                  </ul>
                </div>
              </div>

              {/* Related Documents */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Related Documents</H2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy" className="text-cobalt hover:underline text-sm bg-background-secondary dark:bg-secondary-800 px-4 py-2 rounded-lg">
                    Privacy Policy
                  </Link>
                  <Link href="/sla" className="text-cobalt hover:underline text-sm bg-background-secondary dark:bg-secondary-800 px-4 py-2 rounded-lg">
                    Service Level Agreement
                  </Link>
                  <Link href="/refund" className="text-cobalt hover:underline text-sm bg-background-secondary dark:bg-secondary-800 px-4 py-2 rounded-lg">
                    Refund Policy
                  </Link>
                  <Link href="/cookies" className="text-cobalt hover:underline text-sm bg-background-secondary dark:bg-secondary-800 px-4 py-2 rounded-lg">
                    Cookie Policy
                  </Link>
                  <Link href="/dpa" className="text-cobalt hover:underline text-sm bg-background-secondary dark:bg-secondary-800 px-4 py-2 rounded-lg">
                    Data Processing Agreement
                  </Link>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center text-sm text-stone border-t pt-8">
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
