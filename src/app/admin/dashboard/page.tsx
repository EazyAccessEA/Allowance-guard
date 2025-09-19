'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
// Button component not used in this file
import { Badge } from '@/components/ui/Badge'
import AuditDashboard from '@/components/AuditDashboard'
import PerformanceDashboard from '@/components/PerformanceDashboard'
import { 
  Shield, 
  BarChart3, 
  Activity, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'performance'>('overview')

  // Mock data for overview
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalScans: 15643,
    totalRevocations: 8934,
    systemHealth: 'healthy',
    lastIncident: '2024-01-15T10:30:00Z'
  }

  const recentActivity = [
    {
      id: 1,
      type: 'scan',
      user: '0x1234...5678',
      timestamp: '2024-01-15T14:30:00Z',
      details: 'Scanned 12 allowances'
    },
    {
      id: 2,
      type: 'revoke',
      user: '0xabcd...efgh',
      timestamp: '2024-01-15T14:25:00Z',
      details: 'Revoked 3 risky approvals'
    },
    {
      id: 3,
      type: 'alert',
      user: 'system',
      timestamp: '2024-01-15T14:20:00Z',
      details: 'High-risk approval detected'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan': return <Activity className="w-4 h-4 text-primary-accent" />
      case 'revoke': return <Shield className="w-4 h-4 text-semantic-success" />
      case 'alert': return <AlertTriangle className="w-4 h-4 text-semantic-danger" />
      default: return <Activity className="w-4 h-4 text-neutral-text" />
    }
  }

  // Activity color function removed as it's not used

  return (
    <div className="min-h-screen bg-background-light">
      <Section className="py-8">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-text mb-2">Admin Dashboard</h1>
            <p className="text-neutral-text">Monitor system performance, security, and user activity</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-background-light p-1 rounded-lg border border-neutral-borders">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-150 ${
                  activeTab === 'overview'
                    ? 'bg-white text-primary-accent shadow-sm'
                    : 'text-neutral-text hover:text-neutral-text hover:bg-white/50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-150 ${
                  activeTab === 'audit'
                    ? 'bg-white text-primary-accent shadow-sm'
                    : 'text-neutral-text hover:text-neutral-text hover:bg-white/50'
                }`}
              >
                Audit Logs
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-150 ${
                  activeTab === 'performance'
                    ? 'bg-white text-primary-accent shadow-sm'
                    : 'text-neutral-text hover:text-neutral-text hover:bg-white/50'
                }`}
              >
                Performance
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-text">Total Users</p>
                        <p className="text-2xl font-bold text-neutral-text">{stats.totalUsers.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-semantic-success" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-text">Active Users</p>
                        <p className="text-2xl font-bold text-semantic-success">{stats.activeUsers.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-semantic-info/10 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-semantic-info" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-text">Total Scans</p>
                        <p className="text-2xl font-bold text-semantic-info">{stats.totalScans.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-semantic-warning/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-semantic-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-text">Revocations</p>
                        <p className="text-2xl font-bold text-semantic-warning">{stats.totalRevocations.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Health & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-semantic-success" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-text">Overall Status</span>
                        <Badge variant="success">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-text">Database</span>
                        <Badge variant="success">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-text">RPC Endpoints</span>
                        <Badge variant="success">3/3 Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-text">Last Incident</span>
                        <span className="text-sm text-neutral-text">
                          {new Date(stats.lastIncident).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-accent" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-background-light">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-text">{activity.details}</p>
                            <p className="text-xs text-neutral-text">{activity.user}</p>
                          </div>
                          <span className="text-xs text-neutral-text">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <AuditDashboard />
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-accent" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-text mb-4">
                    Real-time performance monitoring and Core Web Vitals tracking.
                  </p>
                  <div className="bg-background-light p-4 rounded-lg">
                    <p className="text-sm text-neutral-text">
                      Performance dashboard is available as a floating widget in the bottom-right corner.
                      Click the performance icon to view detailed metrics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </Section>

      {/* Performance Dashboard Widget */}
      <PerformanceDashboard />
    </div>
  )
}
