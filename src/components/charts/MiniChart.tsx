'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MiniChartProps {
  data: number[]
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MiniChart({
  data,
  title,
  value,
  trend,
  trendValue,
  color = '#00C2B3',
  className,
  size = 'md'
}: MiniChartProps) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const valueRange = maxValue - minValue || 1

  const getPoint = (value: number, index: number) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - minValue) / valueRange) * 100
    return { x, y }
  }

  const points = data.map(getPoint)

  const createPath = () => {
    if (points.length < 2) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    
    return path
  }

  const getTrendIcon = () => {
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

  const getTrendColor = () => {
    if (!trend) return 'text-text-tertiary'
    switch (trend) {
      case 'up':
        return 'text-semantic-success-500'
      case 'down':
        return 'text-semantic-error-500'
      default:
        return 'text-text-tertiary'
    }
  }

  const sizeClasses = {
    sm: {
      container: 'p-3',
      chart: 'h-8',
      title: 'mobbin-caption',
      value: 'mobbin-body-small',
      trend: 'text-xs'
    },
    md: {
      container: 'p-4',
      chart: 'h-12',
      title: 'mobbin-body-small',
      value: 'mobbin-body',
      trend: 'mobbin-caption'
    },
    lg: {
      container: 'p-6',
      chart: 'h-16',
      title: 'mobbin-body',
      value: 'mobbin-heading-4',
      trend: 'mobbin-body-small'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn('mobbin-card hover:shadow-md transition-all duration-200', classes.container, className)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={cn(classes.title, 'text-text-secondary')}>{title}</h4>
        {trend && trendValue && (
          <div className={cn('flex items-center gap-1', classes.trend, getTrendColor())}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className={cn(classes.value, 'text-text-primary font-medium')}>
          {value}
        </div>
        
        <div className={cn('flex-1 ml-4', classes.chart)}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="opacity-80"
          >
            <path
              d={createPath()}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
