'use client'

import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ArrowRight, BookOpen, Shield, Lightbulb, Users } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

// Blog posts data - in a real app, this would come from a CMS or database
interface BlogPost {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  publishedAt: string
  readTime: string
  category: string
  featured: boolean
  image?: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'hardware-wallets-and-multisigs-elevating-your-security',
    title: 'Hardware Wallets and Multisigs: Elevating Your Security',
    subtitle: 'From Digital Convenience to Physical Security',
    excerpt: 'In our ongoing discussion of Web3 security, we have focused on managing the permissions you grant to smart contracts. But what about the master key to the vault itself? True digital sovereignty requires a shift in mindset from digital convenience to physical security.',
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Security',
    featured: true,
    image: '/Hardware Wallets and Multisigs.png'
  },
  {
    slug: 'understanding-smart-contract-risk-beyond-allowances',
    title: 'Understanding Smart Contract Risk Beyond Allowances',
    subtitle: 'The Hidden Dangers in the Code You Trust',
    excerpt: 'Managing your token allowances is like diligently locking the doors and windows of your home. But what if the building itself has a cracked foundation? What if the landlord can enter and change the locks at any time, without warning? This is the reality of smart contract risk.',
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false,
    image: '/u3182613983_High-detail_3D_render_of_an_open_semi-transparent_50162c0f-297f-4156-aa76-5016cafeb9c5_2.png'
  },
  {
    slug: 'building-your-personal-web3-security-routine',
    title: 'Building Your Personal Web3 Security Routine',
    subtitle: 'Transform Security from Emergency Response to Daily Habit',
    excerpt: 'We practice fire drills not because we expect a fire today, but so our response is calm and automatic when it matters most. Why, then, do so many of us treat our digital wealth differently? The most effective defense is not a one-time, heroic effort. It is a quiet, consistent, and deliberate routine.',
    publishedAt: '2024-12-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
    image: '/Building Your Personal Web3 Security Routine.png'
  },
  {
    slug: 'gas-fees-and-revocations-making-security-cost-effective',
    title: 'Gas, Fees, and Revocations: Making Security Cost-Effective',
    subtitle: 'Transforming Security from Expensive Chore to Low-Cost Habit',
    excerpt: 'Security is like insurance. Everyone understands its importance, but paying the premium can feel like a burden. In Web3, the "premium" for securing your wallet is often paid in gas fees. But what if you could significantly lower that premium?',
    publishedAt: '2024-12-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
    image: '/Gas.png'
  },
  {
    slug: 'understanding-layer-2-networks-how-they-work',
    title: 'Understanding Layer 2 Networks: How They Work',
    subtitle: 'A Deeper Dive into the Technology Behind Scalable Ethereum',
    excerpt: 'To understand Layer 2 solutions, we first need to understand the fundamental challenge they are designed to solve: the Blockchain Trilemma. Layer 2 networks are the key to unlocking Ethereum\'s scalability.',
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Education',
    featured: false,
    image: '/Layer2.png'
  },
  {
    slug: 'red-team-yourself-simulating-an-attack-on-your-wallet',
    title: 'Red Team Yourself: Simulating an Attack on Your Wallet',
    subtitle: 'Your Personal Flight Simulator for Web3 Security',
    excerpt: 'Commercial pilots spend hundreds of hours in flight simulators, practicing their response to engine failures. Why should we treat our digital wealth with any less seriousness? This guide walks you through how to safely red team your own wallet and habits.',
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false,
    image: '/Red_Team.png'
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
    featured: false,
    image: '/How to self audit.png'
  },
  {
    slug: 'what-are-token-allowances',
    title: 'What Are Token Allowances and Why They Matter',
    subtitle: 'The Silent Permission You\'re Probably Giving Away',
    excerpt: 'Every time you connect a wallet to a DeFi app, swap on a DEX, or stake in a protocol, you\'re asked to approve something. Most people click "Approve" without thinking. That click gives the app a token allowance—a standing permission to move your assets on your behalf.',
    publishedAt: '2024-12-18',
    readTime: '8 min read',
    category: 'Security',
    featured: false,
    image: '/What are token allowances.png'
  },
  {
    slug: 'from-dapp-user-to-security-advocate-building-community-trust',
    title: 'From Dapp User to Security Advocate: Building Community Trust',
    subtitle: 'How to Become a Force Multiplier for Web3 Security',
    excerpt: 'Web3 is a frontier town rapidly growing into a global city. For too long, we have treated security as a purely personal problem. But to build a truly resilient and trustworthy ecosystem, we must take the next step: becoming security advocates who strengthen the entire network.',
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Community',
    featured: false,
    image: '/From Dapp User.png'
  }
]

// Category configuration with icons and colors
const categoryConfig = {
  Security: { icon: Shield, color: 'bg-red-50 text-red-700 border-red-200', gradient: 'from-red-50 to-red-100' },
  Education: { icon: BookOpen, color: 'bg-blue-50 text-blue-700 border-blue-200', gradient: 'from-blue-50 to-blue-100' },
  Innovation: { icon: Lightbulb, color: 'bg-yellow-50 text-yellow-700 border-yellow-200', gradient: 'from-yellow-50 to-yellow-100' },
  Community: { icon: Users, color: 'bg-green-50 text-green-700 border-green-200', gradient: 'from-green-50 to-green-100' },
}

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

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

      {/* Featured Post Section */}
      {featuredPost && (
        <Section className="py-16 sm:py-20 lg:py-24 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
                  <Shield className="w-4 h-4" />
                  Featured Article
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Our Most Important Insights</h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">Essential guides and deep-dives into Web3 security</p>
              </div>
              
              <article className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="p-6 sm:p-8 md:p-12 lg:p-16">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <Badge variant="default" className="text-xs sm:text-sm bg-primary-100 text-primary-700 border-primary-200 px-3 py-1.5 sm:px-4 sm:py-2">
                        {featuredPost.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs sm:text-sm bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200 px-3 py-1.5 sm:px-4 sm:py-2">
                        ⭐ Featured
                      </Badge>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="hover:text-primary-accent transition-colors duration-200"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>
                    
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 font-medium leading-relaxed">
                      {featuredPost.subtitle}
                    </p>
                    
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-4xl">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base md:text-lg">{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base md:text-lg">{featuredPost.readTime}</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-primary-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 text-base sm:text-lg w-full sm:w-auto"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </Container>
        </Section>
      )}

      {/* All Posts Section */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">All Articles</h2>
              <p className="text-lg text-gray-600">Explore our complete library of Web3 security content</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const Icon = config.icon
                const count = blogPosts.filter(post => post.category === category).length
                return (
                  <button
                    key={category}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 hover:shadow-md ${config.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    {category} ({count})
                  </button>
                )
              })}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => {
                const categoryInfo = categoryConfig[post.category as keyof typeof categoryConfig]
                const Icon = categoryInfo?.icon || BookOpen
                
                return (
                  <article key={post.slug} className="group">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                      {/* Add image if it exists with glassmorphism overlay */}
                      {post.image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-90"
                          />
                          {/* Opacity overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                          {/* Glassmorphism overlay with title */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${categoryInfo?.gradient} bg-gradient-to-r shadow-lg`}>
                                <Icon className="w-3 h-3 text-white drop-shadow-lg" />
                              </div>
                              <Badge variant="default" className={`text-xs ${categoryInfo?.color} bg-white/20 backdrop-blur-sm border-white/30 text-white shadow-lg`}>
                                {post.category}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-200 transition-colors duration-300 line-clamp-2 drop-shadow-lg">
                              <Link 
                                href={`/blog/${post.slug}`}
                                className="hover:text-primary-200 transition-colors duration-200"
                              >
                                {post.title}
                              </Link>
                            </h3>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6 h-full flex flex-col">
                        {/* Show category and title only if no image */}
                        {!post.image && (
                          <>
                            <div className="flex items-center gap-2 mb-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryInfo?.gradient} bg-gradient-to-r`}>
                                <Icon className="w-4 h-4 text-gray-700" />
                              </div>
                              <Badge variant="default" className={`text-xs ${categoryInfo?.color}`}>
                                {post.category}
                              </Badge>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                              <Link 
                                href={`/blog/${post.slug}`}
                                className="hover:text-primary-accent transition-colors duration-200"
                              >
                                {post.title}
                              </Link>
                            </h3>
                          </>
                        )}
                        
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-600">{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-600">{post.readTime}</span>
                            </div>
                          </div>
                          
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                          >
                            Read
                            <ArrowRight className="w-4 h-4 text-primary-600" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Empty state for when there are no posts */}
            {blogPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No blog posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        </Container>
      </Section>

    </div>
  )
}