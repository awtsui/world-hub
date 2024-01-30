import { Metadata } from 'next';
import '../styles/global.css';
import { Kanit } from 'next/font/google';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import RootError from './error';
import Script from 'next/script';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <head>
        <Script
          id="places-autocomplete-script"
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBojZfA4vrwDiBxvE56DeyDxMJigyrL9HY&libraries=places&callback=initAutocomplete"
        ></Script>
        <Script id="places-autocomplete-callback-script">window.initAutocomplete = Function.prototype</Script>
      </head>
      <body>
        <ErrorBoundary errorComponent={RootError}>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
