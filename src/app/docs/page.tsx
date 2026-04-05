'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import { useState } from 'react'
import { menuItems, headingsMap } from './docs-data'
import DocsContentPrimary from './DocsContentPrimary'
import DocsContentSecondary from './DocsContentSecondary'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const headings = headingsMap[activeSection] ?? []

  return (
    <div className="min-h-screen bg-background-primary dark:bg-secondary-800 text-text-primary dark:text-secondary-100">

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
          <H1 className="mb-6">Documentation</H1>
          <p className="text-base text-text-secondary dark:text-secondary-400 max-w-reading mb-8">
            Complete guide to using AllowanceGuard for wallet security. Free, open source, and transparent.
          </p>
        </Container>
      </Section>

      <div className="border-t border-border-primary dark:border-secondary-700" />

      {/* Main Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <nav className="space-y-1">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-secondary-100 uppercase tracking-wide mb-3">Documentation</h3>
                    {menuItems.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 text-sm flex items-center ${
                            activeSection === item.id
                              ? 'bg-primary-600 dark:bg-primary-400 text-white'
                              : 'text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:text-secondary-100 hover:bg-mist'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {item.title}
                        </button>
                      )
                    })}
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-6">
              <div className="prose prose-sm max-w-none">
                <DocsContentPrimary section={activeSection} />
                <DocsContentSecondary section={activeSection} />
              </div>
            </div>

            {/* Right Sidebar - On This Page */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <div className="border border-border-primary dark:border-secondary-700 rounded-md p-4 bg-mist">
                  <h4 className="text-sm font-semibold text-text-primary dark:text-secondary-100 mb-3">On this page</h4>
                  <nav className="space-y-2">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block text-sm text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:text-secondary-100 transition-colors duration-200 ${
                          heading.level === 3 ? 'ml-3' : ''
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
