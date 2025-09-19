'use client'

import React from 'react'
import { ChartContainer } from './ChartContainer'

interface LineChartData {
  label: string
  value: number
  timestamp?: string
}

interface LineChartProps {
  data: LineChartData[]
  title?: string
  subtitle?: string
  className?: string
  height?: string
  loading?: boolean
  error?: string
  showValues?: boolean
  showGrid?: boolean
  color?: string
  strokeWidth?: number
}

export function LineChart({
  data,
  title,
  subtitle,
  className,
  height = 'h-64',
  loading = false,
  error,
  showValues = true,
  showGrid = true,
  color = '#00C2B3',
  strokeWidth = 2
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const valueRange = maxValue - minValue || 1

  const getPoint = (item: LineChartData, index: number) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / valueRange) * 100
    return { x, y, value: item.value, label: item.label }
  }

  const points = data.map(getPoint)

  const createPath = () => {
    if (points.length < 2) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      
      // Create smooth curves using quadratic Bézier curves
      const cp1x = prev.x + (curr.x - prev.x) / 3
      const cp1y = prev.y
      const cp2x = curr.x - (curr.x - prev.x) / 3
      const cp2y = curr.y
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
    }
    
    return path
  }

  const createAreaPath = () => {
    if (points.length < 2) return ''
    
    const linePath = createPath()
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    
    return `${linePath} L ${lastPoint.x} 100 L ${firstPoint.x} 100 Z`
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
      <div className="relative w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          {/* Grid Lines */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
              ))}
              {[0, 20, 40, 60, 80, 100].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="100"
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}
          
          {/* Area Fill */}
          <path
            d={createAreaPath()}
            fill={`url(#gradient-${color.replace('#', '')})`}
            className="opacity-20"
          />
          
          {/* Line */}
          <path
            d={createPath()}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          
          {/* Data Points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={color}
              className="transition-all duration-300 hover:r-3 cursor-pointer"
            />
          ))}
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Value Labels */}
        {showValues && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-text-tertiary">
            {data.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mobbin-caption">{item.value.toLocaleString()}</div>
                <div className="mobbin-caption mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ChartContainer>
  )
}
