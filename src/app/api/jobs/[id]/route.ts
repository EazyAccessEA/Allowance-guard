import { NextResponse } from 'next/server'
import { getJob } from '@/lib/jobs'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jobId = Number(id)
  
  if (!Number.isFinite(jobId)) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 })
  }
  
  const job = await getJob(jobId)
  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json({ 
    id: job.id, 
    status: job.status, 
    attempts: job.attempts, 
    error: job.error,
    created_at: job.created_at,
    started_at: job.started_at,
    finished_at: job.finished_at
  })
}
