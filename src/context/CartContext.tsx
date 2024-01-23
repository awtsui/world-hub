'use client';

import { TicketWithData } from '@/lib/types';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const LOCAL_STORAGE_KEY = 'STRIPE_CART_ITEMS';

function loadJSON(key: string) {
  if (localStorage[key]) return JSON.parse(localStorage[key] ?? '');
  return '';
}
function saveJSON(key: string, data: Record<string, TicketWithData>) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartContext {
  tickets: Record<string, TicketWithData>;
  addTicket: (ticket: TicketWithData) => void;
  removeTicket: (eventId: string, ticketLabel: string) => void;
  resetCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContext | null>(null);

interface CartProviderProps {
  children?: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const firstRender = useRef(true);
  const [tickets, setTickets] = useState<Record<string, TicketWithData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (firstRender.current) {
      setIsLoading(true);
      firstRender.current = false;
      const localItems = loadJSON(LOCAL_STORAGE_KEY);
      localItems && setTickets(localItems);
      setIsLoading(false);
    }
    saveJSON(LOCAL_STORAGE_KEY, tickets);
  }, [tickets]);

  const addTicket = useCallback((ticket: TicketWithData) => {
    const ticketId = ticket.eventId + ':' + ticket.label; // TODO: define ticket id creation, must be deterministic
    setTickets((prev) => {
      if (prev[ticketId]) {
        return {
          ...prev,
          [ticketId]: {
            ...prev[ticketId],
            unitAmount: prev[ticketId].unitAmount + ticket.unitAmount,
          },
        };
      } else {
        return {
          ...prev,
          [ticketId]: ticket,
        };
      }
    });
  }, []);
  const removeTicket = useCallback((eventId: string, ticketLabel: string) => {
    const ticketId = eventId + ':' + ticketLabel;
    setTickets((prev) => {
      const next = { ...prev };
      delete next[ticketId];
      return next;
    });
  }, []);

  const resetCart = useCallback(() => setTickets({}), []);

  return (
    <CartContext.Provider
      value={{
        tickets,
        addTicket,
        removeTicket,
        resetCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
