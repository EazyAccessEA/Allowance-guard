// Build Check API
// Checks if build has changed and needs cache invalidation

import { NextRequest, NextResponse } from 'next/server'
import { checkBuildChange, getCurrentBuild } from '@/lib/build-cache'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const currentBuildId = searchParams.get('buildId')
    
    if (!currentBuildId) {
      return NextResponse.json({ error: 'buildId parameter required' }, { status: 400 })
    }

    // Check if build has changed
    const { hasChanged, newBuild } = await checkBuildChange(currentBuildId)
    
    if (hasChanged && newBuild) {
      return NextResponse.json({
        hasChanged: true,
        newBuild: {
          buildId: newBuild.buildId,
          version: newBuild.version,
          timestamp: newBuild.timestamp,
          staticAssets: newBuild.staticAssets,
          apiEndpoints: newBuild.apiEndpoints
        },
        message: 'Build has changed, cache invalidation required'
      })
    }

    return NextResponse.json({
      hasChanged: false,
      message: 'Build is current'
    })
    
  } catch (error) {
    console.error('Failed to check build change:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { buildId, version, staticAssets, apiEndpoints } = body
    
    if (!buildId || !version) {
      return NextResponse.json({ error: 'buildId and version required' }, { status: 400 })
    }

    // Track new build
    const { trackBuild } = await import('@/lib/build-cache')
    await trackBuild(
      buildId,
      version,
      staticAssets || [],
      apiEndpoints || []
    )

    return NextResponse.json({
      success: true,
      message: 'Build tracked successfully'
    })
    
  } catch (error) {
    console.error('Failed to track build:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
