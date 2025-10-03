import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ContextProvider from '@/context'
import { LighthouseInitializer } from '@/components/LighthouseInitializer'
import RpcStatusBanner from '@/components/RpcStatusBanner'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import RollbarProvider from '@/components/RollbarProvider'
// import PerformanceDashboard from '@/components/PerformanceDashboard' // Removed
import CookieBanner from '@/components/CookieBanner'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import PredictivePerformanceProvider from '@/components/PredictivePerformanceProvider'
import BuildDetectionProvider from '@/components/BuildDetectionProvider'
// import PerformanceMonitor from '@/components/PerformanceMonitor' // Disabled due to missing API endpoint
import { AppKit } from '../../appkit'

// Sophisticated Static Generation Strategy
export const dynamic = 'force-static'
export const revalidate = 3600 // 1 hour ISR
export const fetchCache = 'force-cache'
export const runtime = 'nodejs'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A'
}

export const metadata: Metadata = {
  metadataBase: new URL("https://allowanceguard.com"),
  title: "Allowance Guard — Review & Revoke Wallet Permissions",
  description: "Free, open-source dashboard to review, revoke, and monitor wallet approvals across chains.",
  robots: { index: true, follow: true },
  keywords: [
    'DeFi', 'dapp', 'web3', 'blockchain', 'ethereum', 'token approvals', 
    'wallet security', 'crypto security', 'allowance management', 'revoke tokens',
    'Ethereum', 'Arbitrum', 'Base', 'Polygon', 'Optimism', 'Avalanche',
    'donate', 'donation', 'support', 'open source', 'ENS', 'allowanceguard.eth'
  ],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    url: 'https://allowanceguard.com',
    siteName: 'Allowance Guard',
    title: 'Allowance Guard — Review & Revoke Wallet Permissions',
    description: 'Free, open-source dashboard to review, revoke, and monitor wallet approvals across chains.',
    images: ['/og-card.png']
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    site: '@AllowanceGuard',
    creator: '@AllowanceGuard',
    title: 'Allowance Guard — Review & Revoke Wallet Permissions',
    description: 'Free, open-source dashboard to review, revoke, and monitor wallet approvals across chains.',
    images: ['/og-card.png']
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.rollbar.com" />
        <link rel="dns-prefetch" href="https://www.allowanceguard.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />
        <link rel="dns-prefetch" href="https://reown.com" />
        <link rel="dns-prefetch" href="https://wagmi.sh" />
        
        {/* PRPL Pattern: Push critical resources */}
        {/* CSS files are handled by Next.js automatically */}
        {/* Critical CSS preloading - Next.js handles this automatically */}
        
        {/* Preload critical images - only preload if they exist and are used */}
        <link rel="preload" href="/AG_Logo2.png" as="image" type="image/png" />
        <link rel="preload" href="/AllowanceGuard_BG.png" as="image" type="image/png" />
        
        {/* Fonts are handled by Next.js font optimization */}
        
        {/* Pre-cache critical routes */}
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/docs" />
        <link rel="prefetch" href="/features" />
        
        {/* Critical mobile optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* DApp Identification Signals for Security Scanners */}
        <meta name="application-name" content="Allowance Guard" />
        <meta name="dapp" content="true" />
        <meta name="web3" content="true" />
        <meta name="defi" content="true" />
        <meta name="blockchain" content="ethereum,arbitrum,base,polygon,optimism,avalanche" />
        <meta name="wallet-connect" content="true" />
        <meta name="token-approvals" content="true" />
        <meta name="crypto-security" content="true" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="p5fb1uXV2sHQmWPgJRCfiI5QjM0LNOsbjymQG-5YiBE" />
        
        {/* Structured Data for DApp Recognition */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Allowance Guard",
            "description": "Open-source, free tool to view and revoke token approvals safely.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "keywords": "DeFi, dapp, web3, blockchain, ethereum, token approvals, wallet security, crypto security",
            "url": process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            "author": {
              "@type": "Organization",
              "name": "Allowance Guard Team"
            }
          })
        }} />
        
        {/* Preload critical fonts - removed incorrect paths that cause 404s */}
        
        {/* Critical CSS inlining to reduce render blocking */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles for mobile performance */
            * { box-sizing: border-box; }
            html { font-size: 16px; -webkit-text-size-adjust: 100%; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'JetBrains Mono', Inter, ui-monospace, SFMono-Regular, Monaco, Consolas, monospace;
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .min-h-screen { min-height: 100vh; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .flex-1 { flex: 1; }
            .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
            .focus\\:not-sr-only:focus { position: static; width: auto; height: auto; padding: 0.5rem; margin: 0; overflow: visible; clip: auto; white-space: normal; }
            .focus\\:absolute:focus { position: absolute; }
            .focus\\:top-2:focus { top: 0.5rem; }
            .focus\\:left-2:focus { left: 0.5rem; }
            .bg-white { background-color: white; }
            .border { border-width: 1px; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .z-50 { z-index: 50; }
            
            /* Mobile-specific optimizations */
            @media (max-width: 768px) {
              .text-3xl { font-size: 1.5rem; line-height: 2rem; }
              .sm\\:text-4xl { font-size: 1.75rem; line-height: 2.25rem; }
              .lg\\:text-5xl { font-size: 2rem; line-height: 2.5rem; }
              .px-4 { padding-left: 1rem; padding-right: 1rem; }
              .py-8 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
              .mb-6 { margin-bottom: 1rem; }
            }
            
            /* TBT Optimization - Prevent layout shifts */
            .contain-layout { contain: layout style; }
            .will-change-transform { will-change: transform; }
            .transform-gpu { transform: translateZ(0); }
            
            /* Critical performance optimizations */
            .lazy-load { content-visibility: auto; contain-intrinsic-size: 0 500px; }
            .optimize-rendering { will-change: auto; }
            .reduce-paint { contain: paint; }
            
            /* Font display optimization - using Next.js font optimization */
            
            /* Critical button styles to prevent layout shifts */
            .btn-primary {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0.75rem 1.5rem;
              font-size: 1rem;
              font-weight: 600;
              border-radius: 0.5rem;
              background-color: #3B82F6;
              color: white;
              border: none;
              cursor: pointer;
              transition: background-color 0.2s;
              min-height: 44px;
              min-width: 120px;
            }
            
            /* Critical hero section styles */
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
            .font-bold { font-weight: 700; }
            .text-text-primary { color: #0A0A0A; }
            .leading-tight { line-height: 1.25; }
            .mb-6 { margin-bottom: 1.5rem; }
            
            /* Critical button styles */
            .bg-primary-700 { background-color: #008B7A; }
            .text-white { color: white; }
            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .font-medium { font-weight: 500; }
            .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; }
            .duration-200 { transition-duration: 200ms; }
            .hover\\:bg-primary-800:hover { background-color: #006B5C; }
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border px-2 py-1 text-sm z-50">Skip to content</a>
        <RpcStatusBanner />
        <RollbarProvider>
          <AppKit>
            <ContextProvider>
              <LighthouseInitializer />
              <HeaderWrapper />
              <main id="main" className="flex-1">{children}</main>
              <Footer />
              {/* {process.env.NODE_ENV !== 'production' && <PerformanceDashboard />} - Removed */}
              <CookieBanner />
              <ServiceWorkerRegistration />
              <PredictivePerformanceProvider />
              <BuildDetectionProvider />
              {/* <PerformanceMonitor /> - Disabled due to missing API endpoint */}
            </ContextProvider>
          </AppKit>
        </RollbarProvider>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root { 
              --font-mono: ${jetbrainsMono.style.fontFamily}; 
            } 
            code, pre, .font-mono { 
              font-family: var(--font-mono); 
            }
          `
        }} />
        
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Allowance Guard",
              "url": "https://allowanceguard.com",
              "logo": "https://allowanceguard.com/logo.png",
              "sameAs": [
                "https://github.com/EazyAccessEA/Allowance-guard",
                "https://x.com/AllowanceGuard"
              ]
            })
          }}
        />
        
        <Script
          id="software-application-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Allowance Guard",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Open-source dashboard to inspect and revoke approvals",
              "url": "https://allowanceguard.com"
            })
          }}
        />
      </body>
    </html>
  )
}
// Force deployment - Wed Oct  1 23:20:38 BST 2025
