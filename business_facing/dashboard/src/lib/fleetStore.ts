// Fleet management store for demo purposes
// In a real app, this would be replaced with proper API integration

export interface Vehicle {
  id: string
  type: 'Electric Truck' | 'Hybrid Truck' | 'Diesel Truck' | 'Electric Van' | 'Cargo Van'
  model: string
  licensePlate: string
  status: 'available' | 'in_transit' | 'loading' | 'maintenance_required' | 'under_maintenance' | 'charging' | 'out_of_service'
  currentHub: string
  currentRoute?: string
  driver?: string
  fuelLevel: number // percentage
  batteryLevel?: number // percentage for electric vehicles
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
  emissions: number // kg CO2 per 100km
  maxCapacity: number // kg
  currentLoad: number // kg
  costPerKm: number
}

export interface Hub {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  vehicleCapacity: number
  currentVehicleCount: number
  chargingStations: number
  maintenanceBays: number
  operationalHours: string
}

class FleetStore {
  private vehicles: Vehicle[] = [
    // Bangalore Hub Vehicles
    {
      id: 'BLR-ET-001',
      type: 'Electric Truck',
      model: 'Tata Ace EV',
      licensePlate: 'KA-05-AB-1234',
      status: 'available',
      currentHub: 'blr-001',
      fuelLevel: 0,
      batteryLevel: 85,
      mileage: 45000,
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      emissions: 0.085,
      maxCapacity: 750,
      currentLoad: 0,
      costPerKm: 18.5
    },
    {
      id: 'BLR-HT-002',
      type: 'Hybrid Truck',
      model: 'Ashok Leyland AVTR Hybrid',
      licensePlate: 'KA-05-CD-5678',
      status: 'in_transit',
      currentHub: 'blr-001',
      currentRoute: 'BLR-MUM-001',
      driver: 'Rajesh Kumar',
      fuelLevel: 65,
      mileage: 78000,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      emissions: 0.52,
      maxCapacity: 12000,
      currentLoad: 7500,
      costPerKm: 22.8
    },
    {
      id: 'BLR-DT-003',
      type: 'Diesel Truck',
      model: 'Bharat Benz 1617R',
      licensePlate: 'KA-05-EF-9012',
      status: 'maintenance_required',
      currentHub: 'blr-001',
      fuelLevel: 30,
      mileage: 120000,
      lastMaintenance: '2023-12-01',
      nextMaintenance: '2024-01-01',
      emissions: 0.78,
      maxCapacity: 16000,
      currentLoad: 0,
      costPerKm: 28.5
    },
    
    // Mumbai Hub Vehicles
    {
      id: 'MUM-EV-001',
      type: 'Electric Van',
      model: 'Mahindra eSupro',
      licensePlate: 'MH-01-AB-3456',
      status: 'charging',
      currentHub: 'mum-001',
      fuelLevel: 0,
      batteryLevel: 45,
      mileage: 25000,
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-02-08',
      emissions: 0.065,
      maxCapacity: 800,
      currentLoad: 0,
      costPerKm: 12.2
    },
    {
      id: 'MUM-HT-002',
      type: 'Hybrid Truck',
      model: 'Eicher Pro 6049 Hybrid',
      licensePlate: 'MH-01-CD-7890',
      status: 'available',
      currentHub: 'mum-001',
      fuelLevel: 80,
      mileage: 55000,
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-02-12',
      emissions: 0.52,
      maxCapacity: 11000,
      currentLoad: 0,
      costPerKm: 22.8
    },
    {
      id: 'MUM-DT-003',
      type: 'Diesel Truck',
      model: 'Tata LPT 1613',
      licensePlate: 'MH-01-EF-2345',
      status: 'under_maintenance',
      currentHub: 'mum-001',
      fuelLevel: 20,
      mileage: 95000,
      lastMaintenance: '2024-01-13',
      nextMaintenance: '2024-02-13',
      emissions: 0.78,
      maxCapacity: 14000,
      currentLoad: 0,
      costPerKm: 28.5
    },

    // Delhi Hub Vehicles
    {
      id: 'DEL-ET-001',
      type: 'Electric Truck',
      model: 'Ashok Leyland SWITCH',
      licensePlate: 'DL-01-AB-6789',
      status: 'available',
      currentHub: 'del-001',
      fuelLevel: 0,
      batteryLevel: 92,
      mileage: 35000,
      lastMaintenance: '2024-01-07',
      nextMaintenance: '2024-02-07',
      emissions: 0.085,
      maxCapacity: 900,
      currentLoad: 0,
      costPerKm: 18.5
    },
    {
      id: 'DEL-CV-002',
      type: 'Cargo Van',
      model: 'Mahindra Bolero Pick-up',
      licensePlate: 'DL-01-CD-0123',
      status: 'loading',
      currentHub: 'del-001',
      fuelLevel: 70,
      mileage: 42000,
      lastMaintenance: '2024-01-09',
      nextMaintenance: '2024-02-09',
      emissions: 0.42,
      maxCapacity: 1500,
      currentLoad: 1200,
      costPerKm: 16.8
    },

    // Chennai Hub Vehicles
    {
      id: 'CHN-HT-001',
      type: 'Hybrid Truck',
      model: 'Volvo FE Hybrid',
      licensePlate: 'TN-01-AB-4567',
      status: 'in_transit',
      currentHub: 'chn-001',
      currentRoute: 'CHN-DEL-078',
      driver: 'Suresh Babu',
      fuelLevel: 55,
      mileage: 68000,
      lastMaintenance: '2024-01-06',
      nextMaintenance: '2024-02-06',
      emissions: 0.52,
      maxCapacity: 10500,
      currentLoad: 6800,
      costPerKm: 22.8
    },
    {
      id: 'CHN-EV-002',
      type: 'Electric Van',
      model: 'Mahindra Treo Zor',
      licensePlate: 'TN-01-CD-8901',
      status: 'available',
      currentHub: 'chn-001',
      fuelLevel: 0,
      batteryLevel: 78,
      mileage: 18000,
      lastMaintenance: '2024-01-11',
      nextMaintenance: '2024-02-11',
      emissions: 0.065,
      maxCapacity: 700,
      currentLoad: 0,
      costPerKm: 12.2
    },

    // Hyderabad Hub Vehicles
    {
      id: 'HYD-DT-001',
      type: 'Diesel Truck',
      model: 'Ashok Leyland U-TRUCK',
      licensePlate: 'TS-01-AB-2345',
      status: 'available',
      currentHub: 'hyd-001',
      fuelLevel: 90,
      mileage: 82000,
      lastMaintenance: '2024-01-04',
      nextMaintenance: '2024-02-04',
      emissions: 0.78,
      maxCapacity: 13500,
      currentLoad: 0,
      costPerKm: 28.5
    },
    {
      id: 'HYD-ET-002',
      type: 'Electric Truck',
      model: 'Tata ACE EV',
      licensePlate: 'TS-01-CD-6789',
      status: 'charging',
      currentHub: 'hyd-001',
      fuelLevel: 0,
      batteryLevel: 25,
      mileage: 22000,
      lastMaintenance: '2024-01-14',
      nextMaintenance: '2024-02-14',
      emissions: 0.085,
      maxCapacity: 800,
      currentLoad: 0,
      costPerKm: 18.5
    },

    // Pune Hub Vehicles
    {
      id: 'PUN-HT-001',
      type: 'Hybrid Truck',
      model: 'Scania R 450 Hybrid',
      licensePlate: 'MH-12-AB-0123',
      status: 'available',
      currentHub: 'pun-001',
      fuelLevel: 75,
      mileage: 61000,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-15',
      emissions: 0.52,
      maxCapacity: 10000,
      currentLoad: 0,
      costPerKm: 22.8
    },
    {
      id: 'PUN-CV-002',
      type: 'Cargo Van',
      model: 'Tata Intra V30',
      licensePlate: 'MH-12-CD-4567',
      status: 'maintenance_required',
      currentHub: 'pun-001',
      fuelLevel: 40,
      mileage: 75000,
      lastMaintenance: '2023-12-20',
      nextMaintenance: '2024-01-20',
      emissions: 0.42,
      maxCapacity: 1200,
      currentLoad: 0,
      costPerKm: 16.8
    }
  ]

  private hubs: Hub[] = [
    {
      id: 'blr-001',
      name: 'Bangalore Warehouse East',
      location: 'Electronic City, Bangalore',
      coordinates: { lat: 12.8456, lng: 77.6632 },
      vehicleCapacity: 25,
      currentVehicleCount: 18,
      chargingStations: 8,
      maintenanceBays: 3,
      operationalHours: '24/7'
    },
    {
      id: 'mum-001',
      name: 'Mumbai Fulfillment Center',
      location: 'Bhiwandi, Mumbai',
      coordinates: { lat: 19.2956, lng: 73.0430 },
      vehicleCapacity: 30,
      currentVehicleCount: 22,
      chargingStations: 10,
      maintenanceBays: 4,
      operationalHours: '24/7'
    },
    {
      id: 'del-001',
      name: 'Delhi Distribution Hub',
      location: 'Gurgaon, Delhi NCR',
      coordinates: { lat: 28.4595, lng: 77.0266 },
      vehicleCapacity: 35,
      currentVehicleCount: 28,
      chargingStations: 12,
      maintenanceBays: 5,
      operationalHours: '24/7'
    },
    {
      id: 'chn-001',
      name: 'Chennai Port Logistics',
      location: 'Chennai Port, Tamil Nadu',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      vehicleCapacity: 20,
      currentVehicleCount: 15,
      chargingStations: 6,
      maintenanceBays: 2,
      operationalHours: '06:00 - 22:00'
    },
    {
      id: 'hyd-001',
      name: 'Hyderabad Customer Center',
      location: 'HITEC City, Hyderabad',
      coordinates: { lat: 17.4485, lng: 78.3908 },
      vehicleCapacity: 18,
      currentVehicleCount: 14,
      chargingStations: 5,
      maintenanceBays: 2,
      operationalHours: '24/7'
    },
    {
      id: 'pun-001',
      name: 'Pune Express Center',
      location: 'Hinjewadi, Pune',
      coordinates: { lat: 18.5830, lng: 73.7404 },
      vehicleCapacity: 15,
      currentVehicleCount: 12,
      chargingStations: 4,
      maintenanceBays: 2,
      operationalHours: '06:00 - 20:00'
    }
  ]

  // Get all vehicles
  getAllVehicles(): Vehicle[] {
    return [...this.vehicles]
  }

  // Get vehicles by hub
  getVehiclesByHub(hubId: string): Vehicle[] {
    return this.vehicles.filter(vehicle => vehicle.currentHub === hubId)
  }

  // Get vehicles by status
  getVehiclesByStatus(status: Vehicle['status']): Vehicle[] {
    return this.vehicles.filter(vehicle => vehicle.status === status)
  }

  // Get vehicles by type
  getVehiclesByType(type: Vehicle['type']): Vehicle[] {
    return this.vehicles.filter(vehicle => vehicle.type === type)
  }

  // Get all hubs
  getAllHubs(): Hub[] {
    return [...this.hubs]
  }

  // Get hub by ID
  getHubById(hubId: string): Hub | undefined {
    return this.hubs.find(hub => hub.id === hubId)
  }

  // Get fleet statistics
  getFleetStats() {
    const total = this.vehicles.length
    const available = this.vehicles.filter(v => v.status === 'available').length
    const inTransit = this.vehicles.filter(v => v.status === 'in_transit').length
    const maintenance = this.vehicles.filter(v => 
      v.status === 'maintenance_required' || v.status === 'under_maintenance'
    ).length
    const charging = this.vehicles.filter(v => v.status === 'charging').length

    // Vehicle type breakdown
    const electric = this.vehicles.filter(v => 
      v.type === 'Electric Truck' || v.type === 'Electric Van'
    ).length
    const hybrid = this.vehicles.filter(v => v.type === 'Hybrid Truck').length
    const diesel = this.vehicles.filter(v => 
      v.type === 'Diesel Truck' || v.type === 'Cargo Van'
    ).length

    // Calculate utilization rate
    const utilizationRate = Math.round(((inTransit + charging) / total) * 100)

    // Calculate average emissions
    const avgEmissions = Math.round(
      this.vehicles.reduce((sum, v) => sum + v.emissions, 0) / total
    )

    // Calculate vehicles needing maintenance
    const needsMaintenance = this.vehicles.filter(v => {
      const nextMaintenance = new Date(v.nextMaintenance)
      const today = new Date()
      const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 || v.status === 'maintenance_required'
    }).length

    return {
      total,
      available,
      inTransit,
      maintenance,
      charging,
      electric,
      hybrid,
      diesel,
      utilizationRate,
      avgEmissions,
      needsMaintenance
    }
  }

  // Get hub statistics
  getHubStats(hubId: string) {
    const hub = this.getHubById(hubId)
    const vehicles = this.getVehiclesByHub(hubId)
    
    if (!hub) return null

    const available = vehicles.filter(v => v.status === 'available').length
    const inTransit = vehicles.filter(v => v.status === 'in_transit').length
    const maintenance = vehicles.filter(v => 
      v.status === 'maintenance_required' || v.status === 'under_maintenance'
    ).length
    const charging = vehicles.filter(v => v.status === 'charging').length

    const capacityUtilization = Math.round((vehicles.length / hub.vehicleCapacity) * 100)

    return {
      hub,
      vehicleCount: vehicles.length,
      available,
      inTransit,
      maintenance,
      charging,
      capacityUtilization
    }
  }

  // Update vehicle status
  updateVehicleStatus(vehicleId: string, status: Vehicle['status']): void {
    const vehicle = this.vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      vehicle.status = status
    }
  }

  // Get vehicles needing maintenance
  getMaintenanceAlerts(): Vehicle[] {
    return this.vehicles.filter(v => {
      const nextMaintenance = new Date(v.nextMaintenance)
      const today = new Date()
      const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 || v.status === 'maintenance_required'
    })
  }
}

// Create singleton instance
export const fleetStore = new FleetStore()
export type { Vehicle, Hub }