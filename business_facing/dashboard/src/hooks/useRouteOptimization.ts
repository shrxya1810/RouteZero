'use client'

import { useState, useCallback } from 'react'
import { routeZeroAPI, transformRouteOptionToFrontend, getHubCoordinates, RouteZeroAPIError, handleAPIError } from '@/lib/api'

interface RouteFormData {
  origin: string
  destination: string
  cargoType: string
  weight: string
  volume: string
  priority: 'cost' | 'time' | 'emissions' | 'balanced'
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  specialRequirements: string
}

interface OptimizationState {
  isLoading: boolean
  error: string | null
  routes: any[]
  selectedRoute: any | null
}

export const useRouteOptimization = () => {
  const [state, setState] = useState<OptimizationState>({
    isLoading: false,
    error: null,
    routes: [],
    selectedRoute: null
  })

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const resetRoutes = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      routes: [], 
      selectedRoute: null, 
      error: null 
    }))
  }, [])

  const planRoute = useCallback(async (formData: RouteFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Get coordinates for origin and destination
      const originCoords = getHubCoordinates(formData.origin)
      const destinationCoords = getHubCoordinates(formData.destination)

      if (!originCoords || !destinationCoords) {
        throw new Error('Invalid origin or destination hub selected')
      }

      // Call RouteZero API
      const response = await routeZeroAPI.getRouteOptions({
        source: originCoords,
        destination: destinationCoords,
        cargoType: formData.cargoType,
        weight: parseFloat(formData.weight) || undefined,
        volume: parseFloat(formData.volume) || undefined,
        priority: formData.priority,
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
        specialRequirements: formData.specialRequirements
      })

      // Transform backend response to frontend format
      const transformedRoutes = response.routes.map(transformRouteOptionToFrontend)

      // Sort routes by eco-friendliness (eco points descending)
      transformedRoutes.sort((a, b) => b.ecoPoints - a.ecoPoints)

      setState(prev => ({
        ...prev,
        isLoading: false,
        routes: transformedRoutes,
        selectedRoute: transformedRoutes[0] || null // Auto-select the most eco-friendly route
      }))

      return transformedRoutes
    } catch (error: any) {
      const apiError = handleAPIError(error, '/route-options')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: apiError.message,
        routes: [],
        selectedRoute: null
      }))
      throw apiError
    }
  }, [])

  const planFreightRoute = useCallback(async (
    origin: string, 
    destination: string, 
    mode: 'heavy_truck' | 'rail_freight' | 'ship_barge' = 'heavy_truck'
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const originCoords = getHubCoordinates(origin)
      const destinationCoords = getHubCoordinates(destination)

      if (!originCoords || !destinationCoords) {
        throw new Error('Invalid origin or destination hub selected')
      }

      const response = await routeZeroAPI.getFreightOptions({
        source: originCoords,
        destination: destinationCoords,
        mode
      })

      // Transform freight response to route format
      const freightRoute = {
        id: `freight-${Date.now()}`,
        name: `${mode.replace('_', ' ').toUpperCase()} Route`,
        type: 'freight' as const,
        vehicles: [mode],
        distance: response.freight_route.distance_km,
        duration: Math.round(response.freight_route.duration_min / 60 * 10) / 10,
        cost: estimateFreightCost(response.freight_route),
        emissions: Math.round(response.freight_route.emissions_grams / 1000 * 100) / 100,
        ecoPoints: calculateFreightEcoPoints(response.freight_route),
        reliability: 92,
        features: getFreightFeatures(response.freight_route),
        details: {
          segments: [{
            mode: response.freight_route.vehicle_type,
            distance: response.freight_route.distance_km,
            duration: Math.round(response.freight_route.duration_min / 60 * 10) / 10,
            emissions: Math.round(response.freight_route.emissions_grams / 1000 * 100) / 100
          }]
        },
        freightData: response.freight_route
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        routes: [freightRoute],
        selectedRoute: freightRoute
      }))

      return freightRoute
    } catch (error: any) {
      const apiError = handleAPIError(error, '/freight-options')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: apiError.message
      }))
      throw apiError
    }
  }, [])

  const getRouteExplanation = useCallback(async (route: any, userContext?: string) => {
    try {
      if (route.freightData) {
        // For freight routes, use basic explanation
        return {
          explanation: `This freight route covers ${route.distance} km using ${route.vehicles[0]} transport. It produces ${route.emissions} kg of CO₂ emissions.`,
          confidence: 0.8,
          source: 'system'
        }
      }

      // For regular routes, use RouteZero explanation API
      const response = await routeZeroAPI.getRouteExplanation({
        emissions_grams: route.emissions * 1000, // Convert back to grams
        vehicle_type: route.vehicles[0].toLowerCase(),
        duration_min: route.duration * 60 // Convert back to minutes
      })

      return response.data
    } catch (error: any) {
      console.warn('Failed to get route explanation:', error)
      return {
        explanation: `This route covers ${route.distance} km in ${route.duration} hours, producing ${route.emissions} kg of CO₂ emissions.`,
        confidence: 0.5,
        source: 'fallback'
      }
    }
  }, [])

  const selectRoute = useCallback((route: any) => {
    setState(prev => ({ ...prev, selectedRoute: route }))
  }, [])

  const applyRoute = useCallback(async (route: any) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      // Simulate route application
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real implementation, you would:
      // 1. Update the shipment in your WMS
      // 2. Assign vehicles
      // 3. Generate shipping documents
      // 4. Notify relevant parties

      setState(prev => ({ ...prev, isLoading: false }))
      return { success: true, routeId: route.id }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to apply route. Please try again.' 
      }))
      throw error
    }
  }, [])

  return {
    ...state,
    planRoute,
    planFreightRoute,
    getRouteExplanation,
    selectRoute,
    applyRoute,
    clearError,
    resetRoutes
  }
}

// Helper functions
function estimateFreightCost(freightRoute: any): number {
  const baseCostPerKm = 2.5
  const modeMultipliers = {
    heavy_truck: 1.0,
    rail_freight: 0.7,
    ship_barge: 0.5
  }
  
  const multiplier = modeMultipliers[freightRoute.vehicle_type as keyof typeof modeMultipliers] || 1.0
  return Math.round(freightRoute.distance_km * baseCostPerKm * multiplier)
}

function calculateFreightEcoPoints(freightRoute: any): number {
  // Award eco points based on emission level
  switch (freightRoute.freight_emission_level) {
    case 'low': return 50
    case 'medium': return 25
    case 'high': return 0
    default: return 0
  }
}

function getFreightFeatures(freightRoute: any): string[] {
  const features: string[] = []
  
  if (freightRoute.percent_emissions_saved > 50) {
    features.push('Major Emissions Reduction')
  }
  
  if (freightRoute.vehicle_type === 'rail_freight') {
    features.push('Rail Efficiency')
  }
  
  if (freightRoute.vehicle_type === 'ship_barge') {
    features.push('Sea Route')
  }
  
  if (freightRoute.freight_emission_level === 'low') {
    features.push('Low Carbon')
  }
  
  return features
}