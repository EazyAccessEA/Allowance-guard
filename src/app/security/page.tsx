'use client'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'

export default function SecurityPage() {





  return (
    <div className="min-h-screen bg-white text-ink">
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Security First: Our Uncompromising Commitment to Your Safety</H1>
          <p className="text-xl text-stone max-w-reading mb-8">
            Allowance Guard is a non-custodial Web3 security platform designed exclusively to identify, assess, and mitigate token approval risks. We never hold your private keys, funds, or sensitive credentials.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Our Security Commitment */}
      <Section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-8">Our Security Commitment</h2>
            <p className="text-lg text-stone leading-relaxed mb-12">
              In the Web3 environment, security is not merely a feature but the foundational principle upon which all trust is built. The decentralized nature of blockchain technology, while revolutionary, introduces unique attack vectors that traditional security models cannot address. Token approvals represent the single largest attack surface in decentralized finance, with approval-based exploits accounting for 73% of all DeFi security incidents in 2024, resulting in over $3.2 billion in losses. Allowance Guard is engineered to the PuredgeOS 3.0 God-tier standard, incorporating foundational security principles that ensure the highest levels of protection, clarity, and performance. Our commitment to security is absolute and uncompromising.
            </p>
          </div>
        </Container>
      </Section>

      {/* How We Protect You and Your Data */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">How We Protect You and Your Data</h2>
            
            <div className="space-y-16">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Encryption in Transit</h3>
                <p className="text-lg text-stone leading-relaxed">
                  All data transmission between your browser and Allowance Guard&apos;s servers is encrypted using TLS 1.3, the most current and secure version of the Transport Layer Security protocol. Every connection is mandated to enforce HTTPS, ensuring that all communications are protected by modern cryptographic standards. Our implementation uses perfect forward secrecy, meaning that even if our private keys were compromised, past communications would remain secure. All API endpoints require HTTPS, and we implement HTTP Strict Transport Security (HSTS) headers to prevent protocol downgrade attacks.
                </p>
              </div>

                  <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Encryption at Rest</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Any user data that is persisted in our databases, including user preferences, cached allowance lists for performance optimization, and session information, is encrypted using industry-standard AES-256 encryption. This includes data stored in our PostgreSQL database, Redis cache, and any temporary storage systems. Database encryption keys are managed through a secure key management system and are rotated regularly. We maintain strict data retention policies, with most user data automatically purged after defined periods to minimize exposure.
                </p>
                    </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Secure Infrastructure</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Allowance Guard is hosted on Vercel&apos;s secure cloud infrastructure, which provides enterprise-grade security features including DDoS protection, automated security scanning, and global CDN distribution. Our systems are hardened according to industry best practices, with regular security patches applied automatically. We implement comprehensive monitoring and logging systems that operate 24/7 to detect and respond to unauthorized access attempts, anomalous behavior, and potential security incidents. All infrastructure components are regularly audited and updated to maintain the highest security standards.
                </p>
                  </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Wallet Connection Security</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Allowance Guard provides an explicit guarantee that the application never requests, receives, or stores a user&apos;s private keys, seed phrases, or any other sensitive credentials. All wallet connections are established through secure, industry-standard protocols such as WalletConnect or direct browser extension integration. All transactions are proposed to the user and must be signed directly within their own wallet application, such as MetaMask, Coinbase Wallet, or other supported wallet providers. We never have the ability to initiate transactions on behalf of users, ensuring that users maintain complete control over their funds at all times.
                </p>
                </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Smart Contract Security</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Allowance Guard utilizes direct, well-audited standard function calls for token approval revocation, specifically the ERC-20 `approve(spender, 0)` function and ERC-721 `setApprovalForAll(spender, false)` function. These are the same functions used by all legitimate DeFi applications and have been extensively tested and audited by the broader Ethereum community. We do not deploy custom smart contracts that could introduce additional attack vectors. All revocation operations are executed through these standard, battle-tested functions, ensuring maximum security and compatibility across all token standards.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Privacy Principles */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">Our Privacy Principles</h2>
            
            <div className="space-y-16">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Data Minimization</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Allowance Guard operates on the principle of data minimization, collecting only the absolute minimum data required to provide our security services. This includes exclusively the public wallet address and on-chain allowance data that is already publicly available on the blockchain. We do not collect unnecessary personal information, browsing history, or any data unrelated to token approval security. Our data collection is purpose-limited and directly tied to the core functionality of identifying and managing token approval risks.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Data Usage and Non-Aggregation</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We provide an absolute guarantee that user data is never sold, rented, or shared with third parties for advertising, marketing, or any commercial purposes. All collected data is used exclusively for providing and improving the core service functionality, including risk scoring algorithms, performance optimization, and security monitoring. We do not aggregate user data for analytics or create user profiles for any purpose beyond the direct provision of our security services. Our data usage is transparent, limited, and directly tied to the security functions that users explicitly request.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Transparency and User Control</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Users maintain complete control over their data and can disconnect their wallet at any time, which immediately ceases all active data fetching and processing. We provide clear visibility into what data is being collected and how it is being used. Users can request a complete export of their data or request deletion of all stored information. Our privacy practices are documented transparently, and we regularly update our policies to reflect any changes in data handling practices. Users are notified of any significant changes to our privacy practices with adequate advance notice.
                </p>
                </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What Data We Collect and Why */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">What Data We Collect and Why</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Public Wallet Address</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We collect your public wallet address to fetch and display token allowances from the blockchain. This address is used to query blockchain data through our indexer or third-party APIs such as The Graph, Alchemy, or Infura. The wallet address is public information that is already visible on the blockchain and is necessary for the core functionality of identifying and displaying your token approvals. We do not associate this address with any personal information or create user profiles beyond the security analysis.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">On-Chain Allowance Data</h3>
                <p className="text-lg text-stone leading-relaxed">
                  The list of token approvals, including token contract addresses, spender addresses, and approval amounts, is retrieved from the blockchain via our indexer or third-party APIs. This data includes ERC-20 token approvals and ERC-721/ERC-1155 NFT approvals. This information is public data that exists on the blockchain; we simply organize, analyze, and present it in a user-friendly format. We cache this data temporarily for performance optimization but do not store it permanently or use it for any purpose beyond the security analysis you request.
              </p>
            </div>
            
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Application Usage Telemetry</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We collect anonymous usage data, including feature usage patterns, performance metrics, error reports, and application performance indicators. This data is collected solely to diagnose problems, improve application performance, and enhance user experience. All telemetry data is anonymized and aggregated, never tied to a user&apos;s public wallet address or any identifying information. This includes metrics such as page load times, feature adoption rates, and error frequencies, which help us optimize the application according to PuredgeOS clarity metrics and performance standards.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">User Preferences and Settings</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We store user preferences such as alert settings, monitoring configurations, team memberships, and notification preferences. This data is encrypted and stored securely to maintain your personalized experience across sessions. This includes email addresses for alert subscriptions, Slack webhook URLs for team notifications, and risk assessment preferences. All preference data is directly tied to the security services you explicitly configure and is not used for any other purpose.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Your Rights and Controls */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">Your Rights and Controls</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Data Control and Portability</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Given the nature of our product, the primary data we work with consists of on-chain transactions and approvals, which are immutable and publicly available on the blockchain. However, regarding the application itself and any data we store, you maintain complete control. You can discontinue use at any time by disconnecting your wallet, which immediately ceases all data collection and processing. You can request a complete export of any data we have stored about you, including preferences, settings, and cached information. You also have the right to request deletion of all stored data, with the exception of data required for legal compliance or security purposes.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Account Management</h3>
                <p className="text-lg text-stone leading-relaxed">
                  If you have created an account through our team features or email authentication, you can manage your account settings, update your preferences, and control your data through the application interface. You can modify alert settings, update team memberships, change notification preferences, and manage all aspects of your account without requiring assistance. For any questions about data handling, privacy practices, or account management, you can contact our security team at security@allowanceguard.com for prompt assistance.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Compliance and Legal Rights</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We comply with applicable data protection laws and regulations, including GDPR, CCPA, and other relevant privacy frameworks. You have the right to access your data, correct inaccurate information, request data portability, and request deletion of your data. We will respond to all privacy-related requests within the timeframes required by applicable law. If you believe we have not handled your data in accordance with our privacy policy or applicable law, you have the right to lodge a complaint with the relevant supervisory authority.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Continuous Vigilance */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">Continuous Vigilance</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Security Research and Responsible Disclosure</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We maintain an active security research program and welcome responsible disclosure of potential vulnerabilities. Security researchers who identify security issues in our platform are encouraged to report them through our dedicated security contact at security@allowanceguard.com. We follow responsible disclosure practices, providing adequate time for remediation before public disclosure. We acknowledge and credit security researchers who help improve our platform&apos;s security through responsible disclosure.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Regular Security Audits and Testing</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Our systems undergo regular penetration testing and security audits conducted by independent third-party security firms. These assessments cover all aspects of our platform, including web application security, infrastructure security, and data protection measures. All dependencies and third-party libraries are continuously monitored for newly disclosed vulnerabilities, and security updates are applied promptly. We maintain a comprehensive security monitoring program that operates 24/7 to detect and respond to potential security incidents.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Security Incident Response</h3>
                <p className="text-lg text-stone leading-relaxed">
                  We maintain a formal security incident response plan that outlines procedures for detecting, analyzing, and responding to security incidents. Our incident response team is trained to handle various types of security events, from minor vulnerabilities to major security breaches. In the event of a security incident that may affect user data or system integrity, we will notify affected users promptly and provide regular updates throughout the incident response process. We also maintain relationships with law enforcement and regulatory authorities as appropriate for security incident reporting.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact for Security Issues */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-ink mb-8">Contact for Security Issues</h2>
            <p className="text-xl text-stone leading-relaxed mb-12">
              For security vulnerabilities, privacy concerns, or any security-related questions, please contact our dedicated security team.
            </p>
            
            <div className="bg-white border border-line rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-ink mb-4">Security Contact</h3>
              <p className="text-lg text-stone mb-6">
                Email: <a href="mailto:security@allowanceguard.com" className="text-cobalt hover:underline">security@allowanceguard.com</a>
              </p>
              <p className="text-base text-stone leading-relaxed">
                We encourage responsible disclosure of security vulnerabilities. Please include detailed information about the issue, steps to reproduce it, and any potential impact. We will respond to all security reports within 24 hours and work with you to resolve any issues promptly and professionally.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}