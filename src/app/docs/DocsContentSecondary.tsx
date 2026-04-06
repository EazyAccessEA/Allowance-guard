import {
  Mail, Bell, Zap, Users, Lock, AlertTriangle, Shield, Settings,
  Eye, ChevronDown, ChevronRight, MessageCircle,
} from 'lucide-react'
import { alertFeatures, apiEndpoints, faqItems } from './docs-data'

interface Props { section: string }

/** Docs content: alerts, monitoring, teams, revoking, api, browser-extension, troubleshooting, faq */
export default function DocsContentSecondary({ section }: Props) {
  switch (section) {
    case 'alerts':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="alerts-notifications" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Alerts &amp; Notifications
            </h2>
            <p className="text-sm text-slate-400 mb-6">Stay informed with automated security alerts across multiple channels.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alertFeatures.map((alert, index) => {
                const icons = [Mail, Bell, Zap, Settings]
                const Icon = icons[index] ?? Bell
                return (
                  <div key={index} className="rounded-xl p-5 bg-slate-800/40 border border-slate-700/50 hover:border-amber-500/20 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1">{alert.type}</h4>
                    <p className="text-xs text-slate-400 mb-3">{alert.description}</p>
                    <ul className="space-y-1">
                      {alert.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-1 h-1 rounded-full bg-amber-500/60" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )

    case 'monitoring':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="autonomous-monitoring" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Autonomous Monitoring
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Continuous wallet monitoring with automatic rescans and instant drift detection.
            </p>

            <h3 id="how-it-works" className="text-lg font-semibold text-slate-100 mb-3">How It Works</h3>
            <div className="space-y-2 mb-6">
              {[
                'Enable monitoring with a custom frequency (default: 12 hours).',
                'System automatically rescans your wallet at set intervals.',
                'Detects drift: new approvals, amount changes, unlimited flips.',
                'Sends instant alerts via email and Slack.',
                'Remembers past alerts to prevent spam.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 text-xs text-slate-400">
                  <span className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>

            <h3 id="drift-detection" className="text-lg font-semibold text-slate-100 mb-3">Drift Detection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { label: 'New Approvals', desc: 'Previously unseen token approvals' },
                { label: 'Amount Growth', desc: 'Approvals that grew from zero' },
                { label: 'Unlimited Flips', desc: 'Approvals that became unlimited' },
                { label: 'Policy Filtering', desc: 'Only alerts matching your risk policy' },
              ].map((d) => (
                <div key={d.label} className="rounded-lg p-3 bg-slate-800/30 border border-slate-700/30">
                  <h4 className="text-xs font-semibold text-slate-200">{d.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                </div>
              ))}
            </div>

            <h3 id="configuration" className="text-lg font-semibold text-slate-100 mb-3">Configuration</h3>
            <div className="space-y-2">
              {[
                { label: 'Enable/Disable', desc: 'Turn monitoring on or off per wallet' },
                { label: 'Frequency', desc: 'Set rescan interval (minimum 30 minutes)' },
                { label: 'Alert Channels', desc: 'Configure email and Slack notification preferences' },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{c.label}:</span>
                    <span className="text-xs text-slate-400 ml-1">{c.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'teams':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="teams-collaboration" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Teams &amp; Collaboration
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Collaborative wallet security with role-based access control for DAOs, treasuries, and organisations.
            </p>

            <h3 id="team-roles" className="text-lg font-semibold text-slate-100 mb-3">Roles</h3>
            <div className="space-y-2 mb-6">
              {[
                { role: 'Owner', desc: 'Full control. Add/remove members, manage wallets, invite collaborators.', icon: Users, color: 'text-amber-400' },
                { role: 'Admin', desc: 'Manage members, add wallets, send invites. Cannot remove owner.', icon: Shield, color: 'text-sky-400' },
                { role: 'Editor', desc: 'Add wallets, invite viewers. Revoke approvals and manage monitoring.', icon: Settings, color: 'text-emerald-400' },
                { role: 'Viewer', desc: 'Read-only. View approvals and scan results. Cannot revoke or modify.', icon: Eye, color: 'text-slate-400' },
              ].map((r) => (
                <div key={r.role} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-200">{r.role}</span>
                    <span className="text-xs text-slate-400 ml-2">{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 id="getting-started-with-teams" className="text-lg font-semibold text-slate-100 mb-3">Getting Started</h3>
            <div className="space-y-2 mb-6">
              {[
                'Sign in via magic link authentication.',
                'Click "New team" and enter a team name.',
                'Add wallet addresses to monitor.',
                'Send email invites with appropriate roles.',
                'Control who can view, edit, or revoke.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 text-xs text-slate-400">
                  <span className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>

            <h3 id="team-features" className="text-lg font-semibold text-slate-100 mb-3">Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Users, title: 'Shared Wallets', desc: 'Centralised monitoring for multiple addresses' },
                { icon: Mail, title: 'Email Invites', desc: 'Secure invitations with role-based access' },
                { icon: Shield, title: 'RBAC', desc: 'Owner, admin, editor, and viewer permissions' },
                { icon: Bell, title: 'Team Monitoring', desc: 'Autonomous monitoring for team-managed wallets' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                    <f.icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">{f.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'revoking':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="how-to-revoke-approvals" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Revoking Approvals
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Revoking sets the allowance to zero, preventing the spender from accessing your tokens.
            </p>

            <h3 id="using-the-dashboard" className="text-lg font-semibold text-slate-100 mb-3">Using the Dashboard</h3>
            <div className="space-y-2 mb-6">
              {[
                'Connect your wallet and scan for approvals.',
                'Find the approval you want to revoke.',
                'Click the "Revoke" button.',
                'Sign the transaction in your wallet.',
                'Pay the gas fee to complete revocation.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 text-xs text-slate-400">
                  <span className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>

            <h3 id="manual-revocation" className="text-lg font-semibold text-slate-100 mb-3">Important Notes</h3>
            <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-500/20">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Each revocation requires a separate transaction and gas fee.</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Revoking doesn&apos;t affect already deposited or staked tokens.</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Some dApps may require re-approval for continued use.</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> Revocation is preventative — it cannot recover stolen funds.</li>
              </ul>
            </div>
          </div>
        </div>
      )

    case 'api':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="settings-configuration" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              API &amp; Settings
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Configure monitoring preferences and access AllowanceGuard programmatically.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, title: 'Email Alerts', items: ['Daily digest with risky approval summaries', 'Risk-only filtering', 'Customisable per wallet'] },
                { icon: Shield, title: 'Risk Policy', items: ['Minimum risk score thresholds', 'Unlimited approvals focus', 'Chain-specific policies'] },
                { icon: Bell, title: 'Slack Integration', items: ['Webhook-based notifications', 'Rich formatting', 'Custom channel routing'] },
                { icon: Settings, title: 'Public Share Links', items: ['Privacy controls (censor addresses/amounts)', 'Risk-only filtering', 'Expiration dates'] },
              ].map((s) => (
                <div key={s.title} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-slate-200">{s.title}</h3>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 id="api-endpoints" className="text-lg font-semibold text-slate-100 mb-3">API Endpoints</h3>
            <div className="rounded-xl overflow-hidden border border-slate-700/50">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wide font-medium">Method</th>
                    <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wide font-medium">Endpoint</th>
                    <th className="text-left px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wide font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((ep, index) => (
                    <tr key={index} className="border-t border-slate-700/30">
                      <td className="px-3 py-2">
                        <span className="font-mono font-bold text-emerald-400">{ep.method}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-amber-400/80">{ep.endpoint}</td>
                      <td className="px-3 py-2 text-slate-400">{ep.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )

    case 'browser-extension':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="browser-extension" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Browser Extension
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Real-time transaction risk assessment directly in your browser. Get warnings before signing risky approvals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { name: 'Google Chrome', note: 'Works with Brave, Edge, Opera', status: 'Pending Approval' },
                { name: 'Mozilla Firefox', note: 'Latest Firefox releases', status: 'Pending Approval' },
              ].map((b) => (
                <div key={b.name} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">{b.name}</h4>
                  <p className="text-xs text-slate-400 mb-2">{b.note}</p>
                  <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{b.status}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-slate-100 mb-3">Features</h3>
            <div className="space-y-3 mb-6">
              {[
                { title: 'Pre-Signing Risk Assessment', desc: 'Analyses contract and approval amount before you sign. Warns on unlimited approvals, known malicious spenders, and other red flags.' },
                { title: 'Quick Overview', desc: 'Click the extension icon for a summary of active approvals and overall risk score without leaving the current page.' },
                { title: 'Non-Custodial & Privacy-First', desc: 'Never accesses private keys. Reads only public blockchain data. No tracking or browsing analytics.' },
              ].map((f) => (
                <div key={f.title} className="rounded-lg p-3 bg-slate-800/30 border border-slate-700/30">
                  <h4 className="text-sm font-semibold text-slate-200 mb-0.5">{f.title}</h4>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-slate-100 mb-3">Installation</h3>
            <div className="space-y-2">
              {[
                { step: '1', title: 'Download', desc: 'Visit the Chrome Web Store or Firefox Add-ons and click "Add to Browser".' },
                { step: '2', title: 'Connect', desc: 'Click the icon in your toolbar. Enter your public wallet address — no private keys needed.' },
                { step: '3', title: 'Browse safely', desc: 'The extension runs in the background and shows a risk popup whenever a dApp requests a token approval.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <span className="w-6 h-6 rounded bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">{s.step}</span>
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{s.title}:</span>
                    <span className="text-xs text-slate-400 ml-1">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'troubleshooting':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="common-issues-solutions" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              Troubleshooting
            </h2>

            <div className="space-y-3 mb-8">
              {[
                { q: 'Why can\'t I see my allowances?', a: 'You may have no approvals (good!), or there\'s a network issue. Try switching networks, refreshing, or reconnecting your wallet.' },
                { q: 'Why did my transaction fail?', a: 'Usually insufficient gas, network congestion, or nonce conflicts. Ensure you have enough ETH for gas and try increasing the gas price.' },
                { q: 'Why is a known protocol flagged as risky?', a: 'Our engine errs on the side of caution. Unlimited approvals, unverified source, or past incidents can trigger flags. Review individually.' },
                { q: 'Why is my scan slow?', a: 'Depends on approval count, network congestion, and indexer load. Scans process in the background — you can continue using the app.' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">{item.q}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            <h3 id="glossary" className="text-lg font-semibold text-slate-100 mb-3">Glossary</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-xs">
                <tbody>
                  {[
                    { term: 'Allowance', def: 'Permission granted to a contract to spend a specific amount of your tokens.' },
                    { term: 'Revocation', def: 'Setting an allowance to zero, removing spending permission.' },
                    { term: 'Gas', def: 'Fee to execute blockchain transactions, paid to network validators.' },
                    { term: 'Spender', def: 'Contract address with permission to spend your tokens (DEX, marketplace, etc.).' },
                    { term: 'dApp', def: 'Decentralised application operating on blockchain without central authority.' },
                    { term: 'Non-Custodial', def: 'Security model where users maintain full control of keys and funds.' },
                  ].map((g) => (
                    <tr key={g.term} className="border-b border-slate-700/30">
                      <td className="py-2 pr-4 font-semibold text-amber-400/80 whitespace-nowrap">{g.term}</td>
                      <td className="py-2 text-slate-400">{g.def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 id="getting-help" className="text-lg font-semibold text-slate-100 mb-3">Getting Help</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                <Mail className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-200 mb-0.5">Support</h4>
                <p className="text-[11px] text-slate-400">support@allowanceguard.com — typically within 24h.</p>
              </div>
              <div className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                <AlertTriangle className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-200 mb-0.5">Bug Reports</h4>
                <p className="text-[11px] text-slate-400">Report on GitHub with browser, wallet, network, and repro steps.</p>
              </div>
              <div className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                <MessageCircle className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-200 mb-0.5">Community</h4>
                <p className="text-[11px] text-slate-400">Follow on X for updates, security alerts, and discussions.</p>
              </div>
            </div>
          </div>
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-8">
          <div>
            <h2 id="frequently-asked-questions" className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
              FAQ
            </h2>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div key={index} className="rounded-xl p-4 bg-slate-800/40 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-200 mb-1.5">{item.question}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
