import React, { useState } from 'react';
import { Star, ShoppingCart, Leaf } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        quantity,
      },
    });
    setQuantity(1);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 relative">
      {/* Product Image */}
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        {product.category === 'Home & Garden' && (
          <div className="absolute top-2 left-2">
            <span className="eco-badge flex items-center space-x-1">
              <Leaf className="h-3 w-3" />
              <span>Eco</span>
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          
          {product.inStock ? (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Qty:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-[#0071dc] hover:bg-[#005cb2] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Add to Cart Popup */}
      {showPopup && (
        <div className="fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50 bg-[#0071dc] text-white px-6 py-3 rounded-full shadow-lg text-base font-medium animate-fade-in-out">
          Added to cart!
        </div>
      )}
    </div>
  );
}