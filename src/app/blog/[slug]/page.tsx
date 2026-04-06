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
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-accent transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

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

      <div className="border-t border-secondary-700" />

      {/* Article Content */}
      <Section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <article
              className="prose max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <MobileTableConverter />

            {/* Call to action */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-2xl p-8 mb-12 shadow-sm">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Secure Your Token Allowances?
              </h3>
              <p className="text-text-secondary mb-6">
                Don&apos;t wait for an attack to happen. Start monitoring and managing your token allowances today with AllowanceGuard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-accent text-white font-semibold rounded-lg hover:bg-primary-accent/90 transition-colors duration-200 shadow-md hover:shadow-lg"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-secondary-700 bg-secondary-800 rounded-lg p-6">
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
