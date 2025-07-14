import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Gift, Award, ShoppingBag, MapPin, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockEcoRewards } from '../data/mockData';

export default function Profile() {
  const { state, dispatch } = useApp();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [dummyCode, setDummyCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Show streak bonus feedback and reset after display
  React.useEffect(() => {
    if (state.user.showStreakBonus) {
      setTimeout(() => {
        dispatch({ type: 'UPDATE_STREAK', payload: { date: state.user.lastEcoDate, isEco: true } });
      }, 2000);
    }
  }, [state.user.showStreakBonus, state.user.lastEcoDate, dispatch]);

  // Calculate user tier and next tier progress
  const getUserTier = (points: number) => {
    if (points >= 500) return 'Planet Hero';
    if (points >= 250) return 'Carbon Saver';
    if (points >= 100) return 'Eco Explorer';
    return 'Green Novice';
  };
  const userTier = getUserTier(state.user.ecoPoints);
  const getNextTier = (points: number) => {
    if (points < 100) return { tier: 'Eco Explorer', needed: 100 - points };
    if (points < 250) return { tier: 'Carbon Saver', needed: 250 - points };
    if (points < 500) return { tier: 'Planet Hero', needed: 500 - points };
    return null;
  };
  const nextTier = getNextTier(state.user.ecoPoints);

  const handleRedeemReward = (rewardId: string) => {
    const reward = mockEcoRewards.find(r => r.id === rewardId);
    if (!reward) return;

    const lastReward = state.user.rewardHistory?.[state.user.rewardHistory.length - 1];
    if (lastReward === rewardId) {
      setErrorMsg('You cannot redeem the same reward twice in a row.');
      return;
    }

    if (state.user.ecoPoints >= reward.pointsRequired) {
      dispatch({ type: 'REDEEM_ECO_POINTS', payload: { points: reward.pointsRequired, rewardId } });
      setSelectedReward(rewardId);
      setDummyCode('SAVE' + Math.floor(1000 + Math.random() * 9000));
      setErrorMsg(null);
      alert(`Successfully redeemed ${reward.name}!`);
    } else {
      setErrorMsg('Not enough eco points to redeem this reward.');
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Award className="h-5 w-5 text-blue-600" />;
      case 'free-shipping':
        return <ShoppingBag className="h-5 w-5 text-green-600" />;
      case 'cashback':
        return <Gift className="h-5 w-5 text-purple-600" />;
      default:
        return <Gift className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#0071dc] mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="card rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-eco-100 rounded-full flex items-center justify-center">
                  <span className="text-eco-600 font-semibold text-lg">
                    {state.user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{state.user.name}</h3>
                  <p className="text-sm text-gray-600">{state.user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{state.user.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{state.user.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{state.user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Eco Points and Stats */}
        <div className="lg:col-span-2">
          <div className="card mb-6 rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Eco Points & Sustainability</h2>
            
            {/* Eco Points Display */}
            <div className="bg-gradient-to-r from-[#0071dc] to-[#ffc220] rounded-lg p-6 text-white mb-6 relative">
              {state.user.showStreakBonus === 3 && (
                <div className="absolute top-2 right-2 animate-bounce bg-green-200 text-green-800 px-4 py-2 rounded shadow-lg font-bold z-10">
                  🎉 3-Day Streak! +15 pts
                </div>
              )}
              {state.user.showStreakBonus === 7 && (
                <div className="absolute top-2 right-2 animate-bounce bg-yellow-200 text-yellow-800 px-4 py-2 rounded shadow-lg font-bold z-10">
                  🏅 7-Day Streak! +10 Cashback
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{state.user.ecoPoints}</h3>
                  <p className="text-white">Total Eco Points</p>
                  <div className="mt-2 flex flex-col space-y-1 text-white text-sm">
                    <span>Tier: <span className="font-semibold">{userTier}</span></span>
                    <span>Streak: <span className="font-semibold">{state.user.streak || 0} days</span></span>
                    <span>Emissions Saved: <span className="font-semibold">{state.user.emissionsSaved?.toFixed(2) || '0.00'} kg CO₂</span></span>
                    {nextTier && (
                      <span className="mt-1">{nextTier.needed} points to <span className="font-semibold">{nextTier.tier}</span>!</span>
                    )}
                  </div>
                </div>
                <img src="/walmart-logo(1).png" alt="Eco Points" className="h-12 w-12" />
              </div>
            </div>

            {/* Points Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#f3f8fd] rounded-lg">
                <div className="text-2xl font-bold text-[#0071dc]">50</div>
                <div className="text-sm text-[#0071dc]">Eco-Friendly Deliveries</div>
              </div>
              <div className="text-center p-4 bg-[#fffbe6] rounded-lg">
                <div className="text-2xl font-bold text-[#ffc220]">25</div>
                <div className="text-sm text-[#ffc220]">Balanced Routes</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">0</div>
                <div className="text-sm text-gray-700">Express Deliveries</div>
              </div>
            </div>
          </div>

          {/* Available Rewards */}
          <div className="card rounded-xl border border-gray-200 shadow bg-white">
            <h2 className="text-xl font-bold text-[#0071dc] mb-4">Available Rewards</h2>
            <p className="text-gray-600 mb-6">
              Redeem your eco points for exclusive rewards and discounts.
            </p>
            {errorMsg && <div className="mb-4 text-red-600 text-sm">{errorMsg}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockEcoRewards.map((reward) => {
                const canRedeem = state.user.ecoPoints >= reward.pointsRequired;
                const isSelected = selectedReward === reward.id;

                return (
                  <div
                    key={reward.id}
                    className={`border-2 rounded-lg p-4 ${
                      isSelected
                        ? 'border-[#0071dc] bg-[#f3f8fd]'
                        : canRedeem
                        ? 'border-gray-200 bg-white hover:border-[#0071dc]'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getRewardIcon(reward.type)}
                        <h3 className="font-semibold text-[#0071dc]">{reward.name}</h3>
                      </div>
                      <span className="text-sm font-medium text-[#0071dc]">
                        {reward.pointsRequired} pts
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {reward.type === 'discount' && `₹${reward.discount} off`}
                        {reward.type === 'free-shipping' && 'Free shipping'}
                        {reward.type === 'cashback' && `₹${reward.discount} cashback`}
                      </span>

                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!canRedeem}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          canRedeem
                            ? 'bg-[#0071dc] text-white hover:bg-[#005fa3]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isSelected ? 'Redeemed' : 'Redeem'}
                      </button>
                    </div>

                    {!canRedeem && (
                      <div className="mt-2 text-xs text-red-600">
                        Need {reward.pointsRequired - state.user.ecoPoints} more points
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {dummyCode && (
              <div className="mt-6 p-4 bg-[#f3f8fd] border border-[#0071dc] rounded-lg text-center">
                <div className="text-lg font-bold text-[#0071dc] mb-2">Your Reward Code</div>
                <div className="text-2xl font-mono text-[#0071dc] mb-2">{dummyCode}</div>
                <div className="text-sm text-[#0071dc]">Use this code at checkout or scan the QR below.</div>
                {/* Simulated QR code (could use a library for real QR) */}
                <div className="mt-2 mx-auto w-20 h-20 bg-[#ffc220] rounded flex items-center justify-center font-bold text-[#0071dc]">QR</div>
              </div>
            )}
          </div>
          {/* Reward History */}
          {state.user.rewardHistory && state.user.rewardHistory.length > 0 && (
            <div className="card mt-8 rounded-xl border border-gray-200 shadow bg-white">
              <h2 className="text-xl font-bold text-[#0071dc] mb-4">Reward Redemption History</h2>
              <ul className="list-disc pl-6 text-gray-700">
                {state.user.rewardHistory.map((rid, idx) => {
                  const reward = mockEcoRewards.find(r => r.id === rid);
                  return (
                    <li key={idx} className="mb-1">
                      {reward ? reward.name : rid}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card rounded-xl border border-gray-200 shadow bg-white">
          <h2 className="text-xl font-bold text-[#0071dc] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-[#0071dc] hover:bg-[#f3f8fd] transition-colors"
            >
              <ShoppingBag className="h-6 w-6 text-[#0071dc]" />
              <div>
                <h3 className="font-medium text-gray-900">Continue Shopping</h3>
                <p className="text-sm text-gray-600">Browse more eco-friendly products</p>
              </div>
            </Link>

            <Link
              to="/cart"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-[#0071dc] hover:bg-[#f3f8fd] transition-colors"
            >
              <ShoppingBag className="h-6 w-6 text-[#0071dc]" />
              <div>
                <h3 className="font-medium text-gray-900">View Cart</h3>
                <p className="text-sm text-gray-600">Check your shopping cart</p>
              </div>
            </Link>

            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <Leaf className="h-6 w-6 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">Earn More Points</h3>
                <p className="text-sm text-gray-600">Choose eco-friendly delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
