'use client'
import { useEffect, useState } from 'react'

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const [msg, setMsg] = useState('Accepting invite…')
  useEffect(() => {
    (async () => {
      const resolvedParams = await params
      const me = await fetch('/api/auth/me').then(r=>r.json())
      if (!me.user) { window.location.href = `/signin?redirect=/invite/${resolvedParams.token}`; return }
      const r = await fetch('/api/invites/accept',{ method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ token: resolvedParams.token }) })
      const j = await r.json()
      if (!r.ok) setMsg(j.error || 'Invite invalid'); else setMsg('Invite accepted! Redirecting…')
      setTimeout(() => { window.location.href = '/' }, 1500)
    })()
  }, [params])
  return <main className="mx-auto max-w-xl px-6 py-10"><h1 className="text-xl font-semibold">Team Invite</h1><p className="mt-3 text-sm">{msg}</p></main>
}
