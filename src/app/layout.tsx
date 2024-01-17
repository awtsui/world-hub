import './global.css';
import { Kanit } from 'next/font/google';

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
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
