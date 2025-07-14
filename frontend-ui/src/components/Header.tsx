import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Leaf, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, cartItemCount } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/walmart-logo.png" alt="Walmart Logo" className="h-10 w-auto" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-eco-600 bg-eco-50'
                  : 'text-gray-700 hover:text-eco-600 hover:bg-eco-50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'text-eco-600 bg-eco-50'
                  : 'text-gray-700 hover:text-eco-600 hover:bg-eco-50'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Right side - Eco Points and Cart */}
          <div className="flex items-center space-x-4">
            {/* Eco Points */}
            <div className="hidden sm:flex items-center space-x-2 bg-eco-50 px-3 py-2 rounded-lg">
              <Leaf className="h-4 w-4 text-eco-600" />
              <span className="text-sm font-medium text-eco-800">
                {state.user.ecoPoints} pts
              </span>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-eco-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-eco-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-700" />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {state.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

