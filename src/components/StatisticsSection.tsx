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
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-sm">
      <CardContent className="p-8">
        {/* Apple-style icon with better visual hierarchy */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2 tracking-wide uppercase">{title}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
            </div>
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor()}`}>
              {getTrendIcon()}
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
    <section className="py-16 sm:py-20 lg:py-24 bg-background-light">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Apple-style clarity */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 text-sm font-medium tracking-wide uppercase">
            Security Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
            The Hidden Risk in Every Wallet
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Token approvals are the silent vulnerability that affects every DeFi user. 
            Understanding the scale helps you protect what matters most.
          </p>
        </div>

        {/* Statistics Grid - Apple-style clarity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard
            title="Total Losses (2024)"
            value="$3.2B+"
            description="Lost to approval-based exploits across all DeFi protocols"
            trend="up"
            trendValue="+47%"
            icon={
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />

          <StatCard
            title="Attack Vector"
            value="73%"
            description="Percentage of DeFi attacks that exploit token approvals"
            trend="up"
            trendValue="+12%"
            icon={
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="Average Wallets"
            value="47"
            description="Active token approvals per wallet across major chains"
            trend="neutral"
            icon={
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          <StatCard
            title="Scan Time"
            value="<60s"
            description="Average time to complete a comprehensive security audit"
            trend="down"
            trendValue="-30%"
            icon={
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Risk Breakdown - Apple-style clarity and hierarchy */}
        <div className="bg-white rounded-2xl shadow-sm border-0 p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Common Approval Risks
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding these risks helps you make informed decisions about your token approvals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors duration-200">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Unlimited Approvals</h4>
              <p className="text-gray-600 leading-relaxed">
                Approvals that allow unlimited token spending, creating maximum risk exposure. These should be avoided whenever possible.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-100 transition-colors duration-200">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Abandoned Contracts</h4>
              <p className="text-gray-600 leading-relaxed">
                Approvals to contracts that are no longer maintained or have been compromised. These pose ongoing security risks.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-200">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Malicious Contracts</h4>
              <p className="text-gray-600 leading-relaxed">
                Known malicious or suspicious contracts that pose immediate security threats. These should be revoked immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
