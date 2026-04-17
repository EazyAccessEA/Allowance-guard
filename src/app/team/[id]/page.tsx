'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import TeamPortfolioView from '@/components/team/TeamPortfolioView'
import TeamActivityLog from '@/components/team/TeamActivityLog'
import SafeDashboard from '@/components/team/SafeDashboard'
import {
  Users,
  Wallet,
  Shield,
  Activity,
  UserPlus,
  Download,
  RefreshCw,
  Lock,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TeamInfo {
  id: number
  name: string
  description: string | null
  role: string
  member_count: number
  wallet_count: number
  created_at: string
}

interface TeamMember {
  user_id: number
  email: string
  name: string | null
  role: string
  created_at: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TeamDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: teamId } = use(params)

  const [team, setTeam] = useState<TeamInfo | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'activity' | 'members' | 'safe'>('portfolio')
  const [safeAddress, setSafeAddress] = useState('')
  const [safeChainId, setSafeChainId] = useState(1)

  const loadTeam = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [teamRes, membersRes] = await Promise.all([
        fetch(`/api/teams/details?teamId=${teamId}`),
        fetch(`/api/teams/members?teamId=${teamId}`),
      ])

      if (!teamRes.ok) {
        const data = await teamRes.json()
        setError(data.error ?? 'Failed to load team')
        return
      }

      const teamData = await teamRes.json()
      const membersData = await membersRes.json()

      setTeam(teamData.team)
      setMembers(membersData.members ?? [])
    } catch {
      setError('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }, [teamId])

  useEffect(() => { loadTeam() }, [loadTeam])

  const canManage = team?.role === 'owner' || team?.role === 'admin'

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-paper-sub rounded w-48" />
          <div className="h-32 bg-paper-sub rounded" />
          <div className="h-64 bg-paper-sub rounded" />
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert variant="danger">
          {error ?? 'Team not found'}
        </Alert>
      </div>
    )
  }

  const roleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'danger' as const
      case 'admin': return 'warning' as const
      case 'editor': return 'info' as const
      default: return 'secondary' as const
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Team Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">{team.name}</h1>
            <Badge variant={roleColor(team.role)}>
              {team.role.charAt(0).toUpperCase() + team.role.slice(1)}
            </Badge>
          </div>
          {team.description && (
            <p className="text-sm text-ink-muted mt-1">{team.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={loadTeam} variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          {canManage && (
            <Button
              onClick={() => window.location.href = `/api/compliance/export?teamId=${teamId}`}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-accent" />
              <div>
                <div className="text-2xl font-bold">{team.member_count}</div>
                <div className="text-xs text-ink-muted">Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-accent" />
              <div>
                <div className="text-2xl font-bold">{team.wallet_count}</div>
                <div className="text-xs text-ink-muted">Wallets</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-semantic-success-700" />
              <div>
                <div className="text-2xl font-bold">Sentinel</div>
                <div className="text-xs text-ink-muted">Plan</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-deep" />
              <div>
                <div className="text-2xl font-bold">Active</div>
                <div className="text-xs text-ink-muted">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-ink-rule">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'portfolio'
              ? 'border-primary-accent text-primary-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Wallet className="w-4 h-4 inline mr-1.5" />
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-primary-accent text-primary-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-1.5" />
          Activity Log
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'members'
              ? 'border-primary-accent text-primary-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Users className="w-4 h-4 inline mr-1.5" />
          Members
        </button>
        <button
          onClick={() => setActiveTab('safe')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'safe'
              ? 'border-primary-accent text-primary-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Lock className="w-4 h-4 inline mr-1.5" />
          Safe Multi-Sig
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'portfolio' && (
        <TeamPortfolioView teamId={Number(teamId)} />
      )}

      {activeTab === 'activity' && (
        <TeamActivityLog teamId={Number(teamId)} />
      )}

      {activeTab === 'members' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              {canManage && (
                <Button variant="primary" size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Invite
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <p className="text-sm text-ink-muted">No members found</p>
            ) : (
              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m.user_id}
                    className="flex items-center justify-between p-3 rounded-lg border border-ink-rule"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-paper-sub border border-ink-rule flex items-center justify-center">
                        <span className="text-sm font-medium text-amber-deep">
                          {(m.name ?? m.email)?.[0]?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink">
                          {m.name ?? m.email}
                        </div>
                        <div className="text-xs text-ink-whisper">{m.email}</div>
                      </div>
                    </div>
                    <Badge variant={roleColor(m.role)}>
                      {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'safe' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Safe Multi-Sig Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink-muted mb-4">
                Enter a Safe (Gnosis Safe) address to view and manage its token approvals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="0x... Safe address"
                  value={safeAddress}
                  onChange={(e) => setSafeAddress(e.target.value)}
                  className="flex-1 px-4 py-2 border border-ink-rule rounded-lg bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-amber-deep"
                />
                <select
                  value={safeChainId}
                  onChange={(e) => setSafeChainId(Number(e.target.value))}
                  className="px-4 py-2 border border-ink-rule rounded-lg bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-amber-deep"
                >
                  <option value={1}>Ethereum</option>
                  <option value={42161}>Arbitrum</option>
                  <option value={8453}>Base</option>
                  <option value={137}>Polygon</option>
                  <option value={10}>Optimism</option>
                  <option value={43114}>Avalanche</option>
                  <option value={56}>BNB Smart Chain</option>
                  <option value={250}>Fantom</option>
                  <option value={324}>zkSync Era</option>
                  <option value={1101}>Polygon zkEVM</option>
                  <option value={5000}>Mantle</option>
                  <option value={100}>Gnosis</option>
                  <option value={59144}>Linea</option>
                  <option value={534352}>Scroll</option>
                  <option value={42220}>Celo</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {safeAddress && (
            <SafeDashboard
              safeAddress={safeAddress}
              chainId={safeChainId}
              userTier="sentinel"
            />
          )}
        </div>
      )}
    </div>
  )
}
