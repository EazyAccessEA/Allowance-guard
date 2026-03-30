import { NextResponse } from 'next/server'
import { run } from '@/lib/health-check'

export async function GET() {
  try {
    // Capture console output
    const originalLog = console.log
    const originalError = console.error
    const logs: string[] = []
    
    console.log = (...args) => logs.push(args.join(' '))
    console.error = (...args) => logs.push('ERROR: ' + args.join(' '))
    
    await run()
    
    // Restore console
    console.log = originalLog
    console.error = originalError
    
    return NextResponse.json({
      status: 'success',
      message: 'RPC health check completed',
      logs: logs
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'RPC health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
