'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const data = [
  { day: 'Mon', current: 2400, target: 2500, previous: 2800 },
  { day: 'Tue', current: 2210, target: 2500, previous: 2600 },
  { day: 'Wed', current: 2290, target: 2500, previous: 2700 },
  { day: 'Thu', current: 2000, target: 2500, previous: 2550 },
  { day: 'Fri', current: 2181, target: 2500, previous: 2400 },
  { day: 'Sat', current: 2500, target: 2500, previous: 2650 },
  { day: 'Sun', current: 2100, target: 2500, previous: 2300 },
]

export default function EmissionsTrendChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Emissions Trend</h3>
          <p className="text-sm text-gray-500">Daily CO₂ emissions vs target</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Current Week</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-600">Previous Week</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Target</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0071CE" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0071CE" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: string) => {
                const labels: { [key: string]: string } = {
                  current: 'Current Week',
                  previous: 'Previous Week', 
                  target: 'Target'
                }
                return [`${value} kg CO₂`, labels[name] || name]
              }}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#0071CE"
              fillOpacity={1}
              fill="url(#currentGradient)"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}