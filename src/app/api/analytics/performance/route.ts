import { NextRequest, NextResponse } from 'next/server'
import { trackUserBehavior, getSmartPreloadResources, getAdaptiveLoadingStrategy } from '@/lib/predictive-performance'

interface PerformanceVitals {
  lcp?: number
  inp?: number
  cls?: number
  fid?: number
  ttfb?: number
}

interface PerformanceResources {
  totalSize?: number
  resourceCount?: number
  imageCount?: number
  scriptCount?: number
  stylesheetCount?: number
}

interface PerformanceMetrics {
  vitals?: PerformanceVitals
  resources?: PerformanceResources
  navigation?: Record<string, unknown>
  userAgent?: string
  pageUrl?: string
  timestamp?: string
  userId?: string
  sessionDuration?: number
  connectionSpeed?: string
}

export async function POST(req: NextRequest) {
  try {
    const metrics = await req.json()
    
    // Validate required fields
    if (!metrics.vitals) {
      return NextResponse.json({ error: 'Invalid metrics data' }, { status: 400 })
    }

    // Log performance metrics to console for now (in production, this would go to a proper monitoring system)
    console.log('PERFORMANCE METRICS:', {
      timestamp: new Date().toISOString(),
      vitals: metrics.vitals,
      navigation: metrics.navigation,
      resources: metrics.resources,
      userAgent: metrics.userAgent,
      pageUrl: metrics.pageUrl,
      // Track donation page performance specifically
      isDonationPage: metrics.pageUrl?.includes('/donate')
    })
    
    // Log performance issues
    logPerformanceIssues(metrics)
    
    // Track user behavior for predictive optimization
    if (metrics.userId && metrics.pageUrl && metrics.sessionDuration) {
      await trackUserBehavior(
        metrics.userId,
        metrics.pageUrl,
        metrics.sessionDuration,
        {
          userAgent: metrics.userAgent || '',
          connectionSpeed: metrics.connectionSpeed
        }
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Failed to process performance metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function logPerformanceIssues(metrics: PerformanceMetrics) {
  const issues: string[] = []
  
  // Check Core Web Vitals against budgets
  if (metrics.vitals?.lcp && metrics.vitals.lcp > 2500) {
    issues.push(`LCP: ${metrics.vitals.lcp}ms (budget: 1800ms)`)
  }
  
  if (metrics.vitals?.inp && metrics.vitals.inp > 500) {
    issues.push(`INP: ${metrics.vitals.inp}ms (budget: 200ms)`)
  }
  
  if (metrics.vitals?.cls && metrics.vitals.cls > 0.25) {
    issues.push(`CLS: ${metrics.vitals.cls} (budget: 0.1)`)
  }
  
  if (metrics.vitals?.fid && metrics.vitals.fid > 100) {
    issues.push(`FID: ${metrics.vitals.fid}ms (budget: 50ms)`)
  }
  
  if (metrics.vitals?.ttfb && metrics.vitals.ttfb > 1000) {
    issues.push(`TTFB: ${metrics.vitals.ttfb}ms (budget: 600ms)`)
  }
  
  // Check bundle size
  if (metrics.resources?.totalSize && metrics.resources.totalSize > 1000000) { // 1MB
    issues.push(`Bundle size: ${(metrics.resources.totalSize / 1024 / 1024).toFixed(2)}MB (budget: 1MB)`)
  }
  
  if (issues.length > 0) {
    console.warn('Performance budget exceeded:', {
      issues,
      vitals: metrics.vitals,
      resources: metrics.resources
    })
  }
}

// GET endpoint to retrieve performance metrics and predictive recommendations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const currentPage = searchParams.get('currentPage')
    
    // If userId and currentPage provided, return predictive recommendations
    if (userId && currentPage) {
      const [preloadResources, loadingStrategy] = await Promise.all([
        getSmartPreloadResources(userId, currentPage),
        getAdaptiveLoadingStrategy(userId)
      ])
      
      return NextResponse.json({
        predictive: {
          preloadResources,
          loadingStrategy,
          timestamp: new Date().toISOString()
        }
      })
    }
    
    // Return mock data for admin dashboard
    return NextResponse.json({ 
      metrics: [],
      message: 'Performance metrics collection is active but not yet stored in database'
    })
    
  } catch (error) {
    console.error('Failed to retrieve performance metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
