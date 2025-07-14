'use client'

import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  actionable?: boolean
}

interface AlertCardProps {
  alerts: Alert[]
}

export default function AlertCard({ alerts }: AlertCardProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-l-blue-500 bg-blue-50'
      case 'success':
        return 'border-l-green-500 bg-green-50'
    }
  }

  const getPriorityOrder = (type: Alert['type']) => {
    const order = { critical: 1, warning: 2, info: 3, success: 4 }
    return order[type]
  }

  const sortedAlerts = [...alerts].sort((a, b) => 
    getPriorityOrder(a.type) - getPriorityOrder(b.type)
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Priority Alerts</h3>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {alerts.filter(a => a.type === 'critical').length} Critical
          </span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 border-l-4 ${getAlertStyles(alert.type)} border-b border-gray-100 last:border-b-0`}
          >
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {alert.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                
                {alert.actionable && (
                  <div className="mt-3">
                    <button className="text-xs bg-walmart-blue text-white px-3 py-1 rounded-md hover:bg-walmart-dark-blue transition-colors">
                      Take Action
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">All systems operating normally</p>
        </div>
      )}
    </div>
  )
}