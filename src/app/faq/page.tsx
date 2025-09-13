'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function FAQPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <H1 className="mb-6">Frequently Asked Questions</H1>
            <p className="text-xl text-stone leading-relaxed mb-8">
              Find immediate clarity below. If your question isn&apos;t answered, contact our team at legal.support@allowanceguard.com. We are here to help.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* The Basics */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Understanding Allowances and Our Tool</H2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">What is a token allowance?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  A token allowance is a permission you grant a smart contract to spend a specific amount of your tokens. This is necessary for using decentralized exchanges (DEXs) or other dApps but can become a security risk if left unchecked. When you approve a token allowance, you are essentially giving another contract the right to move those tokens from your wallet on your behalf. This permission persists until you explicitly revoke it, even if you no longer use the dApp that requested it.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">What does Allowance Guard do?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Allowance Guard is a dashboard that scans the blockchain for all these allowances connected to your wallet. It presents them in a simple list, assesses each one for potential risk, and allows you to revoke any permission instantly with one click. Our platform reads public blockchain data to identify every token approval associated with your wallet address, analyzes each approval for security risks, and provides you with clear, actionable information to secure your assets.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Is Allowance Guard a wallet?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  No. Allowance Guard is a non-custodial security tool. It is a window into your wallet&apos;s permissions, not a wallet itself. It never holds your funds or private keys. We are a read-only security dashboard that helps you understand and manage the permissions you have granted to various smart contracts. Your funds always remain in your own wallet, and you maintain complete control over all transactions.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Security & Privacy */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Our Security Model and Your Privacy</H2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Is it safe to connect my wallet?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Yes. Connecting your wallet via MetaMask or WalletConnect only grants the application permission to read your public address and view your token allowances. This is a read-only operation. We cannot access your private keys, sign transactions on your behalf, or move any funds. You will still sign every revocation transaction directly within your own wallet. The connection uses industry-standard protocols that are used by thousands of dApps, and we implement the same security practices as major DeFi platforms.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">What data do you collect and store?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We store the minimal data required to provide our service. This includes your public wallet address and a cached copy of your allowance data to improve performance. We do not store private keys, seed phrases, or personal information. We collect anonymized usage data to improve the product. For full details, please read our Privacy Policy. All data is encrypted at rest using AES-256 encryption, and all communications are protected by TLS 1.3. We follow strict data retention policies and automatically purge cached data after defined periods.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">How does your risk engine work?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Our risk engine uses a rule-based system fueled by real-time threat intelligence. It flags allowances based on several heuristics, including whether an allowance is set to &apos;unlimited,&apos; if the spender contract is on a known malicious address list, if the allowance amount is anomalously high, or if the contract lacks verified source code. The system continuously updates its threat intelligence from multiple sources, including security researchers, blockchain analysis firms, and community reports. Risk scores are calculated using weighted algorithms that consider contract reputation, approval patterns, and historical exploit data.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Using the Product */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Using the Dashboard</H2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">How much does it cost?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  The core functionality of Allowance Guard is completely free to use. We believe basic Web3 security should be accessible to everyone. Our project is sustained through voluntary contributions from our community to fund development and infrastructure costs. We do not charge subscription fees, premium tiers, or hidden costs. The only costs you may encounter are the standard gas fees required for blockchain transactions when revoking allowances, which are paid directly to the network validators, not to us.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">What does &apos;revoking&apos; an allowance do?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Revoking an allowance sets the spending limit for that specific token and contract to zero. This completely removes the contract&apos;s ability to spend those tokens from your wallet. It is a permanent action executed on the blockchain via a transaction that you sign, requiring gas fees. Once revoked, the smart contract can no longer access those tokens unless you explicitly grant a new allowance. This is the most effective way to eliminate the security risk posed by unused or suspicious allowances.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Why do I have to pay gas to revoke?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Revoking an allowance is a transaction on the Ethereum blockchain. Gas fees are the payment required to miners/validators to process and confirm that transaction. Allowance Guard does not receive any portion of these fees; they are a fundamental part of using the Ethereum network. Gas fees vary based on network congestion and transaction complexity. We provide gas estimation tools to help you understand the costs before confirming the transaction, and we optimize our revocation contracts to minimize gas usage wherever possible.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Technical & Support */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Technical Details and Troubleshooting</H2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Which wallets and chains do you support?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We currently support all Ethereum Virtual Machine (EVM) compatible wallets like MetaMask, Coinbase Wallet, and WalletConnect. Our initial focus is on the Ethereum mainnet, Arbitrum, and Base networks. Support for other chains like Polygon, Optimism, and Avalanche is on our development roadmap. We use standard wallet connection protocols, so any wallet that supports these protocols will work with our platform. We continuously expand our network support based on user demand and security considerations.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">The transaction to revoke failed. What should I do?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Transaction failures are typically due to network congestion or insufficient gas. Ensure you have enough ETH in your wallet to cover the gas fees for the transaction. You can try again and adjust the gas fee settings in your wallet for a higher priority. If problems persist, please contact support with the transaction hash. We can help diagnose the specific cause of the failure and provide guidance on resolving it. Common issues include insufficient gas limits, network congestion, or temporary smart contract issues.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">I found a bug or have a feature request. How can I contribute?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We welcome community input. Please report bugs or suggest features on our GitHub repository. For general feedback, you can email us at legal.support@allowanceguard.com. Financial contributions to support our work can be made via our contributing page. We review all bug reports and feature requests, and we prioritize security-related issues and improvements that benefit the broader community. We also welcome code contributions from developers who want to help improve the platform.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Advanced Security Questions */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-12">Advanced Security Questions</H2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">How do you ensure the integrity of your smart contracts?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We use only standard, well-audited ERC-20 and ERC-721 functions for revocation operations, specifically the &apos;approve(spender, 0)&apos; function and &apos;setApprovalForAll(spender, false)&apos; function. These are the same functions used by all legitimate DeFi applications and have been extensively tested by the broader Ethereum community. We do not deploy custom smart contracts that could introduce additional attack vectors. All revocation operations are executed through these standard, battle-tested functions, ensuring maximum security and compatibility across all token standards.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">What happens if your service goes down?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Allowance Guard is a read-only service that helps you identify and manage allowances, but your allowances exist independently on the blockchain regardless of our service status. If our service is temporarily unavailable, your allowances remain unchanged, and you can still revoke them directly through Etherscan or other blockchain explorers. We maintain high availability through redundant infrastructure and monitoring systems, but we recommend keeping our service as one tool in your security toolkit rather than your only option for managing allowances.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">How do you handle false positives in risk assessment?</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Our risk engine is designed to err on the side of caution, flagging potentially risky allowances for your review rather than missing actual threats. We provide detailed explanations for why each allowance was flagged, including specific risk factors and context. Users can review each flagged allowance and make informed decisions about whether to revoke it. We continuously refine our algorithms based on user feedback and new threat intelligence to reduce false positives while maintaining high detection rates for actual threats.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Support Section */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-ink mb-8">
              Still Need Help?
            </h2>
            <p className="text-xl text-stone leading-relaxed mb-12">
              Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help with any questions about Allowance Guard, wallet security, or token allowances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-electric text-white rounded-lg hover:bg-electric/90 transition-all duration-200 text-lg font-medium"
              >
                Contact Support
              </a>
              <a 
                href="/docs" 
                className="inline-flex items-center justify-center px-8 py-4 border border-ink text-ink rounded-lg hover:bg-ink hover:text-white transition-all duration-200 text-lg font-medium"
              >
                Documentation
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}