import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Clock, Truck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockRouteOptions } from '../data/mockData';
// @ts-ignore: No type definitions for this package

import RouteMap from '../components/RouteMap';
import AddressAutocomplete from '../components/AddressAutocomplete';

export default function Checkout() {
  const navigate = useNavigate();
  const { state, dispatch, cartTotal, cartItemCount } = useApp();
  const [deliveryAddress, setDeliveryAddress] = useState(state.deliveryAddress);
  const [selectedRoute, setSelectedRoute] = useState(state.selectedRoute);
  const [showMap, setShowMap] = useState(false);
  const [mapAddress, setMapAddress] = useState<any>(null); // Use 'any' for GooglePlacesAutocomplete value

  if (cartItemCount === 0) {
    navigate('/');
    return null;
  }

  const handleRouteSelect = (route: typeof mockRouteOptions[0]) => {
    setSelectedRoute(route);
    dispatch({ type: 'SET_ROUTE', payload: route });
  };

  const handleAddressChange = (address: string) => {
    setDeliveryAddress(address);
    dispatch({ type: 'SET_ADDRESS', payload: address });
    
    // Show map and set address for map display when typing in textarea
    if (address.trim()) {
      setMapAddress({ label: address });
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter a delivery address');
      return;
    }
    if (!selectedRoute) {
      alert('Please select a delivery route');
      return;
    }

    // Add eco points for the selected route
    dispatch({ type: 'ADD_ECO_POINTS', payload: selectedRoute.ecoPoints });

    // Update streak and emissions saved for eco or mid routes
    const isEco = selectedRoute.type === 'eco-friendly' || selectedRoute.type === 'mid-route';
    if (isEco) {
      dispatch({ type: 'UPDATE_STREAK', payload: { date: new Date().toISOString().slice(0, 10), isEco: true } });
      dispatch({ type: 'ADD_EMISSIONS_SAVED', payload: selectedRoute.carbonFootprint });
    } else {
      dispatch({ type: 'UPDATE_STREAK', payload: { date: new Date().toISOString().slice(0, 10), isEco: false } });
    }

    // Clear cart
    dispatch({ type: 'CLEAR_CART' });

    // Navigate to confirmation, pass feedback
    navigate('/order-confirmation', {
      state: {
        pointsEarned: selectedRoute.ecoPoints,
        emissionsSaved: selectedRoute.carbonFootprint,
        routeType: selectedRoute.type,
      },
    });
  };

  const formatINR = (amount: number) =>
    `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'eco-friendly':
        return <Leaf className="h-5 w-5 text-green-600" />;
      case 'mid-route':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'non-eco':
        return <Truck className="h-5 w-5 text-gray-600" />;
      default:
        return <Truck className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRouteColor = (type: string) => {
    switch (type) {
      case 'eco-friendly':
        return 'border-green-200 bg-green-50';
      case 'mid-route':
        return 'border-yellow-200 bg-yellow-50';
      case 'non-eco':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const totalWithShipping = cartTotal + (selectedRoute?.cost || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#0071dc] mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Details and Address */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Order Summary</h2>
            <div className="space-y-3">
              {state.cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatINR(item.quantity * item.product.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">{formatINR(cartTotal)}</span>
              </div>
            </div>
          </div>
          {/* Delivery Address */}
          <div className="card rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Delivery Address</h2>
            <textarea
              value={deliveryAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Enter your delivery address..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071dc] focus:border-transparent"
              rows={3}
            />
            <div className="mt-4">
              <AddressAutocomplete
                apiKey="AIzaSyCbARkUvVezU2dZvoYdjHOmOUwS-LsC9KU" // Replace this with your real key
                onSelect={(address: string) => {
                  setMapAddress({ label: address });
                  setShowMap(true);
                  handleAddressChange(address);
                }}
              />

              {showMap && mapAddress?.label && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Delivery Route</h3>
                  <RouteMap
                    apiKey="" // No longer needed for OpenStreetMap
                    destination={mapAddress.label}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
        {/* Right Column - Route Selection and Total */}
        <div className="space-y-6">
          {/* Route Selection */}
          <div className="card rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Choose Delivery Route</h2>
            <div className="space-y-3">
              {mockRouteOptions.map((route) => (
                <div
                  key={route.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${selectedRoute?.id === route.id
                    ? 'border-[#0071dc] bg-[#f3f8fd]'
                    : route.type === 'eco-friendly'
                      ? 'border-[#0071dc] bg-[#f3f8fd]'
                      : route.type === 'mid-route'
                        ? 'border-[#ffc220] bg-[#fffbe6]'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  onClick={() => handleRouteSelect(route)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <img src="/walmart-logo(1).png" alt="Route" className="h-5 w-5" />
                      <div>
                        <h3 className="font-semibold text-[#0071dc]">{route.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{route.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>⏱️ {route.estimatedTime}</span>
                          <span>🌱 {route.carbonFootprint}kg CO₂</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0071dc]">{formatINR(route.cost)}</p>
                      <p className="text-sm font-medium text-[#ffc220]">
                        +{route.ecoPoints} pts
                      </p>
                    </div>
                  </div>
                  {selectedRoute?.id === route.id && (
                    <div className="flex items-center space-x-2 mt-3 text-[#0071dc]">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Order Total */}
          <div className="card rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Order Total</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItemCount} items)</span>
                <span className="font-medium">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {selectedRoute ? formatINR(selectedRoute.cost) : 'Select route'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-[#0071dc]">Total</span>
                  <span className="text-lg font-bold text-[#0071dc]">
                    {formatINR(totalWithShipping)}
                  </span>
                </div>
              </div>
            </div>
            {/* Eco Points Info */}
            {selectedRoute && (
              <div className="mt-4 p-3 bg-[#f3f8fd] rounded-lg">
                <div className="flex items-center space-x-2">
                  <img src="/walmart-logo(1).png" alt="Eco Points" className="h-4 w-4" />
                  <span className="text-sm font-medium text-[#0071dc]">
                    You'll earn {selectedRoute.ecoPoints} eco points with this delivery!
                  </span>
                </div>
              </div>
            )}
            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!deliveryAddress.trim() || !selectedRoute}
              className="w-full bg-[#0071dc] text-white font-bold py-2 px-4 rounded mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#005fa3] transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
