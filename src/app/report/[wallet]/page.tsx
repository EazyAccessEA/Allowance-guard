import { ReportPageClient } from '@/components/ReportPageClient'

export default async function ReportPage({ params }: { params: Promise<{ wallet: string }> }) {
  const resolvedParams = await params
  return <ReportPageClient wallet={resolvedParams.wallet} />
}
