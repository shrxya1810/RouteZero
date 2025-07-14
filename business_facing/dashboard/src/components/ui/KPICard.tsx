'use client'

import { ReactNode } from 'react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  change?: {
    value: number
    period: string
    positive: boolean
  }
  status?: 'good' | 'warning' | 'critical'
  icon?: ReactNode
  className?: string
}

export default function KPICard({
  title,
  value,
  unit,
  change,
  status = 'good',
  icon,
  className = ''
}: KPICardProps) {
  const getStatusColors = () => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'critical':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getChangeColors = () => {
    if (!change) return ''
    return change.positive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100'
  }

  return (
    <div className={`p-6 rounded-xl border-2 ${getStatusColors()} shadow-sm hover:shadow-walmart transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
          
          {change && (
            <div className="mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeColors()}`}>
                {change.positive ? '↗' : '↘'} {Math.abs(change.value)}% {change.period}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 walmart-gradient rounded-lg flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}