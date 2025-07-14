'use client'

import { 
  Leaf, 
  Clock, 
  DollarSign, 
  Truck, 
  Zap, 
  Fuel, 
  Train,
  Ship,
  CheckCircle,
  Star,
  TrendingDown,
  AlertTriangle,
  Battery,
  ArrowRight,
  RefreshCw,
  MapPin,
  Navigation
} from 'lucide-react'

interface RouteOption {
  id: string
  name: string
  type: 'eco' | 'balanced' | 'express'
  recommended?: boolean
  vehicles: string[]
  distance: number
  duration: number
  cost: number
  emissions: number
  ecoPoints: number
  reliability: number
  available?: boolean
  assignedVehicle?: any
  transferVehicle?: any
  transferHub?: string
  routePath?: Array<{
    hubId: string
    hubName: string
    isTransfer?: boolean
  }>
  features: string[]
  details: {
    segments: Array<{
      mode: string
      distance: number
      duration: number
      emissions: number
      from?: string
      to?: string
      vehicle?: any
      transfer?: boolean
    }>
  }
}

interface RouteOptionCardProps {
  option: RouteOption
  onSelect: (option: RouteOption) => void
  isSelected?: boolean
}

export default function RouteOptionCard({ option, onSelect, isSelected = false }: RouteOptionCardProps) {
  const getTypeStyles = () => {
    switch (option.type) {
      case 'eco':
        return {
          badge: 'bg-green-100 text-green-800 border-green-200',
          border: 'border-green-200',
          bg: 'bg-green-50'
        }
      case 'balanced':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          border: 'border-blue-200',
          bg: 'bg-blue-50'
        }
      case 'express':
        return {
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          border: 'border-orange-200',
          bg: 'bg-orange-50'
        }
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          border: 'border-gray-200',
          bg: 'bg-gray-50'
        }
    }
  }

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle.toLowerCase()) {
      case 'electric':
      case 'ev':
        return <Zap className="w-4 h-4" />
      case 'hybrid':
        return <Truck className="w-4 h-4" />
      case 'diesel':
        return <Fuel className="w-4 h-4" />
      case 'rail':
        return <Train className="w-4 h-4" />
      case 'ship':
        return <Ship className="w-4 h-4" />
      default:
        return <Truck className="w-4 h-4" />
    }
  }

  const getEmissionColor = (emissions: number) => {
    if (emissions <= 200) return 'text-green-600'
    if (emissions <= 400) return 'text-yellow-600'
    return 'text-red-600'
  }

  const styles = getTypeStyles()

  return (
    <div 
      className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
          : option.available === false
          ? 'border-red-200 bg-red-50 opacity-75'
          : styles.border + ' hover:border-gray-300'
      }`}
      onClick={() => onSelect(option)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
            {option.recommended && option.available !== false && (
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                <Star className="w-3 h-3" />
                <span>Recommended</span>
              </div>
            )}
            {option.available === false && (
              <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                <AlertTriangle className="w-3 h-3" />
                <span>No Vehicle</span>
              </div>
            )}
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles.badge}`}>
            {option.type.charAt(0).toUpperCase() + option.type.slice(1)} Route
          </div>
        </div>
        
        {isSelected && (
          <CheckCircle className="w-6 h-6 text-blue-600" />
        )}
      </div>

      {/* Vehicles */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Transport:</span>
          <div className="flex items-center space-x-2">
            {option.vehicles.map((vehicle, index) => (
              <div key={index} className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${
                option.available === false ? 'bg-red-100 text-red-800' : 'bg-gray-100'
              }`}>
                {getVehicleIcon(vehicle)}
                <span>{vehicle}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vehicle Assignment Info */}
        {option.assignedVehicle && (
          <div className="bg-blue-50 p-3 rounded-lg">
            {/* Single Vehicle Route */}
            {!option.transferVehicle ? (
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-blue-900">Assigned Vehicle: {option.assignedVehicle.id}</p>
                  <p className="text-blue-700">{option.assignedVehicle.model} • {option.assignedVehicle.licensePlate}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {option.assignedVehicle.batteryLevel !== undefined ? (
                      <>
                        <Battery className="w-4 h-4 text-green-600" />
                        <span className="text-blue-900 font-medium">{option.assignedVehicle.batteryLevel}%</span>
                      </>
                    ) : (
                      <>
                        <Fuel className="w-4 h-4 text-gray-600" />
                        <span className="text-blue-900 font-medium">{option.assignedVehicle.fuelLevel}%</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-blue-700">Capacity: {option.assignedVehicle.maxCapacity}kg</p>
                </div>
              </div>
            ) : (
              /* Multi-Vehicle Transfer Route */
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-xs font-medium text-orange-800">Transfer Route</span>
                </div>
                
                {/* First Vehicle */}
                <div className="flex items-center justify-between text-sm bg-white p-2 rounded">
                  <div>
                    <p className="font-medium text-blue-900">Leg 1: {option.assignedVehicle.id}</p>
                    <p className="text-blue-700 text-xs">{option.assignedVehicle.type}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {option.assignedVehicle.batteryLevel !== undefined ? (
                      <>
                        <Battery className="w-3 h-3 text-green-600" />
                        <span className="text-blue-900 text-xs">{option.assignedVehicle.batteryLevel}%</span>
                      </>
                    ) : (
                      <>
                        <Fuel className="w-3 h-3 text-gray-600" />
                        <span className="text-blue-900 text-xs">{option.assignedVehicle.fuelLevel}%</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Transfer Arrow */}
                <div className="flex items-center justify-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">Transfer</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Second Vehicle */}
                <div className="flex items-center justify-between text-sm bg-white p-2 rounded">
                  <div>
                    <p className="font-medium text-blue-900">Leg 2: {option.transferVehicle.id}</p>
                    <p className="text-blue-700 text-xs">{option.transferVehicle.type}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {option.transferVehicle.batteryLevel !== undefined ? (
                      <>
                        <Battery className="w-3 h-3 text-green-600" />
                        <span className="text-blue-900 text-xs">{option.transferVehicle.batteryLevel}%</span>
                      </>
                    ) : (
                      <>
                        <Fuel className="w-3 h-3 text-gray-600" />
                        <span className="text-blue-900 text-xs">{option.transferVehicle.fuelLevel}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Route Path Visualization */}
      {option.routePath && option.routePath.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            <Navigation className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Route Path:</span>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {option.routePath.map((hub, index) => (
              <div key={hub.hubId} className="flex items-center space-x-2 flex-shrink-0">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                  hub.isTransfer 
                    ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                    : index === 0 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : index === option.routePath!.length - 1
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  <MapPin className={`w-3 h-3 ${
                    hub.isTransfer ? 'text-orange-600' : 
                    index === 0 ? 'text-green-600' : 
                    index === option.routePath!.length - 1 ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <span>{hub.hubName}</span>
                  {hub.isTransfer && (
                    <RefreshCw className="w-3 h-3 text-orange-600" />
                  )}
                </div>
                
                {index < option.routePath!.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-gray-900">${option.cost}</span>
          </div>
          <span className="text-xs text-gray-700 font-medium">Total Cost</span>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">{option.duration}h</span>
          </div>
          <span className="text-xs text-gray-700 font-medium">Duration</span>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Leaf className={`w-4 h-4 ${getEmissionColor(option.emissions)}`} />
            <span className={`text-lg font-bold ${getEmissionColor(option.emissions)}`}>
              {option.emissions}kg
            </span>
          </div>
          <span className="text-xs text-gray-700 font-medium">CO₂ Emissions</span>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-lg font-bold text-gray-900">{option.ecoPoints}</span>
          </div>
          <span className="text-xs text-gray-700 font-medium">Eco Points</span>
        </div>
      </div>

      {/* Distance and Reliability */}
      <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
        <span className="font-medium">{option.distance} km total distance</span>
        <div className="flex items-center space-x-1">
          <span>Reliability:</span>
          <span className="font-medium text-gray-900">{option.reliability}%</span>
        </div>
      </div>

      {/* Features */}
      {option.features.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {option.features.map((feature, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Route Segments Preview */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Route Breakdown:</h4>
        <div className="space-y-2">
          {option.details.segments.map((segment, index) => (
            <div key={index} className={`text-xs ${segment.transfer ? 'bg-orange-50 p-2 rounded' : ''}`}>
              {segment.transfer && (
                <div className="flex items-center space-x-1 mb-1">
                  <RefreshCw className="w-3 h-3 text-orange-600" />
                  <span className="text-orange-800 font-medium text-xs">Vehicle Transfer</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getVehicleIcon(segment.mode)}
                  <span className="text-gray-800 font-medium">{segment.mode}</span>
                  {segment.from && segment.to && (
                    <span className="text-gray-600">({segment.from} → {segment.to})</span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-700">
                  <span className="font-medium">{segment.distance}km</span>
                  <span className="font-medium">{segment.duration}h</span>
                  <span className={getEmissionColor(segment.emissions)}>
                    {segment.emissions}kg CO₂
                  </span>
                </div>
              </div>
              
              {segment.vehicle && (
                <div className="text-xs text-gray-600 mt-1 ml-6">
                  Vehicle: {segment.vehicle.id} ({segment.vehicle.licensePlate})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button 
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSelected 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(option)
          }}
        >
          {isSelected ? 'Selected' : 'Select Route'}
        </button>
      </div>

      {/* Savings Indicator */}
      {option.type === 'eco' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
          <TrendingDown className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}