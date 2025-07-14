import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, User, RouteOption } from '../types';
import { mockUser } from '../data/mockData';

interface AppState {
  cart: CartItem[];
  user: User;
  selectedRoute: RouteOption | null;
  deliveryAddress: string;
}

// | { type: 'ADD_TO_CART'; payload: CartItem }
// | { type: 'REMOVE_FROM_CART'; payload: string }
// | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
// | { type: 'CLEAR_CART' }
// | { type: 'SET_ROUTE'; payload: RouteOption }
// | { type: 'SET_ADDRESS'; payload: string }
// | { type: 'ADD_ECO_POINTS'; payload: number }
// | { type: 'REDEEM_ECO_POINTS'; payload: number };

export type AppAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ROUTE'; payload: RouteOption }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'ADD_ECO_POINTS'; payload: number }
  | { type: 'UPDATE_STREAK'; payload: { date: string; isEco: boolean } }    // ← NEW
  | { type: 'ADD_EMISSIONS_SAVED'; payload: number }                            // ← NEW
  | { type: 'REDEEM_ECO_POINTS'; payload: { points: number; rewardId: string } };

const initialState: AppState = {
  cart: [],
  user: mockUser,
  selectedRoute: null,
  deliveryAddress: '',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'SET_ROUTE':
      return {
        ...state,
        selectedRoute: action.payload,
      };

    case 'SET_ADDRESS':
      return {
        ...state,
        deliveryAddress: action.payload,
      };

    case 'ADD_ECO_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          ecoPoints: state.user.ecoPoints + action.payload,
        },
      };

    case 'REDEEM_ECO_POINTS': {
      const { points, rewardId } = action.payload;
      return {
        ...state,
        user: {
          ...state.user,
          ecoPoints: Math.max(0, state.user.ecoPoints - points),
          rewardHistory: [...state.user.rewardHistory, rewardId],
        },
      };
    }

    case 'UPDATE_STREAK': {
      const { date, isEco } = action.payload;
      const currentStreak = state.user.streak || 0;
      const lastEcoDate = state.user.lastEcoDate || '';
      
      let newStreak = currentStreak;
      let showStreakBonus: 0 | 3 | 7 = 0;
      
      if (isEco) {
        // Check if this is consecutive day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().slice(0, 10);
        
        if (lastEcoDate === yesterdayString || lastEcoDate === '') {
          newStreak = currentStreak + 1;
          
          // Check for streak bonuses
          if (newStreak === 3) {
            showStreakBonus = 3;
          } else if (newStreak === 7) {
            showStreakBonus = 7;
          }
        } else {
          newStreak = 1; // Start new streak
        }
      } else {
        newStreak = 0; // Reset streak for non-eco orders
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          streak: newStreak,
          lastEcoDate: date,
          showStreakBonus,
        },
      };
    }

    case 'ADD_EMISSIONS_SAVED': {
      return {
        ...state,
        user: {
          ...state.user,
          emissionsSaved: (state.user.emissionsSaved || 0) + action.payload,
        },
      };
    }

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  cartTotal: number;
  cartItemCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartItemCount = state.cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const value = {
    state,
    dispatch,
    cartTotal,
    cartItemCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}