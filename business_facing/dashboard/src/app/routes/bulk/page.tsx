'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { routeStore, type PendingRoute } from '@/lib/store'
import Header from '@/components/layout/Header'
import { 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Truck, 
  Filter,
  Download,
  Play,
  BarChart3,
  Zap,
  DollarSign,
  Leaf,
  Edit,
  Trash2,
  Send,
  Lock
} from 'lucide-react'

export default function BulkOptimizePage() {
  const router = useRouter()
  const [pendingRoutes, setPendingRoutes] = useState<PendingRoute[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isDispatching, setIsDispatching] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  // Load routes from store on component mount
  useEffect(() => {
    setPendingRoutes(routeStore.getAllRoutes())
  }, [])

  // Mock pending routes data for fallback
const mockPendingRoutes = [
  {
    id: 'BLR-MUM-001',
    origin: 'Bangalore Warehouse',
    destination: 'Mumbai Store',
    cargoType: 'Electronics',
    weight: 2500,
    status: 'pending',
    priority: 'high',
    currentEmissions: 445,
    estimatedSavings: 289,
    currentCost: 1050,
    optimizedCost: 1240,
    deadline: '2024-01-15',
    hasIssues: true
  },
  {
    id: 'DEL-CHN-023',
    origin: 'Delhi Hub',
    destination: 'Chennai Port',
    cargoType: 'Groceries',
    weight: 5100,
    status: 'optimized',
    priority: 'medium',
    currentEmissions: 623,
    estimatedSavings: 187,
    currentCost: 1350,
    optimizedCost: 1420,
    deadline: '2024-01-16',
    hasIssues: false
  },
  {
    id: 'HYD-PUN-087',
    origin: 'Hyderabad Center',
    destination: 'Pune Express',
    cargoType: 'Clothing',
    weight: 1800,
    status: 'suggestion',
    priority: 'low',
    currentEmissions: 287,
    estimatedSavings: 89,
    currentCost: 780,
    optimizedCost: 820,
    deadline: '2024-01-17',
    hasIssues: false
  },
  {
    id: 'MUM-BLR-045',
    origin: 'Mumbai Fulfillment',
    destination: 'Bangalore East',
    cargoType: 'Home & Garden',
    weight: 3200,
    status: 'pending',
    priority: 'high',
    currentEmissions: 389,
    estimatedSavings: 156,
    currentCost: 950,
    optimizedCost: 1080,
    deadline: '2024-01-15',
    hasIssues: false
  },
  {
    id: 'CHN-DEL-078',
    origin: 'Chennai Logistics',
    destination: 'Delhi Distribution',
    cargoType: 'Pharmaceuticals',
    weight: 980,
    status: 'pending',
    priority: 'critical',
    currentEmissions: 567,
    estimatedSavings: 340,
    currentCost: 1120,
    optimizedCost: 1380,
    deadline: '2024-01-14',
    hasIssues: true
  }
]

  const handleSelectRoute = (routeId: string) => {
    setSelectedRoutes(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    )
  }

  const handleSelectAll = () => {
    const filteredRoutes = getFilteredRoutes()
    if (selectedRoutes.length === filteredRoutes.length) {
      setSelectedRoutes([])
    } else {
      setSelectedRoutes(filteredRoutes.map(route => route.id))
    }
  }

  const handleBulkOptimize = async () => {
    setIsOptimizing(true)
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsOptimizing(false)
    
    // Update route statuses
    alert(`${selectedRoutes.length} routes optimized successfully!`)
    setSelectedRoutes([])
  }

  const handleEditRoute = (route: PendingRoute) => {
    // Navigate to optimize page with edit mode and route data
    const params = new URLSearchParams({
      edit: 'true',
      routeId: route.id,
      origin: route.origin,
      destination: route.destination,
      cargoType: route.cargoType,
      weight: route.weight.toString(),
      deliveryDate: route.deadline
    })
    
    router.push(`/routes/optimize?${params.toString()}`)
  }

  const handleDeleteRoute = (routeId: string) => {
    const route = pendingRoutes.find(r => r.id === routeId)
    if (route?.isDispatched) {
      alert('Cannot delete dispatched routes. Dispatched routes are finalized and cannot be modified.')
      return
    }
    
    if (confirm('Are you sure you want to delete this route? This will free up the assigned vehicle(s).')) {
      routeStore.removeRoute(routeId)
      setPendingRoutes(routeStore.getAllRoutes())
      setSelectedRoutes(prev => prev.filter(id => id !== routeId))
    }
  }

  const handleBulkDispatch = async () => {
    if (!routeStore.canDispatch()) {
      alert('No routes available for dispatch. All routes must be optimized before dispatch.')
      return
    }
    
    if (!confirm('Are you sure you want to dispatch all routes? This action will finalize all deliveries and prevent further modifications.')) {
      return
    }
    
    setIsDispatching(true)
    // Simulate dispatch process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = routeStore.dispatchAllRoutes()
    setPendingRoutes(routeStore.getAllRoutes())
    setSelectedRoutes([])
    setIsDispatching(false)
    
    alert(result.message)
  }

  const getFilteredRoutes = () => {
    return pendingRoutes.filter(route => {
      if (filterStatus !== 'all' && route.status !== filterStatus) return false
      if (filterPriority !== 'all' && route.priority !== filterPriority) return false
      return true
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'optimized': return 'text-green-600 bg-green-100'
      case 'suggestion': return 'text-blue-600 bg-blue-100'
      case 'dispatched': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const calculateTotalSavings = () => {
    return selectedRoutes.reduce((total, routeId) => {
      const route = pendingRoutes.find(r => r.id === routeId)
      return total + (route?.estimatedSavings || 0)
    }, 0)
  }

  const calculateTotalCostImpact = () => {
    return selectedRoutes.reduce((total, routeId) => {
      const route = pendingRoutes.find(r => r.id === routeId)
      return total + ((route?.optimizedCost || 0) - (route?.currentCost || 0))
    }, 0)
  }

  const filteredRoutes = getFilteredRoutes()
  const allSelected = selectedRoutes.length === filteredRoutes.length && filteredRoutes.length > 0

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Route Optimization</h1>
              <p className="text-gray-600 mt-2">Optimize multiple routes simultaneously for maximum efficiency</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              
              <button 
                onClick={handleBulkDispatch}
                disabled={!routeStore.canDispatch() || isDispatching}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isDispatching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch All Routes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Routes</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingRoutes.length}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Potential Savings</p>
                  <p className="text-3xl font-bold text-green-600">
                    {pendingRoutes.reduce((sum, r) => sum + r.estimatedSavings, 0)}kg
                  </p>
                </div>
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selected Routes</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedRoutes.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Est. CO₂ Reduction</p>
                  <p className="text-3xl font-bold text-green-600">{calculateTotalSavings()}kg</p>
                </div>
                <Zap className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Routes Table */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {/* Table Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Pending Routes</h2>
                    
                    <div className="flex items-center space-x-4">
                      {/* Filters */}
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select 
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="optimized">Optimized</option>
                          <option value="suggestion">Suggestion</option>
                          <option value="dispatched">Dispatched</option>
                        </select>
                        
                        <select 
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value)}
                        >
                          <option value="all">All Priority</option>
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>

                      {/* Select All */}
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        <span>Select All</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input type="checkbox" className="sr-only" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current CO₂</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Savings</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRoutes.map((route) => (
                        <tr key={route.id} className={`hover:bg-gray-50 ${selectedRoutes.includes(route.id) ? 'bg-blue-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => handleSelectRoute(route.id)}>
                              {selectedRoutes.includes(route.id) ? 
                                <CheckSquare className="w-5 h-5 text-blue-600" /> : 
                                <Square className="w-5 h-5 text-gray-400" />
                              }
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {route.hasIssues && <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{route.id}</div>
                                <div className="text-sm text-gray-500">{route.originName} → {route.destinationName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{route.cargoType}</div>
                            <div className="text-sm text-gray-600 font-medium">{route.weight} kg</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(route.status)}`}>
                              {route.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(route.priority)}`}>
                              {route.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {route.currentEmissions} kg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-green-600">-{route.estimatedSavings} kg</div>
                            <div className="text-xs text-gray-600 font-medium">CO₂ reduction</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {route.deadline}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              {route.isDispatched ? (
                                <div className="flex items-center space-x-1 text-purple-600">
                                  <Lock className="w-4 h-4" />
                                  <span className="text-xs">Dispatched</span>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditRoute(route)}
                                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit Route"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRoute(route.id)}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Route"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Bulk Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleBulkOptimize}
                    disabled={selectedRoutes.length === 0 || isOptimizing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Optimize Selected ({selectedRoutes.length})</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    disabled={selectedRoutes.length === 0}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply AI Recommendations
                  </button>
                </div>
              </div>

              {/* Impact Summary */}
              {selectedRoutes.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Impact</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Routes Selected:</span>
                      <span className="font-medium">{selectedRoutes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CO₂ Reduction:</span>
                      <span className="font-medium text-green-600">-{calculateTotalSavings()} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Impact:</span>
                      <span className={`font-medium ${calculateTotalCostImpact() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {calculateTotalCostImpact() > 0 ? '+' : ''}${calculateTotalCostImpact()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Filters</h3>
                
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    High Priority Routes (2)
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    Routes with Issues (2)
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    Due Today (1)
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">
                    High Savings Potential (3)
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