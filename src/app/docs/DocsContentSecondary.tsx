import { Search, Mail, Bell, Zap, Users, Lock, AlertTriangle, Shield, Settings } from 'lucide-react'
import { alertFeatures, apiEndpoints, faqItems } from './docs-data'

interface Props { section: string }

/** Docs content sections: alerts through faq */
export default function DocsContentSecondary({ section }: Props) {
 switch (section) {
 case 'alerts':
 return (
 <div className="space-y-8">
 <div>
 <h2 id="alerts-notifications" className="text-2xl font-semibold text-ink mb-4">Alerts & Notifications</h2>
 <p className="text-base text-ink-soft mb-6">
 Stay informed about your wallet security with automated alerts:
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {alertFeatures.map((alert, index) => {
 const IconComponent = alert.type === 'Email Alerts' ? Mail : 
 alert.type === 'Slack Integration' ? Bell :
 alert.type === 'Autonomous Monitoring' ? Zap : Bell
 return (
 <div key={index} className="border border-ink-rule rounded-lg p-6 bg-paper-sub">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <IconComponent className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">{alert.type}</h4>
 <p className="text-base text-ink-soft mb-4">{alert.description}</p>
 </div>
 </div>
 <ul className="space-y-2 text-sm text-ink-soft">
 {alert.features.map((feature, fIndex) => (
 <li key={fIndex} className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
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
 <h2 id="autonomous-monitoring" className="text-2xl font-semibold text-ink mb-4">Autonomous Monitoring</h2>
 <p className="text-base text-ink-soft mb-6">
 Enable continuous monitoring of your wallets with automatic rescans and instant drift detection. The system will alert you immediately when new approvals appear or existing ones change.
 </p>
 
 <div className="space-y-6">
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Zap className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h3 id="how-it-works" className="text-xl font-semibold text-ink mb-3">How It Works</h3>
 </div>
 </div>
 <ol className="list-decimal list-inside space-y-2 text-base text-ink-soft ml-16">
 <li>Enable monitoring for your wallet with a custom frequency (default: 12 hours)</li>
 <li>System automatically rescans your wallet at the specified intervals</li>
 <li>Detects drift: new approvals, amount changes, or unlimited flips</li>
 <li>Sends instant alerts via email and Slack when changes are detected</li>
 <li>Remembers what was alerted to prevent spam notifications</li>
 </ol>
 </div>

 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Bell className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h3 id="drift-detection" className="text-xl font-semibold text-ink mb-3">Drift Detection</h3>
 </div>
 </div>
 <p className="text-sm text-ink-soft mb-3">The system detects the following types of changes:</p>
 <ul className="space-y-1 text-sm text-ink-soft">
 <li>• <strong>New Approvals:</strong> Previously unseen token approvals</li>
 <li>• <strong>Amount Growth:</strong> Approvals that grew from zero to a positive amount</li>
 <li>• <strong>Unlimited Flips:</strong> Approvals that became unlimited</li>
 <li>• <strong>Policy Filtering:</strong> Only alerts on approvals that match your risk policy</li>
 </ul>
 </div>

 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Settings className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h3 id="configuration" className="text-xl font-semibold text-ink mb-3">Configuration</h3>
 </div>
 </div>
 <p className="text-base text-ink-soft mb-4 ml-16">You can configure monitoring settings in the sidebar:</p>
 <ul className="space-y-2 text-base text-ink-soft ml-16">
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span><strong>Enable/Disable:</strong> Turn monitoring on or off for each wallet</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span><strong>Frequency:</strong> Set rescan interval (minimum 30 minutes)</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span><strong>Alerts:</strong> Configure email and Slack notification preferences</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 )

 case 'teams':
 return (
 <div className="space-y-8">
 <div>
 <h2 id="teams-collaboration" className="text-2xl font-semibold text-ink mb-4">Teams & Collaboration</h2>
 <p className="text-base text-ink-soft mb-6">
 AllowanceGuard supports team collaboration with role-based access control. Create teams, invite members, and manage wallet access with different permission levels.
 </p>

 <h3 className="text-xl font-semibold text-ink mb-3">Team Roles</h3>
 <div className="space-y-4 mb-6">
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Users className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Owner</h4>
 <p className="text-base text-ink-soft">Full control over the team, including adding/removing members, managing wallets, and inviting collaborators.</p>
 </div>
 </div>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Shield className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Admin</h4>
 <p className="text-base text-ink-soft">Can manage team members, add wallets, and invite users. Cannot remove the owner.</p>
 </div>
 </div>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Settings className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Editor</h4>
 <p className="text-base text-ink-soft">Can add wallets to the team and invite viewers. Can revoke approvals and manage monitoring settings.</p>
 </div>
 </div>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Search className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Viewer</h4>
 <p className="text-base text-ink-soft">Read-only access. Can view approvals and scan results but cannot revoke approvals or modify settings.</p>
 </div>
 </div>
 </div>
 </div>

 <h3 className="text-xl font-semibold text-ink mb-3">Getting Started with Teams</h3>
 <ol className="list-decimal list-inside space-y-2 text-base text-ink-soft mb-6">
 <li><strong>Sign In:</strong> Use the email magic link authentication to create an account</li>
 <li><strong>Create Team:</strong> Click &quot;New team&quot; and enter a team name</li>
 <li><strong>Add Wallets:</strong> Add wallet addresses that your team needs to monitor</li>
 <li><strong>Invite Members:</strong> Send email invites to collaborators with appropriate roles</li>
 <li><strong>Manage Access:</strong> Control who can view, edit, or revoke approvals</li>
 </ol>

 <h3 className="text-xl font-semibold text-ink mb-3">Team Features</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Users className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Shared Wallets</h4>
 <p className="text-base text-ink-soft">Add multiple wallet addresses to a team for centralized monitoring</p>
 </div>
 </div>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Mail className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Email Invites</h4>
 <p className="text-base text-ink-soft">Invite team members via secure email links with role-based access</p>
 </div>
 </div>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Shield className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Role-Based Access</h4>
 <p className="text-base text-ink-soft">Control permissions with owner, admin, editor, and viewer roles</p>
 </div>
 </div>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Bell className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Team Monitoring</h4>
 <p className="text-base text-ink-soft">Set up autonomous monitoring for team-managed wallets</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )

 case 'revoking':
 return (
 <div className="space-y-8">
 <div>
 <h2 className="text-2xl font-semibold text-ink mb-4">How to Revoke Approvals</h2>
 <p className="text-base text-ink-soft mb-6">
 Revoking an approval means setting the allowance to zero, preventing the spender from accessing your tokens:
 </p>
 <div className="space-y-6">
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <Lock className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Using AllowanceGuard</h4>
 </div>
 </div>
 <ol className="list-decimal list-inside space-y-2 text-base text-ink-soft ml-16">
 <li>Connect your wallet and scan for approvals</li>
 <li>Find the approval you want to revoke</li>
 <li>Click the &quot;Revoke&quot; button</li>
 <li>Sign the transaction in your wallet</li>
 <li>Pay the gas fee to complete the revocation</li>
 </ol>
 </div>
 <div className="p-6 bg-paper-sub border border-ink-rule rounded-lg">
 <div className="flex items-start gap-4 mb-4">
 <div className="w-12 h-12 bg-amber-500/10 ring-1 ring-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
 <AlertTriangle className="w-6 h-6 text-amber-deep" />
 </div>
 <div>
 <h4 className="text-lg font-semibold text-ink mb-2">Important Notes</h4>
 </div>
 </div>
 <ul className="space-y-2 text-base text-ink-soft ml-16">
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span>Each revocation requires a separate transaction and gas fee</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span>Revoking doesn&apos;t affect already deposited or staked tokens</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span>Some dApps may require you to re-approve for continued functionality</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400rounded-full mt-2 flex-shrink-0"></span>
 <span>Revocation is preventative, not restorative for already stolen funds</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 )

 case 'api':
 return (
 <div className="space-y-8">
 <div>
 <h2 className="text-2xl font-semibold text-ink mb-4">Settings & Configuration</h2>
 <p className="text-base text-ink-soft mb-6">
 AllowanceGuard exposes the settings that actually matter for monitoring:
 </p>
 
 <div className="space-y-6">
 {/* Email Alerts */}
 <div className="border border-ink-rule rounded-md p-6 bg-paper-sub">
 <div className="flex items-center gap-3 mb-3">
 <Mail className="w-5 h-5 text-ink" />
 <h3 className="text-lg font-semibold text-ink">Email Alerts</h3>
 </div>
 <p className="text-sm text-ink-soft mb-4">
 Get notified the moment a new high-risk approval is detected on any wallet you monitor.
 </p>
 <ul className="space-y-2 text-sm text-ink-soft">
 <li>• Daily digest emails with risky approval summaries</li>
 <li>• Risk-only filtering to reduce notification noise</li>
 <li>• HTML templates with professional formatting</li>
 <li>• Customizable preferences per wallet address</li>
 </ul>
 </div>

 {/* Risk Policy */}
 <div className="border border-ink-rule rounded-md p-6 bg-paper-sub">
 <div className="flex items-center gap-3 mb-3">
 <Shield className="w-5 h-5 text-ink" />
 <h3 className="text-lg font-semibold text-ink">Risk Policy Configuration</h3>
 </div>
 <p className="text-sm text-ink-soft mb-4">
 Configure what counts as alert-worthy for your specific needs.
 </p>
 <ul className="space-y-2 text-sm text-ink-soft">
 <li>• Set minimum risk score thresholds</li>
 <li>• Focus on unlimited approvals only</li>
 <li>• Include/exclude specific spender addresses</li>
 <li>• Filter by token addresses</li>
 <li>• Chain-specific policies</li>
 </ul>
 </div>

 {/* Slack Integration */}
 <div className="border border-ink-rule rounded-md p-6 bg-paper-sub">
 <div className="flex items-center gap-3 mb-3">
 <Bell className="w-5 h-5 text-ink" />
 <h3 className="text-lg font-semibold text-ink">Slack Integration</h3>
 </div>
 <p className="text-sm text-ink-soft mb-4">
 Get daily digests directly in your Slack workspace.
 </p>
 <ul className="space-y-2 text-sm text-ink-soft">
 <li>• Webhook-based notifications</li>
 <li>• Rich formatting with approval details</li>
 <li>• Team collaboration features</li>
 <li>• Custom channel routing</li>
 </ul>
 </div>

 {/* Public Sharing */}
 <div className="border border-ink-rule rounded-md p-6 bg-paper-sub">
 <div className="flex items-center gap-3 mb-3">
 <Settings className="w-5 h-5 text-ink" />
 <h3 className="text-lg font-semibold text-ink">Public Share Links</h3>
 </div>
 <p className="text-sm text-ink-soft mb-4">
 Generate read-only links to share your wallet&apos;s approval status.
 </p>
 <ul className="space-y-2 text-sm text-ink-soft">
 <li>• Privacy controls (censor addresses/amounts)</li>
 <li>• Risk-only filtering for public sharing</li>
 <li>• Expiration dates for temporary access</li>
 <li>• One-click link generation and rotation</li>
 </ul>
 </div>

 {/* API Reference */}
 <div className="border border-ink-rule rounded-md p-6 bg-paper-sub">
 <div className="flex items-center gap-3 mb-3">
 <Settings className="w-5 h-5 text-ink" />
 <h3 className="text-lg font-semibold text-ink">API Endpoints</h3>
 </div>
 <p className="text-sm text-ink-soft mb-4">
 Programmatic access to AllowanceGuard functionality:
 </p>
 <div className="space-y-2">
 {apiEndpoints.map((endpoint, index) => (
 <div key={index} className="flex items-center gap-3 text-sm">
 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-ink text-ink">
 {endpoint.method}
 </span>
 <code className="font-mono text-ink">{endpoint.endpoint}</code>
 <span className="text-ink-soft">{endpoint.description}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 )

 case 'browser-extension':
 return (
 <div className="space-y-8">
 <div>
 <h2 id="browser-extension" className="text-2xl font-semibold text-ink mb-4">Browser Extension</h2>
 <p className="text-base text-ink-soft mb-6">
 The AllowanceGuard browser extension brings real-time transaction risk assessment directly into your browser. Get warnings before you sign risky approvals, without needing to visit the dashboard.
 </p>

 <h3 className="text-xl font-semibold text-ink mb-3">Available On</h3>
 <div className="space-y-4 mb-8">
 <div className="bg-paper-sub border border-ink-rule rounded-xl p-6">
 <h4 className="font-medium text-ink mb-2">Google Chrome</h4>
 <p className="text-base text-ink-soft mb-2">
 Available on the Chrome Web Store. Works with all Chromium-based browsers including Brave, Edge, and Opera.
 </p>
 <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-800">Pending Approval</span>
 </div>
 <div className="bg-paper-sub border border-ink-rule rounded-xl p-6">
 <h4 className="font-medium text-ink mb-2">Mozilla Firefox</h4>
 <p className="text-base text-ink-soft mb-2">
 Available on Firefox Add-ons. Fully compatible with the latest Firefox releases.
 </p>
 <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-800">Pending Approval</span>
 </div>
 </div>

 <h3 className="text-xl font-semibold text-ink mb-3">What the Extension Does</h3>
 <div className="space-y-4 mb-8">
 <div>
 <h4 className="font-medium text-ink mb-2">Pre-Signing Risk Assessment</h4>
 <p className="text-base text-ink-soft">
 Before you approve a transaction, the extension analyses the contract and approval amount, warning you if it detects an unlimited approval, a known malicious spender, or other red flags.
 </p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Quick Allowance Overview</h4>
 <p className="text-base text-ink-soft">
 Click the extension icon to see a summary of your current active approvals and overall risk score without leaving the page you are on.
 </p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Non-Custodial &amp; Privacy-First</h4>
 <p className="text-base text-ink-soft">
 The extension never accesses your private keys. It reads only public blockchain data and communicates with the AllowanceGuard API for risk analysis. No tracking, no analytics on your browsing.
 </p>
 </div>
 </div>

 <h3 className="text-xl font-semibold text-ink mb-3">How to Install</h3>
 <div className="space-y-4 text-base text-ink-soft">
 <p><strong>1. Download:</strong> Visit the Chrome Web Store or Firefox Add-ons page (links will be active once store approval is complete) and click &quot;Add to Browser&quot;.</p>
 <p><strong>2. Connect:</strong> After installation, click the AllowanceGuard icon in your toolbar and connect your wallet address. No private keys are required — just your public address.</p>
 <p><strong>3. Browse safely:</strong> The extension runs in the background. Whenever a dApp asks you to sign a token approval, the extension will show a risk popup before you confirm.</p>
 </div>
 </div>
 </div>
 )

 case 'troubleshooting':
 return (
 <div className="space-y-8">
 <div>
 <h2 id="troubleshooting" className="text-2xl font-semibold text-ink mb-4">Support & Troubleshooting</h2>
 
 <h3 id="common-issues" className="text-xl font-semibold text-ink mb-3">Common Issues and Solutions</h3>
 <div className="space-y-6 mb-8">
 <div>
 <h4 className="font-medium text-ink mb-2">Why can&apos;t I see my allowances?</h4>
 <p className="text-base text-ink-soft">This could indicate several scenarios. First, you may genuinely have no token approvals, which is actually a good security posture. Second, there might be a network connectivity issue preventing the scan from completing. Third, the blockchain indexer might be experiencing delays. Try switching networks, refreshing the page, or reconnecting your wallet. If the problem persists, contact support with your wallet address and network information.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Why did my transaction fail?</h4>
 <p className="text-base text-ink-soft">Transaction failures are typically due to insufficient gas fees, network congestion, or nonce conflicts. Ensure you have enough ETH in your wallet to cover gas costs, and consider increasing the gas price for faster confirmation during network congestion. If the transaction fails due to a nonce issue, wait a few minutes before retrying. Some contracts may also require specific revocation methods or have additional security measures that prevent standard revocation.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Why is a known protocol flagged as risky?</h4>
 <p className="text-base text-ink-soft">Our risk engine uses multiple heuristics that may flag legitimate protocols for various reasons. A protocol might be flagged if it has unlimited approvals, unverified source code, or appears on security watchlists due to past incidents. The risk score is designed to err on the side of caution, encouraging users to review each approval individually. You can still use the protocol while being aware of the associated risks, or consider revoking the approval if you no longer need it.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Why is my scan taking so long?</h4>
 <p className="text-base text-ink-soft">Scan duration depends on several factors including the number of approvals, network congestion, and blockchain indexer performance. Wallets with extensive transaction history or many approvals may take several minutes to scan completely. The system processes scans in the background using a job queue, so you can continue using the application while the scan completes. If a scan appears stuck, try refreshing the page or reconnecting your wallet.</p>
 </div>
 </div>
 
 <h3 id="glossary" className="text-xl font-semibold text-ink mb-3">Glossary of Terms</h3>
 <div className="space-y-4 mb-8">
 <div>
 <h4 className="font-medium text-ink mb-2">Allowance</h4>
 <p className="text-base text-ink-soft">A permission granted to a smart contract to spend a specific amount of your tokens. This is necessary for DeFi interactions but can become a security risk if left unchecked.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Revocation</h4>
 <p className="text-base text-ink-soft">The process of setting an allowance to zero, completely removing a contract&apos;s ability to spend your tokens. This is accomplished through a blockchain transaction.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Gas</h4>
 <p className="text-base text-ink-soft">The fee required to execute transactions on the Ethereum blockchain. Gas fees are paid to network validators and vary based on network congestion and transaction complexity.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Spender</h4>
 <p className="text-base text-ink-soft">The smart contract address that has been granted permission to spend your tokens. This is typically a DEX router, NFT marketplace, or other DeFi protocol.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">dApp</h4>
 <p className="text-base text-ink-soft">Decentralized application - a blockchain-based application that operates without central authority, typically requiring token approvals for functionality.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Non-Custodial</h4>
 <p className="text-base text-ink-soft">A security model where users hold their own keys and sign their own transactions; no third party can move funds on their behalf.</p>
 </div>
 </div>
 
 <h3 id="getting-help" className="text-xl font-semibold text-ink mb-3">Getting Help</h3>
 <div className="space-y-4">
 <div>
 <h4 className="font-medium text-ink mb-2">Technical Support</h4>
 <p className="text-base text-ink-soft">For technical issues, feature requests, or general questions, contact our support team at support@allowanceguard.com. We typically respond within 24 hours and can help with wallet connection issues, transaction problems, or platform-specific questions.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Bug Reports</h4>
 <p className="text-base text-ink-soft">If you encounter a bug or unexpected behavior, please report it on our GitHub repository with detailed information including your browser, wallet type, network, and steps to reproduce the issue. This helps us quickly identify and fix problems.</p>
 </div>
 <div>
 <h4 className="font-medium text-ink mb-2">Community Updates</h4>
 <p className="text-base text-ink-soft">Follow us on X for platform updates, security alerts, and community discussions. We regularly share security tips, new feature announcements, and important updates about the Web3 security landscape.</p>
 </div>
 </div>
 </div>
 </div>
 )

 case 'faq':
 return (
 <div className="space-y-8">
 <div>
 <h2 className="text-2xl font-semibold text-ink mb-4">Frequently Asked Questions</h2>
 <div className="space-y-4">
 {faqItems.map((item, index) => (
 <div key={index} className="border border-ink-rule rounded-md p-4 bg-paper-sub">
 <h4 className="font-medium text-ink mb-2">Q: {item.question}</h4>
 <p className="text-sm text-ink-soft">A: {item.answer}</p>
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
