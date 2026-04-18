'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import {
 Mail,
 Shield,
 MessageCircle,
 Github,
 Lock,
 ArrowRight,
 CheckCircle2,
 AlertCircle,
} from 'lucide-react'

type Topic = 'support' | 'security' | 'partnerships' | 'enterprise' | 'press' | 'funding' | 'other'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const TOPICS: { value: Topic; label: string; hint: string }[] = [
 { value: 'support', label: 'Product support', hint: 'Bug, billing, or how-to' },
 { value: 'security', label: 'Security disclosure', hint: 'Encrypted via PGP' },
 { value: 'partnerships', label: 'Partnerships', hint: 'Integrations &amp; co-marketing' },
 { value: 'enterprise', label: 'API Enterprise', hint: 'Custom limits, SLA, dedicated support' },
 { value: 'press', label: 'Press', hint: 'Interviews &amp; quotes' },
 { value: 'funding', label: 'Funding &amp; grants', hint: 'VC, foundations, ecosystem grants' },
 { value: 'other', label: 'Something else', hint: 'When in doubt' },
]

const VALID_TOPICS = new Set(TOPICS.map((t) => t.value))

function isTopic(value: string | null): value is Topic {
 return value !== null && VALID_TOPICS.has(value as Topic)
}

export default function ContactPage() {
 const searchParams = useSearchParams()
 const [status, setStatus] = useState<Status>('idle')
 const [error, setError] = useState<string | null>(null)
 const [form, setForm] = useState({
 name: '',
 email: '',
 topic: 'support' as Topic,
 wallet: '',
 message: '',
 company: '', // honeypot
 })

 // Preselect topic from ?topic=... so the pricing page's Enterprise CTA
 // and any future deep links land on the right category without the
 // user having to re-click.
 useEffect(() => {
 const queryTopic = searchParams?.get('topic')
 if (isTopic(queryTopic)) {
 setForm((prev) => (prev.topic === queryTopic ? prev : { ...prev, topic: queryTopic }))
 }
 }, [searchParams])

 const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
 setForm((prev) => ({ ...prev, [key]: value }))
 }

 const onSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setStatus('submitting')
 setError(null)
 try {
 const res = await fetch('/api/contact', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(form),
 })
 const data = await res.json().catch(() => ({}))
 if (!res.ok) {
 setStatus('error')
 setError(data?.error ?? 'Something went wrong. Please try again.')
 return
 }
 setStatus('success')
 setForm({ name: '', email: '', topic: 'support', wallet: '', message: '', company: '' })
 } catch {
 setStatus('error')
 setError('Network error. Please try again or email support@allowanceguard.com directly.')
 }
 }

 return (
 <div className="min-h-screen bg-paper text-ink">
 {/* ============ HERO ============ */}
 <Section className="relative py-24 sm:py-32 overflow-hidden">
 

 <Container className="relative text-left max-w-4xl z-20">
 <span className="inline-block mb-4 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep">
 Contact
 </span>
 <H1 className="mb-6 text-ink">Talk to a human.</H1>
 <p className="text-lg text-ink-soft max-w-2xl">
 Bug reports, security disclosures, partnerships, press, funding &mdash; all of it lands in front of someone who can actually help. Choose a topic, write what you need, and we&rsquo;ll be back inside one business day. Critical security reports inside two hours.
 </p>
 </Container>
 </Section>

 <div className="border-t border-ink-rule" />

 {/* ============ FORM + CHANNELS ============ */}
 <Section className="py-20 sm:py-24">
 <Container>
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
 {/* ---------- Form ---------- */}
 <div className="lg:col-span-7">
 <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">
 Send a message
 </h2>
 <p className="text-sm text-ink-muted mb-8">
 Routed automatically to the right inbox. We never share your details with third parties.
 </p>

 {status === 'success' ? (
 <div className="border border-semantic-success-600/40 bg-paper-sub p-8">
 <div className="flex items-start gap-3">
 <CheckCircle2 className="w-6 h-6 text-semantic-success-700 flex-shrink-0 mt-0.5" />
 <div>
 <h3 className="text-lg font-semibold text-ink mb-2">Message received.</h3>
 <p className="text-sm text-ink-soft leading-relaxed">
 Thanks &mdash; we&rsquo;ll be in touch shortly. A confirmation copy is on its way to your inbox. If your inquiry is urgent and security-related, we&rsquo;ll acknowledge within two hours; everything else within one business day.
 </p>
 <button
 type="button"
 onClick={() => setStatus('idle')}
 className="mt-4 text-sm font-medium text-amber-deep hover:text-amber-deep transition-colors"
 >
 Send another message →
 </button>
 </div>
 </div>
 </div>
 ) : (
 <form onSubmit={onSubmit} className="space-y-6" noValidate>
 {/* Honeypot — hidden from humans, visible to bots */}
 <div className="absolute left-[-9999px]" aria-hidden="true">
 <label>
 Company
 <input
 type="text"
 tabIndex={-1}
 autoComplete="off"
 value={form.company}
 onChange={(e) => update('company', e.target.value)}
 />
 </label>
 </div>

 {/* Name + Email */}
 <div className="grid sm:grid-cols-2 gap-5">
 <Field
 label="Name"
 id="name"
 required
 value={form.name}
 onChange={(v) => update('name', v)}
 placeholder="Jane Doe"
 autoComplete="name"
 />
 <Field
 label="Email"
 id="email"
 type="email"
 required
 value={form.email}
 onChange={(v) => update('email', v)}
 placeholder="jane@example.com"
 autoComplete="email"
 />
 </div>

 {/* Topic */}
 <fieldset>
 <legend className="block text-sm font-medium text-ink mb-3">
 What is this about? <span className="text-amber-deep">*</span>
 </legend>
 <div className="grid sm:grid-cols-2 gap-2">
 {TOPICS.map((t) => {
 const selected = form.topic === t.value
 return (
 <label
 key={t.value}
 className={`relative flex flex-col cursor-pointer border px-4 py-3 transition-all ${
 selected
 ? 'border-amber-400/60 bg-paper-sub'
 : 'border-ink-rule bg-paper-sub hover:border-ink-rule hover:bg-paper-sub'
 }`}
 >
 <input
 type="radio"
 name="topic"
 value={t.value}
 checked={selected}
 onChange={() => update('topic', t.value)}
 className="sr-only"
 />
 <span
 className={`text-sm font-semibold ${
 selected ? 'text-amber-deep' : 'text-ink'
 }`}
 dangerouslySetInnerHTML={{ __html: t.label }}
 />
 <span
 className="text-xs text-ink-muted mt-0.5"
 dangerouslySetInnerHTML={{ __html: t.hint }}
 />
 </label>
 )
 })}
 </div>
 </fieldset>

 {/* Optional wallet */}
 <Field
 label="Wallet address"
 id="wallet"
 value={form.wallet}
 onChange={(v) => update('wallet', v)}
 placeholder="0x… (optional, helps us debug faster)"
 optional
 />

 {/* Message */}
 <div>
 <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
 Message <span className="text-amber-deep">*</span>
 </label>
 <textarea
 id="message"
 required
 rows={6}
 minLength={10}
 maxLength={5000}
 value={form.message}
 onChange={(e) => update('message', e.target.value)}
 placeholder="Tell us what's going on. The more context, the faster we can help."
 className="w-full bg-paper-sub border border-ink-rule px-4 py-3 text-sm text-ink placeholder-ink-whisper resize-y focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-colors"
 />
 <p className="mt-1.5 text-xs text-ink-whisper">
 {form.message.length} / 5000
 </p>
 </div>

 {/* Error */}
 {status === 'error' && error && (
 <div className="flex items-start gap-2 border border-crimson-paper/40/30 bg-paper-sub p-4">
 <AlertCircle className="w-5 h-5 text-crimson-paper flex-shrink-0 mt-0.5" />
 <p className="text-sm text-crimson-paper">{error}</p>
 </div>
 )}

 {/* Submit */}
 <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
 <button
 type="submit"
 disabled={status === 'submitting'}
 className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-ink text-sm font-semibold hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper-deep"
 >
 {status === 'submitting' ? 'Sending…' : (
 <>
 Send message
 <ArrowRight className="w-4 h-4 ml-2" />
 </>
 )}
 </button>
 <p className="text-xs text-ink-whisper">
 By submitting, you agree to our{' '}
 <a href="/privacy" className="text-amber-deep hover:underline">Privacy Policy</a>.
 </p>
 </div>
 </form>
 )}
 </div>

 {/* ---------- Sidebar ---------- */}
 <aside className="lg:col-span-5 space-y-5">
 <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">
 Or reach us directly
 </h2>
 <p className="text-sm text-ink-muted mb-6">
 Prefer email or chat? Pick the channel that fits.
 </p>

 <ChannelCard
 icon={<Mail className="w-5 h-5" />}
 title="Support"
 description="Product, billing, and how-to questions."
 href="mailto:support@allowanceguard.com"
 cta="support@allowanceguard.com"
 meta="Replies within one business day"
 />
 <ChannelCard
 icon={<Shield className="w-5 h-5" />}
 title="Security disclosures"
 description="Vulnerabilities, exploits, responsible disclosure. Encrypt with our PGP key for sensitive findings."
 href="mailto:security@allowanceguard.com"
 cta="security@allowanceguard.com"
 meta="Acknowledged within 2 hours"
 accent
 />
 <ChannelCard
 icon={<MessageCircle className="w-5 h-5" />}
 title="Discord"
 description="Real-time community help and product discussion."
 href="https://discord.gg/DsJ4Pa94"
 cta="Join the server"
 meta="Active community + core team"
 external
 />
 <ChannelCard
 icon={<Github className="w-5 h-5" />}
 title="GitHub"
 description="Bug reports, feature requests, and source code."
 href="https://github.com/EazyAccessEA/Allowance-guard/issues"
 cta="Open an issue"
 meta="Public, tracked, AGPL-3.0"
 external
 />
 </aside>
 </div>
 </Container>
 </Section>

 {/* ============ TRUST STRIP ============ */}
 <div className="border-t border-ink-rule">
 <Container>
 <div className="py-10 grid sm:grid-cols-3 gap-6 text-sm">
 <TrustItem
 icon={<Lock className="w-4 h-4 text-amber-deep" />}
 title="Encrypted in transit"
 >
 Every message travels over HTTPS. We never sell or share your details.
 </TrustItem>
 <TrustItem
 icon={<Shield className="w-4 h-4 text-amber-deep" />}
 title="PGP for security reports"
 >
 <a href="/pgp-key.asc" className="text-amber-deep hover:underline">
 Download our public key
 </a>{' '}
 before sending sensitive findings.
 </TrustItem>
 <TrustItem
 icon={<CheckCircle2 className="w-4 h-4 text-amber-deep" />}
 title="security.txt"
 >
 <a href="/.well-known/security.txt" className="text-amber-deep hover:underline">
 /.well-known/security.txt
 </a>{' '}
 follows RFC 9116.
 </TrustItem>
 </div>
 </Container>
 </div>
 </div>
 )
}

/* ---------- Subcomponents ---------- */

function Field({
 id,
 label,
 type = 'text',
 required,
 optional,
 value,
 onChange,
 placeholder,
 autoComplete,
}: {
 id: string
 label: string
 type?: string
 required?: boolean
 optional?: boolean
 value: string
 onChange: (v: string) => void
 placeholder?: string
 autoComplete?: string
}) {
 return (
 <div>
 <label htmlFor={id} className="block text-sm font-medium text-ink mb-2">
 {label}
 {required && <span className="text-amber-deep ml-1">*</span>}
 {optional && <span className="text-ink-whisper ml-2 text-xs font-normal">optional</span>}
 </label>
 <input
 id={id}
 type={type}
 required={required}
 value={value}
 onChange={(e) => onChange(e.target.value)}
 placeholder={placeholder}
 autoComplete={autoComplete}
 className="w-full bg-paper-sub border border-ink-rule px-4 py-3 text-sm text-ink placeholder-ink-whisper focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-colors"
 />
 </div>
 )
}

function ChannelCard({
 icon,
 title,
 description,
 href,
 cta,
 meta,
 external,
 accent,
}: {
 icon: React.ReactNode
 title: string
 description: string
 href: string
 cta: string
 meta: string
 external?: boolean
 accent?: boolean
}) {
 return (
 <a
 href={href}
 target={external ? '_blank' : undefined}
 rel={external ? 'noopener noreferrer' : undefined}
 className={`block group border p-5 transition-all ${
 accent
 ? 'border-amber-400/30 bg-amber-400/5 hover:border-amber-400/60'
 : 'border-ink-rule bg-paper-sub hover:border-ink-rule hover:bg-paper-sub'
 }`}
 >
 <div className="flex items-start gap-4">
 <div
 className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ${
 accent ? 'bg-amber-400/15 text-amber-deep' : 'bg-paper-sub text-ink-soft'
 }`}
 >
 {icon}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-2">
 <h3 className="text-base font-semibold text-ink">{title}</h3>
 <ArrowRight className="w-4 h-4 text-ink-whisper group-hover:text-amber-deep group-hover:translate-x-0.5 transition-all flex-shrink-0" />
 </div>
 <p className="mt-1 text-sm text-ink-muted leading-relaxed">{description}</p>
 <div className="mt-3 flex items-center justify-between gap-3 text-xs">
 <span className="font-mono text-amber-deep truncate">{cta}</span>
 <span className="text-ink-whisper flex-shrink-0">{meta}</span>
 </div>
 </div>
 </div>
 </a>
 )
}

function TrustItem({
 icon,
 title,
 children,
}: {
 icon: React.ReactNode
 title: string
 children: React.ReactNode
}) {
 return (
 <div className="flex items-start gap-3">
 <div className="flex-shrink-0 mt-0.5">{icon}</div>
 <div>
 <h4 className="font-semibold text-ink text-sm mb-1">{title}</h4>
 <p className="text-xs text-ink-muted leading-relaxed">{children}</p>
 </div>
 </div>
 )
}
