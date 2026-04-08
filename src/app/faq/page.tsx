'use client'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import VideoBackground from '@/components/VideoBackground'

export default function FAQPage() {

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10 bg-paper-deep/90" />
        
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="mobbin-display-1 text-ink mb-6 mobbin-fade-in text-left">Frequently Asked Questions</h1>
            <p className="mobbin-body-large text-ink-muted leading-relaxed mb-8 mobbin-fade-in mobbin-stagger-1 text-left">
              Straight answers. If yours isn&apos;t here, reach us at support@allowanceguard.com.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* The Basics */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-ink mb-12 mobbin-fade-in">The Basics</h2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">What is a token allowance?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    A permission you grant a smart contract to spend your tokens. Required for DEXs and dApps, but the permission persists after you stop using them. If left unchecked, a compromised contract can drain approved tokens from your wallet.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">What does Allowance Guard do?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    A security dashboard that scans your wallet for every token approval, scores each one for risk, and lets you revoke with one click. We read public blockchain data — your keys stay in your wallet.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">Is Allowance Guard a wallet?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    No. It is a read-only security dashboard, not a wallet. We never hold funds or keys. Think of it as a window into your wallet&apos;s permissions — you see them, you decide what stays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Security & Privacy */}
      <Section className="py-32 bg-paper-deep">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-ink mb-12 mobbin-fade-in">Security & Privacy</h2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">Is it safe to connect my wallet?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Yes. Connecting via MetaMask or WalletConnect grants read-only access to your public address and approvals. We cannot access private keys, sign transactions, or move funds. You sign every revocation yourself, in your own wallet.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">What data do you collect and store?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Minimal data: your public wallet address and cached allowance data for performance. No private keys, no seed phrases, no personal information. Encrypted at rest (AES-256), in transit (TLS 1.3). Full details in our Privacy Policy.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">How does your risk engine work?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Rule-based scoring powered by live threat intelligence. Flags unlimited amounts, known malicious addresses, unverified contract code, and anomalous approval patterns. Scores update continuously as new threat data comes in from security researchers, blockchain analysts, and community reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Using the Product */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-ink mb-12 mobbin-fade-in">Using the Dashboard</h2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">How much does it cost?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    The core scanner is free and open source. Scan wallets, view risk scores, and revoke approvals at no cost — you only pay the network gas fee for on-chain revocations. Pro and Sentinel plans unlock monitoring, batch revoke, multi-chain views, and team tools.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">What does revoking do?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Sets the spending limit for that token and contract to zero. The contract can no longer access your tokens unless you grant a new approval. It is an on-chain transaction that you sign and pay gas for.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">Why do I pay gas to revoke?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Revoking is an on-chain transaction. Gas goes to network validators, not to us. We show a gas estimate before you confirm, and our batch revoke contract minimises the cost when revoking multiple approvals at once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Technical & Support */}
      <Section className="py-32 bg-paper-deep">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-ink mb-12 mobbin-fade-in">Technical & Support</h2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">Which wallets and chains do you support?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Any EVM-compatible wallet: MetaMask, Coinbase Wallet, WalletConnect, and others. We cover 15 chains: Ethereum, Arbitrum, Base, Polygon, Optimism, Avalanche, BNB Chain, Fantom, zkSync Era, Polygon zkEVM, Mantle, Gnosis, Linea, Scroll, and Celo.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">My revocation transaction failed.</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Usually caused by insufficient gas or network congestion. Check that you have enough ETH (or the chain&apos;s native token) and try again with a higher gas setting. If it keeps failing, contact support with the transaction hash.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">How do I report a bug or request a feature?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Open an issue on our GitHub repository. For general feedback, email support@allowanceguard.com. Security-related reports are prioritised. Code contributions are welcome — see our Contributing page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Advanced Security Questions */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-ink mb-12 mobbin-fade-in">Advanced Security Questions</h2>
            
            <div className="space-y-8">
              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">How do you ensure smart contract integrity?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Revocations use standard ERC-20 <code>approve(spender, 0)</code> and ERC-721 <code>setApprovalForAll(spender, false)</code> — the same functions every legitimate DeFi protocol uses. No custom contracts that could introduce additional attack surface.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">What if your service goes down?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Your approvals exist on-chain, independent of our service. If we go offline, your approvals are unchanged and you can revoke directly through Etherscan or any block explorer. We target 99.9% uptime with redundant infrastructure.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">How do you handle false positives?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    The engine errs on the side of caution — better to flag and explain than to miss a real threat. Every flagged approval shows exactly which risk factors triggered the score. You review, you decide. We refine algorithms continuously based on feedback and new threat data.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-4">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">Has AllowanceGuard been audited?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Initial security assessment completed September 2024, covering the risk engine, data handling, and contract interactions. Revocations use standard ERC-20/ERC-721 functions tested by the broader Ethereum ecosystem. SOC 2 Type II compliance and third-party audits are in progress.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-5">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">How fresh is the data?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Allowance data refreshes on every scan — pulled live from the chain. Threat intelligence updates continuously throughout the day. Risk scores recalculate in real time as new data arrives. For best results, scan after interacting with new protocols.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-6">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">I think an approval was wrongly flagged.</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Every flag shows the specific risk factors that triggered it — unlimited amount, unverified code, known patterns. If you disagree, report it through our feedback system. We review every report and adjust detection rules when warranted.
                  </p>
                </div>
              </div>

              <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-7">
                <div className="p-8">
                  <h3 className="mobbin-heading-3 text-ink mb-6">Where does your malicious contract data come from?</h3>
                  <p className="mobbin-body-large text-ink-muted leading-relaxed">
                    Multiple sources: security researchers, blockchain analysis firms, community reports, and our own threat intelligence. The database covers known exploits, phishing contracts, and rug pulls, updated continuously. Our risk scoring is one tool in your security toolkit — always do your own research as well.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Support Section */}
      <Section className="py-32 bg-paper-deep">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobbin-heading-1 text-ink mb-8 mobbin-fade-in">
              Still Need Help?
            </h2>
            <p className="mobbin-body-large text-ink-muted leading-relaxed mb-12 mobbin-fade-in mobbin-stagger-1">
              Question not covered here? Reach out — we respond to every inquiry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mobbin-fade-in">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring bg-amber-500 text-ink rounded-lg hover:bg-amber-400 transition-all duration-200"
              >
                Contact Support
              </a>
              <a 
                href="/docs" 
                className="inline-flex items-center justify-center px-8 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-ink-rule text-ink rounded-lg hover:bg-paper-sub hover:text-ink transition-all duration-200"
              >
                Documentation
              </a>
            </div>
          </div>
        </Container>
      </Section>

    </div>
  )
}