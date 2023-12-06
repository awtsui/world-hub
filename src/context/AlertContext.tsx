import { AlertStatus } from '@/types';
import { createContext, useCallback, useContext, useState } from 'react';

interface AlertContext {
  alert: AlertStatus;
  alertText: string;
  setSuccess: (text: string, timeout: number) => void;
  setError: (text: string, timeout: number) => void;
  setNotif: (text: string, timeout: number) => void;
  clear: () => void;
}

const AlertContext = createContext<AlertContext | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === null) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children?: React.ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState(AlertStatus.None);
  const [alertText, setAlertText] = useState('');

  function createSetCallback(alertType: AlertStatus) {
    return useCallback((text: string, timeout: number) => {
      setAlertText(text);
      setAlert(alertType);
      setTimeout(() => {
        setAlert(AlertStatus.None);
      }, timeout * 1000 || 10000);
    }, []);
  }

  const setSuccess = createSetCallback(AlertStatus.Success);
  const setError = createSetCallback(AlertStatus.Error);
  const setNotif = createSetCallback(AlertStatus.Notif);
  const clear = useCallback(() => setAlert(AlertStatus.None), []);

  return (
    <AlertContext.Provider
      value={{ alert, alertText, setSuccess, setNotif, setError, clear }}
    >
      {children}
    </AlertContext.Provider>
  );
}
