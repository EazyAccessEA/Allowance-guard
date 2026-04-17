'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useUserPlan } from '@/hooks/useUserPlan'
import FeatureLock from '@/components/FeatureLock'
import { Users, Plus, Mail, Crown, Shield, Eye, UserPlus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Team {
 id: number
 name: string
 description: string | null
 role: string
 member_count: number
 wallet_count: number
 created_at: string
}

interface Member {
 user_id: number
 email: string
 name: string | null
 role: string
 created_at: string
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
 owner: <Crown className="h-3.5 w-3.5 text-amber-deep" />,
 admin: <Shield className="h-3.5 w-3.5 text-amber-deep" />,
 editor: <UserPlus className="h-3.5 w-3.5 text-ink-blue" />,
 viewer: <Eye className="h-3.5 w-3.5 text-neutral-400" />,
}

export default function TeamDashboard() {
 const { plan, limits } = useUserPlan()
 const [teams, setTeams] = useState<Team[]>([])
 const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
 const [members, setMembers] = useState<Member[]>([])
 const [loading, setLoading] = useState(true)
 const [membersLoading, setMembersLoading] = useState(false)
 const [showCreate, setShowCreate] = useState(false)
 const [showInvite, setShowInvite] = useState(false)
 const [newTeamName, setNewTeamName] = useState('')
 const [newTeamDesc, setNewTeamDesc] = useState('')
 const [inviteEmail, setInviteEmail] = useState('')
 const [inviteRole, setInviteRole] = useState('viewer')
 const [creating, setCreating] = useState(false)
 const [inviting, setInviting] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const fetchTeams = useCallback(async () => {
 try {
 const res = await fetch('/api/teams')
 if (res.ok) {
 const json = await res.json()
 setTeams(json.teams ?? [])
 if (json.teams?.length > 0 && !selectedTeam) {
 setSelectedTeam(json.teams[0])
 }
 }
 } catch {
 setError('Failed to load teams')
 } finally {
 setLoading(false)
 }
 }, [selectedTeam])

 const fetchMembers = useCallback(async (teamId: number) => {
 setMembersLoading(true)
 try {
 const res = await fetch(`/api/teams/members?teamId=${teamId}`)
 if (res.ok) {
 const json = await res.json()
 setMembers(json.members ?? [])
 }
 } catch {
 // Keep existing state
 } finally {
 setMembersLoading(false)
 }
 }, [])

 useEffect(() => { fetchTeams() }, [fetchTeams])

 useEffect(() => {
 if (selectedTeam) fetchMembers(selectedTeam.id)
 }, [selectedTeam, fetchMembers])

 const handleCreateTeam = async () => {
 if (!newTeamName.trim()) return
 setCreating(true)
 setError(null)
 try {
 const res = await fetch('/api/teams', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ name: newTeamName, description: newTeamDesc }),
 })
 if (!res.ok) {
 const json = await res.json()
 setError(json.error || 'Failed to create team')
 return
 }
 setNewTeamName('')
 setNewTeamDesc('')
 setShowCreate(false)
 await fetchTeams()
 } catch {
 setError('Failed to create team')
 } finally {
 setCreating(false)
 }
 }

 const handleInvite = async () => {
 if (!inviteEmail.trim() || !selectedTeam) return
 setInviting(true)
 setError(null)
 try {
 const res = await fetch('/api/teams/invite', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ teamId: selectedTeam.id, email: inviteEmail, role: inviteRole }),
 })
 if (!res.ok) {
 const json = await res.json()
 setError(json.error || 'Failed to send invite')
 return
 }
 setInviteEmail('')
 setShowInvite(false)
 } catch {
 setError('Failed to send invite')
 } finally {
 setInviting(false)
 }
 }

 // Gate the entire dashboard for non-sentinel users
 if (!limits.teams) {
 return (
 <FeatureLock feature="Team dashboard" requiredPlan="sentinel">
 <div className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Users className="h-5 w-5" />
 Team Dashboard
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 <div className="h-8 bg-neutral-100 rounded w-48" />
 <div className="h-20 bg-neutral-50 rounded" />
 <div className="h-20 bg-neutral-50 rounded" />
 </div>
 </CardContent>
 </Card>
 </div>
 </FeatureLock>
 )
 }

 if (loading) {
 return (
 <Card>
 <CardContent className="py-12 flex items-center justify-center">
 <Loader2 className="h-6 w-6 animate-spin text-amber-deep" />
 </CardContent>
 </Card>
 )
 }

 return (
 <div className="space-y-6">
 {error && (
 <div className="rounded-lg border border-crimson-paper/40 bg-paper-sub px-4 py-3 text-sm text-crimson-paper">
 {error}
 <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
 </div>
 )}

 {/* Team Selector + Create */}
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <Users className="h-6 w-6 text-amber-deep" />
 <h2 className="text-xl font-bold text-ink">Team Dashboard</h2>
 <Badge variant="info" size="sm">{plan}</Badge>
 </div>
 <Button onClick={() => setShowCreate(true)} variant="primary" size="sm" className="flex items-center gap-2">
 <Plus className="h-4 w-4" />
 Create Team
 </Button>
 </div>

 {/* Create Team Form */}
 {showCreate && (
 <Card>
 <CardContent className="py-4 space-y-4">
 <h3 className="font-semibold text-ink">Create New Team</h3>
 <Input
 label="Team Name"
 value={newTeamName}
 onChange={(e) => setNewTeamName(e.target.value)}
 placeholder="e.g., Treasury Team"
 />
 <Input
 label="Description (optional)"
 value={newTeamDesc}
 onChange={(e) => setNewTeamDesc(e.target.value)}
 placeholder="What is this team for?"
 />
 <div className="flex gap-2">
 <Button onClick={handleCreateTeam} variant="primary" size="sm" loading={creating}>
 Create
 </Button>
 <Button onClick={() => setShowCreate(false)} variant="ghost" size="sm">
 Cancel
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Teams List */}
 {teams.length === 0 ? (
 <Card>
 <CardContent className="py-12 text-center">
 <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
 <h3 className="font-semibold text-ink mb-2">No teams yet</h3>
 <p className="text-sm text-ink-muted mb-4">
 Create a team to collaborate on wallet monitoring and security management.
 </p>
 <Button onClick={() => setShowCreate(true)} variant="primary" size="sm">
 Create Your First Team
 </Button>
 </CardContent>
 </Card>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {teams.map((team) => (
 <Card
 key={team.id}
 className={cn(
 'cursor-pointer transition-all duration-150',
 selectedTeam?.id === team.id
 ? 'ring-2 ring-amber-deep0 border-amber-deep/40'
 : 'hover:border-amber-deep/40'
 )}
 onClick={() => setSelectedTeam(team)}
 >
 <CardContent className="py-4">
 <div className="flex items-start justify-between mb-2">
 <h3 className="font-semibold text-ink">{team.name}</h3>
 <Badge variant="default" size="sm">{team.role}</Badge>
 </div>
 {team.description && (
 <p className="text-xs text-ink-muted mb-3">{team.description}</p>
 )}
 <div className="flex gap-4 text-xs text-ink-muted">
 <span>{team.member_count} member{team.member_count !== 1 ? 's' : ''}</span>
 <span>{team.wallet_count} wallet{team.wallet_count !== 1 ? 's' : ''}</span>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}

 {/* Selected Team Members */}
 {selectedTeam && (
 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <CardTitle className="flex items-center gap-2">
 <Users className="h-5 w-5" />
 {selectedTeam.name} Members
 </CardTitle>
 {['owner', 'admin', 'editor'].includes(selectedTeam.role) && (
 <Button onClick={() => setShowInvite(true)} variant="secondary" size="sm" className="flex items-center gap-2">
 <Mail className="h-4 w-4" />
 Invite
 </Button>
 )}
 </div>
 </CardHeader>
 <CardContent>
 {/* Invite Form */}
 {showInvite && (
 <div className="mb-6 p-4 border border-ink-rule rounded-lg space-y-3">
 <h4 className="text-sm font-semibold text-ink">Invite Member</h4>
 <Input
 label="Email"
 type="email"
 value={inviteEmail}
 onChange={(e) => setInviteEmail(e.target.value)}
 placeholder="colleague@example.com"
 />
 <div>
 <label className="block text-sm font-medium text-ink-muted mb-1">Role</label>
 <select
 value={inviteRole}
 onChange={(e) => setInviteRole(e.target.value)}
 className="w-full border border-ink-rule rounded-md px-3 py-2 text-sm bg-paper-sub text-ink"
 >
 <option value="viewer">Viewer</option>
 <option value="editor">Editor</option>
 <option value="admin">Admin</option>
 </select>
 </div>
 <div className="flex gap-2">
 <Button onClick={handleInvite} variant="primary" size="sm" loading={inviting}>
 Send Invite
 </Button>
 <Button onClick={() => setShowInvite(false)} variant="ghost" size="sm">
 Cancel
 </Button>
 </div>
 </div>
 )}

 {/* Members List */}
 {membersLoading ? (
 <div className="flex justify-center py-8">
 <Loader2 className="h-5 w-5 animate-spin text-amber-deep" />
 </div>
 ) : (
 <div className="divide-y divide-border-primary">
 {members.map((member) => (
 <div key={member.user_id} className="flex items-center justify-between py-3">
 <div className="flex items-center gap-3">
 <div className="h-8 w-8 rounded-full bg-paper-sub flex items-center justify-center text-sm font-medium text-amber-deep">
 {(member.name || member.email)?.[0]?.toUpperCase() ?? '?'}
 </div>
 <div>
 <p className="text-sm font-medium text-ink">
 {member.name || member.email}
 </p>
 {member.name && (
 <p className="text-xs text-ink-muted">{member.email}</p>
 )}
 </div>
 </div>
 <div className="flex items-center gap-1.5">
 {ROLE_ICONS[member.role]}
 <span className="text-xs font-medium text-ink-muted capitalize">
 {member.role}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>
 )}
 </div>
 )
}
