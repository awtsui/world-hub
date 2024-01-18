import { Metadata } from 'next';
import './global.css';
import { Kanit } from 'next/font/google';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import RootError from './error';

export const metadata: Metadata = {
  title: 'WorldHub',
  description: 'World ID Marketplace',
  icons: {
    icon: '/favicon.png',
  },
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
    <html lang="en" className={font.className}>
      <body>
        <ErrorBoundary errorComponent={RootError}>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
