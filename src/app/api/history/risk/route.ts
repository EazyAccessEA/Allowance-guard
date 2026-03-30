import { NextRequest } from 'next/server'
import { getRiskSnapshots } from '../risk-snapshots'

export async function GET(req: NextRequest) {
  return getRiskSnapshots(req)
}
