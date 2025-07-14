'use client'

import { useState, useEffect } from 'react'
import { Truck, Zap, Fuel, Battery } from 'lucide-react'
import { fleetStore } from '@/lib/fleetStore'

interface FleetData {
  type: 'electric' | 'hybrid' | 'diesel' | 'heavy_truck'
  name: string
  available: number
  inTransit: number
  efficiency: number
  emissionsPerKm: number
  icon: React.ReactNode
}

export default function FleetStatusCard() {
  const [fleetData, setFleetData] = useState<FleetData[]>([])

  useEffect(() => {
    // Get real fleet data from fleetStore
    const vehicles = fleetStore.getAllVehicles()
    
    // Calculate fleet data based on actual vehicles
    const electricVehicles = vehicles.filter(v => v.type === 'Electric Truck' || v.type === 'Electric Van')
    const hybridVehicles = vehicles.filter(v => v.type === 'Hybrid Truck')
    const dieselVehicles = vehicles.filter(v => v.type === 'Diesel Truck')
    const cargoVehicles = vehicles.filter(v => v.type === 'Cargo Van')
    
    const getVehicleStats = (vehicleList: any[]) => {
      const available = vehicleList.filter(v => v.status === 'available').length
      const inTransit = vehicleList.filter(v => v.status === 'in_transit').length
      const avgEmissions = vehicleList.length > 0 
        ? Math.round(vehicleList.reduce((sum, v) => sum + v.emissions * 100, 0) / vehicleList.length)
        : 0
      return { available, inTransit, avgEmissions }
    }

    const electricStats = getVehicleStats(electricVehicles)
    const hybridStats = getVehicleStats(hybridVehicles)
    const dieselStats = getVehicleStats(dieselVehicles)
    const cargoStats = getVehicleStats(cargoVehicles)

    const realFleetData: FleetData[] = [
      {
        type: 'electric',
        name: 'Electric',
        available: electricStats.available,
        inTransit: electricStats.inTransit,
        efficiency: 98,
        emissionsPerKm: electricStats.avgEmissions,
        icon: <Zap className="w-5 h-5" />
      },
      {
        type: 'hybrid',
        name: 'Hybrid',
        available: hybridStats.available,
        inTransit: hybridStats.inTransit,
        efficiency: 89,
        emissionsPerKm: hybridStats.avgEmissions,
        icon: <Battery className="w-5 h-5" />
      },
      {
        type: 'diesel',
        name: 'Diesel',
        available: dieselStats.available,
        inTransit: dieselStats.inTransit,
        efficiency: 76,
        emissionsPerKm: dieselStats.avgEmissions,
        icon: <Fuel className="w-5 h-5" />
      },
      {
        type: 'heavy_truck',
        name: 'Cargo Van',
        available: cargoStats.available,
        inTransit: cargoStats.inTransit,
        efficiency: 82,
        emissionsPerKm: cargoStats.avgEmissions,
        icon: <Truck className="w-5 h-5" />
      }
    ]

    setFleetData(realFleetData)
  }, [])
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600 bg-green-100'
    if (efficiency >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEmissionColor = (emissions: number) => {
    if (emissions === 0) return 'text-green-600'
    if (emissions <= 100) return 'text-yellow-600'
    return 'text-red-600'
  }

  const totalVehicles = fleetData.reduce((sum, fleet) => sum + fleet.available + fleet.inTransit, 0)
  const activeVehicles = fleetData.reduce((sum, fleet) => sum + fleet.inTransit, 0)
  const utilizationRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0

  if (fleetData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fleet data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Fleet Status</h3>
            <p className="text-sm text-gray-500">Vehicle utilization and efficiency</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{utilizationRate}%</div>
            <div className="text-sm text-gray-500">Fleet Utilization</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {fleetData.map((fleet) => (
            <div key={fleet.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="walmart-gradient w-10 h-10 rounded-lg flex items-center justify-center text-white">
                  {fleet.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{fleet.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Available: {fleet.available}</span>
                    <span>•</span>
                    <span>In Transit: {fleet.inTransit}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Efficiency */}
                <div className="text-center">
                  <div className={`text-sm font-medium px-2 py-1 rounded-full ${getEfficiencyColor(fleet.efficiency)}`}>
                    {fleet.efficiency}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Efficiency</div>
                </div>

                {/* Emissions */}
                <div className="text-center">
                  <div className={`text-sm font-bold ${getEmissionColor(fleet.emissionsPerKm)}`}>
                    {fleet.emissionsPerKm}g
                  </div>
                  <div className="text-xs text-gray-500">CO₂/km</div>
                </div>

                {/* Utilization */}
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round((fleet.inTransit / (fleet.available + fleet.inTransit)) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Utilization</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{activeVehicles}</div>
              <div className="text-sm text-gray-500">Active Routes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {fleetData.filter(f => f.type === 'electric' || f.type === 'hybrid').reduce((sum, f) => sum + f.inTransit, 0)}
              </div>
              <div className="text-sm text-gray-500">Eco Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-walmart-blue">
                {activeVehicles > 0 ? Math.round(fleetData.reduce((sum, f) => sum + f.efficiency * f.inTransit, 0) / activeVehicles) : 0}%
              </div>
              <div className="text-sm text-gray-500">Avg Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}