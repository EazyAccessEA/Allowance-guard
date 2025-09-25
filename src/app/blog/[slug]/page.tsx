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