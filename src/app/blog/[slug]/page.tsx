'use client'

/**
 * Blog post — Ledger aesthetic
 *
 * Council:
 * Maren: paper/grain hero, font-display-tight headline, no VideoBackground, no glassmorphism
 * Kael: paper-card for CTA, no rounded-lg, system typography for article prose
 * Idris: CascadingScrollAnimation on header, staggered on nav
 * Noor: semantic article/header/nav, AA contrast, no drop-shadow on text
 * Thane: No video. No bg-paper-sub. Server-compatible prose.
 * #20 Brand: CTA rewritten — confident, not desperate
 * #22 Conversion: CTA earns the click with value prop, not"don't wait for an attack"
 */

import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import MobileTableConverter from '@/components/MobileTableConverter'
import { blogPosts } from './blog-data'

interface BlogPostPageProps {
 params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
 const resolvedParams = React.use(params)
 const { slug } = resolvedParams

 const post = blogPosts.find(p => p.slug === slug)

 if (!post) {
 notFound()
 }

 const currentIndex = blogPosts.findIndex(p => p.slug === slug)
 const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
 const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

 const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 })

 return (
 <div className="min-h-screen bg-paper">

 {/* ── Hero ── */}
 <section className="paper grain relative py-20 sm:py-28 overflow-hidden">
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
 <div className="max-w-3xl">
 <CascadingScrollAnimation direction="up" distance={30} delay={0}>
 <Link
 href="/blog"
 className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper hover:text-amber-deep transition-colors duration-200 mb-8"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Blog
 </Link>
 </CascadingScrollAnimation>

 <CascadingScrollAnimation direction="up" distance={40} delay={100}>
 <header>
 <div className="inline-flex items-baseline gap-3 mb-6">
 <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
 {post.category}
 </span>
 <span className="h-px w-8 bg-ink-rule" aria-hidden="true" />
 <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
 {formattedDate} &middot; {post.readTime}
 </span>
 </div>

 <h1 className="font-display-tight text-ink leading-[0.98] text-4xl sm:text-5xl lg:text-6xl mb-5">
 {post.title}
 </h1>

 <p className="font-plex text-lg sm:text-xl text-ink-soft leading-[1.55] max-w-2xl">
 {post.subtitle}
 </p>

 {post.tags && post.tags.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-6">
 {post.tags.map((tag) => (
 <span
 key={tag}
 className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper border border-ink-rule px-2.5 py-1"
 >
 {tag}
 </span>
 ))}
 </div>
 )}
 </header>
 </CascadingScrollAnimation>

 {/* Amber hairline */}
 <CascadingScrollAnimation direction="up" distance={20} delay={250}>
 <div
 className="h-px max-w-sm mt-10"
 aria-hidden="true"
 style={{
 background:
 'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.35) 60%, transparent 100%)',
 boxShadow: '0 0 6px rgba(245, 158, 11, 0.2)',
 }}
 />
 </CascadingScrollAnimation>
 </div>
 </Container>
 </section>

 {/* ── Article content ── */}
 <section className="paper-sub grain py-16 sm:py-20">
 <Container>
 <div className="max-w-3xl mx-auto">
 <article
 className="prose prose-ink max-w-none font-plex mb-16"
 dangerouslySetInnerHTML={{ __html: post.content }}
 />
 <MobileTableConverter />

 {/* ── CTA ── */}
 <CascadingScrollAnimation direction="up" distance={40} delay={0}>
 <div className="paper-card border-l-2 border-amber-deep p-8 sm:p-10 mb-16">
 <h3 className="font-display-tight text-ink text-2xl mb-3">
 Take control of your approvals.
 </h3>
 <p className="font-plex text-ink-muted text-[15px] leading-relaxed mb-6">
 AllowanceGuard scans your wallet for risky token permissions and helps you revoke them — free, open source, non-custodial.
 </p>
 <div className="flex flex-col sm:flex-row gap-3">
 <Link
 href="/"
 className="inline-flex items-center justify-center px-6 py-3 bg-oxblood text-cream font-medium font-plex text-[15px] hover:bg-oxblood/90 transition-colors duration-150"
 >
 Join the waitlist
 </Link>
 <Link
 href="/docs"
 className="paper-button text-[15px] text-center"
 >
 Read the docs
 </Link>
 </div>
 </div>
 </CascadingScrollAnimation>

 {/* ── Prev / Next navigation ── */}
 <CascadingScrollAnimation direction="up" distance={30} delay={0}>
 <nav className="paper-card p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-6" aria-label="Article navigation">
 {prevPost ? (
 <Link
 href={`/blog/${prevPost.slug}`}
 className="group flex items-start gap-3 text-ink-muted hover:text-amber-deep transition-colors duration-200"
 >
 <ArrowLeft className="w-4 h-4 mt-0.5 group-hover:-translate-x-1 transition-transform duration-200 shrink-0" />
 <div>
 <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-1">Previous</p>
 <p className="font-plex text-sm leading-snug">{prevPost.title}</p>
 </div>
 </Link>
 ) : (
 <div />
 )}

 {nextPost ? (
 <Link
 href={`/blog/${nextPost.slug}`}
 className="group flex items-start gap-3 text-ink-muted hover:text-amber-deep transition-colors duration-200 sm:ml-auto sm:text-right"
 >
 <div>
 <p className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-1">Next</p>
 <p className="font-plex text-sm leading-snug">{nextPost.title}</p>
 </div>
 <ArrowRight className="w-4 h-4 mt-0.5 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
 </Link>
 ) : (
 <div />
 )}
 </nav>
 </CascadingScrollAnimation>
 </div>
 </Container>
 </section>
 </div>
 )
}
