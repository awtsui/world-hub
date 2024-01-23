'use client';

import { AlertStatus } from '@/lib/types';
import { createContext, useCallback, useContext, useState } from 'react';

// -----Search Modal Context-----

interface SearchModalContext {
  isSearchOpen: boolean;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  searchData: any;
  setSearchData: (data: any) => void;
}

const SearchModalContext = createContext<SearchModalContext | null>(null);

export function useSearchDialog() {
  const context = useContext(SearchModalContext);
  if (context === null) {
    throw new Error('useSearchDialog must be used within ModalProvider');
  }
  return context;
}

// -----Cart Modal Context-----

interface CartModalContext {
  isCartOpen: boolean;
  onCartOpen: () => void;
  onCartClose: () => void;
}

const CartModalContext = createContext<CartModalContext | null>(null);

export function useCartSheet() {
  const context = useContext(CartModalContext);
  if (context === null) {
    throw new Error('useCartSheet must be used within ModalProvider');
  }
  return context;
}

// -----Alert Modal Context-----

interface AlertModalContext {
  alert: AlertStatus;
  alertText: string;
  setSuccess: (text: string, timeout?: number) => void;
  setError: (text: string, timeout?: number) => void;
  setNotif: (text: string, timeout?: number) => void;
  clear: () => void;
}

export const AlertModalContext = createContext<AlertModalContext | null>(null);

export function useAlertDialog() {
  const context = useContext(AlertModalContext);
  if (context === null) {
    throw new Error('useAlertDialog must be used within ModalProvider');
  }
  return context;
}

interface AlertModalProviderProps {
  children?: React.ReactNode;
}

export function AlertModalProvider({ children }: AlertModalProviderProps) {
  // ----- Alert Modal -----
  const [alert, setAlert] = useState(AlertStatus.None);
  const [alertText, setAlertText] = useState('');

  function useCreateSetCallback(alertType: AlertStatus) {
    return useCallback(
      (text: string, timeout?: number) => {
        setAlertText(text);
        setAlert(alertType);
        setTimeout(
          () => {
            setAlert(AlertStatus.None);
          },
          timeout ? timeout * 1000 : 3000,
        );
      },
      [alertType],
    );
  }

  const setSuccess = useCreateSetCallback(AlertStatus.Success);
  const setError = useCreateSetCallback(AlertStatus.Error);
  const setNotif = useCreateSetCallback(AlertStatus.Notif);
  const clear = useCallback(() => setAlert(AlertStatus.None), []);

  return (
    <AlertModalContext.Provider value={{ alert, alertText, setSuccess, setNotif, setError, clear }}>
      {children}
    </AlertModalContext.Provider>
  );
}

interface ModalProviderProps {
  children?: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  // ----- Search Modal -----
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const onSearchOpen = useCallback(() => setIsSearchOpen(true), []);
  const onSearchClose = useCallback(() => setIsSearchOpen(false), []);

  // ----- Cart Modal -----
  const [isCartOpen, setIsCartOpen] = useState(false);

  const onCartOpen = useCallback(() => setIsCartOpen(true), []);
  const onCartClose = useCallback(() => setIsCartOpen(false), []);

  return (
    <AlertModalProvider>
      <CartModalContext.Provider
        value={{
          isCartOpen,
          onCartOpen,
          onCartClose,
        }}
      >
        <SearchModalContext.Provider
          value={{
            isSearchOpen,
            onSearchOpen,
            onSearchClose,
            searchData,
            setSearchData,
          }}
        >
          {children}
        </SearchModalContext.Provider>
      </CartModalContext.Provider>
    </AlertModalProvider>
  );
}
