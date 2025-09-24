import { NextResponse } from 'next/server'
import { getNetworksApiResponse } from '@/lib/networks-roadmap'

export async function GET() {
  try {
    const data = getNetworksApiResponse()
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch networks roadmap:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch networks roadmap',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
