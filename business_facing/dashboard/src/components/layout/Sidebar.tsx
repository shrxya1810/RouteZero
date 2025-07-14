'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Route,
  Truck,
  BarChart3,
  Settings,
  ChevronRight,
  MapPin,
  Calendar,
  Users
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Route Planning',
    href: '/routes',
    icon: Route,
    children: [
      { name: 'Plan Routes', href: '/routes/plan' },
      { name: 'Optimize Routes', href: '/routes/optimize' },
      { name: 'Bulk Operations', href: '/routes/bulk' },
    ]
  },
  {
    name: 'Fleet Management',
    href: '/fleet',
    icon: Truck,
    children: [
      { name: 'Fleet Overview', href: '/fleet' },
      { name: 'Hub Management', href: '/fleet/hubs' },
      { name: 'Vehicle Details', href: '/fleet/vehicles' },
      { name: 'Maintenance', href: '/fleet/maintenance' },
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    children: [
      { name: 'Emissions Report', href: '/analytics/emissions' },
      { name: 'Cost Analysis', href: '/analytics/costs' },
      { name: 'Performance', href: '/analytics/performance' },
    ]
  },
  {
    name: 'Hubs & Locations',
    href: '/locations',
    icon: MapPin,
  },
  {
    name: 'Schedule',
    href: '/schedule',
    icon: Calendar,
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Route Planning'])
  const pathname = usePathname()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  const isChildActive = (parentHref: string, children: any[]) => {
    return children.some(child => pathname.startsWith(child.href))
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen max-h-screen overflow-y-auto custom-scrollbar sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <Image
              src="/image.png"
              alt="Walmart Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Supply Chain</h2>
            <p className="text-sm text-gray-500">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.name}>
            {/* Main Navigation Item */}
            <div className="relative">
              {item.children ? (
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href) || isChildActive(item.href, item.children)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${
                      expandedItems.includes(item.name) ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>

            {/* Sub Navigation Items */}
            {item.children && expandedItems.includes(item.name) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive(child.href)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Today's Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Routes</span>
              <span className="font-medium text-gray-900">42</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CO₂ Today</span>
              <span className="font-medium text-green-600">2.8T</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Eco Points</span>
              <span className="font-medium text-blue-600">+890</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}