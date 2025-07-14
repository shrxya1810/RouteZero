'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import EmissionsTrendChart from '@/components/charts/EmissionsTrendChart'
import AlertCard from '@/components/ui/AlertCard'
import FleetStatusCard from '@/components/ui/FleetStatusCard'
import ClientTimestamp from '@/components/ui/ClientTimestamp'
import { fleetStore } from '@/lib/fleetStore'
import { routeStore } from '@/lib/store'
import { 
  Truck, 
  Leaf, 
  Target, 
  TrendingDown, 
  MapPin, 
  Clock,
  DollarSign,
  Zap
} from 'lucide-react'

// Mock data for demonstration
const mockAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    title: 'Route BLR-MUM-001 Exceeded Emission Target',
    message: 'Current route emissions 45% above target. Consider switching to rail freight.',
    timestamp: '2 min ago',
    actionable: true
  },
  {
    id: '2',
    type: 'warning' as const,
    title: 'EV Charging Station Offline',
    message: 'Mumbai hub charging station requires maintenance.',
    timestamp: '15 min ago',
    actionable: true
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'Route Optimization Available',
    message: '12 routes can be optimized for 15% emission reduction.',
    timestamp: '1 hour ago',
    actionable: true
  }
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [fleetStats, setFleetStats] = useState({
    total: 0,
    electric: 0,
    hybrid: 0,
    diesel: 0,
    available: 0,
    inTransit: 0,
    maintenance: 0,
    avgEmissions: 0
  })
  const [routeStats, setRouteStats] = useState({
    totalPotentialSavings: 0,
    activeRoutes: 0
  })

  useEffect(() => {
    // Load real fleet and route data
    const fleetData = fleetStore.getFleetStats()
    const routeData = routeStore.getStats()
    
    setFleetStats(fleetData)
    setRouteStats(routeData)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </>
    )
  }

  // Calculate real KPI values
  const greenFleetPercentage = Math.round(((fleetStats.electric + fleetStats.hybrid) / fleetStats.total) * 100)
  const totalEmissionsToday = fleetStats.avgEmissions * 1000
  const activeRoutes = fleetStats.inTransit
  const weeklySavings = routeStats.totalPotentialSavings * 15.5

  return (
    <>
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Executive Overview KPIs */}
        <section className="fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Executive Overview</h2>
            <p className="text-gray-600">Real-time supply chain emissions and performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Today's Carbon Footprint"
              value={Math.round(totalEmissionsToday).toLocaleString()}
              unit="kg CO₂"
              status="warning"
              change={{ value: 14, period: "vs target", positive: false }}
              icon={<Leaf className="w-6 h-6" />}
            />
            
            <KPICard
              title="Fleet Efficiency"
              value={greenFleetPercentage.toString()}
              unit="% EV/Hybrid"
              status="good"
              change={{ value: 12, period: "this week", positive: true }}
              icon={<Zap className="w-6 h-6" />}
            />
            
            <KPICard
              title="Active Routes"
              value={activeRoutes.toString()}
              status="good"
              change={{ value: 23, period: "in transit", positive: true }}
              icon={<Target className="w-6 h-6" />}
            />
            
            <KPICard
              title="Weekly Savings"
              value={`$${Math.round(weeklySavings).toLocaleString()}`}
              status="good"
              change={{ value: 8, period: "vs last week", positive: true }}
              icon={<DollarSign className="w-6 h-6" />}
            />
          </div>
        </section>

        {/* Charts and Analytics */}
        <section className="fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emissions Trend */}
            <div className="lg:col-span-2">
              <EmissionsTrendChart />
            </div>
          </div>
        </section>

        {/* Operational Status */}
        <section className="fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Operational Status</h2>
            <p className="text-gray-600">Live fleet status and priority alerts</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fleet Status - Takes 2 columns */}
            <div className="lg:col-span-2">
              <FleetStatusCard />
            </div>
            
            {/* Alerts - Takes 1 column */}
            <div>
              <AlertCard alerts={mockAlerts} />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="fade-in">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Frequently used operations</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <TrendingDown className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">Optimize Routes</span>
                </div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">Fleet Status</span>
                </div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">Track Shipments</span>
                </div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">Generate Report</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-gray-500 text-sm">
            <ClientTimestamp />
          </p>
        </footer>
      </main>
    </>
  )
}