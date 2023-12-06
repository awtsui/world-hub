import './globals.css';
import Navbar from '../components/Navbar';
import { Kanit } from 'next/font/google';
import ContextProviders from '@/modules/providers';
import NextAuthProvider from '../providers/NextAuthProvider';
import Alert from '../components/Alert';
import NavigationEvents from '../components/NavigationEvents';
import { Suspense } from 'react';

export const metadata = {
  title: 'WorldHub',
  description: 'World ID Marketplace',
};

const font = Kanit({
  subsets: ['latin'],
  weight: ['200'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ContextProviders>
          <NextAuthProvider>
            <Alert />
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
            <Navbar />
            <main>{children}</main>
          </NextAuthProvider>
        </ContextProviders>
      </body>
    </html>
  );
}
