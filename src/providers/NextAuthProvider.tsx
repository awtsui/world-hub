'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import AnonymousSessionProvider from './AnonymousSessionProvider';

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
