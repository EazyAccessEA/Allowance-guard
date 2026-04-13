'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import Link from 'next/link'

export default function SLAPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-paper-deep/85" />

        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Service Level Agreement</H1>
          <p className="text-xl text-ink-muted max-w-2xl mb-8">
            Our commitment to uptime, response times, and service quality — broken down by tier.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* SLA Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="max-w-none text-ink-soft">

              {/* Overview */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Overview</H2>
                <p className="text-ink-muted leading-relaxed">
                  This Service Level Agreement (SLA) defines the availability targets, response times,
                  and compensation policies for Allowance Guard&apos;s paid services. The SLA applies only
                  to paid tiers — the free tier is provided on a best-effort basis with no uptime commitment.
                </p>
              </div>

              {/* Uptime Targets by Tier */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Uptime Targets</H2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-ink-muted border border-ink-rule">
                    <thead className="bg-paper-sub border border-ink-rule">
                      <tr>
                        <th className="text-left p-4 font-medium">Tier</th>
                        <th className="text-left p-4 font-medium">Uptime Target</th>
                        <th className="text-left p-4 font-medium">Max Downtime/Month</th>
                        <th className="text-left p-4 font-medium">Response Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-ink-rule">
                        <td className="p-4 font-medium">Free</td>
                        <td className="p-4">Best effort</td>
                        <td className="p-4">No commitment</td>
                        <td className="p-4">Community support only</td>
                      </tr>
                      <tr className="border-t border-ink-rule bg-paper-sub border border-ink-rule/50">
                        <td className="p-4 font-medium">Pro</td>
                        <td className="p-4">Best effort</td>
                        <td className="p-4">No commitment</td>
                        <td className="p-4">48-hour email response</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-4 font-medium">Sentinel</td>
                        <td className="p-4 font-semibold text-amber-deep">99.5%</td>
                        <td className="p-4">~3.65 hours</td>
                        <td className="p-4">4-hour critical, 24-hour general</td>
                      </tr>
                      <tr className="border-t border-ink-rule bg-paper-sub border border-ink-rule/50">
                        <td className="p-4 font-medium">API Free</td>
                        <td className="p-4">Best effort</td>
                        <td className="p-4">No commitment</td>
                        <td className="p-4">Community support only</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-4 font-medium">API Developer</td>
                        <td className="p-4">99.0%</td>
                        <td className="p-4">~7.3 hours</td>
                        <td className="p-4">48-hour email response</td>
                      </tr>
                      <tr className="border-t border-ink-rule bg-paper-sub border border-ink-rule/50">
                        <td className="p-4 font-medium">API Growth</td>
                        <td className="p-4 font-semibold text-amber-deep">99.9%</td>
                        <td className="p-4">~43 minutes</td>
                        <td className="p-4">4-hour critical, 12-hour general</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-4 font-medium">API Enterprise</td>
                        <td className="p-4 font-semibold text-amber-deep">99.99%</td>
                        <td className="p-4">~4.3 minutes</td>
                        <td className="p-4">1-hour critical, 4-hour general</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Definition of Downtime */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Definition of Downtime</H2>
                <div className="bg-paper-sub border border-ink-rule p-6">
                  <p className="text-ink-muted mb-4">
                    <strong>&quot;Downtime&quot;</strong> is defined as the complete inability to perform core operations:
                  </p>
                  <ul className="space-y-2 text-ink-muted text-sm">
                    <li>• <strong>Consumer app:</strong> Inability to scan wallets OR initiate revocation transactions</li>
                    <li>• <strong>B2B API:</strong> API returning 5xx errors for more than 5 consecutive minutes, measured by our monitoring system</li>
                  </ul>
                  <p className="text-ink-muted text-sm mt-4">
                    The following are <strong>not</strong> counted as downtime:
                  </p>
                  <ul className="space-y-2 text-ink-muted text-sm mt-2">
                    <li>• Scheduled maintenance windows (announced 48 hours in advance via email and status page)</li>
                    <li>• Third-party RPC provider outages beyond our control</li>
                    <li>• Blockchain network congestion or outages</li>
                    <li>• Features degraded but core scan/revoke still functional</li>
                    <li>• Issues caused by your own systems, network, or API misuse</li>
                    <li>• Force majeure events</li>
                  </ul>
                </div>
              </div>

              {/* Severity Levels */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Incident Severity Levels</H2>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-400 pl-6 bg-red-900/20 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-1 text-red-800">Critical (P0)</h3>
                    <p className="text-red-800 text-sm">
                      Complete service outage. Users cannot scan or revoke. API returns 5xx for all requests.
                      Response: Within SLA response time. Status page updated within 15 minutes.
                    </p>
                  </div>

                  <div className="border-l-4 border-amber-400 pl-6 bg-paper-sub p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-1 text-amber-deep">High (P1)</h3>
                    <p className="text-amber-deep text-sm">
                      Major feature degradation. Monitoring alerts delayed, batch revoke unavailable, or specific chain scanning broken.
                      Response: Within 2x the critical response time.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6 bg-blue-900/20 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-1 text-blue-800">Medium (P2)</h3>
                    <p className="text-blue-800 text-sm">
                      Minor feature issues. Export delayed, dashboard slow, non-critical UI bugs.
                      Response: Within 4x the critical response time or next business day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compensation / Service Credits */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Service Credits</H2>
                <p className="text-ink-muted mb-4">
                  If we fail to meet the uptime target for your tier in a calendar month, you are eligible
                  for service credits applied to your next billing cycle.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-ink-muted border border-ink-rule">
                    <thead className="bg-paper-sub border border-ink-rule">
                      <tr>
                        <th className="text-left p-4 font-medium">Monthly Uptime</th>
                        <th className="text-left p-4 font-medium">Credit (% of monthly fee)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-ink-rule">
                        <td className="p-4">99.0% – below target</td>
                        <td className="p-4">10%</td>
                      </tr>
                      <tr className="border-t border-ink-rule bg-paper-sub border border-ink-rule/50">
                        <td className="p-4">95.0% – 99.0%</td>
                        <td className="p-4">25%</td>
                      </tr>
                      <tr className="border-t border-ink-rule">
                        <td className="p-4">Below 95.0%</td>
                        <td className="p-4">50%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-ink-muted text-sm space-y-2">
                  <p>
                    <strong>How to claim:</strong> Email <span className="text-amber-deep">support@allowanceguard.com</span> within
                    30 days of the affected month with your account details. Credits are verified against our monitoring data.
                  </p>
                  <p>
                    <strong>Limits:</strong> Maximum credit per month is 50% of your monthly fee. Credits are not refundable
                    as cash and do not carry over beyond one billing cycle.
                  </p>
                </div>
              </div>

              {/* Monitoring */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Monitoring &amp; Status</H2>
                <div className="bg-paper-sub border border-ink-rule p-6 text-ink-muted">
                  <p className="mb-3">
                    We monitor service health using automated systems. Real-time status is available on our{' '}
                    <a
                      href="https://allowanceguard.instatus.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-deep hover:underline font-medium"
                    >
                      public status page
                    </a>.
                    During incidents:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Sentinel and API Growth/Enterprise customers receive email notifications for P0/P1 incidents</li>
                    <li>• Status page is updated within 15 minutes of a confirmed P0 incident</li>
                    <li>• Post-incident reports are published for any downtime exceeding 30 minutes</li>
                    <li>• Scheduled maintenance is announced at least 48 hours in advance via email and status page</li>
                  </ul>
                  <p className="mt-4 text-sm">
                    Subscribe to updates at{' '}
                    <a
                      href="https://allowanceguard.instatus.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-deep hover:underline"
                    >
                      allowanceguard.instatus.com
                    </a>{' '}
                    to receive incident notifications via email.
                  </p>
                </div>
              </div>

              {/* Exclusions */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">SLA Exclusions</H2>
                <p className="text-ink-muted mb-4">
                  This SLA does not apply to:
                </p>
                <ul className="space-y-2 text-ink-muted text-sm">
                  <li>• Free tier or API Free tier (best-effort only)</li>
                  <li>• Pro tier (best-effort; no uptime guarantee or service credits)</li>
                  <li>• Features in beta or preview</li>
                  <li>• Accounts in violation of our <Link href="/terms" className="text-amber-deep hover:underline">Terms of Service</Link></li>
                  <li>• Accounts with overdue payments</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Support Contacts</H2>
                <div className="bg-paper-sub border border-ink-rule p-6">
                  <ul className="space-y-2 text-ink-muted text-sm">
                    <li>General support: <span className="text-amber-deep font-medium">support@allowanceguard.com</span></li>
                    <li>Urgent / P0 issues (Sentinel/Enterprise): <span className="text-amber-deep font-medium">urgent@allowanceguard.com</span></li>
                    <li>SLA credit claims: <span className="text-amber-deep font-medium">support@allowanceguard.com</span></li>
                  </ul>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center text-sm text-ink-muted border-t pt-8">
                <p>Last updated: April 2, 2026</p>
                <p className="mt-2">
                  This SLA is subject to change with 30 days&apos; notice to affected customers.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
