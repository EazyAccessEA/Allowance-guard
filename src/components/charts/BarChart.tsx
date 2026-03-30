'use client'

import React from 'react'
import { ChartContainer } from './ChartContainer'

interface BarChartData {
  label: string
  value: number
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

interface BarChartProps {
  data: BarChartData[]
  title?: string
  subtitle?: string
  className?: string
  height?: string
  loading?: boolean
  error?: string
  showValues?: boolean
  showTrends?: boolean
  maxValue?: number
}

export function BarChart({
  data,
  title,
  subtitle,
  className,
  height = 'h-64',
  loading = false,
  error,
  showValues = true,
  showTrends = true,
  maxValue
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  const colors = {
    primary: '#00C2B3',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
    neutral: '#64748B'
  }

  const getBarColor = (item: BarChartData) => {
    if (item.color) return item.color
    if (item.trend === 'up') return colors.success
    if (item.trend === 'down') return colors.error
    return colors.primary
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (!trend) return null
    switch (trend) {
      case 'up':
        return <span className="text-semantic-success-500">↗</span>
      case 'down':
        return <span className="text-semantic-error-500">↘</span>
      default:
        return <span className="text-text-tertiary">→</span>
    }
  }

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      className={className}
      height={height}
      loading={loading}
      error={error}
    >
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const height = (item.value / max) * 100
          const barColor = getBarColor(item)
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              {/* Bar */}
              <div className="relative w-full flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${height}%`,
                    backgroundColor: barColor,
                    minHeight: item.value > 0 ? '4px' : '0px'
                  }}
                />
                
                {/* Value Tooltip */}
                {showValues && item.value > 0 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-text-primary text-background-primary px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <div className="mobbin-caption text-text-secondary truncate max-w-full">
                  {item.label}
                </div>
                {showTrends && item.trend && (
                  <div className="flex items-center justify-center mt-1">
                    {getTrendIcon(item.trend)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </ChartContainer>
  )
}
