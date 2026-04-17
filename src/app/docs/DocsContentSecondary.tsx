/**
 * Docs content sections: alerts through faq — quiet-bold Ledger layout.
 *
 * Three sections extracted to their own files to keep this one under the
 * 600-line limit: teams, troubleshooting, settings. Five sections rewritten
 * in place: alerts, monitoring, revoking, browser-extension, faq.
 *
 * Council:
 * Kael: No rounded-xl cards. No bg-amber-500 icon frames. No dark: tokens
 * (homepage is paper-only — dark variants leak onto light surfaces).
 * #7 Maren: Scale contrast carries structure; whitespace does the rest.
 * Noor: amber-deep on paper is AA; ink-muted for body is AAA.
 * #13 UX writer: H3s state the thing, not label the category.
 */

import { alertFeatures, faqItems } from './docs-data'
import TeamsSection from './sections/TeamsSection'
import TroubleshootingSection from './sections/TroubleshootingSection'
import SettingsSection from './sections/SettingsSection'

interface Props { section: string }

export default function DocsContentSecondary({ section }: Props) {
 switch (section) {

 case 'alerts':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="alerts-notifications" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Alerts.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 Four ways to hear from AllowanceGuard when a wallet&rsquo;s risk picture changes.
 </p>
 </section>

 <section>
 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
 {alertFeatures.map((alert) => (
 <div key={alert.type}>
 <h3 className="font-plex font-semibold text-ink text-base mb-2">{alert.type}</h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6] mb-3">{alert.description}</p>
 <ul className="space-y-1 font-plex text-sm text-ink-muted">
 {alert.features.map((f) => (
 <li key={f} className="flex items-baseline gap-2">
 <span className="text-ink-whisper" aria-hidden="true">·</span>
 <span>{f}</span>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </section>
 </div>
 )

 case 'monitoring':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="autonomous-monitoring" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Continuous monitoring.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 Rescan wallets on a schedule. Detect drift the moment it appears. Alert only on things that match your policy.
 </p>
 </section>

 <section className="space-y-6">
 <h3 id="how-it-works" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 How it works.
 </h3>
 <ol className="space-y-5">
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Enable monitoring.</strong> Choose a rescan frequency per wallet. Default is every 12 hours. Minimum 30 minutes.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">We rescan on schedule.</strong> Every chain, every approval. Delta-compared against the previous scan.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Drift detected.</strong> New approvals, amount changes, unlimited flips. Anything that moves.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">04</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">You&rsquo;re alerted.</strong> Email and Slack. We remember what was already alerted so you don&rsquo;t get spammed.
 </p>
 </li>
 </ol>
 </section>

 <section className="space-y-5">
 <h3 id="drift-detection" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 What counts as drift.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Four events trigger an alert, each filtered by your risk policy: <strong className="text-ink font-semibold">new approvals</strong> the scanner hasn&rsquo;t seen before, <strong className="text-ink font-semibold">amount growth</strong> on an existing approval, <strong className="text-ink font-semibold">unlimited flips</strong> where an approval becomes uncapped, and <strong className="text-ink font-semibold">policy matches</strong> on high-severity spenders. Changes that don&rsquo;t match your policy are logged silently.
 </p>
 </section>

 <section className="space-y-5">
 <h3 id="configuration" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Configuration.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Toggle monitoring on or off per wallet. Set the rescan interval (minimum 30 minutes). Choose email, Slack, or both for the alert channel. Change the risk policy independently &mdash; the policy is what decides what&rsquo;s worth hearing about.
 </p>
 </section>
 </div>
 )

 case 'revoking':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="how-to-revoke-approvals" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Revoking.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 Revoking sets an allowance to zero on-chain. The contract can&rsquo;t move those tokens again until you explicitly approve a new amount.
 </p>
 </section>

 <section className="space-y-6">
 <h3 id="using-the-dashboard" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Using the dashboard.
 </h3>
 <ol className="space-y-5">
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Connect your wallet and scan for approvals.</p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Find the approval you want to revoke. Sort by risk to surface urgent ones first.</p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Click <strong className="text-ink font-semibold">Revoke</strong>.</p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">04</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Sign the transaction in your wallet. Pay the gas fee to complete the revocation.</p>
 </li>
 </ol>
 </section>

 <section className="space-y-5">
 <h3 id="bulk-operations" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Bulk operations.
 </h3>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Select multiple approvals and use <strong className="text-ink font-semibold">Batch revoke</strong> to zero them in a single transaction. Verified helper contract, public ABI, roughly 70% gas savings over one-by-one revokes.
 </p>
 </section>

 <section className="space-y-5">
 <h3 id="important-notes" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 What to know before you revoke.
 </h3>
 <ul className="space-y-3">
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Each single revoke is its own transaction with its own gas fee.</p>
 </li>
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Revoking doesn&rsquo;t affect tokens you&rsquo;ve already deposited or staked in a contract. It only zeros the <em>future</em> spend permission.</p>
 </li>
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Some dApps require a fresh approval to keep working. Revoking now may mean re-approving later.</p>
 </li>
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">Revocation is preventative. It cannot recover funds that have already moved.</p>
 </li>
 </ul>
 </section>
 </div>
 )

 case 'teams':
 return <TeamsSection />

 case 'api':
 return <SettingsSection />

 case 'browser-extension':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="browser-extension" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 Browser extension.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 Pre-signing risk assessment in the browser. A warning before you approve, not after you&rsquo;re drained.
 </p>
 </section>

 <section className="space-y-7">
 <h3 id="availability" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 Where it runs.
 </h3>
 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Chrome & Chromium</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6] mb-2">
 Chrome Web Store. Works on Brave, Edge, and Opera.
 </p>
 <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-amber-deep">Pending approval</p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Firefox</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6] mb-2">
 Firefox Add-ons. Compatible with current releases.
 </p>
 <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-amber-deep">Pending approval</p>
 </div>
 </div>
 </section>

 <section className="space-y-7">
 <h3 id="what-it-does" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 What it does.
 </h3>
 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Pre-signing risk popup</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 When a dApp asks you to sign an approval, the extension analyses the contract and the amount, then warns you if it detects an unlimited approval, a known-malicious spender, or other red flags &mdash; before you confirm.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Quick overview</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 Click the toolbar icon for a summary of your current active approvals and overall risk score without leaving the page you&rsquo;re on.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">Non-custodial</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 The extension never accesses your private keys. It reads public on-chain data and queries the AllowanceGuard API for risk analysis.
 </p>
 </div>
 <div>
 <h4 className="font-plex font-semibold text-ink text-base mb-2">No tracking</h4>
 <p className="font-plex text-base text-ink-muted leading-[1.6]">
 No analytics on your browsing. No per-site telemetry. The only data that leaves your browser is the approval payload being risk-scored.
 </p>
 </div>
 </div>
 </section>

 <section className="space-y-6">
 <h3 id="how-to-install" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
 How to install.
 </h3>
 <ol className="space-y-5">
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Download.</strong> Visit the Chrome Web Store or Firefox Add-ons page (live once store approval is complete) and click <em>Add to browser</em>.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Connect.</strong> Click the AllowanceGuard icon in your toolbar and paste your public wallet address. No private keys required.
 </p>
 </li>
 <li className="flex gap-5">
 <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
 <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
 <strong className="text-ink font-semibold">Browse normally.</strong> The extension runs in the background. When a dApp requests an approval, the risk popup appears before you confirm.
 </p>
 </li>
 </ol>
 </section>
 </div>
 )

 case 'troubleshooting':
 return <TroubleshootingSection />

 case 'faq':
 return (
 <div className="space-y-16">
 <section className="space-y-5">
 <h2 id="frequently-asked-questions" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
 FAQ.
 </h2>
 <p className="font-plex text-lg text-ink-muted leading-[1.6]">
 The questions we hear most. For anything missing, the{' '}
 <a href="mailto:support@allowanceguard.com" className="text-amber-deep hover:underline underline-offset-2">support team</a>{' '}
 typically responds within 24 hours.
 </p>
 </section>

 <section>
 <dl className="border-t border-b border-ink-rule divide-y divide-ink-rule">
 {faqItems.map((item) => (
 <div key={item.question} className="py-6">
 <dt className="font-plex font-semibold text-ink text-base mb-2">{item.question}</dt>
 <dd className="font-plex text-base text-ink-muted leading-[1.6] m-0">{item.answer}</dd>
 </div>
 ))}
 </dl>
 </section>
 </div>
 )

 default:
 return null
 }
}
