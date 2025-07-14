// API integration layer for RouteZero backend

const API_BASE_URL = process.env.NEXT_PUBLIC_ROUTEZERO_API_URL || 'http://localhost:8000'

interface RouteRequest {
  source: [number, number] // [lng, lat]
  destination: [number, number] // [lng, lat]
  cargoType?: string
  weight?: number
  volume?: number
  priority?: 'cost' | 'time' | 'emissions' | 'balanced'
  pickupDate?: string
  deliveryDate?: string
  specialRequirements?: string
}

interface FreightRequest {
  source: [number, number]
  destination: [number, number]
  mode?: 'heavy_truck' | 'rail_freight' | 'ship_barge'
}

interface RouteOption {
  distance_km: number
  duration_min: number
  emissions_grams: number
  emission_level: string
  eco_tag: string
  eco_points: number
  carrier_type: string
  carrier_score: number
  green_carrier: {
    recommended_vehicle: string
    reasoning: string
    feasibility_score: number
    eco_impact: string
    recommended_emissions_grams: number
    emissions_saved_grams: number
    recommended_eco_points: number
    points_gained: number
  }
}

interface FreightOption {
  distance_km: number
  duration_min: number
  emissions_grams: number
  freight_emission_level: string
  vehicle_type: string
  recommended_mode: string
  emissions_saved_grams: number
  percent_emissions_saved: number
  best_emissions_grams: number
}

// API client class
export class RouteZeroAPI {
  private baseURL: string
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Get route options for last-mile delivery
  async getRouteOptions(request: RouteRequest): Promise<{ routes: RouteOption[] }> {
    return this.request<{ routes: RouteOption[] }>('/route-options', {
      method: 'POST',
      body: JSON.stringify({
        source: request.source,
        destination: request.destination,
      }),
    })
  }

  // Get freight route options
  async getFreightOptions(request: FreightRequest): Promise<{ freight_route: FreightOption }> {
    return this.request<{ freight_route: FreightOption }>('/freight-options', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Get route explanation
  async getRouteExplanation(routeData: {
    emissions_grams: number
    vehicle_type: string
    duration_min: number
  }) {
    return this.request('/route-explanation', {
      method: 'POST',
      body: JSON.stringify(routeData),
    })
  }

  // Get LLM-powered route explanation
  async generateRouteExplanation(routeObject: RouteOption, userContext?: string) {
    return this.request('/generate-explanation', {
      method: 'POST',
      body: JSON.stringify({
        route: routeObject,
        user_context: userContext,
      }),
    })
  }

  // Optimize reverse logistics
  async optimizeReverseLogistics(deliveries: any[], returns: any[]) {
    return this.request('/reverse-logistics', {
      method: 'POST',
      body: JSON.stringify({
        deliveries,
        returns,
      }),
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

// Utility functions
export const transformRouteOptionToFrontend = (backendRoute: RouteOption) => {
  return {
    id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: getRouteName(backendRoute),
    type: getRouteType(backendRoute.eco_tag),
    recommended: backendRoute.eco_points >= 30,
    vehicles: [backendRoute.green_carrier.recommended_vehicle],
    distance: backendRoute.distance_km,
    duration: Math.round(backendRoute.duration_min / 60 * 10) / 10, // Convert to hours
    cost: estimateCost(backendRoute), // You'll need to implement cost estimation
    emissions: Math.round(backendRoute.emissions_grams / 1000 * 100) / 100, // Convert to kg
    ecoPoints: backendRoute.eco_points,
    reliability: 95, // Default reliability - you might want to calculate this
    features: getRouteFeatures(backendRoute),
    details: {
      segments: [{
        mode: backendRoute.green_carrier.recommended_vehicle,
        distance: backendRoute.distance_km,
        duration: Math.round(backendRoute.duration_min / 60 * 10) / 10,
        emissions: Math.round(backendRoute.emissions_grams / 1000 * 100) / 100
      }]
    }
  }
}

function getRouteName(route: RouteOption): string {
  switch (route.eco_tag) {
    case 'eco_friendly':
      return 'Eco-Optimized Route'
    case 'mid':
      return 'Balanced Route'
    case 'non_eco':
      return 'Express Route'
    default:
      return 'Standard Route'
  }
}

function getRouteType(ecoTag: string): 'eco' | 'balanced' | 'express' {
  switch (ecoTag) {
    case 'eco_friendly':
      return 'eco'
    case 'mid':
      return 'balanced'
    case 'non_eco':
      return 'express'
    default:
      return 'balanced'
  }
}

function estimateCost(route: RouteOption): number {
  // Simple cost estimation based on distance and vehicle type
  const baseCostPerKm = 1.2
  const vehicleMultiplier = getVehicleCostMultiplier(route.green_carrier.recommended_vehicle)
  return Math.round(route.distance_km * baseCostPerKm * vehicleMultiplier)
}

function getVehicleCostMultiplier(vehicle: string): number {
  switch (vehicle.toLowerCase()) {
    case 'ev':
    case 'electric':
      return 1.3
    case 'hybrid':
      return 1.1
    case 'diesel':
      return 1.0
    default:
      return 1.0
  }
}

function getRouteFeatures(route: RouteOption): string[] {
  const features: string[] = []
  
  if (route.eco_points >= 50) {
    features.push('Carbon Neutral')
  }
  
  if (route.green_carrier.recommended_vehicle.toLowerCase().includes('electric')) {
    features.push('Zero Emissions')
  }
  
  if (route.green_carrier.feasibility_score >= 0.9) {
    features.push('Highly Reliable')
  }
  
  if (route.green_carrier.emissions_saved_grams > 100) {
    features.push('Significant Savings')
  }
  
  return features
}

// Utility to get hub coordinates from ID
export const getHubCoordinates = (hubId: string): [number, number] | null => {
  const hubMap: { [key: string]: [number, number] } = {
    'blr-001': [77.6413, 12.9716],
    'mum-001': [72.8777, 19.0760],
    'del-001': [77.2090, 28.6139],
    'hyd-001': [78.4867, 17.3850],
    'chn-001': [80.2707, 13.0827],
    'pun-001': [73.8563, 18.5204],
  }
  
  return hubMap[hubId] || null
}

// Create singleton instance
export const routeZeroAPI = new RouteZeroAPI()

// Error handling utilities
export class RouteZeroAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message)
    this.name = 'RouteZeroAPIError'
  }
}

export const handleAPIError = (error: any, endpoint: string) => {
  if (error instanceof RouteZeroAPIError) {
    return error
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new RouteZeroAPIError(
      'Unable to connect to RouteZero backend. Please check if the service is running.',
      0,
      endpoint
    )
  }
  
  return new RouteZeroAPIError(
    error.message || 'An unexpected error occurred',
    error.statusCode,
    endpoint
  )
}