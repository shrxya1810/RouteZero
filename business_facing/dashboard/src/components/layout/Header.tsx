'use client'

import { Bell, Search, Settings, User } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-4">
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
                <h1 className="text-2xl font-bold text-gray-900">Supply Chain Command</h1>
                <p className="text-sm text-gray-500">Emissions & Logistics Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search routes, vehicles, or hubs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right: Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Real-time Status */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <div className="status-online status-indicator pulse-gentle"></div>
              <span className="text-sm font-medium text-green-700">Live Data</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                <p className="text-xs text-gray-500">Supply Chain Manager</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}