'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import Link from 'next/link'

export default function RefundPage() {
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
            Legal &middot; Refund Policy
          </span>
          <H1 className="mb-6 text-ink">Refund Policy</H1>
          <p className="text-lg text-ink-soft max-w-reading">
            Fourteen days, no questions asked, on every paid tier. After that the rules are written down here in plain English so nobody is guessing.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* Refund Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="max-w-none text-ink-soft">

              {/* 14-Day Guarantee */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">14-Day Money-Back Guarantee</H2>
                <div className="border-l-4 border-emerald-400 pl-6 bg-paper-sub p-4 rounded-r-lg">
                  <p className="text-emerald-800">
                    If you are not satisfied with any paid Allowance Guard subscription, you may request
                    a <strong>full refund within 14 days</strong> of your first payment on that tier. No questions asked.
                  </p>
                </div>
                <p className="text-ink-soft mt-4 text-sm">
                  This applies to your first subscription on any paid tier (Pro, Sentinel, API Developer, API Growth).
                  If you previously had a subscription, cancelled, and re-subscribed, the 14-day window applies
                  only to the first subscription.
                </p>
              </div>

              {/* By Plan Type */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Refunds by Plan Type</H2>
                <div className="space-y-6">

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Monthly Subscriptions (Pro, Sentinel)</h3>
                    <ul className="space-y-2 text-ink-soft text-sm">
                      <li>• <strong>Within 14 days of first payment:</strong> Full refund</li>
                      <li>• <strong>After 14 days:</strong> No refund for the current billing period</li>
                      <li>• Cancellation takes effect at end of billing period — you keep access until then</li>
                      <li>• No partial-month refunds after the 14-day window</li>
                    </ul>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Annual Subscriptions (Pro, Sentinel)</h3>
                    <ul className="space-y-2 text-ink-soft text-sm">
                      <li>• <strong>Within 14 days of first payment:</strong> Full refund</li>
                      <li>• <strong>Within 30 days:</strong> Pro-rated refund based on unused months</li>
                      <li>• <strong>After 30 days:</strong> No refund; cancellation takes effect at end of annual period</li>
                    </ul>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">B2B API Tiers (Developer, Growth, Enterprise)</h3>
                    <ul className="space-y-2 text-ink-soft text-sm">
                      <li>• <strong>Within 14 days of first payment:</strong> Full refund</li>
                      <li>• <strong>After 14 days:</strong> Pro-rated refund based on actual API usage during the billing period</li>
                      <li>• If usage exceeds 50% of your tier&apos;s daily limit on average, the refund is reduced proportionally</li>
                      <li>• Enterprise tier: Refund terms per individual contract</li>
                    </ul>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Free Trials</h3>
                    <ul className="space-y-2 text-ink-soft text-sm">
                      <li>• Cancel during the trial period at no charge</li>
                      <li>• If you forget to cancel and are charged, the 14-day guarantee still applies</li>
                    </ul>
                  </div>

                  <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-ink">Donations</h3>
                    <ul className="space-y-2 text-ink-soft text-sm">
                      <li>• Donations are non-refundable once processed</li>
                      <li>• Exception: technical errors (duplicate charges, incorrect amount) — contact us within 7 days</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Request */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">How to Request a Refund</H2>
                <div className="space-y-4 text-ink-soft">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-deep mb-2">1</div>
                      <h3 className="font-medium mb-2">Email Us</h3>
                      <p className="text-sm">
                        Send a refund request to{' '}
                        <span className="text-amber-deep">billing@allowanceguard.com</span>{' '}
                        with your account email.
                      </p>
                    </div>

                    <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-deep mb-2">2</div>
                      <h3 className="font-medium mb-2">We Review</h3>
                      <p className="text-sm">
                        We verify your eligibility and process the refund within 3-5 business days.
                      </p>
                    </div>

                    <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-deep mb-2">3</div>
                      <h3 className="font-medium mb-2">Refund Issued</h3>
                      <p className="text-sm">
                        Refund is returned to your original payment method via Stripe. May take 5-10 business days to appear.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exceptions */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Exceptions &amp; Special Cases</H2>
                <div className="text-ink-soft space-y-3 text-sm">
                  <p>
                    <strong>Service outages:</strong> If a service outage affected your tier and you are covered
                    by our <Link href="/sla" className="text-amber-deep hover:underline">SLA</Link>, you may be eligible
                    for service credits instead of a refund.
                  </p>
                  <p>
                    <strong>Billing errors:</strong> If you were charged incorrectly (wrong amount, double charge),
                    contact us immediately. We will correct the error regardless of the refund window.
                  </p>
                  <p>
                    <strong>Account termination by us:</strong> If we terminate your account for a Terms of Service violation,
                    no refund is provided for the remaining billing period.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4 text-ink">Contact</H2>
                <div className="bg-paper-sub border border-ink-rule p-6 rounded-lg">
                  <ul className="space-y-2 text-ink-soft text-sm">
                    <li>Refund requests: <span className="text-amber-deep font-medium">billing@allowanceguard.com</span></li>
                    <li>Billing questions: <span className="text-amber-deep font-medium">billing@allowanceguard.com</span></li>
                    <li>General support: <span className="text-amber-deep font-medium">support@allowanceguard.com</span></li>
                  </ul>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center text-sm text-ink-soft border-t border-ink-rule pt-8">
                <p>Last updated: April 2, 2026</p>
                <p className="mt-2">
                  This refund policy is part of our{' '}
                  <Link href="/terms" className="text-amber-deep hover:underline">Terms of Service</Link>.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
