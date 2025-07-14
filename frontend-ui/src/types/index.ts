export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RouteOption {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  cost: number;
  ecoPoints: number;
  type: 'eco-friendly' | 'mid-route' | 'non-eco';
  carbonFootprint: number; // in kg CO2
}

export interface User {
  id: string;
  name: string;
  email: string;
  ecoPoints: number;
  address: string;
  phone: string;
  streak: number;
  lastEcoDate: string;
  showStreakBonus: 0 | 3 | 7;
  emissionsSaved: number;
  rewardHistory: string[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  routeOption: RouteOption;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface EcoReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discount: number; // percentage
  type: 'discount' | 'free-shipping' | 'cashback';
}