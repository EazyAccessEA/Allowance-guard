'use client'
import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import ConnectButton from '@/components/ConnectButton'

export default function SettingsPage() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [selectedWallet] = useState<string | null>(null)
  
  // Email Alerts state
  const [email, setEmail] = useState('')
  const [riskOnly, setRiskOnly] = useState(true)
  const [subMsg, setSubMsg] = useState<string | null>(null)
  
  // Risk Policy state
  const [policy, setPolicy] = useState<{
    min_risk_score: number
    unlimited_only: boolean
    include_spenders: string[]
    ignore_spenders: string[]
    include_tokens: string[]
    ignore_tokens: string[]
    chains: number[]
  } | null>(null)
  const [policyMsg, setPolicyMsg] = useState<string | null>(null)
  
  // Slack state
  const [webhook, setWebhook] = useState('')
  const [slackMsg, setSlackMsg] = useState<string | null>(null)
  
  // Share state
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [shareMsg, setShareMsg] = useState<string | null>(null)
  const [censorAddr, setCensorAddr] = useState(true)
  const [censorAmt, setCensorAmt] = useState(false)
  const [riskOnlyShare, setRiskOnlyShare] = useState(true)
  const [expireDays, setExpireDays] = useState<number | ''>('')

  const targetWallet = selectedWallet || connectedAddress

  // Load policy on mount
  const loadPolicy = useCallback(async () => {
    if (!targetWallet) return
    const r = await fetch(`/api/policy?wallet=${targetWallet}`)
    const j = await r.json()
    setPolicy(j.policy ?? { 
      min_risk_score: 0, 
      unlimited_only: false, 
      include_spenders: [], 
      ignore_spenders: [], 
      include_tokens: [], 
      ignore_tokens: [], 
      chains: [] 
    })
  }, [targetWallet])

  useEffect(() => { 
    if (targetWallet) {
      loadPolicy()
    }
  }, [targetWallet, loadPolicy])

  // Email Alerts functions
  async function subscribe() {
    if (!email) return setSubMsg('Enter an email address')
    if (!targetWallet) return setSubMsg('Select or connect a wallet first')
    
    const res = await fetch('/api/alerts/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        wallet: targetWallet,
        email,
        risk_only: riskOnly
      })
    })
    
    const json = await res.json()
    if (!res.ok) return setSubMsg(json.error || 'Failed to subscribe')
    setSubMsg('Subscribed successfully')
  }

  // Risk Policy functions
  async function savePolicy() {
    if (!targetWallet || !policy) return setPolicyMsg('Select a wallet and configure policy first')
    
    const res = await fetch('/api/policy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        wallet: targetWallet,
        ...policy
      })
    })
    
    const json = await res.json()
    if (!res.ok) return setPolicyMsg(json.error || 'Failed to save policy')
    setPolicyMsg('Policy saved')
  }

  // Slack functions
  async function addSlack() {
    if (!webhook) return setSlackMsg('Enter a webhook URL')
    if (!targetWallet) return setSlackMsg('Select or connect a wallet first')
    
    const res = await fetch('/api/slack/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        wallet: targetWallet,
        webhook_url: webhook
      })
    })
    
    const json = await res.json()
    if (!res.ok) return setSlackMsg(json.error || 'Failed to add webhook')
    setSlackMsg('Webhook added')
  }

  // Share functions
  const shareUrl = shareToken ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/share/${shareToken}` : null

  async function generateShare() {
    if (!targetWallet) return setShareMsg('Select or connect a wallet first')
    const r = await fetch('/api/share/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        wallet: targetWallet,
        censor_addresses: censorAddr,
        censor_amounts: censorAmt,
        risk_only: riskOnlyShare,
        expires_in_days: typeof expireDays === 'number' ? expireDays : null
      })
    })
    const j = await r.json()
    if (!r.ok) return setShareMsg(j.error || 'Failed to create link')
    setShareToken(j.token)
    setShareMsg('Share link created')
  }

  async function expireShareLink() {
    if (!targetWallet) return setShareMsg('Select or connect a wallet first')
    const r = await fetch('/api/share/expire', {
      method: 'POST', 
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ wallet: targetWallet })
    })
    if (!r.ok) return setShareMsg('Failed to expire link')
    setShareToken(null)
    setShareMsg('Share link expired')
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white text-ink">
        <Header isConnected={isConnected} />
        <Section>
          <Container className="text-center">
            <H1 className="mb-6">Settings</H1>
            <p className="text-base text-stone max-w-reading mx-auto mb-8">
              Connect your wallet to access comprehensive settings and configure your security monitoring preferences.
            </p>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-line rounded-md p-6 bg-mist">
                  <h3 className="text-lg font-semibold text-ink mb-3">Email Alerts</h3>
                  <p className="text-sm text-stone mb-3">
                    Get notified when new approvals are detected on your wallets via Microsoft SMTP.
                  </p>
                  <ul className="text-sm text-stone space-y-1">
                    <li>• Daily digest emails with risky approval summaries</li>
                    <li>• Risk-only filtering to reduce notification noise</li>
                    <li>• Customizable preferences per wallet address</li>
                  </ul>
                </div>

                <div className="border border-line rounded-md p-6 bg-mist">
                  <h3 className="text-lg font-semibold text-ink mb-3">Risk Policy Configuration</h3>
                  <p className="text-sm text-stone mb-3">
                    Configure what counts as alert-worthy for your specific needs.
                  </p>
                  <ul className="text-sm text-stone space-y-1">
                    <li>• Set minimum risk score thresholds</li>
                    <li>• Focus on unlimited approvals only</li>
                    <li>• Include/exclude specific addresses</li>
                  </ul>
                </div>

                <div className="border border-line rounded-md p-6 bg-mist">
                  <h3 className="text-lg font-semibold text-ink mb-3">Slack Integration</h3>
                  <p className="text-sm text-stone mb-3">
                    Get daily digests directly in your Slack workspace.
                  </p>
                  <ul className="text-sm text-stone space-y-1">
                    <li>• Webhook-based notifications</li>
                    <li>• Rich formatting with approval details</li>
                    <li>• Team collaboration features</li>
                  </ul>
                </div>

                <div className="border border-line rounded-md p-6 bg-mist">
                  <h3 className="text-lg font-semibold text-ink mb-3">Public Share Links</h3>
                  <p className="text-sm text-stone mb-3">
                    Generate read-only links to share your wallet's approval status.
                  </p>
                  <ul className="text-sm text-stone space-y-1">
                    <li>• Privacy controls (censor addresses/amounts)</li>
                    <li>• Risk-only filtering for public sharing</li>
                    <li>• Expiration dates for temporary access</li>
                  </ul>
                </div>
              </div>

              <div className="bg-ink text-white rounded-md p-6">
                <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Connect your wallet to access these settings and start monitoring your token approvals with custom alerts and policies.
                </p>
                <p className="text-sm opacity-75 mb-6">
                  Your wallet connection is secure and only used to identify which settings apply to your addresses.
                </p>
                <div className="flex justify-center">
                  <ConnectButton 
                    variant="primary"
                    className="bg-white text-ink hover:bg-white/90 transition-all duration-200 px-8 py-3 text-base font-medium rounded-lg"
                  />
                </div>
              </div>
            </div>
          </Container>
        </Section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/V3AG.mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Settings</H1>
          <p className="text-base text-stone max-w-reading mb-12">
            Configure alerts, policies, and sharing options for your wallet.
          </p>

          <div className="space-y-12">
            {/* Email Alerts Card */}
            <div className="border border-line rounded-md p-8">
              <H2 className="mb-3">Email Alerts</H2>
              <p className="text-base text-stone mb-6">
                Get notified when new approvals are detected on your wallets.
              </p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                  />
                </div>
                    
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="riskOnly"
                    checked={riskOnly}
                    onChange={(e) => setRiskOnly(e.target.checked)}
                    className="mr-3 focus:outline-none focus:ring-2 focus:ring-ink/30"
                  />
                  <label htmlFor="riskOnly" className="text-base text-stone">
                    Only alert for high-risk approvals
                  </label>
                </div>
                
                <button
                  onClick={subscribe}
                  className="bg-ink text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
                >
                  Subscribe to Alerts
                </button>
                
                {subMsg && (
                  <p className="text-base text-stone">{subMsg}</p>
                )}
              </div>
            </div>

            {/* Risk Policy Card */}
            <div className="border border-line rounded-md p-8">
              <H2 className="mb-3">Risk Policy</H2>
              <p className="text-base text-stone mb-6">
                Configure what counts as alert-worthy for your wallet.
              </p>
              
              {policy && (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <label className="text-base text-stone font-medium w-32">Min risk score</label>
                    <input 
                      className="w-24 px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30" 
                      type="number"
                      value={policy?.min_risk_score || 0}
                      onChange={e=>policy && setPolicy({...policy, min_risk_score: Number(e.target.value)})}
                    />
                  </div>
                  
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={policy?.unlimited_only || false}
                      onChange={e=>policy && setPolicy({...policy, unlimited_only: e.target.checked})}
                      className="rounded focus:outline-none focus:ring-2 focus:ring-ink/30"
                    />
                    <span className="text-base text-stone">Only alert on UNLIMITED approvals</span>
                  </label>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="text-base text-stone font-medium mb-2">Include spenders (comma-separated)</div>
                      <input 
                        className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                        value={(policy?.include_spenders||[]).join(',')}
                        onChange={e=>policy && setPolicy({...policy, include_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                      />
                    </div>
                    <div>
                      <div className="text-base text-stone font-medium mb-2">Ignore spenders</div>
                      <input 
                        className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                        value={(policy?.ignore_spenders||[]).join(',')}
                        onChange={e=>policy && setPolicy({...policy, ignore_spenders: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                      />
                    </div>
                    <div>
                      <div className="text-base text-stone font-medium mb-2">Include tokens</div>
                      <input 
                        className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                        value={(policy?.include_tokens||[]).join(',')}
                        onChange={e=>policy && setPolicy({...policy, include_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                      />
                    </div>
                    <div>
                      <div className="text-base text-stone font-medium mb-2">Ignore tokens</div>
                      <input 
                        className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                        value={(policy?.ignore_tokens||[]).join(',')}
                        onChange={e=>policy && setPolicy({...policy, ignore_tokens: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={savePolicy} 
                    className="bg-ink text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
                  >
                    Save Policy
                  </button>
                  {policyMsg && <span className="text-base text-stone ml-4">{policyMsg}</span>}
                </div>
              )}
            </div>

            {/* Slack Alerts Card */}
            <div className="border border-line rounded-md p-8">
              <H2 className="mb-3">Slack Alerts</H2>
              <p className="text-base text-stone mb-6">
                Get daily digests in your Slack workspace.
              </p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-base text-stone font-medium mb-2">
                    Slack webhook URL:
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                    placeholder="https://hooks.slack.com/services/..."
                    value={webhook} 
                    onChange={e=>setWebhook(e.target.value)} 
                  />
                </div>
                
                <button 
                  onClick={addSlack} 
                  className="bg-ink text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
                >
                  Add Webhook
                </button>
                {slackMsg && (
                  <span className="text-base text-stone ml-4">
                    {slackMsg}
                  </span>
                )}
                
                <div className="bg-mist border border-line rounded-md p-4">
                  <p className="text-sm text-stone">
                    <strong>Tip:</strong> Create a webhook at <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">api.slack.com/apps</a> → Create New App → Enable Incoming Webhooks → Add to channel
                  </p>
                </div>
              </div>
            </div>

            {/* Public Share Link Card */}
            <div className="border border-line rounded-md p-8">
              <H2 className="mb-3">Public Share Link</H2>
              <p className="text-base text-stone mb-6">
                Generate a read-only link to share your wallet&apos;s approval status with others.
              </p>
              
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 gap-4">
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={censorAddr} 
                      onChange={e => setCensorAddr(e.target.checked)} 
                      className="rounded focus:outline-none focus:ring-2 focus:ring-ink/30"
                    />
                    <span className="text-base text-stone">Censor addresses (0x1234…abcd)</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={censorAmt} 
                      onChange={e => setCensorAmt(e.target.checked)} 
                      className="rounded focus:outline-none focus:ring-2 focus:ring-ink/30"
                    />
                    <span className="text-base text-stone">Hide amounts</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={riskOnlyShare} 
                      onChange={e => setRiskOnlyShare(e.target.checked)} 
                      className="rounded focus:outline-none focus:ring-2 focus:ring-ink/30"
                    />
                    <span className="text-base text-stone">Risky only (UNLIMITED / STALE / risk&gt;0)</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <span className="text-base text-stone w-32">Expire after (days)</span>
                    <input 
                      className="w-20 px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30" 
                      type="number"
                      value={expireDays} 
                      onChange={e => setExpireDays(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Never"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={generateShare} 
                    className="bg-ink text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
                  >
                    Generate / Rotate
                  </button>
                  <button 
                    onClick={expireShareLink} 
                    className="bg-white text-ink border border-ink px-6 py-3 rounded-md font-medium hover:bg-ink hover:text-white transition focus:outline-none focus:ring-2 focus:ring-ink/30"
                  >
                    Expire Link
                  </button>
                  {shareMsg && (
                    <span className="text-base text-stone flex items-center">
                      {shareMsg}
                    </span>
                  )}
                </div>

                {shareToken && (
                  <div className="mt-4">
                    <label className="block text-base text-stone font-medium mb-2">
                      Share URL:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        className="flex-1 px-3 py-2 border border-line rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink/30" 
                        readOnly 
                        value={shareUrl ?? ''} 
                      />
                      <button
                        onClick={async () => { 
                          await navigator.clipboard.writeText(shareUrl || '')
                          setShareMsg('URL copied to clipboard!')
                        }}
                        className="bg-ink text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-ink/30"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-mist border border-line rounded-md p-4">
                  <p className="text-sm text-stone">
                    <strong>Privacy:</strong> Share links are read-only and can be expired at any time. 
                    Addresses and amounts can be censored for privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
