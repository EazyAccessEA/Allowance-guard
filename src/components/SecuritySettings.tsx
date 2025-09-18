'use client'
import { useState, useEffect } from 'react'
import { Shield, Monitor, Clock, AlertTriangle, Check, X } from 'lucide-react'
import TwoFactorSetup from './TwoFactorSetup'

interface Device {
  id: number
  device_name: string
  device_type: string
  browser_name: string
  browser_version: string
  os_name: string
  os_version: string
  last_used_at: string
  created_at: string
}

interface Session {
  id: number
  device_name: string
  device_type: string
  browser_name: string
  browser_version: string
  os_name: string
  os_version: string
  ip_address: string
  location_country?: string
  location_city?: string
  is_trusted: boolean
  last_activity_at: string
  created_at: string
  expires_at: string
  is_current: boolean
}

interface User {
  id: number
  email: string
  name?: string
  two_factor_enabled: boolean
  last_login_at?: string
}

export default function SecuritySettings() {
  const [user, setUser] = useState<User | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'sessions'>('overview')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, devicesRes, sessionsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/auth/devices'),
        fetch('/api/auth/sessions')
      ])

      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData.user)
      }

      if (devicesRes.ok) {
        const devicesData = await devicesRes.json()
        setDevices(devicesData.devices)
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData.sessions)
      }
    } catch {
      setError('Failed to load security data')
    } finally {
      setLoading(false)
    }
  }

  const disable2FA = async () => {
    const token = prompt('Enter your 6-digit 2FA code to disable:')
    if (!token) return

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('2FA has been disabled successfully')
        setUser(prev => prev ? { ...prev, two_factor_enabled: false } : null)
      } else {
        setError(data.error || 'Failed to disable 2FA')
      }
    } catch {
      setError('Failed to disable 2FA')
    }
  }

  const removeDevice = async (deviceFingerprint: string) => {
    if (!confirm('Are you sure you want to remove this trusted device?')) return

    try {
      const response = await fetch('/api/auth/devices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceFingerprint })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Device removed successfully')
        setDevices(prev => prev.filter(d => d.id.toString() !== deviceFingerprint))
      } else {
        setError(data.error || 'Failed to remove device')
      }
    } catch {
      setError('Failed to remove device')
    }
  }

  const invalidateSession = async (sessionId: number) => {
    if (!confirm('Are you sure you want to end this session?')) return

    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Session ended successfully')
        setSessions(prev => prev.filter(s => s.id !== sessionId))
      } else {
        setError(data.error || 'Failed to end session')
      }
    } catch {
      setError('Failed to end session')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return '📱'
      case 'tablet': return '📱'
      default: return '💻'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (show2FASetup) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TwoFactorSetup
          onComplete={() => {
            setShow2FASetup(false)
            setSuccess('2FA has been enabled successfully')
            setUser(prev => prev ? { ...prev, two_factor_enabled: true } : null)
          }}
          onCancel={() => setShow2FASetup(false)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and trusted devices</p>
      </div>

      {/* Security Notice */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-800 mb-1">Security Notice</h3>
            <p className="text-sm text-amber-700">
              This page contains sensitive security settings. Only make changes if you understand the implications. 
              Keep your 2FA backup codes safe and never share them with anyone.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-600">{success}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'devices', label: 'Trusted Devices', icon: Monitor },
            { id: 'sessions', label: 'Active Sessions', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'devices' | 'sessions')}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${user?.two_factor_enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.two_factor_enabled 
                      ? 'Your account is protected with 2FA'
                      : 'Add an extra layer of security to your account'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={user?.two_factor_enabled ? disable2FA : () => setShow2FASetup(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  user?.two_factor_enabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {user?.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Devices</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">{devices.length}</p>
              <p className="text-sm text-gray-600">Devices you&apos;ve marked as trusted</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Sessions</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">{sessions.length}</p>
              <p className="text-sm text-gray-600">Currently active sessions</p>
            </div>
          </div>

          {user?.last_login_at && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Login</h3>
              <p className="text-gray-600">{formatDate(user.last_login_at)}</p>
            </div>
          )}
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          {devices.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trusted devices</h3>
              <p className="text-gray-600">Trusted devices will appear here after you sign in from them.</p>
            </div>
          ) : (
            devices.map((device) => (
              <div key={device.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{getDeviceIcon(device.device_type)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{device.device_name}</h3>
                      <p className="text-sm text-gray-600">
                        {device.browser_name} {device.browser_version} on {device.os_name} {device.os_version}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last used: {formatDate(device.last_used_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDevice(device.id.toString())}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active sessions</h3>
              <p className="text-gray-600">Active sessions will appear here.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className={`rounded-lg border p-6 ${
                session.is_current 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{getDeviceIcon(session.device_type)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{session.device_name}</h3>
                        {session.is_current && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                        {session.is_trusted && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Trusted
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {session.browser_name} {session.browser_version} on {session.os_name} {session.os_version}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.ip_address} • Last activity: {formatDate(session.last_activity_at)}
                      </p>
                    </div>
                  </div>
                  {!session.is_current && (
                    <button
                      onClick={() => invalidateSession(session.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
