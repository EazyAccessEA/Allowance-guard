'use client'

import { useAccount } from 'wagmi'
import Header from './Header'
import { useAuthSession } from '@/hooks/useAuthSession'

export default function HeaderWrapper() {
  const { isConnected } = useAccount()
  const { isAuthenticated } = useAuthSession()

  return <Header isConnected={isConnected} isAuthenticated={isAuthenticated} />
}
