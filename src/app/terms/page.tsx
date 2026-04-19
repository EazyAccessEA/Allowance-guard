import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Terms of Service — Ledger aesthetic, server component.
 *
 * Council:
 *  Design: SectionHeader, CascadingScrollAnimation, paper-card, grain, font-display-tight. No video.
 *  Copy #20: "Written in plain English wherever the law allows" — editorial voice, keep.
 *  Copy #21: GPL-3.0 reference fixed to AGPL-3.0. Section numbering normalised 01–16.
 *  Legal #9: Tier-specific terms, liability cap, arbitration clause all reviewed.
 *  Legal #23: AGPL-3.0 now correctly referenced. Acceptable use covers API resale.
 *  Legal #24: Data handling section cross-refs privacy policy. Effective date added.
 *  Noor: Semantic headings, AA contrast, accessible tables.
 */

export const metadata: Metadata = {
  title: 'Terms of Service — AllowanceGuard',
  description: 'Terms of Service for AllowanceGuard — the rules of the road, written plainly.',
}

export default function TermsPage() {
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
            number="&sect;"
            eyebrow="Legal &middot; Terms of Service"
            title="The rules of the road."
            lede="Written in plain English wherever the law allows, and in precise English wherever it does not. These terms apply to every tier: Free, Pro, Sentinel, and B2B API. Effective 2 April 2026."
          />
        </Container>
      </section>

      {/* ── Contents ── */}
      <section className="paper py-14 border-y border-ink-rule" aria-label="Table of contents">
        <Container>
          <div className="max-w-4xl">
            <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-6">
              Contents
            </h2>
            <ol className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
              {TOC.map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline gap-4 font-plex text-sm leading-relaxed"
                >
                  <span className="font-mono text-[11px] tabular-nums text-ink-whisper">
                    {item.num}
                  </span>
                  <a
                    href={`#${item.id}`}
                    className="text-ink hover:text-amber-deep transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── 01 Agreement ── */}
      <section id="sec-01" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="01"
                eyebrow="Agreement"
                title="Agreement to these terms."
              />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <p className="font-plex text-ink-soft text-[15px] leading-relaxed">
                  By accessing or using AllowanceGuard &mdash; the website, scanner, dashboard, browser extension, or B2B API &mdash; you agree to be bound by these Terms of Service and by every document they incorporate by reference (Privacy Policy, Cookie Policy, SLA, Refund Policy, and, where applicable, the Data Processing Agreement). If you do not agree, do not use the service. If you are using AllowanceGuard on behalf of an organisation, you represent that you have authority to bind that organisation to these terms.
                </p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 02 What AG Does ── */}
      <section id="sec-02" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="02"
                eyebrow="Service"
                title="What AllowanceGuard does."
              />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">
                  AllowanceGuard is a Web3 wallet security platform. The core scanner is free and open source. Premium services are available via paid subscriptions.
                </p>
                <ul className="space-y-2 font-plex text-ink-muted text-sm">
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" /><span>View and manage token approvals across 27 blockchain networks</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" /><span>Identify risky, unlimited, and Permit2 approvals</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" /><span>Revoke token approvals with one-click transactions</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" /><span><strong>Pro/Sentinel:</strong> Continuous monitoring, alerts, batch revocation, historical timeline, exports</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" /><span><strong>Sentinel:</strong> Team dashboards, automated rules, webhooks, compliance audit logs</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" /><span><strong>B2B API:</strong> Programmatic access to scanning, risk scoring, and allowance data</span></li>
                </ul>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 03 Service Tiers ── */}
      <section id="sec-03" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="03" eyebrow="Tiers" title="Service tiers." />
            </div>
            <div className="space-y-6">
              {TIERS.map((tier, i) => (
                <CascadingScrollAnimation key={tier.name} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8">
                    <h3 className="font-display-tight text-ink text-base mb-2">{tier.name}</h3>
                    <p className="font-plex text-ink-muted text-sm leading-relaxed">{tier.description}</p>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 04 Subscription & Billing ── */}
      <section id="sec-04" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="04" eyebrow="Billing" title="Subscription &amp; billing." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-4 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p><strong className="text-ink">Billing cycle:</strong> Subscriptions are billed monthly or annually. Billing begins at the end of any trial period or immediately if no trial applies.</p>
                <p><strong className="text-ink">Auto-renewal:</strong> All subscriptions automatically renew unless you cancel before the renewal date. You will be charged the then-current price.</p>
                <p><strong className="text-ink">Cancellation:</strong> Cancel at any time through your <Link href="/account" className="text-amber-deep hover:underline">account dashboard</Link> or via the Stripe Customer Portal. Cancellation takes effect at the end of the current billing period.</p>
                <p><strong className="text-ink">Free trials:</strong> Pro subscribers may receive a 7-day free trial. If you cancel during the trial, you will not be charged.</p>
                <p><strong className="text-ink">Price changes:</strong> We may adjust pricing with 30 days&rsquo; notice. Existing subscribers are grandfathered at their current rate until the end of their billing period.</p>
                <p><strong className="text-ink">Failed payments:</strong> If a payment fails, we will retry automatically via Stripe Smart Retries. If payment cannot be collected, your subscription may be downgraded to the free tier.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 05 Refund Policy ── */}
      <section id="sec-05" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="05" eyebrow="Refunds" title="Refund policy." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-3 font-plex text-ink-soft text-sm leading-relaxed">
                <p><strong className="text-ink">14-day money-back guarantee:</strong> If you are unsatisfied with your first subscription (any paid tier), request a full refund within 14 days of your first payment.</p>
                <p><strong className="text-ink">Annual plans:</strong> Pro-rated refund available if cancelled within 30 days of purchase.</p>
                <p><strong className="text-ink">Monthly plans:</strong> No refunds for partial billing periods after the 14-day window.</p>
                <p><strong className="text-ink">API tiers:</strong> Refunds are pro-rated based on usage within the billing period.</p>
                <p><strong className="text-ink">Process:</strong> Request via your account dashboard or by emailing <a href="mailto:billing@allowanceguard.com" className="text-amber-deep hover:underline">billing@allowanceguard.com</a>.</p>
                <p><strong className="text-ink">Donations:</strong> Non-refundable once processed, except for technical errors.</p>
                <p className="pt-2">Full details: <Link href="/refund" className="text-amber-deep hover:underline">Refund Policy</Link>.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 06 Disclaimers ── */}
      <section id="sec-06" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="06" eyebrow="Disclaimers" title="Important disclaimers." />
            </div>
            <div className="space-y-6">
              <CascadingScrollAnimation direction="up" distance={30} delay={0}>
                <div className="paper-card p-6 sm:p-8 border-l-2 border-amber-deep">
                  <h3 className="font-display-tight text-ink text-base mb-2">Not financial or legal advice</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    AllowanceGuard is a security monitoring tool. It is not a broker, dealer, investment adviser, custodian, lawyer, or accountant. Risk scores, labels, and alerts are informational signals, not recommendations. Every decision to approve, hold, or revoke a token permission is yours, and the consequences are yours alone.
                  </p>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={30} delay={80}>
                <div className="paper-card p-6 sm:p-8 border-l-2 border-crimson-paper">
                  <h3 className="font-display-tight text-ink text-base mb-2">Service provided &ldquo;as is&rdquo;</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    To the fullest extent permitted by law, the service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, completeness, or uninterrupted availability. We do not warrant that the scanner will detect every approval, that risk scores are correct, or that revocation transactions will succeed. Always verify critical security decisions on a block explorer.
                  </p>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={30} delay={160}>
                <div className="paper-card p-6 sm:p-8 border-l-2 border-ink-rule">
                  <h3 className="font-display-tight text-ink text-base mb-2">Blockchain &amp; wallet risks</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    Blockchain transactions are irreversible once confirmed. You are solely responsible for verifying every transaction your wallet signs, including the spender address, token contract, amount, and network. Gas fees, RPC availability, mempool congestion, and reorgs may affect whether a transaction succeeds. We do not control, and are not liable for, the behaviour of any blockchain network, node operator, wallet provider, or third-party contract.
                  </p>
                </div>
              </CascadingScrollAnimation>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 07 Data Handling ── */}
      <section id="sec-07" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="07" eyebrow="Data" title="Data handling." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-3 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p><strong className="text-ink">What we store:</strong> Account email, wallet addresses you scan or monitor, approval data retrieved from blockchains, monitoring preferences, team membership data, and usage metrics.</p>
                <p><strong className="text-ink">Payment data:</strong> All payment processing is handled by Stripe. We store only your Stripe customer ID and subscription status. We never see or store your card details.</p>
                <p><strong className="text-ink">Retention:</strong> Active account data is retained while your account exists. Audit logs: 90 days. Technical logs: 30 days. You may request full data export or deletion at any time.</p>
                <p>Complete details: <Link href="/privacy" className="text-amber-deep hover:underline">Privacy Policy</Link>.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 08 Your Responsibilities ── */}
      <section id="sec-08" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="08" eyebrow="Responsibilities" title="Your responsibilities." />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {RESPONSIBILITIES.map((r, i) => (
                <CascadingScrollAnimation key={r.title} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8 h-full">
                    <h3 className="font-display-tight text-ink text-base mb-2">{r.title}</h3>
                    <p className="font-plex text-ink-muted text-sm leading-relaxed">{r.text}</p>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 09 Acceptable Use ── */}
      <section id="sec-09" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="09" eyebrow="Acceptable use" title="What you agree not to do." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <ul className="space-y-3 font-plex text-ink-muted text-sm leading-relaxed">
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Use the service for illegal activities or to facilitate fraud</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Attempt to bypass rate limits, feature gates, or authentication</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Share API keys or allow unauthorised third-party access to your account</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Scrape or harvest data for competitive intelligence without written permission</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Resell API data or build competing products using our API without a commercial licence</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Interfere with the operation of the service or overload our infrastructure</span></li>
                  <li className="flex items-start gap-3"><span className="h-px w-4 bg-ink-rule mt-3 shrink-0" aria-hidden="true" /><span>Reverse-engineer proprietary components (open-source components are governed by AGPL-3.0)</span></li>
                </ul>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 10 Termination ── */}
      <section id="sec-10" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="10" eyebrow="Termination" title="Ending your use." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-3 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p><strong className="text-ink">By you:</strong> Cancel your subscription and close your account at any time. Contact <a href="mailto:legal.support@allowanceguard.com" className="text-amber-deep hover:underline">legal.support@allowanceguard.com</a> or use the account dashboard.</p>
                <p><strong className="text-ink">By us:</strong> We may suspend or terminate your account if you violate these terms, engage in abusive behaviour, fail to pay after reasonable notice, or if required by law. We will provide 7 days&rsquo; notice where possible, except in cases of severe abuse.</p>
                <p><strong className="text-ink">Effect:</strong> Upon termination, access to paid features is immediately revoked. You may request a data export before account closure. Active subscriptions will be cancelled in Stripe.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 11 Service Availability ── */}
      <section id="sec-11" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="11" eyebrow="Availability" title="Service availability." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-3 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p>Service availability varies by tier. Free and Pro tiers are provided on a best-effort basis. Sentinel tier has a 99.5% uptime target. B2B API Growth+ has a 99.9% uptime target.</p>
                <p>We cannot guarantee continuous uptime, accuracy of blockchain data (which depends on RPC providers), success of all transactions, or compatibility with all wallets or browsers. See our <Link href="/sla" className="text-amber-deep hover:underline">SLA page</Link> for tier-specific details.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 12 Changes ── */}
      <section id="sec-12" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="12" eyebrow="Changes" title="Changes to these terms." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p>We may update these terms occasionally. Significant changes will be announced on our website and via email to registered users with at least 30 days&rsquo; notice. Continued use after changes take effect constitutes acceptance of the new terms. If you disagree, you may cancel your subscription before the changes take effect.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 13 Limitation of Liability ── */}
      <section id="sec-13" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="13" eyebrow="Liability" title="Limitation of liability." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 border-l-2 border-crimson-paper">
                <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-crimson-paper mb-4">Please read carefully.</p>
                <div className="space-y-3 font-plex text-ink-muted text-sm leading-relaxed">
                  <p>To the maximum extent permitted by applicable law, in no event shall AllowanceGuard, its operators, contributors, affiliates, or licensors be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of funds, tokens, profits, revenue, goodwill, data, or business opportunities, whether in contract, tort (including negligence), strict liability, or any other legal theory.</p>
                  <p>Our total aggregate liability for any and all claims arising out of or relating to these terms or the service shall not exceed the greater of (a) the fees you paid us in the twelve (12) months immediately preceding the event giving rise to the claim, or (b) one hundred US dollars (US$100). This cap applies in aggregate across all claims and all tiers, including free users.</p>
                  <p>Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited, including liability for fraud, fraudulent misrepresentation, death or personal injury caused by our negligence, or any statutory rights that cannot be waived under the law of your jurisdiction.</p>
                </div>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 14 Indemnity ── */}
      <section id="sec-14" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="14" eyebrow="Indemnity" title="Indemnity." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p>You agree to indemnify and hold harmless AllowanceGuard and its operators and contributors from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with (a) your use of the service, (b) your violation of these terms, (c) your violation of any third-party right, or (d) any transaction you sign or authorise from a wallet connected to the service.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 15 Governing Law ── */}
      <section id="sec-15" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="15" eyebrow="Governing law" title="Governing law &amp; disputes." />
            </div>
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-3 font-plex text-ink-soft text-[15px] leading-relaxed">
                <p>These terms are governed by the laws of England and Wales, without regard to conflict-of-laws principles. Before bringing any formal claim, you agree to first contact us at <a href="mailto:legal.support@allowanceguard.com" className="text-amber-deep hover:underline">legal.support@allowanceguard.com</a> and attempt to resolve the dispute in good faith for at least thirty (30) days.</p>
                <p>If the dispute cannot be resolved through negotiation, it shall be submitted to binding arbitration seated in London, United Kingdom, conducted in English under the rules of the London Court of International Arbitration (LCIA) by a single arbitrator. Judgment on the award may be entered in any court of competent jurisdiction. Nothing in this section prevents either party from seeking injunctive relief to protect intellectual property or confidential information.</p>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── 16 Contact + Related ── */}
      <section id="sec-16" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader number="16" eyebrow="Contact" title="Questions about these terms?" />
            </div>
            <div className="space-y-6">
              <CascadingScrollAnimation direction="up" distance={40} delay={0}>
                <div className="paper-card p-8 sm:p-10">
                  <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">
                    If you have questions or need clarification:
                  </p>
                  <ul className="space-y-2 font-plex text-sm text-ink-muted">
                    <li>General &amp; Legal: <a href="mailto:legal.support@allowanceguard.com" className="text-amber-deep hover:underline">legal.support@allowanceguard.com</a></li>
                    <li>Billing: <a href="mailto:billing@allowanceguard.com" className="text-amber-deep hover:underline">billing@allowanceguard.com</a></li>
                  </ul>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={40} delay={100}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy" className="paper-button text-sm">Privacy Policy</Link>
                  <Link href="/sla" className="paper-button text-sm">Service Level Agreement</Link>
                  <Link href="/refund" className="paper-button text-sm">Refund Policy</Link>
                  <Link href="/cookies" className="paper-button text-sm">Cookie Policy</Link>
                  <Link href="/dpa" className="paper-button text-sm">Data Processing Agreement</Link>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={40} delay={200}>
                <p className="font-plex text-xs text-ink-whisper text-center pt-8 border-t border-ink-rule">
                  Last updated: April 13, 2026. These terms are governed by applicable law and are subject to change with 30 days&rsquo; notice.
                </p>
              </CascadingScrollAnimation>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */

const TOC = [
  { num: '01', id: 'sec-01', title: 'Agreement to these terms' },
  { num: '02', id: 'sec-02', title: 'What AllowanceGuard does' },
  { num: '03', id: 'sec-03', title: 'Service tiers' },
  { num: '04', id: 'sec-04', title: 'Subscription & billing' },
  { num: '05', id: 'sec-05', title: 'Refund policy' },
  { num: '06', id: 'sec-06', title: 'Important disclaimers' },
  { num: '07', id: 'sec-07', title: 'Data handling' },
  { num: '08', id: 'sec-08', title: 'Your responsibilities' },
  { num: '09', id: 'sec-09', title: 'What you agree not to do' },
  { num: '10', id: 'sec-10', title: 'Ending your use' },
  { num: '11', id: 'sec-11', title: 'Service availability' },
  { num: '12', id: 'sec-12', title: 'Changes to these terms' },
  { num: '13', id: 'sec-13', title: 'Limitation of liability' },
  { num: '14', id: 'sec-14', title: 'Indemnity' },
  { num: '15', id: 'sec-15', title: 'Governing law & disputes' },
  { num: '16', id: 'sec-16', title: 'Questions about these terms' },
]

const TIERS = [
  {
    name: 'Free Tier',
    description: 'Core scanning and revocation for up to 3 wallets on a single chain. No account required for basic scans. Provided on a best-effort basis with no uptime guarantee.',
  },
  {
    name: 'Pro ($9.99/month or $79/year)',
    description: 'Unlimited wallets, multi-chain portfolio view, continuous monitoring with alerts, batch revocation, historical risk timeline, and export capabilities (PDF/CSV). Service availability: best effort.',
  },
  {
    name: 'Sentinel ($49.99/month or $499/year)',
    description: 'Everything in Pro plus: monitoring up to 50 wallets, automated revocation rules, team dashboard with role-based access, compliance-ready audit logs, webhook integrations, and priority support. 99.5% uptime target, 4-hour response for critical issues.',
  },
  {
    name: 'B2B API',
    description: 'Free (100 calls/day), Developer ($39/month, 10,000 calls/day), Growth ($149/month, 100,000 calls/day), and Enterprise (custom pricing with SLA). API keys must not be shared. Usage is subject to rate limits per tier.',
  },
]

const RESPONSIBILITIES = [
  { title: 'Wallet security', text: 'You are responsible for keeping your wallet secure. Never share your private keys or seed phrases with anyone, including us.' },
  { title: 'Transaction verification', text: 'Always review transaction details before confirming. Verify token addresses, amounts, and gas fees.' },
  { title: 'Compliance', text: 'Ensure your use of AllowanceGuard complies with applicable laws and regulations in your jurisdiction.' },
  { title: 'Account & API key security', text: 'Keep your account credentials and API keys secure. You are responsible for all activity under your account. Report unauthorised access immediately.' },
]
