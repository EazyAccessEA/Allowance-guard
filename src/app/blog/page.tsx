'use client'

/**
 * Blog index — Ledger aesthetic
 *
 * Council:
 *  Maren: paper/grain surfaces, font-display-tight headlines, Highlight signature, no glassmorphism
 *  Kael: SectionHeader, paper-card (no rounded-lg), system pills
 *  Idris: CascadingScrollAnimation on hero + every card
 *  Noor: semantic article elements, alt text on images, AA contrast
 *  Thane: No VideoBackground. Images use next/image with lazy loading.
 *  #20 Brand: "Thinking clearly about Web3 security" — editorial, not listicle
 *  #21 Technical: Categories as mono labels, not coloured pills
 *  #22 Conversion: Featured article earns prime position, clear read CTA
 */

import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import Highlight from '@/components/ui/Highlight'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

interface BlogPost {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  publishedAt: string
  readTime: string
  category: string
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    slug: 'open-source-stronger-our-license-update',
    title: 'Open Source, Stronger: Our License Update to AGPL-3.0',
    subtitle: 'Why We Switched Licenses and What It Means for You',
    excerpt: 'AllowanceGuard is moving from GPL-3.0 to AGPL-3.0 with a commercial dual-license option. The core tool stays free and open source — this change protects the community and sustains the project for the long run.',
    publishedAt: '2026-04-02',
    readTime: '5 min read',
    category: 'Community',
    featured: false,
  },
  {
    slug: 'hardware-wallets-and-multisigs-elevating-your-security',
    title: 'Hardware Wallets and Multisigs: Elevating Your Security',
    subtitle: 'From Digital Convenience to Physical Security',
    excerpt: 'True digital sovereignty requires a shift from digital convenience to physical security. Hardware wallets and multisigs create layers of defence that are nearly impossible for remote attackers to penetrate.',
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Security',
    featured: true,
  },
  {
    slug: 'understanding-smart-contract-risk-beyond-allowances',
    title: 'Understanding Smart Contract Risk Beyond Allowances',
    subtitle: 'The Hidden Dangers in the Code You Trust',
    excerpt: 'Managing token allowances is like locking doors and windows. But what if the building itself has a cracked foundation? Smart contract risk goes beyond permissions.',
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'building-your-personal-web3-security-routine',
    title: 'Building Your Personal Web3 Security Routine',
    subtitle: 'Transform Security from Emergency Response to Daily Habit',
    excerpt: 'The most effective defence is not heroic effort — it\u2019s a quiet, consistent routine. Like fire drills, you practise so your response is automatic when it matters.',
    publishedAt: '2024-12-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'gas-fees-and-revocations-making-security-cost-effective',
    title: 'Gas, Fees, and Revocations: Making Security Cost-Effective',
    subtitle: 'Transforming Security from Expensive Chore to Low-Cost Habit',
    excerpt: 'Security is like insurance — everyone understands its importance, but paying the premium can feel like a burden. What if you could lower the cost?',
    publishedAt: '2025-08-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'understanding-layer-2-networks-how-they-work',
    title: 'Understanding Layer 2 Networks: How They Work',
    subtitle: 'A Deeper Dive into Scalable Ethereum',
    excerpt: 'To understand Layer 2 solutions, we first need to understand the Blockchain Trilemma. Layer 2 networks are the key to unlocking Ethereum\u2019s scalability.',
    publishedAt: '2025-06-19',
    readTime: '12 min read',
    category: 'Education',
    featured: false,
  },
  {
    slug: 'red-team-yourself-simulating-an-attack-on-your-wallet',
    title: 'Red Team Yourself: Simulating an Attack on Your Wallet',
    subtitle: 'Your Personal Flight Simulator for Web3 Security',
    excerpt: 'Commercial pilots spend hundreds of hours in flight simulators. Why should we treat our digital wealth with any less seriousness?',
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'programmable-safety-future-allowance-security',
    title: 'Programmable Safety: The Future of Allowance Security',
    subtitle: 'From Static Risk to Dynamic, Self-Managing Guardrails',
    excerpt: 'When you give a house key to a contractor, you don\u2019t expect them to keep it forever. Yet in Web3, we routinely give smart contracts permanent, unlimited access.',
    publishedAt: '2024-12-19',
    readTime: '9 min read',
    category: 'Innovation',
    featured: false,
  },
  {
    slug: 'staying-safe-with-defi-dapps',
    title: 'Staying Safe With DeFi Dapps',
    subtitle: 'The Hidden Risks Behind the "Connect Wallet" Button',
    excerpt: 'Every DeFi experience begins with a click: "Connect Wallet." Behind that click sits a world of permissions, smart contracts, and potential traps.',
    publishedAt: '2024-12-19',
    readTime: '7 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'how-to-self-audit-your-wallet',
    title: 'How to Self-Audit Your Wallet',
    subtitle: 'Take Control of Your Own Security',
    excerpt: 'Web3 gives you total custody of your assets — but it also makes you your own security officer. The good news: auditing your wallet is easier than you think.',
    publishedAt: '2024-12-19',
    readTime: '6 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'what-are-token-allowances',
    title: 'What Are Token Allowances and Why They Matter',
    subtitle: 'The Silent Permission You\u2019re Probably Giving Away',
    excerpt: 'Every time you connect a wallet to a DeFi app, you approve something. Most people click without thinking. That click gives the app a standing permission to move your assets.',
    publishedAt: '2024-12-18',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'from-dapp-user-to-security-advocate-building-community-trust',
    title: 'From Dapp User to Security Advocate: Building Community Trust',
    subtitle: 'How to Become a Force Multiplier for Web3 Security',
    excerpt: 'For too long, we\u2019ve treated security as a purely personal problem. To build a truly resilient ecosystem, we must become security advocates.',
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Community',
    featured: false,
  },
  {
    slug: 'permit2-and-eip-2612-the-new-approval-frontier',
    title: 'Permit2 and EIP-2612: The New Approval Frontier',
    subtitle: 'The approval mechanism is evolving. Here\u2019s what you need to know.',
    excerpt: 'Modern DEXs use off-chain signatures instead of on-chain approvals. Better UX, but new phishing risks. Understand Permit2 before you sign.',
    publishedAt: '2026-04-13',
    readTime: '7 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'anatomy-of-an-approval-exploit',
    title: 'The Anatomy of an Approval Exploit',
    subtitle: 'How a forgotten allowance becomes a seven-figure loss.',
    excerpt: 'A trader lost $1.4M in 90 seconds through a forgotten approval. Every approval exploit follows the same pattern. Here\u2019s the kill chain \u2014 and how to break it.',
    publishedAt: '2026-04-13',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
  },
  {
    slug: 'cross-chain-security-bridging-without-getting-burned',
    title: 'Cross-Chain Security: Bridging Without Getting Burned',
    subtitle: 'Bridge exploits are the largest category of DeFi loss.',
    excerpt: 'Over $2 billion lost to bridge hacks in a single year. If you use multiple chains, you\u2019re using bridges. Understanding their risks is essential.',
    publishedAt: '2026-04-13',
    readTime: '8 min read',
    category: 'Education',
    featured: false,
  },
  {
    slug: 'why-we-open-sourced-our-security-scanner',
    title: 'Why We Open-Sourced Our Security Scanner',
    subtitle: 'The story behind AllowanceGuard and the decision to build in the open.',
    excerpt: 'AllowanceGuard started with a spreadsheet and a hundred forgotten approvals. Here\u2019s why we built it \u2014 and why we open-sourced it.',
    publishedAt: '2026-04-13',
    readTime: '6 min read',
    category: 'Community',
    featured: false,
  },
  {
    slug: 'a-non-technical-guide-to-reading-token-approvals',
    title: 'A Non-Technical Guide to Reading Token Approvals',
    subtitle: 'What every column, number, and label on your dashboard means.',
    excerpt: 'You\u2019ve scanned your wallet. Now you\u2019re looking at a table of addresses, amounts, and risk labels. Here\u2019s what it all means \u2014 no jargon.',
    publishedAt: '2026-04-13',
    readTime: '7 min read',
    category: 'Education',
    featured: false,
  },
  {
    slug: 'account-abstraction-future-of-wallet-approvals',
    title: 'Account Abstraction and the Future of Wallet Approvals',
    subtitle: 'Smart accounts change everything about how permissions work.',
    excerpt: 'ERC-4337 smart accounts replace blanket approvals with session keys, batched transactions, and wallet-level spending limits. Here\u2019s what changes.',
    publishedAt: '2026-04-13',
    readTime: '8 min read',
    category: 'Education',
    featured: false,
  },
  {
    slug: 'why-most-wallet-security-tools-fail',
    title: 'Why Most Wallet Security Tools Fail',
    subtitle: 'The five blind spots that leave users exposed.',
    excerpt: 'Single-chain blindness, lists without scores, no monitoring, one-at-a-time revocation, custody requirements. If your tool has any of these, it\u2019s not enough.',
    publishedAt: '2026-04-13',
    readTime: '7 min read',
    category: 'Innovation',
    featured: false,
  },
]

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-paper">

      {/* ── Hero ── */}
      <section className="paper grain relative py-24 sm:py-32 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.10) 0%, transparent 55%),' +
              'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
          }}
        />
        <Container className="relative z-10">
          <SectionHeader
            number="AG"
            eyebrow="Blog"
            title={<>Thinking clearly about <Highlight>Web3 security.</Highlight></>}
            lede="Insights, guides, and deep dives into token allowances, wallet defence, and DeFi best practices."
          />
        </Container>
      </section>

      {/* ── Featured article ── */}
      {featuredPost && (
        <section className="paper-sub grain py-20 sm:py-28 overflow-hidden">
          <Container>
            <div className="max-w-5xl mx-auto">
              <CascadingScrollAnimation direction="up" distance={40} delay={0}>
                <article className="paper-card-raised overflow-hidden">
                    <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-baseline gap-3 mb-5">
                        <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                          Featured
                        </span>
                        <span className="h-px w-8 bg-ink-rule" aria-hidden="true" />
                        <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
                          {featuredPost.category}
                        </span>
                      </div>

                      <h2 className="font-display-tight text-ink leading-[1.05] text-3xl sm:text-4xl mb-4">
                        <Link href={`/blog/${featuredPost.slug}`} className="hover:text-amber-deep transition-colors duration-200">
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-6">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="font-mono text-xs text-ink-whisper tracking-wide">
                          {formatDate(featuredPost.publishedAt)} &middot; {featuredPost.readTime}
                        </div>
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="paper-button text-sm"
                        >
                          Read article
                        </Link>
                      </div>
                    </div>
                </article>
              </CascadingScrollAnimation>
            </div>
          </Container>
        </section>
      )}

      {/* ── All articles ── */}
      <section className="paper grain py-20 sm:py-28 overflow-hidden">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <SectionHeader
                number="01"
                eyebrow="Archive"
                title="All articles."
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, i) => (
                <CascadingScrollAnimation key={post.slug} direction="up" distance={30} delay={(i % 3) * 80}>
                  <article className="paper-card h-full flex flex-col group">
                    <div className="p-6 flex flex-col flex-1">
                      {/* Category mono label */}
                      <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-3">
                        {post.category}
                      </span>

                      <h3 className="font-display-tight text-ink leading-[1.1] text-lg mb-3 group-hover:text-amber-deep transition-colors duration-200">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="font-plex text-ink-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-rule">
                        <span className="font-mono text-[10px] text-ink-whisper tracking-wide">
                          {formatDateShort(post.publishedAt)} &middot; {post.readTime}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-plex text-sm font-medium text-amber-deep hover:underline"
                        >
                          Read
                        </Link>
                      </div>
                    </div>
                  </article>
                </CascadingScrollAnimation>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
