'use client';

import { CartItem, Event } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface CartContext {
  items: CartItem[];
  addItem: (event: Event) => void;
  removeItem: (id: number) => void;
  resetCart: () => void;
}

function loadJSON(key: string) {
  if (localStorage[key]) return JSON.parse(localStorage[key] ?? '');
  return '';
}
function saveJSON(key: string, data: CartItem[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

const CartContext = createContext<CartContext | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children?: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const key = 'STRIPE_CART_ITEMS';
  const firstRender = useRef(true);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const localItems = loadJSON(key);
      localItems && setItems(localItems);
    }
    saveJSON(key, items);
  }, [key, items]);

  const addItem = useCallback(
    (event: Event) =>
      setItems((cartItems) =>
        cartItems.concat([{ unitAmount: 1, ...event, price: event.price }])
      ),
    []
  );
  const removeItem = useCallback(
    (id: number) =>
      setItems((cartItems) =>
        cartItems.filter((event) => event.eventId !== id)
      ),
    []
  );

  const resetCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, resetCart }}>
      {children}
    </CartContext.Provider>
  );
}
