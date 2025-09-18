import { headers } from 'next/headers'

export interface DeviceInfo {
  fingerprint: string
  name: string
  type: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  ip: string
  userAgent: string
  country?: string
  city?: string
}

export async function getClientIP(): Promise<string> {
  const headersList = await headers()
  
  // Check various headers for IP address
  const forwarded = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const cfConnectingIP = headersList.get('cf-connecting-ip')
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  
  return 'unknown'
}

export async function getUserAgent(): Promise<string> {
  const headersList = await headers()
  return headersList.get('user-agent') || 'unknown'
}

export function generateDeviceFingerprint(userAgent: string, ip: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createHash } = require('crypto')
  const data = `${userAgent}-${ip}`
  return createHash('sha256').update(data).digest('hex')
}

export function parseUserAgent(userAgent: string): Partial<DeviceInfo> {
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  const isTablet = /iPad|Tablet/.test(userAgent)
  
  let deviceType = 'desktop'
  if (isTablet) deviceType = 'tablet'
  else if (isMobile) deviceType = 'mobile'

  // Extract browser info
  let browser = 'Unknown'
  let browserVersion = 'Unknown'
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome'
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge'
    const match = userAgent.match(/Edg\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari'
    const match = userAgent.match(/Version\/(\d+\.\d+)/)
    if (match) browserVersion = match[1]
  }

  // Extract OS info
  let os = 'Unknown'
  let osVersion = 'Unknown'
  
  if (userAgent.includes('Windows NT')) {
    os = 'Windows'
    const match = userAgent.match(/Windows NT (\d+\.\d+)/)
    if (match) {
      const version = match[1]
      switch (version) {
        case '10.0': osVersion = '10/11'; break
        case '6.3': osVersion = '8.1'; break
        case '6.2': osVersion = '8'; break
        case '6.1': osVersion = '7'; break
        default: osVersion = version
      }
    }
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS'
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/)
    if (match) {
      const version = match[1].replace('_', '.')
      const major = parseInt(version.split('.')[0])
      if (major >= 12) osVersion = `${major - 8}.0` // macOS version mapping
      else osVersion = version
    }
  } else if (userAgent.includes('Linux')) {
    os = 'Linux'
    if (userAgent.includes('Ubuntu')) osVersion = 'Ubuntu'
    else if (userAgent.includes('Fedora')) osVersion = 'Fedora'
    else if (userAgent.includes('CentOS')) osVersion = 'CentOS'
  } else if (userAgent.includes('Android')) {
    os = 'Android'
    const match = userAgent.match(/Android (\d+\.\d+)/)
    if (match) osVersion = match[1]
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS'
    const match = userAgent.match(/OS (\d+[._]\d+)/)
    if (match) osVersion = match[1].replace('_', '.')
  }

  return {
    type: deviceType,
    browser,
    browserVersion,
    os,
    osVersion
  }
}

export function generateDeviceName(deviceInfo: Partial<DeviceInfo>): string {
  const { os, osVersion, browser, type } = deviceInfo
  
  if (type === 'mobile') {
    return `${os} ${osVersion} Mobile`
  } else if (type === 'tablet') {
    return `${os} ${osVersion} Tablet`
  } else {
    return `${os} ${osVersion} - ${browser}`
  }
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const userAgent = await getUserAgent()
  const ip = await getClientIP()
  const fingerprint = generateDeviceFingerprint(userAgent, ip)
  const parsed = parseUserAgent(userAgent)
  const name = generateDeviceName(parsed)
  
  return {
    fingerprint,
    name,
    type: parsed.type || 'desktop',
    browser: parsed.browser || 'Unknown',
    browserVersion: parsed.browserVersion || 'Unknown',
    os: parsed.os || 'Unknown',
    osVersion: parsed.osVersion || 'Unknown',
    ip,
    userAgent
  }
}
