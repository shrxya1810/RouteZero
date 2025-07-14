'use client'

import { useState, useEffect } from 'react'
import { fleetStore, type Vehicle } from '@/lib/fleetStore'
import Header from '@/components/layout/Header'
import { 
  Truck, 
  Battery, 
  Fuel, 
  Wrench, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Leaf,
  DollarSign,
  MapPin,
  Users,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

export default function FleetOverviewPage() {
  const [fleetStats, setFleetStats] = useState<any>(null)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<Vehicle[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    setFleetStats(fleetStore.getFleetStats())
    setMaintenanceAlerts(fleetStore.getMaintenanceAlerts())
    setVehicles(fleetStore.getAllVehicles())
  }, [])

  if (!fleetStats) {
    return <div>Loading...</div>
  }

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'in_transit': return 'text-blue-600 bg-blue-100'
      case 'charging': return 'text-yellow-600 bg-yellow-100'
      case 'maintenance_required': return 'text-orange-600 bg-orange-100'
      case 'under_maintenance': return 'text-red-600 bg-red-100'
      case 'loading': return 'text-purple-600 bg-purple-100'
      case 'out_of_service': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getVehicleTypeIcon = (type: Vehicle['type']) => {
    if (type.includes('Electric')) return <Zap className="w-4 h-4 text-green-600" />
    if (type.includes('Hybrid')) return <Battery className="w-4 h-4 text-blue-600" />
    return <Fuel className="w-4 h-4 text-gray-600" />
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fleet Overview</h1>
              <p className="text-gray-600 mt-2">Monitor and manage your vehicle fleet across all hubs</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Live Tracking</span>
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fleet</p>
                  <p className="text-3xl font-bold text-gray-900">{fleetStats.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Active vehicles</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-3xl font-bold text-green-600">{fleetStats.available}</p>
                  <p className="text-sm text-gray-500 mt-1">Ready for dispatch</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-3xl font-bold text-blue-600">{fleetStats.inTransit}</p>
                  <p className="text-sm text-gray-500 mt-1">On delivery routes</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization</p>
                  <p className="text-3xl font-bold text-purple-600">{fleetStats.utilizationRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Fleet efficiency</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fleet Status Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Overview */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Fleet Status Distribution
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{fleetStats.available}</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{fleetStats.inTransit}</div>
                      <div className="text-sm text-gray-600">In Transit</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{fleetStats.charging}</div>
                      <div className="text-sm text-gray-600">Charging</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{fleetStats.maintenance}</div>
                      <div className="text-sm text-gray-600">Maintenance</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">2</div>
                      <div className="text-sm text-gray-600">Loading</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">0</div>
                      <div className="text-sm text-gray-600">Out of Service</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Type Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    Vehicle Type Distribution
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-3">
                        <Zap className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{fleetStats.electric}</div>
                      <div className="text-sm text-gray-600">Electric Vehicles</div>
                      <div className="text-xs text-green-600 font-medium mt-1">0kg CO₂/100km</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3">
                        <Battery className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{fleetStats.hybrid}</div>
                      <div className="text-sm text-gray-600">Hybrid Vehicles</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">~27kg CO₂/100km</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3">
                        <Fuel className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{fleetStats.diesel}</div>
                      <div className="text-sm text-gray-600">Diesel Vehicles</div>
                      <div className="text-xs text-gray-600 font-medium mt-1">~40kg CO₂/100km</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Performance Metrics
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Emissions</span>
                    <span className="font-medium text-gray-900">{fleetStats.avgEmissions}kg/100km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fleet Utilization</span>
                    <span className="font-medium text-gray-900">{fleetStats.utilizationRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Green Fleet %</span>
                    <span className="font-medium text-green-600">
                      {Math.round(((fleetStats.electric + fleetStats.hybrid) / fleetStats.total) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Cost/km</span>
                    <span className="font-medium text-gray-900">₹2.8</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Alerts */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Maintenance Alerts
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{fleetStats.needsMaintenance} vehicles</p>
                      <p className="text-sm text-gray-600">Need maintenance within 7 days</p>
                    </div>
                    <Wrench className="w-5 h-5 text-orange-600" />
                  </div>
                  
                  {maintenanceAlerts.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vehicle.id}</p>
                        <p className="text-xs text-gray-600">{vehicle.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                  
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Alerts →
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Hub Management</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Driver Assignment</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Wrench className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Schedule Maintenance</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Fleet Analytics</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}