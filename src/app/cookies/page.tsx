import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Cookie Policy — Ledger aesthetic, server component.
 *
 * Council:
 *  Design (Kael): paper-card, grain, font-display-tight, no rounded corners.
 *  Design (Maren): radial gradient hero, alternating paper/paper-sub rhythm.
 *  Copy #20 Brand: Editorial voice — "Two cookies. Both essential. No trackers."
 *  Copy #21 Technical: Claims match implementation — only ag_sess + ag_csrf are set
 *    (verified in src/lib/auth.ts and src/middleware/csrf.ts). ag_csrf is NOT
 *    HttpOnly because client JS reads it to send the x-csrf-token header.
 *  Legal #24 (veto): No fabricated cookie types. No "Wallet Preferences" /
 *    "Display Settings" cookies — they don't exist. Wallet providers do NOT
 *    set first-party cookies on our domain.
 *  Noor: AA contrast, semantic <section>, accessible code semantics.
 */

export const metadata: Metadata = {
  title: 'Cookie Policy — AllowanceGuard',
  description: 'Two essential cookies. No third-party trackers. No advertising pixels. The full account.',
}

export default function CookiesPage() {
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
            eyebrow="Legal · Cookie Policy"
            title="Two cookies. Both essential."
            lede="No advertising pixels. No third-party trackers. No analytics cookies. What we set, why we set it, and how long it lives — in plain language."
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

      {/* ── At a glance ── */}
      <section id="sec-glance" className="paper-sub grain py-16 sm:py-20 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10">
                <h2 className="font-display-tight text-ink text-xl mb-4">At a glance</h2>
                <ul className="space-y-3 font-plex text-ink-soft text-[15px] leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span>We set <strong>two</strong> first-party cookies — both required for the service to function.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span>We do <strong>not</strong> set any analytics, advertising, or tracking cookies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span>Analytics, when enabled, runs <strong>server-side</strong> in our own database — not via cookies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span>No third party sets cookies on the AllowanceGuard domain.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span>Both cookies are <strong>Secure</strong> in production. The session cookie is also <strong>HttpOnly</strong>; the CSRF cookie has to be JS-readable so the page can echo the token in a header.</span>
                  </li>
                </ul>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── The two cookies ── */}
      <section id="sec-01" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="01"
                eyebrow="Essential cookies"
                title="What we set."
                lede="Two first-party cookies. One server-only for sign-in. One readable by your browser for CSRF protection."
              />
            </div>

            <div className="space-y-6">
              {COOKIES.map((cookie, i) => (
                <CascadingScrollAnimation key={cookie.name} direction="up" distance={30} delay={i * 80}>
                  <div className="paper-card p-6 sm:p-8">
                    <div className="flex flex-wrap items-baseline gap-3 mb-4">
                      <code className="font-mono text-sm bg-paper-sub border border-ink-rule px-2.5 py-1 text-ink">{cookie.name}</code>
                      <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">{cookie.purpose}</span>
                    </div>
                    <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">{cookie.description}</p>
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-ink-rule">
                      {cookie.attrs.map(({ label, value }) => (
                        <div key={label}>
                          <dt className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-1">{label}</dt>
                          <dd className="font-plex text-sm text-ink-muted">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Server-side analytics ── */}
      <section id="sec-02" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="02"
                eyebrow="Analytics"
                title="Why there are no analytics cookies."
                lede="Most products track you with cookies. We don&rsquo;t."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-8 sm:p-10 space-y-5">
                <p className="font-plex text-ink-soft text-[15px] leading-relaxed">
                  The &ldquo;Analytics&rdquo; toggle in our cookie banner does <strong>not</strong> control any cookie.
                  It controls whether anonymous usage events (e.g. <em>scan started</em>, <em>wallet connected</em>) are
                  written to our own PostgreSQL database.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span className="font-plex text-ink-soft text-[15px] leading-relaxed">
                      <strong>Consent-gated.</strong> Choose &ldquo;Essential only&rdquo; and zero analytics events are recorded — anywhere.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span className="font-plex text-ink-soft text-[15px] leading-relaxed">
                      <strong>Server-side only.</strong> Events are stored in our database. Nothing is written to your browser.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span className="font-plex text-ink-soft text-[15px] leading-relaxed">
                      <strong>No third parties.</strong> No Google Analytics, Mixpanel, Segment, PostHog, or any external analytics tool.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-px w-4 bg-amber-deep mt-3 shrink-0" aria-hidden="true" />
                    <span className="font-plex text-ink-soft text-[15px] leading-relaxed">
                      <strong>Error tracking.</strong> Rollbar may receive anonymised exception data for debugging. No personal identifiers, no cookies on this domain.
                    </span>
                  </li>
                </ul>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Local storage ── */}
      <section id="sec-03" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="03"
                eyebrow="Local storage"
                title="What we keep in your browser (not a cookie)."
                lede="Strictly speaking these aren&rsquo;t cookies, but you should know they exist."
              />
            </div>

            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="paper-card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-paper-sub border-b border-ink-rule">
                      <th className="text-left p-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Key</th>
                      <th className="text-left p-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Purpose</th>
                      <th className="text-left p-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">Lifetime</th>
                    </tr>
                  </thead>
                  <tbody className="font-plex text-ink-soft">
                    {LOCAL_STORAGE.map((row, i) => (
                      <tr key={i} className="border-b border-ink-rule last:border-b-0">
                        <td className="p-4"><code className="font-mono text-xs bg-paper-sub border border-ink-rule px-2 py-0.5">{row.key}</code></td>
                        <td className="p-4 text-ink-muted">{row.purpose}</td>
                        <td className="p-4 text-ink-muted">{row.lifetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── Managing preferences ── */}
      <section id="sec-04" className="paper-sub grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="04"
                eyebrow="Your control"
                title="How to manage cookies."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CascadingScrollAnimation direction="up" distance={30} delay={0}>
                <div className="paper-card p-6 sm:p-8 h-full">
                  <h3 className="font-display-tight text-ink text-base mb-2">Withdraw analytics consent</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    Clear your browser&rsquo;s site data for <span className="text-amber-deep">allowanceguard.com</span> to reset the consent banner.
                    On your next visit, choose &ldquo;Essential only.&rdquo;
                  </p>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={30} delay={80}>
                <div className="paper-card p-6 sm:p-8 h-full">
                  <h3 className="font-display-tight text-ink text-base mb-2">Block all cookies</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    Use your browser&rsquo;s site-data settings to block cookies for our domain. Sign-in and CSRF protection will stop working,
                    so you won&rsquo;t be able to use authenticated features.
                  </p>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={30} delay={160}>
                <div className="paper-card p-6 sm:p-8 h-full">
                  <h3 className="font-display-tight text-ink text-base mb-2">Sign out</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    Signing out clears <code className="font-mono text-xs">ag_sess</code> immediately. <code className="font-mono text-xs">ag_csrf</code> persists for up to 30 days and is harmless on its own — clear browser data to remove it.
                  </p>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={30} delay={240}>
                <div className="paper-card p-6 sm:p-8 h-full border-l-2 border-amber-deep">
                  <h3 className="font-display-tight text-ink text-base mb-2">Heads up</h3>
                  <p className="font-plex text-ink-muted text-sm leading-relaxed">
                    Disabling essential cookies will break sign-in, account access, and any feature that requires authentication. Read-only public pages still work.
                  </p>
                </div>
              </CascadingScrollAnimation>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Updates + related ── */}
      <section id="sec-05" className="paper grain py-20 sm:py-28 scroll-mt-24">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-16">
              <SectionHeader
                number="05"
                eyebrow="Maintenance"
                title="When this changes."
              />
            </div>

            <div className="space-y-6">
              <CascadingScrollAnimation direction="up" distance={40} delay={0}>
                <div className="paper-card p-8 sm:p-10">
                  <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-4">
                    If we ever introduce a new cookie, change a cookie&rsquo;s purpose, or add a third-party tracker, this page is updated
                    before the change ships. Material changes are also reflected in our{' '}
                    <Link href="/privacy" className="text-amber-deep hover:underline">Privacy Policy</Link>.
                  </p>
                  <p className="font-plex text-ink-muted text-sm">
                    Questions: <span className="text-amber-deep">legal.support@allowanceguard.com</span>
                  </p>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={40} delay={100}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy" className="paper-button text-sm">Privacy Policy</Link>
                  <Link href="/terms" className="paper-button text-sm">Terms of Service</Link>
                  <Link href="/dpa" className="paper-button text-sm">Data Processing Agreement</Link>
                </div>
              </CascadingScrollAnimation>

              <CascadingScrollAnimation direction="up" distance={40} delay={200}>
                <p className="font-plex text-xs text-ink-whisper text-center pt-8 border-t border-ink-rule">
                  Last updated: April 19, 2026.
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
 * Data — kept inline. Single source of truth lives in the code:
 *   src/lib/auth.ts         (ag_sess)
 *   src/lib/csrf.ts         (ag_csrf)
 * Update both code and copy together.
 * ═══════════════════════════════════════════════════════════════════════ */

const TOC = [
  { num: '§', id: 'sec-glance', title: 'At a glance' },
  { num: '01', id: 'sec-01', title: 'What we set (essential cookies)' },
  { num: '02', id: 'sec-02', title: 'Why there are no analytics cookies' },
  { num: '03', id: 'sec-03', title: 'What we keep in your browser (local storage)' },
  { num: '04', id: 'sec-04', title: 'How to manage cookies' },
  { num: '05', id: 'sec-05', title: 'When this changes' },
]

const COOKIES = [
  {
    name: 'ag_sess',
    purpose: 'Session authentication',
    description:
      'Identifies you to the server after sign-in so you don&rsquo;t have to re-authenticate on every request. ' +
      'Issued when you sign in — either with your wallet (SIWE) or with an email one-time code (OTP) — and cleared when you sign out.',
    attrs: [
      { label: 'Type', value: 'First-party, essential' },
      { label: 'Lifetime', value: 'Up to 30 days' },
      { label: 'Flags', value: 'HttpOnly · Secure · SameSite=Lax' },
    ],
  },
  {
    name: 'ag_csrf',
    purpose: 'CSRF protection',
    description:
      'A double-submit token that prevents cross-site request forgery on authenticated mutations. ' +
      'Browser JavaScript reads this cookie to echo the value in an x-csrf-token header, which the server ' +
      'then matches against the cookie value. This is why it is not HttpOnly.',
    attrs: [
      { label: 'Type', value: 'First-party, essential' },
      { label: 'Lifetime', value: 'Up to 30 days' },
      { label: 'Flags', value: 'Secure · SameSite=Lax · readable by JS' },
    ],
  },
]

const LOCAL_STORAGE = [
  {
    key: 'allowance-guard-cookie-consent',
    purpose: 'Remembers your cookie-banner choice (Essential only, or All).',
    lifetime: 'Until you clear browser storage',
  },
  {
    key: 'ag.userEmail / ag.preferences',
    purpose: 'Saved preferences entered on the /preferences page (notification email, alert toggles).',
    lifetime: 'Until you clear browser storage',
  },
  {
    key: 'wagmi.* / wc@2:*',
    purpose: 'Wallet connection state managed by Wagmi and WalletConnect. Lets the page remember which wallet you connected.',
    lifetime: 'Until you disconnect or clear storage',
  },
]
