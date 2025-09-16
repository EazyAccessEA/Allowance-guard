'use client'

import { useAccount } from 'wagmi'
import Header from './Header'

export default function HeaderWrapper() {
  const { isConnected } = useAccount()
  
  return <Header isConnected={isConnected} />
}
