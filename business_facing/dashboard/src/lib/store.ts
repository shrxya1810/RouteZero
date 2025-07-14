// In-memory store for demo purposes
// In a real app, this would be replaced with proper state management (Redux, Zustand, etc.)

interface PendingRoute {
  id: string
  origin: string
  destination: string
  originName: string
  destinationName: string
  cargoType: string
  weight: number
  status: 'pending' | 'optimized' | 'suggestion' | 'dispatched'
  priority: 'critical' | 'high' | 'medium' | 'low'
  currentEmissions: number
  estimatedSavings: number
  currentCost: number
  optimizedCost: number
  deadline: string
  hasIssues: boolean
  selectedRoute?: any
  routeOptions?: any[]
  createdAt: Date
  dispatchedAt?: Date
  isDispatched?: boolean
}

class RouteStore {
  private routes: PendingRoute[] = [
    // Default mock routes for demo
    {
      id: 'BLR-MUM-001',
      origin: 'blr-001',
      destination: 'mum-001',
      originName: 'Bangalore Warehouse',
      destinationName: 'Mumbai Store',
      cargoType: 'Electronics',
      weight: 2500,
      status: 'pending',
      priority: 'high',
      currentEmissions: 445,
      estimatedSavings: 289,
      currentCost: 1050,
      optimizedCost: 1240,
      deadline: '2024-01-15',
      hasIssues: true,
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'DEL-CHN-023',
      origin: 'del-001',
      destination: 'chn-001',
      originName: 'Delhi Hub',
      destinationName: 'Chennai Port',
      cargoType: 'Groceries',
      weight: 5100,
      status: 'optimized',
      priority: 'medium',
      currentEmissions: 623,
      estimatedSavings: 187,
      currentCost: 1350,
      optimizedCost: 1420,
      deadline: '2024-01-16',
      hasIssues: false,
      createdAt: new Date('2024-01-11')
    },
    {
      id: 'HYD-PUN-087',
      origin: 'hyd-001',
      destination: 'pun-001',
      originName: 'Hyderabad Center',
      destinationName: 'Pune Express',
      cargoType: 'Clothing',
      weight: 1800,
      status: 'suggestion',
      priority: 'low',
      currentEmissions: 287,
      estimatedSavings: 89,
      currentCost: 780,
      optimizedCost: 820,
      deadline: '2024-01-17',
      hasIssues: false,
      createdAt: new Date('2024-01-12')
    }
  ]

  // Generate a unique route ID
  private generateRouteId(origin: string, destination: string): string {
    const originCode = this.getHubCode(origin)
    const destCode = this.getHubCode(destination)
    const timestamp = Date.now().toString().slice(-3)
    return `${originCode}-${destCode}-${timestamp}`
  }

  private getHubCode(hubId: string): string {
    const codes: { [key: string]: string } = {
      'blr-001': 'BLR',
      'mum-001': 'MUM', 
      'del-001': 'DEL',
      'hyd-001': 'HYD',
      'chn-001': 'CHN',
      'pun-001': 'PUN'
    }
    return codes[hubId] || 'XXX'
  }

  private getHubName(hubId: string): string {
    const names: { [key: string]: string } = {
      'blr-001': 'Bangalore Warehouse East',
      'mum-001': 'Mumbai Fulfillment Center',
      'del-001': 'Delhi Distribution Hub',
      'hyd-001': 'Hyderabad Customer Center',
      'chn-001': 'Chennai Port Logistics',
      'pun-001': 'Pune Express Center'
    }
    return names[hubId] || 'Unknown Hub'
  }

  private calculatePriority(deliveryDate: string): 'critical' | 'high' | 'medium' | 'low' {
    const delivery = new Date(deliveryDate)
    const now = new Date()
    const daysUntilDelivery = Math.ceil((delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDelivery <= 1) return 'critical'
    if (daysUntilDelivery <= 2) return 'high'
    if (daysUntilDelivery <= 5) return 'medium'
    return 'low'
  }

  // Add a new route from route planning
  addRoute(routeData: {
    origin: string
    destination: string
    cargoType: string
    weight: string
    deliveryDate?: string
    routeOptions?: any[]
    selectedRoute?: any
  }): PendingRoute {
    const route: PendingRoute = {
      id: this.generateRouteId(routeData.origin, routeData.destination),
      origin: routeData.origin,
      destination: routeData.destination,
      originName: this.getHubName(routeData.origin),
      destinationName: this.getHubName(routeData.destination),
      cargoType: routeData.cargoType,
      weight: parseInt(routeData.weight) || 0,
      status: routeData.selectedRoute ? 'optimized' : 'pending',
      priority: this.calculatePriority(routeData.deliveryDate || '2024-01-20'),
      currentEmissions: this.estimateCurrentEmissions(parseInt(routeData.weight) || 0),
      estimatedSavings: routeData.selectedRoute ? this.calculateSavings(routeData.selectedRoute) : 0,
      currentCost: this.estimateCurrentCost(parseInt(routeData.weight) || 0),
      optimizedCost: routeData.selectedRoute ? routeData.selectedRoute.cost : 0,
      deadline: routeData.deliveryDate || '2024-01-20',
      hasIssues: Math.random() > 0.7, // Random issues for demo
      selectedRoute: routeData.selectedRoute,
      routeOptions: routeData.routeOptions,
      createdAt: new Date()
    }

    this.routes.unshift(route) // Add to beginning of array
    return route
  }

  private estimateCurrentEmissions(weight: number): number {
    // Simple estimation: base 300kg + weight factor
    return Math.round(300 + (weight * 0.1))
  }

  private estimateCurrentCost(weight: number): number {
    // Simple estimation: base $800 + weight factor  
    return Math.round(800 + (weight * 0.3))
  }

  private calculateSavings(selectedRoute: any): number {
    if (!selectedRoute) return 0
    const baseline = 445 // Express route baseline
    return Math.max(0, baseline - (selectedRoute.emissions * 1000 / 1000)) // Convert back to kg
  }

  // Get all routes
  getAllRoutes(): PendingRoute[] {
    return [...this.routes] // Return copy to prevent mutations
  }

  // Get route by ID
  getRouteById(id: string): PendingRoute | undefined {
    return this.routes.find(route => route.id === id)
  }

  // Update route status
  updateRouteStatus(id: string, status: PendingRoute['status']): void {
    const route = this.routes.find(r => r.id === id)
    if (route) {
      route.status = status
    }
  }

  // Update entire route (for editing functionality)
  updateRoute(id: string, routeData: {
    origin: string
    destination: string
    cargoType: string
    weight: string
    deliveryDate?: string
    routeOptions?: any[]
    selectedRoute?: any
  }): void {
    const route = this.routes.find(r => r.id === id)
    if (route) {
      // Update the route with new data
      route.origin = routeData.origin
      route.destination = routeData.destination
      route.originName = this.getHubName(routeData.origin)
      route.destinationName = this.getHubName(routeData.destination)
      route.cargoType = routeData.cargoType
      route.weight = parseInt(routeData.weight) || 0
      route.status = routeData.selectedRoute ? 'optimized' : 'pending'
      route.priority = this.calculatePriority(routeData.deliveryDate || route.deadline)
      route.currentEmissions = this.estimateCurrentEmissions(parseInt(routeData.weight) || 0)
      route.estimatedSavings = routeData.selectedRoute ? this.calculateSavings(routeData.selectedRoute) : 0
      route.currentCost = this.estimateCurrentCost(parseInt(routeData.weight) || 0)
      route.optimizedCost = routeData.selectedRoute ? routeData.selectedRoute.cost : 0
      route.deadline = routeData.deliveryDate || route.deadline
      route.selectedRoute = routeData.selectedRoute
      route.routeOptions = routeData.routeOptions
    }
  }

  // Update multiple routes (for bulk operations)
  updateMultipleRoutes(ids: string[], updates: Partial<PendingRoute>): void {
    ids.forEach(id => {
      const route = this.routes.find(r => r.id === id)
      if (route) {
        Object.assign(route, updates)
      }
    })
  }

  // Remove route and free vehicles
  removeRoute(id: string): void {
    const route = this.routes.find(r => r.id === id)
    if (route && route.selectedRoute) {
      // Import fleetStore to free vehicles
      const { fleetStore } = require('./fleetStore')
      
      // Free the assigned vehicle(s)
      if (route.selectedRoute.assignedVehicle) {
        fleetStore.updateVehicleStatus(route.selectedRoute.assignedVehicle.id, 'available')
      }
      
      // Free transfer vehicle if exists
      if (route.selectedRoute.transferVehicle) {
        fleetStore.updateVehicleStatus(route.selectedRoute.transferVehicle.id, 'available')
      }
    }
    
    this.routes = this.routes.filter(route => route.id !== id)
  }

  // Dispatch all routes (finalize deliveries)
  dispatchAllRoutes(): { success: boolean; dispatchedCount: number; message: string } {
    const undispatchedRoutes = this.routes.filter(r => !r.isDispatched && r.status !== 'pending')
    
    if (undispatchedRoutes.length === 0) {
      return {
        success: false,
        dispatchedCount: 0,
        message: 'No routes available for dispatch. All routes must be optimized before dispatch.'
      }
    }
    
    // Mark all optimized routes as dispatched
    undispatchedRoutes.forEach(route => {
      route.status = 'dispatched'
      route.isDispatched = true
      route.dispatchedAt = new Date()
    })
    
    return {
      success: true,
      dispatchedCount: undispatchedRoutes.length,
      message: `Successfully dispatched ${undispatchedRoutes.length} routes. All deliveries are now in progress.`
    }
  }

  // Check if bulk dispatch is available
  canDispatch(): boolean {
    return this.routes.some(r => !r.isDispatched && r.status !== 'pending')
  }

  // Get statistics
  getStats() {
    return {
      total: this.routes.length,
      pending: this.routes.filter(r => r.status === 'pending').length,
      optimized: this.routes.filter(r => r.status === 'optimized').length,
      dispatched: this.routes.filter(r => r.status === 'dispatched').length,
      withIssues: this.routes.filter(r => r.hasIssues).length,
      totalPotentialSavings: this.routes.reduce((sum, r) => sum + r.estimatedSavings, 0)
    }
  }
}

// Create singleton instance
export const routeStore = new RouteStore()
export type { PendingRoute }