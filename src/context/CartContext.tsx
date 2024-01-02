'use client';

import { Ticket } from '@/types';
import { deserialize, serialize } from '@/utils/client-helper';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const LOCAL_STORAGE_KEY = 'STRIPE_CART_ITEMS';

interface CartContext {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  removeTicket: (eventId: string, ticketLabel: string) => void;
  resetCart: () => void;
}

function loadJSON(key: string) {
  if (localStorage[key]) return deserialize(localStorage[key] ?? '');
  return '';
}
function saveJSON(key: string, data: Ticket[]) {
  localStorage.setItem(key, serialize(data));
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
  const firstRender = useRef(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const localItems = loadJSON(LOCAL_STORAGE_KEY);
      localItems && setTickets(localItems);
    }
    saveJSON(LOCAL_STORAGE_KEY, tickets);
  }, [LOCAL_STORAGE_KEY, tickets]);

  const addTicket = useCallback(
    (ticket: Ticket) =>
      setTickets((prev) => {
        let ticketFound = false;
        const next: Ticket[] = [];
        prev.forEach((item) => {
          if (item.eventId === ticket.eventId && item.label === ticket.label) {
            next.push({
              ...item,
              unitAmount: item.unitAmount + ticket.unitAmount,
            });
            ticketFound = true;
          } else {
            next.push(item);
          }
        });
        if (!ticketFound) {
          next.push(ticket);
        }
        return next;
      }),
    []
  );
  const removeTicket = useCallback(
    (eventId: string, ticketLabel: string) =>
      setTickets((prev) =>
        prev.filter(
          (ticket) =>
            ticket.eventId !== eventId ||
            (ticket.eventId === eventId && ticket.label !== ticketLabel)
        )
      ),
    []
  );

  const resetCart = useCallback(() => setTickets([]), []);

  return (
    <CartContext.Provider
      value={{ tickets, addTicket, removeTicket, resetCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
