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
        return 'text-semantic-success'
      case 'down':
        return 'text-semantic-danger'
      default:
        return 'text-text-secondary'
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
    <Card className="hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">{title}</h3>
              <div className="text-2xl font-bold text-text-primary">{value}</div>
            </div>
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function StatisticsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background-light">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Security Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
            The Hidden Risk in Every Wallet
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Token approvals are the silent vulnerability that affects every DeFi user. 
            Understanding the scale helps you protect what matters most.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            title="Total Losses (2024)"
            value="$3.2B+"
            description="Lost to approval-based exploits across all DeFi protocols"
            trend="up"
            trendValue="+47%"
            icon={
              <svg className="w-5 h-5 text-semantic-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="w-5 h-5 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="w-5 h-5 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="w-5 h-5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Risk Breakdown */}
        <div className="bg-white rounded-lg border border-border-default p-8">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Common Approval Risks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-semantic-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">Unlimited Approvals</h4>
              <p className="text-text-secondary text-sm">
                Approvals that allow unlimited token spending, creating maximum risk exposure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-semantic-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">Abandoned Contracts</h4>
              <p className="text-text-secondary text-sm">
                Approvals to contracts that are no longer maintained or have been compromised.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">Malicious Contracts</h4>
              <p className="text-text-secondary text-sm">
                Known malicious or suspicious contracts that pose immediate security threats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
