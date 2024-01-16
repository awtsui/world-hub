import AlertPopup from '@/components/Alert';
import { Toaster } from '@/components/ui/toaster';
import { AlertModalProvider } from '@/context/ModalContext';
import NextAuthProvider from '@/providers/NextAuthProvider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertModalProvider>
      <NextAuthProvider>
        <AlertPopup />
        {children}
        <Toaster />
      </NextAuthProvider>
    </AlertModalProvider>
  );
}
