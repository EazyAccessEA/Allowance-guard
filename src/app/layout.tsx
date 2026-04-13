import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ContextProvider from '@/context'
import { LighthouseInitializer } from '@/components/LighthouseInitializer'
import RpcStatusBanner from '@/components/RpcStatusBanner'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import RollbarProvider from '@/components/RollbarProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
// import PerformanceDashboard from '@/components/PerformanceDashboard' // Removed
import CookieBanner from '@/components/CookieBanner'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
// import PerformanceMonitor from '@/components/PerformanceMonitor' // Disabled due to missing API endpoint
import { AppKit } from '../../appkit'

// Allow dynamic rendering — the app uses client-side Web3 providers,
// cookies, and real-time data that cannot be statically generated.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Display font: Space Grotesk for headlines and hero text
const spaceGrotesk = localFont({
  src: [
    { path: '../../public/fonts/SpaceGrotesk-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/SpaceGrotesk-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/SpaceGrotesk-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/SpaceGrotesk-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-display',
  preload: true,
})

// Editorial serif: Instrument Serif for premium section headlines
const instrumentSerif = localFont({
  src: [
    { path: '../../public/fonts/InstrumentSerif-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/InstrumentSerif-Italic.ttf', weight: '400', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-serif',
  preload: false,
})

// Ledger v4 — fully sans, IBM Plex Sans does all the heavy lifting.
// Display sizes use Plex Black/Bold; body uses Regular/Medium. No Fraunces.
const ibmPlex = localFont({
  src: [
    { path: '../../public/fonts/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSans-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-plex',
  preload: true,
})

const inter = localFont({
  src: [
    { path: '../../public/fonts/Inter_18pt-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Inter_18pt-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/Inter_18pt-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Inter_18pt-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Inter_18pt-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Inter_18pt-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
})

const jetbrainsMono = localFont({
  src: [
    { path: '../../public/fonts/JetBrainsMono-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/JetBrainsMono-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/JetBrainsMono-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/JetBrainsMono-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A'
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: { default: 'Allowance Guard', template: '%s · Allowance Guard' },
  description: 'Open-source, free tool to view and revoke token approvals safely.',
  robots: { index: true, follow: true },
  keywords: [
    'DeFi', 'dapp', 'web3', 'blockchain', 'ethereum', 'token approvals', 
    'wallet security', 'crypto security', 'allowance management', 'revoke tokens',
    'Ethereum', 'Arbitrum', 'Base', 'Polygon', 'Optimism', 'Avalanche'
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
  openGraph: {
    title: 'AllowanceGuard',
    description: 'Wallet security, reimagined. Scan token approvals, score risk, and revoke — across 27 chains.',
    url: 'https://www.allowanceguard.com',
    siteName: 'AllowanceGuard',
    type: 'website',
    images: [{ url: 'https://www.allowanceguard.com/og-image.webp', width: 2816, height: 1536, alt: 'AllowanceGuard — Wallet security, reimagined' }],
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'AllowanceGuard',
    description: 'Wallet security, reimagined. Scan token approvals, score risk, and revoke — across 27 chains.',
    images: ['https://www.allowanceguard.com/og-image.webp'],
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="https://api.rollbar.com" />
        <link rel="dns-prefetch" href="https://www.allowanceguard.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />
        <link rel="dns-prefetch" href="https://reown.com" />
        <link rel="dns-prefetch" href="https://wagmi.sh" />
        
        {/* PRPL Pattern: Push critical resources */}
        {/* CSS files are handled by Next.js automatically */}
        {/* Critical CSS preloading - Next.js handles this automatically */}
        
        <link rel="preload" href="/images/branding/ag-logo-ink.png" as="image" type="image/png" />
        
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
        
        {/* Critical CSS is handled by Next.js automatic inlining — the
            hand-rolled block that used to live here was stale dark-theme
            debt and was duplicating Tailwind's compiled output. Removed. */}
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} ${instrumentSerif.variable} ${ibmPlex.variable} min-h-screen flex flex-col`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-paper-sub border border-ink-rule px-2 py-1 text-sm z-50">Skip to content</a>
        <RpcStatusBanner />
        <ThemeProvider>
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
              {/* <PerformanceMonitor /> - Disabled due to missing API endpoint */}
            </ContextProvider>
          </AppKit>
        </RollbarProvider>
        </ThemeProvider>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-mono: ${jetbrainsMono.style.fontFamily};
              --font-display: ${spaceGrotesk.style.fontFamily};
            } 
            code, pre, .font-mono { 
              font-family: var(--font-mono); 
            }
          `
        }} />
      </body>
    </html>
  )
}
