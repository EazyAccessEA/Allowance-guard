import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'
import type { PerformanceMetrics } from '@/lib/performance'

export async function POST(req: NextRequest) {
  try {
    const metrics: PerformanceMetrics = await req.json()
    
    // Validate required fields
    if (!metrics.vitals || !metrics.navigation || !metrics.resources) {
      return NextResponse.json({ error: 'Invalid metrics data' }, { status: 400 })
    }

    // Store performance metrics in database
    await storePerformanceMetrics(metrics)
    
    // Log performance issues
    logPerformanceIssues(metrics)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    secureLogger.error('Failed to process performance metrics', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function storePerformanceMetrics(metrics: PerformanceMetrics) {
  try {
    const query = `
      INSERT INTO performance_metrics (
        lcp, inp, cls, fid, ttfb,
        load_time, dom_content_loaded, first_paint, first_contentful_paint,
        total_size, resource_count, image_count, script_count, stylesheet_count,
        user_agent, connection, timestamp, page_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `
    
    const values = [
      metrics.vitals.lcp,
      metrics.vitals.inp,
      metrics.vitals.cls,
      metrics.vitals.fid,
      metrics.vitals.ttfb,
      metrics.navigation.loadTime,
      metrics.navigation.domContentLoaded,
      metrics.navigation.firstPaint,
      metrics.navigation.firstContentfulPaint,
      metrics.resources.totalSize,
      metrics.resources.resourceCount,
      metrics.resources.imageCount,
      metrics.resources.scriptCount,
      metrics.resources.stylesheetCount,
      metrics.userAgent,
      metrics.connection,
      new Date(metrics.timestamp),
      metrics.pageUrl || 'unknown'
    ]
    
    await pool.query(query, values)
    
  } catch (error) {
    secureLogger.error('Failed to store performance metrics', { error })
    throw error
  }
}

function logPerformanceIssues(metrics: PerformanceMetrics) {
  const issues: string[] = []
  
  // Check Core Web Vitals against budgets
  if (metrics.vitals.lcp && metrics.vitals.lcp > 2500) {
    issues.push(`LCP: ${metrics.vitals.lcp}ms (budget: 1800ms)`)
  }
  
  if (metrics.vitals.inp && metrics.vitals.inp > 500) {
    issues.push(`INP: ${metrics.vitals.inp}ms (budget: 200ms)`)
  }
  
  if (metrics.vitals.cls && metrics.vitals.cls > 0.25) {
    issues.push(`CLS: ${metrics.vitals.cls} (budget: 0.1)`)
  }
  
  if (metrics.vitals.fid && metrics.vitals.fid > 100) {
    issues.push(`FID: ${metrics.vitals.fid}ms (budget: 50ms)`)
  }
  
  if (metrics.vitals.ttfb && metrics.vitals.ttfb > 1000) {
    issues.push(`TTFB: ${metrics.vitals.ttfb}ms (budget: 600ms)`)
  }
  
  // Check bundle size
  if (metrics.resources.totalSize > 1000000) { // 1MB
    issues.push(`Bundle size: ${(metrics.resources.totalSize / 1024 / 1024).toFixed(2)}MB (budget: 1MB)`)
  }
  
  if (issues.length > 0) {
    secureLogger.warn('Performance budget exceeded', {
      issues,
      vitals: metrics.vitals,
      resources: metrics.resources
    })
  }
}

// GET endpoint to retrieve performance metrics (for admin dashboard)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const hours = parseInt(searchParams.get('hours') || '24')
    
    const query = `
      SELECT 
        lcp, inp, cls, fid, ttfb,
        load_time, dom_content_loaded, first_paint, first_contentful_paint,
        total_size, resource_count, image_count, script_count, stylesheet_count,
        user_agent, connection, timestamp, page_url
      FROM performance_metrics
      WHERE timestamp > NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp DESC
      LIMIT $1
    `
    
    const { rows } = await pool.query(query, [limit])
    
    return NextResponse.json({ metrics: rows })
    
  } catch (error) {
    secureLogger.error('Failed to retrieve performance metrics', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
