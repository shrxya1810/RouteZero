'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { routeStore } from '@/lib/store'
import { fleetStore, type Vehicle } from '@/lib/fleetStore'
import Header from '@/components/layout/Header'
import RouteOptionCard from '@/components/routes/RouteOptionCard'
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  TrendingDown, 
  BarChart3,
  Map,
  Bookmark
} from 'lucide-react'

// Helper function to get hub names
const getHubName = (hubId?: string) => {
  const hubMap: { [key: string]: string } = {
    'blr-001': 'Bangalore Warehouse East',
    'mum-001': 'Mumbai Fulfillment Center',
    'del-001': 'Delhi Distribution Hub',
    'hyd-001': 'Hyderabad Customer Center',
    'chn-001': 'Chennai Port Logistics',
    'pun-001': 'Pune Express Center',
  }
  return hubMap[hubId || '']
}

// Hub distance matrix (in km) - simplified for demo
const hubDistances: { [key: string]: { [key: string]: number } } = {
  'blr-001': { 'mum-001': 984, 'del-001': 2194, 'chn-001': 346, 'hyd-001': 569, 'pun-001': 842 },
  'mum-001': { 'blr-001': 984, 'del-001': 1424, 'chn-001': 1338, 'hyd-001': 711, 'pun-001': 149 },
  'del-001': { 'blr-001': 2194, 'mum-001': 1424, 'chn-001': 2180, 'hyd-001': 1563, 'pun-001': 1463 },
  'chn-001': { 'blr-001': 346, 'mum-001': 1338, 'del-001': 2180, 'hyd-001': 629, 'pun-001': 1189 },
  'hyd-001': { 'blr-001': 569, 'mum-001': 711, 'del-001': 1563, 'chn-001': 629, 'pun-001': 560 },
  'pun-001': { 'blr-001': 842, 'mum-001': 149, 'del-001': 1463, 'chn-001': 1189, 'hyd-001': 560 }
}

// Check vehicle availability for route types
const checkVehicleAvailability = (hubId?: string) => {
  const availableVehicles = fleetStore.getVehiclesByHub(hubId || 'blr-001')
    .filter(v => v.status === 'available')
  
  const electricVehicles = availableVehicles.filter(v => 
    v.type === 'Electric Truck' || v.type === 'Electric Van'
  )
  const hybridVehicles = availableVehicles.filter(v => v.type === 'Hybrid Truck')
  const dieselVehicles = availableVehicles.filter(v => 
    v.type === 'Diesel Truck' || v.type === 'Cargo Van'
  )

  return {
    electric: electricVehicles,
    hybrid: hybridVehicles,
    diesel: dieselVehicles,
    total: availableVehicles
  }
}

// Find all possible intermediate hubs between origin and destination
const findIntermediateHubs = (origin: string, destination: string) => {
  const allHubs = ['blr-001', 'mum-001', 'del-001', 'chn-001', 'hyd-001', 'pun-001']
  return allHubs.filter(hub => hub !== origin && hub !== destination)
}

// Calculate route through intermediate hub
const calculateTransferRoute = (origin: string, intermediate: string, destination: string, cargoWeight: number) => {
  const originAvailability = checkVehicleAvailability(origin)
  const intermediateAvailability = checkVehicleAvailability(intermediate)
  
  const leg1Distance = hubDistances[origin]?.[intermediate] || 0
  const leg2Distance = hubDistances[intermediate]?.[destination] || 0
  const totalDistance = leg1Distance + leg2Distance
  
  // Find best vehicle at origin (prefer electric for first leg)
  const leg1Vehicle = originAvailability.electric.find(v => v.maxCapacity >= cargoWeight) ||
                     originAvailability.hybrid.find(v => v.maxCapacity >= cargoWeight) ||
                     originAvailability.diesel.find(v => v.maxCapacity >= cargoWeight)
  
  // Find best vehicle at intermediate hub (prefer electric for second leg)
  const leg2Vehicle = intermediateAvailability.electric.find(v => v.maxCapacity >= cargoWeight) ||
                     intermediateAvailability.hybrid.find(v => v.maxCapacity >= cargoWeight) ||
                     intermediateAvailability.diesel.find(v => v.maxCapacity >= cargoWeight)
  
  if (!leg1Vehicle || !leg2Vehicle) return null
  
  // Calculate emissions and time for each leg
  const leg1Emissions = calculateEmissions(leg1Vehicle.type, leg1Distance)
  const leg2Emissions = calculateEmissions(leg2Vehicle.type, leg2Distance)
  const totalEmissions = leg1Emissions + leg2Emissions
  
  const leg1Duration = calculateDuration(leg1Vehicle.type, leg1Distance)
  const leg2Duration = calculateDuration(leg2Vehicle.type, leg2Distance)
  const transferTime = 2 // 2 hours for transfer
  const totalDuration = leg1Duration + leg2Duration + transferTime
  
  const leg1Cost = calculateCost(leg1Vehicle.type, leg1Distance)
  const leg2Cost = calculateCost(leg2Vehicle.type, leg2Distance)
  const transferCost = 850 // Realistic transfer handling cost in INR (loading/unloading/paperwork)
  const totalCost = leg1Cost + leg2Cost + transferCost
  
  return {
    totalDistance,
    totalDuration,
    totalEmissions,
    totalCost,
    transferHub: intermediate,
    leg1Vehicle,
    leg2Vehicle,
    segments: [
      {
        from: origin,
        to: intermediate,
        vehicle: leg1Vehicle,
        distance: leg1Distance,
        duration: leg1Duration,
        emissions: leg1Emissions,
        mode: leg1Vehicle.type
      },
      {
        from: intermediate,
        to: destination,
        vehicle: leg2Vehicle,
        distance: leg2Distance,
        duration: leg2Duration,
        emissions: leg2Emissions,
        mode: leg2Vehicle.type,
        transfer: true
      }
    ]
  }
}

// Helper functions for calculations
const calculateEmissions = (vehicleType: string, distance: number) => {
  // Realistic emission factors in kg CO2 per km for commercial vehicles
  const emissionFactors: { [key: string]: number } = {
    'Electric Truck': 0.085, // Considering electricity grid mix in India (~0.82 kg CO2/kWh)
    'Electric Van': 0.065,   // Smaller electric vehicles, more efficient
    'Hybrid Truck': 0.52,   // Real-world hybrid truck emissions (30-40% better than diesel)
    'Diesel Truck': 0.78,   // Heavy-duty diesel trucks (Euro VI standards)
    'Cargo Van': 0.42       // Light commercial diesel vans
  }
  return Math.round((emissionFactors[vehicleType] || 0.65) * distance)
}

const calculateDuration = (vehicleType: string, distance: number) => {
  // Realistic average speeds including stops, traffic, loading/unloading (km/h)
  const speedFactors: { [key: string]: number } = {
    'Electric Truck': 58,    // Slightly slower due to charging breaks on long routes
    'Electric Van': 52,      // City/local delivery speeds
    'Hybrid Truck': 62,      // Efficient highway cruising
    'Diesel Truck': 68,      // Fastest on highways, well-established infrastructure
    'Cargo Van': 55         // Mixed urban/highway driving
  }
  return Math.round((distance / (speedFactors[vehicleType] || 60)) * 10) / 10
}

const calculateCost = (vehicleType: string, distance: number) => {
  // Realistic cost per km in INR including fuel, maintenance, driver, insurance
  const costFactors: { [key: string]: number } = {
    'Electric Truck': 18.5,   // Higher upfront but lower operational costs
    'Electric Van': 12.2,     // Most cost-effective for short routes
    'Hybrid Truck': 22.8,     // Balanced costs, premium for technology
    'Diesel Truck': 28.5,     // Current fuel prices + maintenance
    'Cargo Van': 16.8        // Light commercial vehicle costs
  }
  return Math.round((costFactors[vehicleType] || 20.0) * distance)
}

// Assign best available vehicle for route type
const assignVehicleForRoute = (routeType: string, origin?: string, weight?: string) => {
  const availability = checkVehicleAvailability(origin)
  const cargoWeight = parseInt(weight || '2500')
  
  switch (routeType) {
    case 'eco':
      // Prefer electric vehicles for eco routes
      const suitableElectric = availability.electric.find(v => v.maxCapacity >= cargoWeight)
      if (suitableElectric) return suitableElectric
      
      // Fallback to hybrid
      const suitableHybrid = availability.hybrid.find(v => v.maxCapacity >= cargoWeight)
      if (suitableHybrid) return suitableHybrid
      break
      
    case 'balanced':
      // Prefer hybrid vehicles for balanced routes
      const balancedHybrid = availability.hybrid.find(v => v.maxCapacity >= cargoWeight)
      if (balancedHybrid) return balancedHybrid
      
      // Fallback to electric or diesel
      const balancedElectric = availability.electric.find(v => v.maxCapacity >= cargoWeight)
      if (balancedElectric) return balancedElectric
      
      const balancedDiesel = availability.diesel.find(v => v.maxCapacity >= cargoWeight)
      if (balancedDiesel) return balancedDiesel
      break
      
    case 'express':
      // Prefer diesel vehicles for express routes (fastest)
      const expressDiesel = availability.diesel.find(v => v.maxCapacity >= cargoWeight)
      if (expressDiesel) return expressDiesel
      
      // Fallback to hybrid
      const expressHybrid = availability.hybrid.find(v => v.maxCapacity >= cargoWeight)
      if (expressHybrid) return expressHybrid
      break
  }
  
  // Ultimate fallback - any available vehicle with sufficient capacity
  return availability.total.find(v => v.maxCapacity >= cargoWeight) || null
}

// Generate dynamic mock route options based on route parameters and vehicle availability
const generateRouteOptions = (origin?: string, destination?: string, cargoType?: string, weight?: string) => {
  const originName = getHubName(origin) || 'Bangalore Warehouse'
  const destinationName = getHubName(destination) || 'Mumbai Fulfillment Center'
  const cargo = cargoType || 'Electronics'
  const cargoWeight = parseInt(weight || '2500')
  
  // Check direct route vehicle availability
  const ecoVehicle = assignVehicleForRoute('eco', origin, weight)
  const balancedVehicle = assignVehicleForRoute('balanced', origin, weight)
  const expressVehicle = assignVehicleForRoute('express', origin, weight)
  
  // Calculate direct route distance
  const directDistance = hubDistances[origin || 'blr-001']?.[destination || 'mum-001'] || 945
  
  // Find best transfer routes if direct eco route is not available
  const intermediateHubs = findIntermediateHubs(origin || 'blr-001', destination || 'mum-001')
  let bestTransferRoute = null
  let bestTransferEmissions = Infinity
  
  if (!ecoVehicle) {
    // Find transfer route with lowest emissions
    for (const hub of intermediateHubs) {
      const transferRoute = calculateTransferRoute(origin || 'blr-001', hub, destination || 'mum-001', cargoWeight)
      if (transferRoute && transferRoute.totalEmissions < bestTransferEmissions) {
        bestTransferEmissions = transferRoute.totalEmissions
        bestTransferRoute = transferRoute
      }
    }
  }
  
  const routes = []
  
  // Direct Eco Route
  if (ecoVehicle) {
    routes.push({
      id: 'eco-direct-001',
      name: 'Direct Eco Route',
      type: 'eco' as const,
      recommended: true,
      vehicles: [ecoVehicle.type],
      distance: directDistance,
      duration: calculateDuration(ecoVehicle.type, directDistance),
      cost: calculateCost(ecoVehicle.type, directDistance),
      emissions: calculateEmissions(ecoVehicle.type, directDistance),
      ecoPoints: 50,
      reliability: 94,
      available: true,
      assignedVehicle: ecoVehicle,
      routePath: [
        { hubId: origin || 'blr-001', hubName: getHubName(origin) || 'Bangalore Warehouse' },
        { hubId: destination || 'mum-001', hubName: getHubName(destination) || 'Mumbai Fulfillment Center' }
      ],
      features: ['Carbon Neutral', 'Direct Route', `Vehicle: ${ecoVehicle.id}`],
      details: {
        segments: [
          { 
            mode: ecoVehicle.type, 
            distance: directDistance, 
            duration: calculateDuration(ecoVehicle.type, directDistance), 
            emissions: calculateEmissions(ecoVehicle.type, directDistance),
            from: getHubName(origin),
            to: getHubName(destination),
            vehicle: ecoVehicle
          }
        ]
      }
    })
  }
  
  // Transfer Eco Route (if direct not available or better emissions possible)
  if (bestTransferRoute && (!ecoVehicle || bestTransferRoute.totalEmissions < calculateEmissions(ecoVehicle?.type || '', directDistance))) {
    routes.push({
      id: 'eco-transfer-001',
      name: `Eco Transfer via ${getHubName(bestTransferRoute.transferHub)}`,
      type: 'eco' as const,
      recommended: !ecoVehicle,
      vehicles: [bestTransferRoute.leg1Vehicle.type, bestTransferRoute.leg2Vehicle.type],
      distance: bestTransferRoute.totalDistance,
      duration: bestTransferRoute.totalDuration,
      cost: bestTransferRoute.totalCost,
      emissions: bestTransferRoute.totalEmissions,
      ecoPoints: 40,
      reliability: 88,
      available: true,
      assignedVehicle: bestTransferRoute.leg1Vehicle,
      transferVehicle: bestTransferRoute.leg2Vehicle,
      transferHub: bestTransferRoute.transferHub,
      routePath: [
        { hubId: origin || 'blr-001', hubName: getHubName(origin) || 'Bangalore Warehouse' },
        { hubId: bestTransferRoute.transferHub, hubName: getHubName(bestTransferRoute.transferHub), isTransfer: true },
        { hubId: destination || 'mum-001', hubName: getHubName(destination) || 'Mumbai Fulfillment Center' }
      ],
      features: [
        'Multi-Hub Optimization', 
        'Lower Emissions', 
        `Transfer at ${getHubName(bestTransferRoute.transferHub)}`,
        `Vehicles: ${bestTransferRoute.leg1Vehicle.id} → ${bestTransferRoute.leg2Vehicle.id}`
      ],
      details: {
        segments: bestTransferRoute.segments.map(seg => ({
          mode: seg.mode,
          distance: seg.distance,
          duration: seg.duration,
          emissions: seg.emissions,
          from: getHubName(seg.from),
          to: getHubName(seg.to),
          vehicle: seg.vehicle,
          transfer: seg.transfer || false
        }))
      }
    })
  }
  
  // If no eco options available
  if (!ecoVehicle && !bestTransferRoute) {
    routes.push({
      id: 'eco-unavailable-001',
      name: 'Eco Route (Unavailable)',
      type: 'eco' as const,
      recommended: false,
      vehicles: ['Electric Vehicle (Unavailable)'],
      distance: directDistance,
      duration: 18,
      cost: 1240,
      emissions: 999,
      ecoPoints: 0,
      reliability: 50,
      available: false,
      assignedVehicle: null,
      routePath: [
        { hubId: origin || 'blr-001', hubName: getHubName(origin) || 'Bangalore Warehouse' },
        { hubId: destination || 'mum-001', hubName: getHubName(destination) || 'Mumbai Fulfillment Center' }
      ],
      features: ['No suitable vehicles available'],
      details: {
        segments: [
          { 
            mode: 'No Vehicle Available', 
            distance: directDistance, 
            duration: 18, 
            emissions: 999,
            from: getHubName(origin),
            to: getHubName(destination)
          }
        ]
      }
    })
  }
  
  // Balanced Route
  routes.push({
    id: 'balanced-001',
    name: 'Balanced Route',
    type: 'balanced' as const,
    vehicles: balancedVehicle ? [balancedVehicle.type] : ['Hybrid Vehicle (Unavailable)'],
    distance: directDistance,
    duration: balancedVehicle ? calculateDuration(balancedVehicle.type, directDistance) : 14,
    cost: balancedVehicle ? calculateCost(balancedVehicle.type, directDistance) : 1180,
    emissions: balancedVehicle ? calculateEmissions(balancedVehicle.type, directDistance) : 450,
    ecoPoints: balancedVehicle ? 25 : 0,
    reliability: balancedVehicle ? 96 : 60,
    available: !!balancedVehicle,
    assignedVehicle: balancedVehicle,
    routePath: [
      { hubId: origin || 'blr-001', hubName: getHubName(origin) || 'Bangalore Warehouse' },
      { hubId: destination || 'mum-001', hubName: getHubName(destination) || 'Mumbai Fulfillment Center' }
    ],
    features: balancedVehicle ? 
      ['Good Balance', 'Reliable', `Vehicle: ${balancedVehicle.id}`] : 
      ['No suitable vehicle available'],
    details: {
      segments: balancedVehicle ? [
        { 
          mode: balancedVehicle.type, 
          distance: directDistance, 
          duration: calculateDuration(balancedVehicle.type, directDistance), 
          emissions: calculateEmissions(balancedVehicle.type, directDistance),
          from: getHubName(origin),
          to: getHubName(destination),
          vehicle: balancedVehicle
        }
      ] : [
        { 
          mode: 'No Vehicle Available', 
          distance: directDistance, 
          duration: 14, 
          emissions: 450,
          from: getHubName(origin),
          to: getHubName(destination)
        }
      ]
    }
  })
  
  // Express Route
  routes.push({
    id: 'express-001',
    name: 'Express Route',
    type: 'express' as const,
    vehicles: expressVehicle ? [expressVehicle.type] : ['Express Vehicle (Unavailable)'],
    distance: directDistance,
    duration: expressVehicle ? calculateDuration(expressVehicle.type, directDistance) : 11,
    cost: expressVehicle ? calculateCost(expressVehicle.type, directDistance) : 1050,
    emissions: expressVehicle ? calculateEmissions(expressVehicle.type, directDistance) : 500,
    ecoPoints: 0,
    reliability: expressVehicle ? 98 : 70,
    available: !!expressVehicle,
    assignedVehicle: expressVehicle,
    routePath: [
      { hubId: origin || 'blr-001', hubName: getHubName(origin) || 'Bangalore Warehouse' },
      { hubId: destination || 'mum-001', hubName: getHubName(destination) || 'Mumbai Fulfillment Center' }
    ],
    features: expressVehicle ? 
      ['Fastest Delivery', 'Direct Route', `Vehicle: ${expressVehicle.id}`] : 
      ['No suitable vehicle available'],
    details: {
      segments: expressVehicle ? [
        { 
          mode: expressVehicle.type, 
          distance: directDistance, 
          duration: calculateDuration(expressVehicle.type, directDistance), 
          emissions: calculateEmissions(expressVehicle.type, directDistance),
          from: getHubName(origin),
          to: getHubName(destination),
          vehicle: expressVehicle
        }
      ] : [
        { 
          mode: 'No Vehicle Available', 
          distance: directDistance, 
          duration: 11, 
          emissions: 500,
          from: getHubName(origin),
          to: getHubName(destination)
        }
      ]
    }
  })
  
  return routes
}

export default function RouteOptimizePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Check if this is edit mode
  const isEditMode = searchParams.get('edit') === 'true'
  const editRouteId = searchParams.get('routeId')
  
  // Get route parameters from URL or use defaults
  const origin = searchParams.get('origin') || 'blr-001'
  const destination = searchParams.get('destination') || 'mum-001'
  const cargoType = searchParams.get('cargoType') || 'electronics'
  const weight = searchParams.get('weight') || '2500'
  const priority = searchParams.get('priority') || 'balanced'
  
  // Generate route options based on parameters
  const routeOptions = generateRouteOptions(origin, destination, cargoType, weight)
  
  // If in edit mode, try to get the existing route and pre-select it
  const existingRoute = isEditMode && editRouteId ? routeStore.getRouteById(editRouteId) : null
  const initialSelectedRoute = existingRoute?.selectedRoute || routeOptions[0]
  
  const [selectedRoute, setSelectedRoute] = useState<typeof routeOptions[0] | null>(initialSelectedRoute)
  const [isApplying, setIsApplying] = useState(false)
  const [showComparison, setShowComparison] = useState(true)

  const handleRouteSelect = (option: typeof routeOptions[0]) => {
    setSelectedRoute(option)
  }

  const handleApplyRoute = async () => {
    if (!selectedRoute) return
    
    // Check if selected route has available vehicle
    if (!selectedRoute.available || !selectedRoute.assignedVehicle) {
      alert('Cannot apply route: No suitable vehicle available. Please check fleet availability.')
      return
    }
    
    setIsApplying(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update vehicle status to in_transit
    if (selectedRoute.assignedVehicle) {
      fleetStore.updateVehicleStatus(selectedRoute.assignedVehicle.id, 'in_transit')
    }
    
    if (isEditMode && editRouteId) {
      // Update existing route
      const routeData = {
        origin,
        destination,
        cargoType,
        weight,
        deliveryDate: searchParams.get('deliveryDate'),
        routeOptions,
        selectedRoute
      }
      
      routeStore.updateRoute(editRouteId, routeData)
      setIsApplying(false)
      
      // Show success message and navigate back to bulk operations
      alert(`Route ${editRouteId} updated successfully! Vehicle ${selectedRoute.assignedVehicle?.id} assigned.`)
      router.push('/routes/bulk')
    } else {
      // Add new route to bulk operations store
      const routeData = {
        origin,
        destination,
        cargoType,
        weight,
        deliveryDate: searchParams.get('deliveryDate'),
        routeOptions,
        selectedRoute
      }
      
      const addedRoute = routeStore.addRoute(routeData)
      
      setIsApplying(false)
      
      // Show success message and navigate
      alert(`Route successfully applied! Vehicle ${selectedRoute.assignedVehicle?.id} assigned to ${addedRoute.id}`)
    }
  }

  const handleSaveToBulk = () => {
    const routeData = {
      origin,
      destination,
      cargoType,
      weight,
      deliveryDate: searchParams.get('deliveryDate'),
      routeOptions,
      selectedRoute
    }
    
    const addedRoute = routeStore.addRoute(routeData)
    alert(`Route saved to bulk operations as ${addedRoute.id}`)
    
    // Navigate to bulk page
    router.push('/routes/bulk')
  }

  const calculateSavings = () => {
    const baseline = routeOptions.find(r => r.type === 'express')
    if (!selectedRoute || !baseline) return null
    
    return {
      costSavings: baseline.cost - selectedRoute.cost,
      timeDifference: selectedRoute.duration - baseline.duration,
      emissionsSaved: baseline.emissions - selectedRoute.emissions,
      ecoPointsGained: selectedRoute.ecoPoints
    }
  }

  const savings = calculateSavings()

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Route' : 'Route Optimization Results'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditMode && editRouteId ? `Editing ${editRouteId}: ` : ''}
                  {getHubName(origin)} → {getHubName(destination)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowComparison(!showComparison)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
              </button>
              
              <button 
                onClick={handleSaveToBulk}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save to Bulk Operations</span>
              </button>
            </div>
          </div>

          {/* Fleet Availability Alert */}
          <div className="mb-6">
            {routeOptions.some(option => !option.available) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Limited Vehicle Availability</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Some route options are unavailable due to fleet constraints at {getHubName(origin)}. 
                      Consider alternative times or check fleet management for vehicle availability.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Route Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {routeOptions.map((option) => (
              <RouteOptionCard
                key={option.id}
                option={option}
                onSelect={handleRouteSelect}
                isSelected={selectedRoute?.id === option.id}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Selected Route Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route Summary */}
              {selectedRoute && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                        Selected Route: {selectedRoute.name}
                      </h2>
                      
                      <button 
                        onClick={handleApplyRoute}
                        disabled={isApplying || !selectedRoute.available}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                          selectedRoute.available 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isApplying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Applying...</span>
                          </>
                        ) : selectedRoute.available ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>{isEditMode ? 'Update Route' : 'Apply Route'}</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            <span>No Vehicle Available</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${selectedRoute.cost}</div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedRoute.duration}h</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{selectedRoute.emissions}kg</div>
                        <div className="text-sm text-gray-600">CO₂ Emissions</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedRoute.ecoPoints}</div>
                        <div className="text-sm text-gray-600">Eco Points</div>
                      </div>
                    </div>

                    {/* Route Segments */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Breakdown</h3>
                      <div className="space-y-3">
                        {selectedRoute.details.segments.map((segment, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{segment.mode}</p>
                                <p className="text-sm text-gray-600">{segment.distance} km • {segment.duration} hours</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{segment.emissions} kg CO₂</p>
                              <p className="text-sm text-gray-600">Emissions</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Environmental Impact */}
              {savings && showComparison && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2 text-green-600" />
                    Environmental Impact vs Express Route
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${savings.emissionsSaved > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {savings.emissionsSaved > 0 ? '-' : '+'}{Math.abs(savings.emissionsSaved)}kg
                      </div>
                      <div className="text-sm text-gray-600">CO₂ Difference</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${savings.costSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {savings.costSavings > 0 ? '-$' : '+$'}{Math.abs(savings.costSavings)}
                      </div>
                      <div className="text-sm text-gray-600">Cost Difference</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${savings.timeDifference < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {savings.timeDifference > 0 ? '+' : ''}{savings.timeDifference}h
                      </div>
                      <div className="text-sm text-gray-600">Time Difference</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">+{savings.ecoPointsGained}</div>
                      <div className="text-sm text-gray-600">Eco Points</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Route Requirements */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Requirements</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cargo Type:</span>
                    <span className="font-medium capitalize">{cargoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium">{searchParams.get('volume') || '15.5'} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-medium capitalize">{priority} Optimized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Window:</span>
                    <span className="font-medium">{searchParams.get('deliveryDate') || 'Jan 15'}, 09:00-17:00</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Map className="w-4 h-4 text-blue-600" />
                    <span>View Route Map</span>
                  </button>
                  <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Detailed Analysis</span>
                  </button>
                  <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Bookmark className="w-4 h-4 text-blue-600" />
                    <span>Save as Template</span>
                  </button>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Weather Advisory</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Rain expected in Mumbai on delivery day. Consider backup plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}