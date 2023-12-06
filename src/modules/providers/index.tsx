'use client';
import { CartProvider } from '@/context/CartContext';
import { AlertProvider } from '@/context/AlertContext';

export default function ContextProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <AlertProvider>{children}</AlertProvider>
    </CartProvider>
  );
}
