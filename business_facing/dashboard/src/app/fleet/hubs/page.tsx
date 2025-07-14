'use client'

import { useState, useEffect } from 'react'
import { fleetStore, type Hub, type Vehicle } from '@/lib/fleetStore'
import Header from '@/components/layout/Header'
import { 
  MapPin, 
  Truck, 
  Battery, 
  Zap, 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
  Fuel,
  Activity,
  Settings,
  Filter,
  RefreshCw
} from 'lucide-react'

export default function HubManagementPage() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [selectedHub, setSelectedHub] = useState<string>('')
  const [hubStats, setHubStats] = useState<any>(null)
  const [hubVehicles, setHubVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    const allHubs = fleetStore.getAllHubs()
    setHubs(allHubs)
    
    // Select first hub by default
    if (allHubs.length > 0 && !selectedHub) {
      setSelectedHub(allHubs[0].id)
    }
  }, [])

  useEffect(() => {
    if (selectedHub) {
      setHubStats(fleetStore.getHubStats(selectedHub))
      setHubVehicles(fleetStore.getVehiclesByHub(selectedHub))
    }
  }, [selectedHub])

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

  const getCapacityColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-100'
    if (utilization >= 75) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hub Management</h1>
              <p className="text-gray-600 mt-2">Monitor vehicle distribution and capacity across all hubs</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Hub Settings</span>
              </button>
            </div>
          </div>

          {/* Hub Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {hubs.map((hub) => {
              const stats = fleetStore.getHubStats(hub.id)
              return (
                <div 
                  key={hub.id}
                  className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedHub === hub.id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedHub(hub.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{hub.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hub.location}
                      </p>
                    </div>
                    
                    {selectedHub === hub.id && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">{stats?.vehicleCount || 0}</div>
                      <div className="text-xs text-gray-600">Vehicles</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{stats?.available || 0}</div>
                      <div className="text-xs text-gray-600">Available</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${getCapacityColor(stats?.capacityUtilization || 0)}`}>
                      {stats?.capacityUtilization || 0}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Hub Details */}
          {hubStats && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Hub Information */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    {hubStats.hub.name}
                  </h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{hubStats.hub.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium text-gray-900">{hubStats.hub.vehicleCapacity} vehicles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Charging Stations:</span>
                      <span className="font-medium text-gray-900">{hubStats.hub.chargingStations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maintenance Bays:</span>
                      <span className="font-medium text-gray-900">{hubStats.hub.maintenanceBays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operating Hours:</span>
                      <span className="font-medium text-gray-900">{hubStats.hub.operationalHours}</span>
                    </div>
                  </div>
                </div>

                {/* Hub Status Cards */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Available</p>
                        <p className="text-2xl font-bold text-green-600">{hubStats.available}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">In Transit</p>
                        <p className="text-2xl font-bold text-blue-600">{hubStats.inTransit}</p>
                      </div>
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Charging</p>
                        <p className="text-2xl font-bold text-yellow-600">{hubStats.charging}</p>
                      </div>
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Maintenance</p>
                        <p className="text-2xl font-bold text-orange-600">{hubStats.maintenance}</p>
                      </div>
                      <Wrench className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle List */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Truck className="w-5 h-5 mr-2 text-blue-600" />
                        Vehicles at {hubStats.hub.name}
                      </h2>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {hubVehicles.length} of {hubStats.hub.vehicleCapacity} vehicles
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-gray-400" />
                          <select className="text-sm border border-gray-300 rounded px-2 py-1">
                            <option value="all">All Types</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="diesel">Diesel</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver/Route</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel/Battery</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {hubVehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{vehicle.id}</div>
                                <div className="text-sm text-gray-600">{vehicle.licensePlate}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {getVehicleTypeIcon(vehicle.type)}
                                <span className="text-sm text-gray-900">{vehicle.type}</span>
                              </div>
                              <div className="text-xs text-gray-600">{vehicle.model}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                                {vehicle.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {vehicle.driver || '-'}
                              </div>
                              <div className="text-xs text-gray-600">
                                {vehicle.currentRoute || 'No active route'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {vehicle.batteryLevel !== undefined ? (
                                  <div className="flex items-center space-x-1">
                                    <Battery className="w-4 h-4 text-green-600" />
                                    <span>{vehicle.batteryLevel}%</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <Fuel className="w-4 h-4 text-gray-600" />
                                    <span>{vehicle.fuelLevel}%</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{vehicle.currentLoad}kg</div>
                              <div className="text-xs text-gray-600">of {vehicle.maxCapacity}kg</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${(vehicle.currentLoad / vehicle.maxCapacity) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
                                  <Activity className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors">
                                  <Settings className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}