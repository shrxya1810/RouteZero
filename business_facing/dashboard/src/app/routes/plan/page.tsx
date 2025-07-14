'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRouteOptimization } from '@/hooks/useRouteOptimization'
import Header from '@/components/layout/Header'
import { 
  MapPin, 
  Package, 
  Clock, 
  Target, 
  Search,
  Calendar,
  Weight,
  DollarSign,
  Leaf,
  Truck
} from 'lucide-react'

// Mock data for Walmart hubs
const walmartHubs = [
  { id: 'blr-001', name: 'Bangalore Warehouse East', type: 'warehouse', coordinates: [77.6413, 12.9716] },
  { id: 'mum-001', name: 'Mumbai Fulfillment Center', type: 'fulfillment', coordinates: [72.8777, 19.0760] },
  { id: 'del-001', name: 'Delhi Distribution Hub', type: 'distribution', coordinates: [77.2090, 28.6139] },
  { id: 'hyd-001', name: 'Hyderabad Customer Center', type: 'customer', coordinates: [78.4867, 17.3850] },
  { id: 'chn-001', name: 'Chennai Port Logistics', type: 'port', coordinates: [80.2707, 13.0827] },
  { id: 'pun-001', name: 'Pune Express Center', type: 'express', coordinates: [73.8563, 18.5204] },
]

const cargoTypes = [
  'Electronics', 'Groceries', 'Clothing', 'Home & Garden', 'Pharmaceuticals', 'Automotive Parts'
]

const priorityOptions = [
  { value: 'cost', label: 'Cost Optimized', icon: DollarSign, color: 'text-green-600' },
  { value: 'time', label: 'Time Optimized', icon: Clock, color: 'text-blue-600' },
  { value: 'emissions', label: 'Eco Optimized', icon: Leaf, color: 'text-green-600' },
  { value: 'balanced', label: 'Balanced', icon: Target, color: 'text-purple-600' }
]

export default function RoutePlanPage() {
  const router = useRouter()
  const { planRoute, isLoading, error, clearError } = useRouteOptimization()
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoType: '',
    weight: '',
    volume: '',
    priority: 'balanced' as const,
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    specialRequirements: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePlanRoute = async () => {
    if (!isFormValid) return
    
    clearError()
    
    try {
      // For demo purposes, navigate directly with URL parameters
      const params = new URLSearchParams({
        origin: formData.origin,
        destination: formData.destination,
        cargoType: formData.cargoType,
        weight: formData.weight,
        volume: formData.volume,
        priority: formData.priority,
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate
      })
      
      router.push(`/routes/optimize?${params.toString()}`)
    } catch (error: any) {
      console.error('Route planning failed:', error)
    }
  }

  const isFormValid = formData.origin && formData.destination && formData.cargoType && formData.weight

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Route Planning</h1>
            <p className="text-gray-600 mt-2">Plan optimized routes for your supply chain operations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Route Planning Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-blue-600" />
                    Route Details
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800">Route Planning Error</h4>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                          <button 
                            onClick={clearError}
                            className="text-sm text-red-600 hover:text-red-800 mt-2 underline"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Origin and Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Origin Hub
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        value={formData.origin}
                        onChange={(e) => handleInputChange('origin', e.target.value)}
                      >
                        <option value="">Select origin hub...</option>
                        {walmartHubs.map(hub => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name} ({hub.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Hub
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                      >
                        <option value="">Select destination hub...</option>
                        {walmartHubs.filter(hub => hub.id !== formData.origin).map(hub => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name} ({hub.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cargo Details */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Cargo Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cargo Type
                        </label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                          value={formData.cargoType}
                          onChange={(e) => handleInputChange('cargoType', e.target.value)}
                        >
                          <option value="">Select cargo type...</option>
                          {cargoTypes.map(type => (
                            <option key={type} value={type.toLowerCase()}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input 
                          type="number"
                          placeholder="e.g., 2500"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Volume (m³)
                        </label>
                        <input 
                          type="number"
                          placeholder="e.g., 15.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                          value={formData.volume}
                          onChange={(e) => handleInputChange('volume', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Schedule
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Date & Time
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                            value={formData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                          />
                          <input 
                            type="time"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                            value={formData.pickupTime}
                            onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Date & Time
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                            value={formData.deliveryDate}
                            onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                          />
                          <input 
                            type="time"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                            value={formData.deliveryTime}
                            onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Priority Selection */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Optimization Priority
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {priorityOptions.map(option => (
                        <label key={option.value} className="cursor-pointer">
                          <input 
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={formData.priority === option.value}
                            onChange={(e) => handleInputChange('priority', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`p-4 border-2 rounded-lg transition-all ${
                            formData.priority === option.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <option.icon className={`w-6 h-6 mx-auto mb-2 ${option.color}`} />
                            <p className="text-sm font-medium text-center text-gray-900">
                              {option.label}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements (Optional)
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="e.g., Temperature controlled, Fragile items, Security requirements..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 pt-6 flex space-x-4">
                    <button 
                      onClick={handlePlanRoute}
                      disabled={!isFormValid || isLoading}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Planning Route...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Find Optimal Routes
                        </>
                      )}
                    </button>
                    
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Routes</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Planning Time</span>
                    <span className="font-medium">3.2 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                </div>
              </div>

              {/* Recent Routes */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Routes</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">BLR → MUM</p>
                    <p className="text-xs text-gray-600">Electronics • 2.5T</p>
                    <p className="text-xs text-green-600">156kg CO₂ saved</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">DEL → CHN</p>
                    <p className="text-xs text-gray-600">Groceries • 4.1T</p>
                    <p className="text-xs text-green-600">203kg CO₂ saved</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">HYD → PUN</p>
                    <p className="text-xs text-gray-600">Clothing • 1.8T</p>
                    <p className="text-xs text-green-600">89kg CO₂ saved</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Optimization Tips</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Combine shipments for better efficiency</li>
                  <li>• Plan ahead for EV availability</li>
                  <li>• Consider rail for long distances</li>
                  <li>• Use off-peak hours when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}