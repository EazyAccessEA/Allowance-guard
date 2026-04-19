'use client'

/**
 * CookieBanner — GDPR-compliant consent gate with blur overlay.
 *
 * Council:
 * #9 Lawyer: X-to-close-without-choosing removed (GDPR gap); accept
 * and reject have equal visual weight (not a dark pattern);
 * banner blocks interaction until consent is explicit.
 * #8 Noor (a11y): focus trap via role="dialog" + aria-modal + auto-focus;
 * blur overlay is aria-hidden and inert.
 * #5 Marketing + psych: Processing Fluency (scannable in 3s); Peak-End
 * Rule (respectful first interaction → halo on the whole site);
 * Status-Quo Bias neutralised by equal-weight buttons.
 * #13 UX writer: every word earns its place; feedback after choice.
 */

import { useState, useEffect, useRef } from 'react'
import { Shield, Settings, BarChart3, Check } from 'lucide-react'

interface CookiePreferences {
 essential: boolean
 analytics: boolean
 preferences: boolean
}

type ConfirmationMessage = string | null

export default function CookieBanner() {
 const [isVisible, setIsVisible] = useState(false)
 const [showSettings, setShowSettings] = useState(false)
 const [confirmation, setConfirmation] = useState<ConfirmationMessage>(null)
 const [preferences, setPreferences] = useState<CookiePreferences>({
 essential: true,
 analytics: false,
 preferences: false,
 })
 const dialogRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 try {
 const saved = localStorage.getItem('allowance-guard-cookie-consent')
 if (!saved) {
 setIsVisible(true)
 } else {
 setPreferences(JSON.parse(saved))
 }
 } catch {
 setIsVisible(true)
 }
 }, [])

 // Auto-focus the dialog when it mounts
 useEffect(() => {
 if (isVisible && dialogRef.current) {
 dialogRef.current.focus()
 }
 }, [isVisible])

 const saveAndConfirm = (prefs: CookiePreferences, message: string) => {
 setPreferences(prefs)
 localStorage.setItem('allowance-guard-cookie-consent', JSON.stringify(prefs))
 setConfirmation(message)
 // Show confirmation, then dismiss
 setTimeout(() => {
 setIsVisible(false)
 setConfirmation(null)
 }, 1500)
 }

 const handleAcceptAll = () => {
 saveAndConfirm(
 { essential: true, analytics: true, preferences: true },
 'All cookies enabled. You can change this anytime in Settings.'
 )
 }

 const handleEssentialOnly = () => {
 saveAndConfirm(
 { essential: true, analytics: false, preferences: false },
 'Only essential cookies active. Analytics and preferences disabled.'
 )
 }

 const handleSavePreferences = () => {
 const parts = ['Essential cookies active']
 if (preferences.analytics) parts.push('analytics enabled')
 if (preferences.preferences) parts.push('preferences enabled')
 saveAndConfirm(preferences, parts.join('. ') + '.')
 }

 const togglePreference = (key: keyof CookiePreferences) => {
 if (key === 'essential') return
 setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
 }

 if (!isVisible) return null

 return (
 <>
 {/* Blur overlay — blocks interaction, shows site is behind */}
 <div
 className="fixed inset-0 z-[49]"
 aria-hidden="true"
 style={{
 backdropFilter: 'blur(8px)',
 WebkitBackdropFilter: 'blur(8px)',
 backgroundColor: 'rgba(15, 17, 21, 0.25)',
 }}
 />

 {/* Banner dialog — z-50 on top of overlay */}
 <div
 ref={dialogRef}
 role="dialog"
 aria-modal="true"
 aria-label="Cookie preferences"
 tabIndex={-1}
 className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 outline-none"
 >
 <div className="max-w-3xl mx-auto">
 <div className="bg-paper border border-ink-rule rounded-2xl shadow-2xl overflow-hidden">
 {/* Confirmation state */}
 {confirmation ? (
 <div className="p-8 text-center space-y-3">
 <div className="inline-flex items-center justify-center w-12 h-12 bg-paper-sub border border-ink-rule mx-auto">
 <Check className="w-6 h-6 text-semantic-success-700" />
 </div>
 <p className="font-plex text-sm font-medium text-ink">{confirmation}</p>
 </div>
 ) : (
 <div className="p-6 sm:p-8">
 {/* Header — no X button, must choose */}
 <div className="flex items-center gap-3 mb-5">
 <div className="p-2 bg-paper-sub rounded-lg border border-ink-rule">
 <Shield className="w-5 h-5 text-ink" />
 </div>
 <div>
 <h3 className="font-plex text-base font-semibold text-ink">
 Cookies we use
 </h3>
 <p className="font-plex text-xs text-ink-muted">
 Choose which cookies to allow before using the site.
 </p>
 </div>
 </div>

 {!showSettings ? (
 <div className="space-y-5">
 {/* Three categories — compact */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <CategoryCard
 icon={<Shield className="w-4 h-4 text-semantic-success-700" />}
 title="Essential"
 description="Wallet connection, session tokens, CSRF protection"
 badge="Always on"
 />
 <CategoryCard
 icon={<Settings className="w-4 h-4 text-ink-muted" />}
 title="Preferences"
 description="UI settings, alert preferences, saved addresses"
 />
 <CategoryCard
 icon={<BarChart3 className="w-4 h-4 text-ink-muted" />}
 title="Analytics"
 description="Anonymous usage events stored in our database. No third-party tracking. No tracking cookies."
 />
 </div>

 {/* Action buttons — EQUAL WEIGHT per GDPR */}
 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={handleAcceptAll}
 className="flex-1 px-5 py-3 bg-ink text-paper font-plex text-sm font-semibold rounded-lg hover:bg-ink/90 transition-colors"
 >
 Accept all
 </button>
 <button
 onClick={handleEssentialOnly}
 className="flex-1 px-5 py-3 border-2 border-ink text-ink font-plex text-sm font-semibold rounded-lg hover:bg-ink hover:text-paper transition-colors"
 >
 Essential only
 </button>
 <button
 onClick={() => setShowSettings(true)}
 className="px-5 py-3 text-ink-muted font-plex text-sm font-medium rounded-lg hover:bg-paper-sub transition-colors"
 >
 Customize
 </button>
 </div>

 <p className="font-plex text-[11px] text-ink-whisper text-center">
 By continuing you agree to our{' '}
 <a href="/terms" className="underline hover:text-ink">Terms</a>,{' '}
 <a href="/privacy" className="underline hover:text-ink">Privacy Policy</a>, and{' '}
 <a href="/cookies" className="underline hover:text-ink">Cookie Policy</a>.
 </p>
 </div>
 ) : (
 /* Customize panel */
 <div className="space-y-5">
 <ToggleRow
 icon={<Shield className="w-4 h-4 text-semantic-success-700" />}
 title="Essential"
 description="Required. Wallet session (ag_sess, 30 days) and CSRF protection."
 retention="Up to 30 days"
 checked={true}
 disabled={true}
 />
 <ToggleRow
 icon={<Settings className="w-4 h-4 text-ink-muted" />}
 title="Preferences"
 description="UI settings, alert preferences, saved addresses."
 retention="Up to 1 year"
 checked={preferences.preferences}
 onChange={() => togglePreference('preferences')}
 />
 <ToggleRow
 icon={<BarChart3 className="w-4 h-4 text-ink-muted" />}
 title="Analytics"
 description="Usage events (scans, page views) in our database. No third-party services. No tracking cookies set."
 retention="Database records, up to 2 years"
 checked={preferences.analytics}
 onChange={() => togglePreference('analytics')}
 />

 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={handleSavePreferences}
 className="flex-1 px-5 py-3 bg-ink text-paper font-plex text-sm font-semibold rounded-lg hover:bg-ink/90 transition-colors"
 >
 Save preferences
 </button>
 <button
 onClick={() => setShowSettings(false)}
 className="px-5 py-3 text-ink-muted font-plex text-sm font-medium rounded-lg hover:bg-paper-sub transition-colors"
 >
 Back
 </button>
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 </div>
 </>
 )
}

function CategoryCard({
 icon,
 title,
 description,
 badge,
}: {
 icon: React.ReactNode
 title: string
 description: string
 badge?: string
}) {
 return (
 <div className="p-3 bg-paper-sub rounded-lg border border-ink-rule">
 <div className="flex items-center gap-2 mb-1.5">
 {icon}
 <span className="font-plex text-sm font-medium text-ink">{title}</span>
 {badge && (
 <span className="ml-auto font-mono text-[9px] font-bold tracking-wider uppercase text-semantic-success-700">
 {badge}
 </span>
 )}
 </div>
 <p className="font-plex text-[11px] text-ink-muted leading-[1.5]">{description}</p>
 </div>
 )
}

function ToggleRow({
 icon,
 title,
 description,
 retention,
 checked,
 disabled,
 onChange,
}: {
 icon: React.ReactNode
 title: string
 description: string
 retention: string
 checked: boolean
 disabled?: boolean
 onChange?: () => void
}) {
 return (
 <div className="flex items-center gap-4 p-4 bg-paper-sub rounded-lg border border-ink-rule">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 {icon}
 <span className="font-plex text-sm font-medium text-ink">{title}</span>
 </div>
 <p className="font-plex text-[11px] text-ink-muted">{description}</p>
 <p className="font-mono text-[10px] text-ink-whisper mt-1">Retention: {retention}</p>
 </div>
 {disabled ? (
 <span className="font-mono text-[9px] font-bold tracking-wider uppercase text-semantic-success-700 shrink-0">
 Required
 </span>
 ) : (
 <button
 type="button"
 role="switch"
 aria-checked={checked}
 onClick={onChange}
 aria-label={`${checked ? 'Disable' : 'Enable'} ${title} cookies`}
 className={`relative inline-flex h-6 w-11 items-center border transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
 checked ? 'bg-ink border-ink' : 'bg-paper border-ink-rule'
 }`}
 >
 <span
 className={`inline-block h-4 w-4 transform transition-transform ${
 checked ? 'translate-x-6 bg-paper' : 'translate-x-1 bg-ink'
 }`}
 />
 </button>
 )}
 </div>
 )
}
