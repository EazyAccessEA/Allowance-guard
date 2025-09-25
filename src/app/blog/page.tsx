'use client'

import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

// Blog posts data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    slug: 'hardware-wallets-and-multisigs-elevating-your-security',
    title: 'Hardware Wallets and Multisigs: Elevating Your Security',
    subtitle: 'From Digital Convenience to Physical Security',
    excerpt: 'In our ongoing discussion of Web3 security, we have focused on managing the permissions you grant to smart contracts. But what about the master key to the vault itself? True digital sovereignty requires a shift in mindset from digital convenience to physical security.',
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Security',
    featured: true
  },
  {
    slug: 'understanding-smart-contract-risk-beyond-allowances',
    title: 'Understanding Smart Contract Risk Beyond Allowances',
    subtitle: 'The Hidden Dangers in the Code You Trust',
    excerpt: 'Managing your token allowances is like diligently locking the doors and windows of your home. But what if the building itself has a cracked foundation? What if the landlord can enter and change the locks at any time, without warning? This is the reality of smart contract risk.',
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'building-your-personal-web3-security-routine',
    title: 'Building Your Personal Web3 Security Routine',
    subtitle: 'Transform Security from Emergency Response to Daily Habit',
    excerpt: 'We practice fire drills not because we expect a fire today, but so our response is calm and automatic when it matters most. Why, then, do so many of us treat our digital wealth differently? The most effective defense is not a one-time, heroic effort. It is a quiet, consistent, and deliberate routine.',
    publishedAt: '2024-12-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'gas-fees-and-revocations-making-security-cost-effective',
    title: 'Gas, Fees, and Revocations: Making Security Cost-Effective',
    subtitle: 'Transforming Security from Expensive Chore to Low-Cost Habit',
    excerpt: 'Security is like insurance. Everyone understands its importance, but paying the premium can feel like a burden. In Web3, the "premium" for securing your wallet is often paid in gas fees. But what if you could significantly lower that premium?',
    publishedAt: '2024-12-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'programmable-safety-future-allowance-security',
    title: 'Programmable Safety: The Future of Allowance Security',
    subtitle: 'From Static Risk to Dynamic, Self-Managing Guardrails',
    excerpt: 'When you give a house key to a contractor, you don\'t expect them to keep it forever. Yet in Web3, we routinely give smart contracts permanent, unlimited access to our digital assets. The solution is not more manual work, but smarter automation: programmable safety.',
    publishedAt: '2024-12-19',
    readTime: '9 min read',
    category: 'Innovation',
    featured: false
  },
  {
    slug: 'staying-safe-with-defi-dapps',
    title: 'Staying Safe With DeFi Dapps',
    subtitle: 'The Hidden Risks Behind the "Connect Wallet" Button',
    excerpt: 'Every DeFi experience begins with a click: "Connect Wallet." Behind that click sits a world of permissions, smart contracts, and potential traps. Knowing how to recognize red flags, verify dapps, and manage your approvals can prevent catastrophic losses.',
    publishedAt: '2024-12-19',
    readTime: '7 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'how-to-self-audit-your-wallet',
    title: 'How to Self-Audit Your Wallet',
    subtitle: 'Take Control of Your Own Security',
    excerpt: 'Web3 gives you total custody of your assets—but it also makes you your own security officer. The good news is that auditing your wallet is easier than you think. With a clear process and the right tools, you can uncover hidden approvals, lower your attack surface, and feel confident about every signature you make.',
    publishedAt: '2024-12-19',
    readTime: '6 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'what-are-token-allowances',
    title: 'What Are Token Allowances and Why They Matter',
    subtitle: 'The Silent Permission You\'re Probably Giving Away',
    excerpt: 'Every time you connect a wallet to a DeFi app, swap on a DEX, or stake in a protocol, you\'re asked to approve something. Most people click "Approve" without thinking. That click gives the app a token allowance—a standing permission to move your assets on your behalf.',
    publishedAt: '2024-12-18',
    readTime: '8 min read',
    category: 'Security',
    featured: false
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
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
            <H1 className="mb-6">Blog</H1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Insights, guides, and updates on Web3 security, token allowances, and DeFi best practices.
            </p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* Featured Post */}
            {blogPosts.filter(post => post.featured).map((post) => (
              <article key={post.slug} className="mb-12">
                <div className="bg-white rounded-2xl border border-border-default overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="default" className="text-sm">
                          {post.category}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                          Featured
                        </Badge>
                      </div>
                    
                    <h2 className="text-3xl font-bold text-text-primary mb-3">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary-accent transition-colors duration-200"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-lg text-text-secondary mb-4 font-medium">
                      {post.subtitle}
                    </p>
                    
                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-text-tertiary">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-primary-accent hover:text-primary-accent/80 font-medium transition-colors duration-200"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Regular Posts */}
            <div className="space-y-8">
              {blogPosts.filter(post => !post.featured).map((post) => (
                <article key={post.slug} className="border-b border-border-default pb-8 last:border-b-0">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="default" className="text-sm">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:text-primary-accent transition-colors duration-200"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-text-secondary mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-text-tertiary">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-primary-accent hover:text-primary-accent/80 font-medium transition-colors duration-200"
                        >
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty state for when there are no posts */}
            {blogPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-secondary text-lg">No blog posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  )
}
