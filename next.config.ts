/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate source maps for production debugging
  productionBrowserSourceMaps: true,
  
  // Configure Turbopack (updated syntax)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Keep webpack config for production builds
  webpack: (config: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    
    // Performance optimizations
    if (config.mode === 'production') {
      // Enable bundle analyzer if ANALYZE=true
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './bundle-analysis.html'
          })
        )
      }
      
      // Optimize chunks for TBT reduction
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 30,
          maxAsyncRequests: 30,
          cacheGroups: {
            // Separate vendor chunks for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate AppKit/Wagmi for deferred loading
            wallet: {
              test: /[\\/]node_modules[\\/](@reown|wagmi|@tanstack)[\\/]/,
              name: 'wallet',
              chunks: 'async',
              priority: 15,
            },
            // Common chunks
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
            // UI components
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 8,
            },
          },
        },
        // Reduce main thread work (Lighthouse recommendation)
        usedExports: true,
        sideEffects: false,
        // Advanced tree shaking
        providedExports: true,
        concatenateModules: true,
        // Minimize bundle size
        minimize: true,
      }
    }
    
    return config
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-toast', '@reown/appkit', 'wagmi', 'react', 'react-dom'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
    // Optimize CSS loading
    optimizeCss: false, // Disabled due to build issues, but keep for future
    // Enable modern JavaScript for better performance
    esmExternals: true,
    // Advanced performance features
    webpackBuildWorker: true,
  },
  
  // Server external packages (moved from experimental)
  // Note: @reown/appkit and wagmi are handled by transpilePackages
  serverExternalPackages: [],
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    // Mobile performance optimizations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Output file tracing for better performance
  outputFileTracingRoot: process.cwd(),
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding'
          }
        ]
      }
    ]
  }
}

// Export Next.js configuration
// Note: Error monitoring is now handled by Rollbar instead of Sentry
module.exports = nextConfig
