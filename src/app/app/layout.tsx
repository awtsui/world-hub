import AppNavbar from '../../components/app/AppNavbar';
import NextAuthProvider from '@/providers/NextAuthProvider';
import { Suspense } from 'react';
import NavigationEvents from '@/components/app/NavigationEvents';
import { CartProvider } from '@/context/CartContext';
import { ModalProvider } from '@/context/ModalContext';
import SearchDialog from '@/components/app/SearchDialog';
import CartSheet from '@/components/app/CartSheet';
import AlertPopup from '@/components/Alert';
import { Toaster } from '@/components/ui/toaster';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <CartProvider>
        <NextAuthProvider>
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>
          <SearchDialog />
          <CartSheet />
          <AlertPopup />
          <AppNavbar />
          <div className="relative mt-20">{children}</div>
          <Toaster />
        </NextAuthProvider>
      </CartProvider>
    </ModalProvider>
  );
}
