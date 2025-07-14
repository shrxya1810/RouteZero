import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Leaf, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, cartItemCount } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#0071dc] shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/walmart-logo(1).png" alt="Walmart Logo" className="h-8 w-auto" />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center mx-8">
            <input
              type="text"
              placeholder="Search everything at Walmart online and in store"
              className="w-full max-w-xl px-5 py-2 rounded-full border-none outline-none text-gray-700 bg-white placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-walmart-yellow"
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/items"
              className={`text-white font-medium text-base hover:underline ${isActive('/items') ? 'underline' : ''}`}
            >
              My Items
            </Link>
            <Link
              to="/profile"
              className={`text-white font-medium text-base hover:underline ${isActive('/profile') ? 'underline' : ''}`}
            >
              Account
            </Link>
            <Link
              to="/cart"
              className={`text-white font-medium text-base hover:underline ${isActive('/cart') ? 'underline' : ''}`}
            >
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

