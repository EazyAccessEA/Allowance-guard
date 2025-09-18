import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import SecuritySettings from '@/components/SecuritySettings'

export default async function SecuritySettingsPage() {
  // Check if user is authenticated
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')
  
  if (!cookieHeader || !cookieHeader.includes('better-auth.session_token')) {
    redirect('/signin?redirect=/settings/security')
  }

  return <SecuritySettings />
}
