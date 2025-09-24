'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface StatCardProps {
  title: string
  value: string
  description: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
}

function StatCard({ title, value, description, trend, trendValue, icon }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-600' // Apple uses red for concerning trends
      case 'down':
        return 'text-green-600' // Apple uses green for positive trends
      default:
        return 'text-gray-500'
    }
  }

  const getTrendIcon = () => {
    // Icons removed for cleaner design
    return null
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-sm">
      <CardContent className="p-8">
        {/* Clean text-focused design without icons */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="mobbin-caption text-text-secondary mb-2 tracking-wide uppercase">{title}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          </div>
          {trend && trendValue && (
            <div className={`text-sm font-semibold ${getTrendColor()}`}>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {/* Apple-style description with better readability */}
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function StatisticsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Left-aligned for better readability */}
        <div className="mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            Security Intelligence
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            The Hidden Risk in Every Wallet
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl leading-relaxed text-justify">
            Token approvals are the silent vulnerability that affects every DeFi user. 
            Understanding the scale helps you protect what matters most.
          </p>
        </div>

        {/* Apple-style Statistics Layout - Clean text-focused design */}
        <div className="space-y-8 mb-20">
          {/* Critical Stat - Most Important */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mobbin-heading-2 text-text-primary mb-1">$3.2B+ Lost in 2024</h3>
                <p className="text-gray-600 text-lg">Lost to approval-based exploits across all DeFi protocols</p>
              </div>
              <div className="text-red-600">
                <span className="text-lg font-semibold">+47%</span>
              </div>
            </div>
          </div>

          {/* Secondary Stats - Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">73%</div>
                <div className="text-sm text-gray-600">of DeFi attacks</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Exploit token approvals as their primary attack vector
              </p>
              <div className="text-orange-600 mt-3">
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">47</div>
                <div className="text-sm text-gray-600">average approvals</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Active token approvals per wallet across major chains
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">&lt;60s</div>
                <div className="text-sm text-gray-600">scan time</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Average time to complete a comprehensive security audit
              </p>
              <div className="text-green-600 mt-3">
                <span className="text-sm font-medium">-30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Types - Left-aligned for better readability */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Common Approval Risks
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl text-justify">
              Understanding these risks helps you make informed decisions about your token approvals.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* High Risk */}
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <h4 className="mobbin-heading-3 text-text-primary mb-2">Unlimited Approvals</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Approvals that allow unlimited token spending, creating maximum risk exposure. These should be avoided whenever possible.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                High Risk
              </div>
            </div>

            {/* Medium Risk */}
            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
              <h4 className="mobbin-heading-3 text-text-primary mb-2">Abandoned Contracts</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Approvals to contracts that are no longer maintained or have been compromised. These pose ongoing security risks.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                Medium Risk
              </div>
            </div>

            {/* Critical Risk */}
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="mobbin-heading-3 text-text-primary mb-2">Malicious Contracts</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Known malicious or suspicious contracts that pose immediate security threats. These should be revoked immediately.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Critical Risk
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
