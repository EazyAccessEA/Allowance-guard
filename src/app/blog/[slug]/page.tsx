'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

// Blog post interface
interface BlogPost {
  slug: string
  title: string
  subtitle: string
  content: string
  publishedAt: string
  readTime: string
  category: string
  featured: boolean
  tags?: string[]
}

// Break content into smaller chunks to avoid build process issues
const blogContent = {
  intro: `
    <p>In our ongoing discussion of Web3 security, we have focused on managing the permissions you grant to smart contracts. This is like curating the list of people allowed to enter a bank. It is a critical, essential practice. But what about the master key to the vault itself?</p>
    <p>That master key is your private key. The security of every asset you own rests on its secrecy. Most users keep this key in a "hot wallet"—a browser extension or mobile app. This is like leaving the vault key on the bank teller's desk: convenient, but constantly exposed to the risks of the outside world.</p>
    <p>True digital sovereignty requires a shift in mindset from digital convenience to physical security. By moving your private keys from software to specialized hardware and adopting multi-signature protocols, you create layers of defense that are nearly impossible for remote attackers to penetrate. This is how you elevate your security from a practice of hope to a fortress of certainty.</p>
    <p>This guide will explain the fundamental importance of hardware wallets and multisigs, how they work together, and how you can implement them to build an institutional-grade security setup for your own assets.</p>
  `,
  
  hotWallet: `
    <h2>The Hot Wallet Problem: Securing the Master Key</h2>
    <p>Your private key is a secret string of data that authorizes all actions from your wallet. Whoever has it has total control. A hot wallet stores this key on a device that is connected to the internet, such as your computer or smartphone. While incredibly convenient for daily use, this creates inherent vulnerabilities:</p>
    <ul>
      <li><strong>Malware Exposure:</strong> Malicious software like keyloggers, clipboard hijackers, or spyware can potentially find and steal your private key or seed phrase from your computer's memory or files.</li>
      <li><strong>Phishing Vulnerabilities:</strong> A sophisticated phishing site can trick you into signing a malicious transaction. Because the signing occurs within the browser environment, it can be difficult to spot the deception.</li>
      <li><strong>Remote Attacks:</strong> Any security flaw in your browser, operating system, or the wallet software itself could theoretically be exploited by a remote attacker.</li>
    </ul>
    <p>For daily transactions with small amounts, the convenience of a hot wallet is often an acceptable risk. But for storing significant value, it is an unnecessary gamble.</p>
  `,
  
  hardwareWallet: `
    <h2>The Hardware Wallet: A Vault for Your Private Key</h2>
    <p>A hardware wallet is a small, specialized physical device designed to do one thing: keep your private keys secure and offline. It creates an "air gap" between your keys and the internet-connected world, fundamentally changing the security game.</p>
    <h3>How It Works</h3>
    <p>The magic of a hardware wallet lies in its "secure element"—a hardened microcontroller chip that is designed to be tamper-resistant. Your private keys are generated and stored within this chip and are physically incapable of ever leaving it.</p>
    <p>When you want to make a transaction:</p>
    <ol>
      <li>The unsigned transaction is sent from your computer to the hardware wallet.</li>
      <li>The device uses the private key stored on its secure chip to sign the transaction internally.</li>
      <li>Only the signed, safe-to-broadcast transaction is sent back to your computer.</li>
      <li>Your private key is never exposed to your computer, your browser, or the internet.</li>
    </ol>
  `,
  
  protections: `
    <h3>The Core Protections a Hardware Wallet Provides</h3>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Hot Wallet (Browser Extension)</th>
          <th>Hardware Wallet</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Key Storage</strong></td>
          <td>On an internet-connected device (computer/phone).</td>
          <td>In an offline, secure chip on a dedicated device.</td>
        </tr>
        <tr>
          <td><strong>Malware Resistance</strong></td>
          <td>Vulnerable to keyloggers and spyware.</td>
          <td>Immune to remote software-based key theft.</td>
        </tr>
        <tr>
          <td><strong>Transaction Confirmation</strong></td>
          <td>A pop-up window in your browser.</td>
          <td>A mandatory physical button press on the device.</td>
        </tr>
        <tr>
          <td><strong>Phishing Defense</strong></td>
          <td>Low. A fake website can present a misleading transaction.</td>
          <td>High. The device's trusted display shows the true transaction details (amount, recipient) for verification.</td>
        </tr>
      </tbody>
    </table>
    <p>The trusted display is a critical, often-understated feature. Even if a phishing site tells you you're signing a transaction to mint an NFT, the hardware wallet's screen will show you the raw truth: you're about to approve a transaction that sends all of your WETH to an attacker's address. This gives you a final, reliable chance to catch the fraud and press "Reject."</p>
  `,
  
  multisig: `
    <h2>Multisignature Wallets: Security Through Shared Control</h2>
    <p>A hardware wallet protects your single key from being compromised. But what if that single device is lost, stolen, or destroyed? A multisignature wallet (or "multisig") solves this problem by eliminating the concept of a single point of failure entirely.</p>
    <p>A multisig is a smart contract wallet that requires multiple private keys to approve a single transaction. You define the rules, such as:</p>
    <ul>
      <li><strong>2-of-3:</strong> The wallet has three authorized keys (signers), and any two of them must approve a transaction for it to be executed.</li>
      <li><strong>3-of-5:</strong> The wallet has five signers, and any three must approve.</li>
    </ul>
    <p>This creates powerful resilience. In a 2-of-3 setup, if one key is lost or compromised, your funds remain safe because the attacker does not have the second required signature. You can then use your two remaining keys to remove the compromised key and secure your wallet.</p>
  `,
  
  personal: `
    <h2>The Personal Multisig: Beyond DAOs</h2>
    <p>Multisigs are not just for large DAOs managing treasuries. They are arguably the most robust security setup an individual can achieve. You can create a personal multisig where you control all the signing keys, but distribute them across different devices and locations.</p>
    <p>A powerful 2-of-3 personal setup might look like this:</p>
    <ul>
      <li><strong>Signer 1:</strong> Your primary hardware wallet (e.g., a <a href="https://shop.ledger.com/?r=c748f3b6c81b" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Ledger</a>), used for initiating transactions.</li>
      <li><strong>Signer 2:</strong> A second hardware wallet from a different brand (e.g., a <a href="https://trezor.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Trezor</a>), stored securely in a separate location like a safe deposit box or a trusted family member's home.</li>
      <li><strong>Signer 3:</strong> A hot wallet on your mobile phone, used only as a secondary confirmation device.</li>
    </ul>
    <p>With this structure, an attacker would need to compromise you in two different locations to steal your funds, a dramatically harder task.</p>
  `,
  
  goldStandard: `
    <h2>The Gold Standard: Combining Hardware with Multisig</h2>
    <p>For the highest level of security, you can combine these two concepts. By assigning each signer of your multisig wallet to its own dedicated hardware wallet, you create a setup that is both physically distributed and cryptographically secured.</p>
    <p>This means an attacker would need to physically steal multiple hardware devices from different locations and compromise their PINs or seed phrases to gain control. This is the model used by institutional custodians to secure billions of dollars in digital assets, and it is fully accessible to any individual user willing to adopt the practice.</p>
    <p>This approach, combined with diligent allowance management, creates a security posture where:</p>
    <ul>
      <li>Permissions are limited (via <a href="/" className="text-primary-accent hover:text-primary-accent/80 underline">AllowanceGuard</a>).</li>
      <li>Signatures are protected (via hardware wallets).</li>
      <li>Control is decentralized (via multisig).</li>
    </ul>
  `,
  
  gettingStarted: `
    <h2>A Practical Guide to Getting Started</h2>
    <p>Adopting this level of security is a gradual process. The goal is to progressively move your assets to safer storage as their value increases.</p>
    <h3>Setting Up Your First Hardware Wallet</h3>
    <ol>
      <li><strong>Buy Directly from the Manufacturer:</strong> Purchase your device only from the official websites of reputable brands like <a href="https://shop.ledger.com/?r=c748f3b6c81b" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Ledger</a>, <a href="https://trezor.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Trezor</a>, <a href="https://keyst.one/?rfsn=8853588.a928f0&utm_source=refersion&utm_medium=affiliate&utm_campaign=8853588.a928f0" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Keystone</a>, or <a href="https://gridplus.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">GridPlus</a>. This prevents supply chain attacks where a device is tampered with before it reaches you.</li>
      <li><strong>Verify the Packaging:</strong> Ensure the device's packaging is sealed and shows no signs of tampering.</li>
      <li><strong>Initialize the Device:</strong> Follow the official instructions carefully. During this process, the device will generate your new private key and show you a 24-word recovery phrase (seed phrase).</li>
      <li><strong>Secure Your Seed Phrase:</strong> Write down your seed phrase on paper or a steel plate. Never store it digitally (no photos, no text files, no password managers). Store your physical backup in a secure, private location. This phrase is the only backup for your funds if your device is lost or broken.</li>
      <li><strong>Perform a Test Transaction:</strong> Send a small amount of crypto to your new hardware wallet. Then, reset the device and restore it using your seed phrase to confirm your backup is correct. Once confirmed, you can move larger sums.</li>
    </ol>
  `,
  
  multisigSetup: `
    <h3>Creating Your First Personal Multisig</h3>
    <ol>
      <li><strong>Use a Trusted Platform:</strong> <a href="https://safe.global/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Safe{Wallet}</a> (formerly Gnosis Safe) is the battle-tested industry standard for creating multisig wallets. It is a user-friendly interface for deploying your own personal security contract.</li>
      <li><strong>Choose Your Signers:</strong> Decide which of your existing wallets will be the signers. You can start with a 2-of-2 setup using your browser wallet and a new hardware wallet.</li>
      <li><strong>Set Your Threshold:</strong> Define the policy (e.g., 2 out of 2 signatures required).</li>
      <li><strong>Deploy and Fund:</strong> Deploy the Safe contract to the blockchain. Once created, you will have a new address for your multisig. Send a small test amount to this address first before moving significant assets.</li>
    </ol>
  `,
  
  nextSteps: `
    <h2>Practical Next Steps</h2>
    <ol>
      <li><strong>Buy a Hardware Wallet:</strong> If you hold a meaningful amount of crypto in a browser wallet, make purchasing a hardware wallet your top security priority for this quarter.</li>
      <li><strong>Migrate Your Long-Term Holdings:</strong> Move any assets you don't need for daily trading or interaction to your new hardware wallet.</li>
      <li><strong>Experiment with a Test Multisig:</strong> Create a <a href="https://safe.global/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Safe{Wallet}</a> on a low-cost network (like Polygon or Arbitrum) with a few dollars. Practice sending and confirming transactions to understand the workflow before using it for high-value assets.</li>
      <li><strong>Build Your Personal Security Roadmap:</strong> Plan your evolution. Start with a hot wallet, graduate to a hardware wallet for storage, and aim for a personal multisig as your ultimate vault.</li>
    </ol>
    <p>Moving to hardware wallets and multisigs is the most significant step you can take to secure your digital sovereignty. It's a deliberate choice to trade a little convenience for a tremendous amount of security and peace of mind.</p>
  `
}

// Combine content chunks
const fullContent = Object.values(blogContent).join('\n')

// Blog posts data - in a real app, this would come from a CMS or database
const blogPosts: BlogPost[] = [
  {
    slug: 'hardware-wallets-and-multisigs-elevating-your-security',
    title: 'Hardware Wallets and Multisigs: Elevating Your Security',
    subtitle: 'From Digital Convenience to Physical Security',
    content: fullContent,
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Security',
    featured: true
  },
  {
    slug: 'understanding-smart-contract-risk-beyond-allowances',
    title: 'Understanding Smart Contract Risk Beyond Allowances',
    subtitle: 'The Hidden Dangers in the Code You Trust',
    content: `
      <p>Managing your token allowances is like diligently locking the doors and windows of your home. It&apos;s a fundamental, non-negotiable step in securing your assets. But what if the building itself has a cracked foundation? What if the landlord can enter and change the locks at any time, without warning?</p>

      <p>This is the reality of smart contract risk. While allowances control who can access your tokens, the underlying smart contracts define what can be done with them. These contracts are not static blocks of code; they are often living, upgradeable, and deeply interconnected programs. A bug, a malicious upgrade, or a vulnerability in a connected protocol can create a security failure that no amount of allowance management can prevent on its own.</p>

      <p>To truly secure your on-chain presence, you must look beyond allowances and develop a deeper understanding of the contracts you interact with. This guide will teach you how to assess contract-level risk, identify hidden dangers like proxies and composability, and build a more resilient security strategy.</p>

      <h2>The Living Code You Place Your Trust In</h2>
      
      <p>When you use a decentralized application (dapp), you are not just interacting with a website. You are sending your assets to be managed by one or more smart contracts. These autonomous programs are responsible for everything:</p>

      <ul>
        <li><strong>Custody:</strong> They hold your tokens in liquidity pools, staking vaults, or lending protocols.</li>
        <li><strong>Execution:</strong> They contain the logic that executes your swaps, calculates your yield, or issues your loans.</li>
        <li><strong>Interaction:</strong> They can call other smart contracts across the ecosystem to perform complex, multi-step operations.</li>
      </ul>

      <p>Your trust is not in the dapp&apos;s brand or its user interface; it is a direct trust in the integrity of its underlying code. If that code is flawed or can be changed maliciously, your assets are at risk, regardless of how carefully you manage your approvals.</p>

      <h2>The Double-Edged Sword of Upgradeable Contracts</h2>
      
      <p>In the early days of Ethereum, most smart contracts were immutable—once deployed, their code could never be changed. This created a rigid but predictable security environment. Today, most major protocols use upgradeable contracts to allow for bug fixes and new features without requiring a massive, disruptive user migration.</p>

      <p>This is typically achieved using a proxy pattern. Imagine your home address is permanent (the proxy contract), but an architect can swap out the entire internal layout and structure overnight (the implementation contract).</p>

      <p>While convenient for developers, this introduces a significant new risk vector for users. A contract you reviewed and trusted today could be replaced by a completely different, potentially malicious, version tomorrow. Your existing token approval would still be valid for the same proxy address, but it would now point to dangerous new logic.</p>

      <p>Here are common proxy patterns you will encounter:</p>

      <table>
        <thead>
          <tr>
            <th>Proxy Pattern</th>
            <th>How It Works</th>
            <th>The Primary Risk for Users</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Transparent Proxy</strong></td>
            <td>The proxy contract holds the assets and user state, but forwards all logic-related calls to a separate implementation contract.</td>
            <td>The protocol&apos;s administrators can unilaterally change the implementation contract, altering the core logic that governs your funds.</td>
          </tr>
          <tr>
            <td><strong>Beacon Proxy</strong></td>
            <td>Multiple proxy contracts point to a single "beacon" contract, which in turn points to the implementation logic.</td>
            <td>A single upgrade to the beacon can change the rules for every user of every proxy simultaneously, creating a systemic risk.</td>
          </tr>
          <tr>
            <td><strong>Diamond (EIP-2535)</strong></td>
            <td>A single proxy contract routes calls to many smaller, modular logic contracts called "facets."</td>
            <td>While highly flexible, this pattern significantly increases the contract&apos;s complexity and attack surface, making a full security audit more difficult.</td>
          </tr>
        </tbody>
      </table>

      <p>An upgradeable contract is not inherently bad, but it requires a higher degree of trust in the team that controls the upgrade keys.</p>

      <h2>Hidden Dangers: Composability and Chained Risk</h2>
      
      <p>DeFi is often described as "money Legos" because of composability—the ability for protocols to seamlessly plug into and build upon one another. A yield aggregator can deposit funds into a lending protocol, which might use a decentralized exchange for liquidations.</p>

      <p>This powerful feature also creates chained risk. Your risk exposure is not limited to the protocol you interact with directly; it is the sum of the risks of every protocol in the chain.</p>

      <p>Consider this common scenario:</p>

      <p><strong>You → Yield Aggregator (Protocol A) → Lending Protocol (Protocol B) → Oracle (Protocol C)</strong></p>

      <p>Even if Protocol A is perfectly audited and secure, you are still exposed to risks from B and C:</p>

      <ul>
        <li><strong>Counterparty Risk:</strong> A bug or exploit in the lending protocol (B) could lead to a loss of the aggregator&apos;s (A) funds—which includes your deposit.</li>
        <li><strong>Dependency Risk:</strong> If the lending protocol (B) relies on a price oracle (C) that gets manipulated, it could trigger improper liquidations, causing losses that flow back up the chain to you.</li>
        <li><strong>Bridge Risk:</strong> If a protocol uses wrapped assets from a cross-chain bridge, a hack of that bridge can make the wrapped tokens worthless, impacting the protocol and its users.</li>
      </ul>

      <p>When you deposit into a composable protocol, you are implicitly trusting its entire stack of dependencies.</p>

      <h2>A Practical Toolkit for Risk Assessment</h2>
      
      <p>You do not need to be a Solidity developer to perform a basic risk assessment of a smart contract. Using free, public tools, you can gather enough information to make a more informed decision.</p>

      <h3>1. Check for Reputable Audits</h3>
      
      <p>Audits are a crucial signal, but not all are created equal.</p>

      <ul>
        <li>Look for multiple audits from well-known security firms (e.g., Trail of Bits, OpenZeppelin, ConsenSys Diligence, Certik). A single audit, especially from an unknown firm, is a weak signal.</li>
        <li>Read the audit summary. Pay attention to any high-severity findings that were not resolved by the development team.</li>
      </ul>

      <h3>2. Verify Open-Source Code</h3>
      
      <p>Trustworthy projects publish their source code for public review.</p>

      <p>On a block explorer like Etherscan, navigate to the contract&apos;s address and click the "Contract" tab. Look for a green checkmark indicating that the source code is verified and matches the deployed bytecode. If the code is not verified, it is a significant red flag.</p>

      <h3>3. Identify Upgradeability and Admin Keys</h3>
      
      <p>This is perhaps the most important check you can perform.</p>

      <ul>
        <li><strong>Is it a proxy?</strong> On the "Contract" tab in Etherscan, look for buttons labeled "Read as Proxy" or "Write as Proxy." If you see them, the contract is upgradeable. Click through to find the address of the current implementation contract.</li>
        <li><strong>Who holds the keys?</strong> Investigate the admin address that has the power to upgrade the contract. Is it a single person&apos;s wallet (an EOA, or Externally Owned Account)? This is extremely high-risk. A better setup is a multi-signature wallet controlled by several parties. The best-case scenario is a timelock, where all upgrades are subject to a mandatory public delay, giving users time to review changes and withdraw funds if necessary.</li>
      </ul>

      <h2>Building Your Own Risk Scorecard</h2>
      
      <p>You can track these factors in a simple spreadsheet to compare protocols and manage your exposure.</p>

      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Low Risk</th>
            <th>Medium Risk</th>
            <th>High Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Upgradeability</strong></td>
            <td>Immutable (Not a proxy)</td>
            <td>Upgradeable via a DAO with a timelock</td>
            <td>Upgradeable by a single wallet or small multi-sig with no delay</td>
          </tr>
          <tr>
            <td><strong>Audit Coverage</strong></td>
            <td>Multiple audits from top-tier firms</td>
            <td>One reputable audit, or audits from newer firms</td>
            <td>No public audits, or unresolved critical findings</td>
          </tr>
          <tr>
            <td><strong>Source Code</strong></td>
            <td>Verified, open-source, and well-documented</td>
            <td>Verified but complex and poorly documented</td>
            <td>Unverified ("black box")</td>
          </tr>
          <tr>
            <td><strong>Admin Control</strong></td>
            <td>Fully decentralized (no admin keys) or a large, diverse DAO</td>
            <td>Controlled by a multi-sig of 3-7 known parties</td>
            <td>Controlled by a single anonymous EOA</td>
          </tr>
          <tr>
            <td><strong>Contract Age</strong></td>
            <td>>1 year, battle-tested through high-volume usage</td>
            <td>3-12 months old, gaining traction</td>
            <td><3 months old, unaudited, or recently launched</td>
          </tr>
        </tbody>
      </table>

      <h2>Layering Your Defenses</h2>
      
      <p>Understanding smart contract risk does not replace the need for diligent allowance management—it enhances it. These two practices form a powerful, layered security strategy.</p>

      <ul>
        <li><strong>Allowance management</strong> is your first line of defense, controlling access at your wallet&apos;s edge.</li>
        <li><strong>Contract risk assessment</strong> is your second line of defense, helping you decide which protocols are trustworthy enough to interact with in the first place.</li>
      </ul>

      <p>When you combine these, your security posture becomes proactive. If you see a governance proposal to remove a timelock or a suspicious upgrade to a contract you use, you can immediately use a tool like <a href="/" className="text-primary-accent hover:text-primary-accent/80 underline">AllowanceGuard</a> to revoke your approval before any potential damage is done.</p>

      <h2>Practical Next Steps</h2>
      
      <p>Knowledge is most powerful when put into practice. Take these steps this week to begin assessing risk beyond allowances.</p>

      <ol>
        <li><strong>Pick One Dapp You Use Daily:</strong> Go to its contract address on a block explorer. Use the guide above to determine if it is an upgradeable proxy.</li>
        <li><strong>Identify the Admin:</strong> Find out who controls the upgrade keys. Is it a single address or a multi-sig with a timelock?</li>
        <li><strong>Check Its Audit History:</strong> Look for the project&apos;s security audits. Have they been audited by reputable firms?</li>
        <li><strong>Make an Informed Decision:</strong> Based on your findings, decide if your current level of exposure to this protocol aligns with your risk tolerance. Adjust your position or revoke allowances if you are uncomfortable.</li>
      </ol>

      <p>By expanding your focus from just allowances to the full architecture of a smart contract, you move from being a passive user to an informed and empowered participant in the decentralized ecosystem.</p>
    `,
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false
  }
]

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = React.use(params)
  const { slug } = resolvedParams

  // Find the blog post
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Find the current post index for navigation
  const currentIndex = blogPosts.findIndex(p => p.slug === slug)
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  return (
    <>
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
          <div className="max-w-4xl mx-auto">
            {/* Back to blog link */}
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-accent transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default" className="text-sm">
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge variant="outline" className="text-sm">
                    Featured
                  </Badge>
                )}
              </div>
              
              <H1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {post.title}
              </H1>
              
              <p className="text-xl text-text-secondary mb-6">
                {post.subtitle}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              {/* Tags - Optional */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>
          </div>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Article content */}
            <article 
              className="prose max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Call to action */}
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Secure Your Token Allowances?
              </h3>
              <p className="text-text-secondary mb-6">
                Don&apos;t wait for an attack to happen. Start monitoring and managing your token allowances today with AllowanceGuard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-accent text-white font-semibold rounded-lg hover:bg-primary-accent/90 transition-colors duration-200"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="/docs"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-accent text-primary-accent font-semibold rounded-lg hover:bg-primary-accent/10 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-border-primary">
              {prevPost ? (
                <Link 
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-primary-accent transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  <div>
                    <p className="text-sm font-medium">Previous</p>
                    <p className="text-sm">{prevPost.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextPost ? (
                <Link 
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-primary-accent transition-colors duration-200 ml-auto"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium">Next</p>
                    <p className="text-sm">{nextPost.title}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}