import { NextResponse } from 'next/server'
import { getJob } from '@/lib/jobs'
import { withReq } from '@/lib/logger'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const L = withReq(req)
  const { id } = await params
  const jobId = Number(id)
  
  L.info('job.status.check', { jobId })
  
  if (!Number.isFinite(jobId)) {
    L.warn('job.status.invalid_id', { id })
    return NextResponse.json({ error: 'Bad id' }, { status: 400 })
  }
  
  try {
    const job = await getJob(jobId)
    if (!job) {
      L.warn('job.status.not_found', { jobId })
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    L.info('job.status.success', { jobId, status: job.status })
    
    return NextResponse.json({ 
      id: job.id, 
      status: job.status, 
      attempts: job.attempts, 
      error: job.error,
      created_at: job.created_at,
      started_at: job.started_at,
      finished_at: job.finished_at
    })
  } catch (error) {
    L.error('job.status.error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      jobId 
    })
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 })
  }
}
