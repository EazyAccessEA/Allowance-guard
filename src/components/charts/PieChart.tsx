'use client'

import React from 'react'
import { ChartContainer } from './ChartContainer'

interface PieChartData {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  data: PieChartData[]
  title?: string
  subtitle?: string
  className?: string
  height?: string
  loading?: boolean
  error?: string
  showLegend?: boolean
  showValues?: boolean
  size?: number
}

export function PieChart({
  data,
  title,
  subtitle,
  className,
  height = 'h-64',
  loading = false,
  error,
  showLegend = true,
  showValues = true,
  size = 120
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = [
    '#00C2B3', // primary
    '#22C55E', // success
    '#F59E0B', // warning
    '#EF4444', // error
    '#0EA5E9', // info
    '#8B5CF6', // purple
    '#F97316', // orange
    '#EC4899'  // pink
  ]

  let cumulativePercentage = 0

  const getColor = (index: number, customColor?: string) => {
    return customColor || colors[index % colors.length]
  }

  const createPath = (percentage: number, radius: number) => {
    const angle = (percentage / 100) * 360
    const startAngle = cumulativePercentage * 3.6 // Convert to degrees
    const endAngle = startAngle + angle
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)
    
    const x1 = 50 + radius * Math.cos(startAngleRad)
    const y1 = 50 + radius * Math.sin(startAngleRad)
    const x2 = 50 + radius * Math.cos(endAngleRad)
    const y2 = 50 + radius * Math.sin(endAngleRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    cumulativePercentage += percentage
    return pathData
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
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-8">
          {/* Pie Chart */}
          <div className="relative">
            <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const color = getColor(index, item.color)
                const pathData = createPath(percentage, 40)
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    stroke="white"
                    strokeWidth="1"
                  />
                )
              })}
            </svg>
            
            {/* Center Text */}
            {showValues && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mobbin-heading-3 text-text-primary">{total.toLocaleString()}</div>
                  <div className="mobbin-caption text-text-secondary">Total</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          {showLegend && (
            <div className="space-y-2">
              {data.map((item, index) => {
                const percentage = ((item.value / total) * 100).toFixed(1)
                const color = getColor(index, item.color)
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="mobbin-body-small text-text-primary truncate">
                        {item.label}
                      </div>
                      <div className="mobbin-caption text-text-tertiary">
                        {item.value.toLocaleString()} ({percentage}%)
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ChartContainer>
  )
}
