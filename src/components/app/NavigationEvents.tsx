'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    function handleUserSession() {
      // Sign out user if "continue as guest"
      if (session && session.user?.provider === 'worldcoinguest') {
        signOut({ redirect: false });
      }
    }

    const url = `${pathname}?${searchParams}`;

    if (isCheckingOut && !pathname.startsWith('/checkout/success')) {
      // Removes user permissions if guest and verified
      handleUserSession();
      setIsCheckingOut(false);
    }
    if (pathname.startsWith('/checkout/success') && searchParams.get('sessionId')?.startsWith('cs_')) {
      setIsCheckingOut(true);
    }
  }, [pathname, searchParams, isCheckingOut, session]);

  return null;
}
