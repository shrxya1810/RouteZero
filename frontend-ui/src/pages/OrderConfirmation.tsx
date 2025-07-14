import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import CarbonReceiptGenerator from '../components/CarbonReceiptGenerator';
import { useApp } from '../context/AppContext';

export default function OrderConfirmation() {
  const location = useLocation();
  const { dispatch } = useApp();
  const { pointsEarned = 0, emissionsSaved = 0, routeType = '', orderData } = location.state || {};
  const [showRedeem, setShowRedeem] = React.useState(pointsEarned > 0);

  // Clear cart when order confirmation page loads
  React.useEffect(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-[#0071dc] mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Thank you for your order. We'll send you a confirmation email with tracking details.
        </p>

        {/* Order Details */}
        <div className="card text-left mb-8 bg-white rounded-xl border border-gray-200 shadow">
          <h2 className="text-xl font-bold text-[#0071dc] mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-medium">#ECO-2024-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="font-medium">2-3 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method</span>
              <span className="font-medium text-eco-600">{routeType === 'eco-friendly' ? 'Eco-Friendly Route' : routeType === 'mid-route' ? 'Balanced Route' : 'Express Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Eco Points Earned */}
        {pointsEarned > 0 && (
          <div className="card bg-[#f3f8fd] border-[#0071dc] mb-8 rounded-xl">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/walmart-logo(1).png" alt="Eco Points" className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-[#0071dc]">
                Eco Points Earned!
              </h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0071dc] mb-2">+{pointsEarned}</div>
              <p className="text-[#0071dc]">
                You've earned {pointsEarned} eco points for choosing a sustainable delivery!
              </p>
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        {emissionsSaved > 0 && (
          <div className="card bg-[#fffbe6] border-[#ffc220] mb-8 rounded-xl">
            <h3 className="text-lg font-semibold text-[#ffc220] mb-4 text-center">
              Environmental Impact
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#ffc220]">{emissionsSaved}kg</div>
                <div className="text-sm text-[#ffc220]">CO₂ Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#ffc220]">{routeType === 'eco-friendly' ? '85%' : routeType === 'mid-route' ? '40%' : '0%'}</div>
                <div className="text-sm text-[#ffc220]">Less Carbon</div>
              </div>
            </div>
            
            {/* Carbon Receipt Generator - show for all eco routes */}
            {emissionsSaved > 0 && (
              <div className="mt-4 pt-4 border-t border-[#ffc220]/20">
                <div className="flex justify-center">
                  {orderData ? (
                    <CarbonReceiptGenerator receiptData={orderData} />
                  ) : (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">🌱 Eco-Friendly Order Complete!</p>
                      <p className="text-green-600 text-sm mt-1">
                        You saved {emissionsSaved}kg CO₂ with this delivery
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Debug info - remove this later */}
            <div className="mt-2 text-xs text-gray-400">
              Debug: orderData={orderData ? 'exists' : 'missing'}, routeType='{routeType}', emissionsSaved={emissionsSaved}
            </div>
          </div>
        )}

        {/* Redeem Modal */}
        {showRedeem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold mb-4 text-[#0071dc]">Want to redeem your points for a reward?</h2>
              <p className="mb-6 text-gray-700">Check out the rewards section in your profile to redeem eco points for coupons, cashback, and more!</p>
              <button className="bg-[#ffc220] text-[#0071dc] font-bold py-2 px-4 rounded w-full" onClick={() => setShowRedeem(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="card rounded-xl">
          <h3 className="text-lg font-semibold text-[#0071dc] mb-4">What's Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-eco-100 rounded-full flex items-center justify-center">
                <span className="text-eco-600 text-sm font-medium">1</span>
              </div>
              <span className="text-gray-700">You'll receive an email confirmation shortly</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-eco-100 rounded-full flex items-center justify-center">
                <span className="text-eco-600 text-sm font-medium">2</span>
              </div>
              <span className="text-gray-700">Track your order in your profile</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-eco-100 rounded-full flex items-center justify-center">
                <span className="text-eco-600 text-sm font-medium">3</span>
              </div>
              <span className="text-gray-700">Redeem your eco points for rewards</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <Link
            to="/profile"
            className="w-full bg-[#0071dc] text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-[#005fa3] transition"
          >
            <span>View Profile & Rewards</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            to="/"
            className="w-full bg-[#ffc220] text-[#0071dc] font-bold py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-[#ffd966] transition"
          >
            <Home className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
