'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import Link from 'next/link'

export default function DPAPage() {
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
            Legal &middot; GDPR Article 28
          </span>
          <H1 className="mb-6 text-ink">Data Processing Agreement</H1>
          <p className="text-lg text-ink-soft max-w-reading">
            The standard DPA for Sentinel and Enterprise customers who process personal data through AllowanceGuard. Plain language where the law allows it; precise language where it doesn&rsquo;t.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* DPA Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="max-w-none text-ink-soft">

              {/* Availability Notice */}
              <div className="mb-12">
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-blue-800">Who Needs a DPA?</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    A Data Processing Agreement is available for <strong>Sentinel tier</strong> and{' '}
                    <strong>Enterprise API</strong> customers who process personal data (e.g., monitoring
                    wallets on behalf of third parties, compliance reporting for organizations).
                  </p>
                  <p className="text-blue-700 text-sm">
                    If you are using Allowance Guard for your own wallets only, a DPA is typically not required.
                    Contact us if you are unsure.
                  </p>
                </div>
              </div>

              {/* Parties */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">1. Parties</H2>
                <div className="text-stone space-y-3">
                  <p>
                    This Data Processing Agreement (&quot;DPA&quot;) is entered into between:
                  </p>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Data Controller</strong> (&quot;Customer&quot;): The entity subscribing to Allowance Guard Sentinel or Enterprise tier</li>
                    <li>• <strong>Data Processor</strong> (&quot;Allowance Guard&quot;): The Allowance Guard platform and its operators</li>
                  </ul>
                  <p className="text-sm">
                    This DPA supplements and forms part of the{' '}
                    <Link href="/terms" className="text-cobalt hover:underline">Terms of Service</Link>.
                  </p>
                </div>
              </div>

              {/* Definitions */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">2. Definitions</H2>
                <div className="text-stone text-sm space-y-3">
                  <p><strong>&quot;Personal Data&quot;</strong> means any information relating to an identified or identifiable natural person, as defined by GDPR Article 4(1).</p>
                  <p><strong>&quot;Processing&quot;</strong> means any operation performed on personal data, including collection, storage, retrieval, consultation, use, disclosure, erasure, or destruction.</p>
                  <p><strong>&quot;Data Subject&quot;</strong> means the identified or identifiable person to whom the personal data relates.</p>
                  <p><strong>&quot;Sub-processor&quot;</strong> means a third party engaged by the Processor to process personal data on behalf of the Controller.</p>
                </div>
              </div>

              {/* Scope of Processing */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">3. Scope of Processing</H2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-stone border border-line rounded-lg">
                    <tbody>
                      <tr className="border-b border-line">
                        <td className="p-3 font-medium bg-paper-sub w-1/3">Subject matter</td>
                        <td className="p-3">Provision of wallet security monitoring and token approval management services</td>
                      </tr>
                      <tr className="border-b border-line">
                        <td className="p-3 font-medium bg-paper-sub">Duration</td>
                        <td className="p-3">For the term of the Customer&apos;s subscription, plus data retention periods specified in the Privacy Policy</td>
                      </tr>
                      <tr className="border-b border-line">
                        <td className="p-3 font-medium bg-paper-sub">Nature &amp; purpose</td>
                        <td className="p-3">Scanning blockchain networks for token approvals, calculating risk scores, sending alerts, generating compliance reports</td>
                      </tr>
                      <tr className="border-b border-line">
                        <td className="p-3 font-medium bg-paper-sub">Categories of data</td>
                        <td className="p-3">Wallet addresses (public blockchain data), email addresses, team member names, monitoring preferences, approval/risk data</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium bg-paper-sub">Categories of data subjects</td>
                        <td className="p-3">Customer&apos;s team members, wallet owners monitored by the Customer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Processor Obligations */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">4. Processor Obligations</H2>
                <div className="text-stone text-sm space-y-3">
                  <p>Allowance Guard shall:</p>
                  <ul className="space-y-2 ml-4">
                    <li>a) Process personal data only on documented instructions from the Customer, including transfers to third countries</li>
                    <li>b) Ensure that persons authorized to process personal data have committed to confidentiality</li>
                    <li>c) Implement appropriate technical and organizational security measures (see Section 5)</li>
                    <li>d) Engage sub-processors only with prior written consent and under a written contract imposing equivalent obligations</li>
                    <li>e) Assist the Customer in responding to data subject requests (access, rectification, erasure, portability)</li>
                    <li>f) Assist with Data Protection Impact Assessments where required</li>
                    <li>g) Delete or return all personal data upon termination at the Customer&apos;s choice, unless retention is required by law</li>
                    <li>h) Make available all information necessary to demonstrate compliance with GDPR Article 28</li>
                    <li>i) Notify the Customer without undue delay (and within 72 hours) upon becoming aware of a personal data breach</li>
                  </ul>
                </div>
              </div>

              {/* Security Measures */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">5. Technical &amp; Organizational Measures</H2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-paper-sub p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm">Encryption</h3>
                    <p className="text-stone text-xs">Data encrypted at rest (AES-256) and in transit (TLS 1.2+). API keys hashed before storage.</p>
                  </div>
                  <div className="bg-paper-sub p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm">Access Control</h3>
                    <p className="text-stone text-xs">Role-based access, session-based authentication, CSRF protection, rate limiting on all endpoints.</p>
                  </div>
                  <div className="bg-paper-sub p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm">Audit Logging</h3>
                    <p className="text-stone text-xs">All data access and modifications logged with actor, timestamp, and action. Logs retained for 90 days.</p>
                  </div>
                  <div className="bg-paper-sub p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm">Infrastructure</h3>
                    <p className="text-stone text-xs">Hosted on Vercel (SOC 2). Database on Neon (encrypted, isolated). Redis on Upstash (encrypted).</p>
                  </div>
                  <div className="bg-paper-sub p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm">Incident Response</h3>
                    <p className="text-stone text-xs">Automated error monitoring (Rollbar). Breach notification within 72 hours per GDPR Article 33.</p>
                  </div>
                  <div className="bg-paper-sub p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-sm">Data Minimization</h3>
                    <p className="text-stone text-xs">Only data necessary for service delivery is collected. Automated cleanup of expired data.</p>
                  </div>
                </div>
              </div>

              {/* Sub-processors */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">6. Sub-processors</H2>
                <p className="text-stone text-sm mb-4">
                  The Customer consents to the use of the following sub-processors. Allowance Guard will
                  notify the Customer at least 30 days before adding or replacing a sub-processor.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-stone border border-line rounded-lg">
                    <thead className="bg-paper-sub">
                      <tr>
                        <th className="text-left p-3 font-medium">Sub-processor</th>
                        <th className="text-left p-3 font-medium">Purpose</th>
                        <th className="text-left p-3 font-medium">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-line">
                        <td className="p-3">Vercel Inc.</td>
                        <td className="p-3">Application hosting &amp; CDN</td>
                        <td className="p-3">US / Global Edge</td>
                      </tr>
                      <tr className="border-t border-line">
                        <td className="p-3">Neon Inc.</td>
                        <td className="p-3">PostgreSQL database hosting</td>
                        <td className="p-3">US / EU</td>
                      </tr>
                      <tr className="border-t border-line">
                        <td className="p-3">Upstash Inc.</td>
                        <td className="p-3">Redis caching &amp; rate limiting</td>
                        <td className="p-3">US / EU</td>
                      </tr>
                      <tr className="border-t border-line">
                        <td className="p-3">Stripe Inc.</td>
                        <td className="p-3">Payment processing</td>
                        <td className="p-3">US / EU</td>
                      </tr>
                      <tr className="border-t border-line">
                        <td className="p-3">Postmark (ActiveCampaign)</td>
                        <td className="p-3">Email delivery</td>
                        <td className="p-3">US</td>
                      </tr>
                      <tr className="border-t border-line">
                        <td className="p-3">Rollbar Inc.</td>
                        <td className="p-3">Error monitoring (anonymized)</td>
                        <td className="p-3">US</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* International Transfers */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">7. International Data Transfers</H2>
                <p className="text-stone text-sm">
                  Where personal data is transferred outside the EEA, Allowance Guard relies on
                  Standard Contractual Clauses (SCCs) as adopted by the European Commission, or
                  other valid transfer mechanisms under GDPR Chapter V. Copies of applicable SCCs
                  are available upon request.
                </p>
              </div>

              {/* Data Subject Rights */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">8. Data Subject Rights</H2>
                <p className="text-stone text-sm mb-3">
                  Allowance Guard provides the following tools to help Customers fulfill data subject requests:
                </p>
                <ul className="space-y-2 text-stone text-sm ml-4">
                  <li>• <strong>Access &amp; Portability:</strong> <code className="text-xs bg-paper-sub px-1 py-0.5 rounded">GET /api/user/export</code> — full data export in JSON format</li>
                  <li>• <strong>Erasure:</strong> <code className="text-xs bg-paper-sub px-1 py-0.5 rounded">DELETE /api/user/delete</code> — complete account and data deletion</li>
                  <li>• <strong>Rectification:</strong> Account settings page for profile updates</li>
                  <li>• <strong>Restriction:</strong> Wallet monitoring can be paused per-wallet</li>
                </ul>
              </div>

              {/* Term and Termination */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">9. Term &amp; Termination</H2>
                <div className="text-stone text-sm space-y-3">
                  <p>
                    This DPA is effective for the duration of the Customer&apos;s subscription. Upon
                    termination, Allowance Guard will delete all Customer personal data within 30 days,
                    unless retention is required by law. The Customer may request a data export before
                    termination.
                  </p>
                  <p>
                    Provisions related to confidentiality, liability, and data protection survive termination.
                  </p>
                </div>
              </div>

              {/* How to Execute */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Request a Signed DPA</H2>
                <div className="bg-paper-sub p-6 rounded-lg">
                  <p className="text-stone mb-4">
                    To execute this DPA for your organization, contact us with your company details:
                  </p>
                  <ul className="space-y-2 text-stone text-sm">
                    <li>Email: <span className="text-cobalt font-medium">legal.support@allowanceguard.com</span></li>
                    <li>Subject: &quot;DPA Request — [Company Name]&quot;</li>
                    <li>Include: Company name, registered address, Allowance Guard account email, subscription tier</li>
                  </ul>
                  <p className="text-stone text-sm mt-4">
                    We aim to process DPA requests within 5 business days.
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center text-sm text-stone border-t pt-8">
                <p>Last updated: April 2, 2026</p>
                <p className="mt-2">
                  This DPA template is part of our{' '}
                  <Link href="/terms" className="text-cobalt hover:underline">Terms of Service</Link>{' '}
                  and <Link href="/privacy" className="text-cobalt hover:underline">Privacy Policy</Link>.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
