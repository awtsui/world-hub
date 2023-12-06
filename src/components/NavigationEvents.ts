'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAlert } from '../context/AlertContext';

export default function NavigationEvents() {
  const { setSuccess } = useAlert();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { data: session, update } = useSession();

  async function handleUpdateUser() {
    if (session && session.user?.provider === 'credentials') {
      await update({
        ...session,
        user: {
          ...session?.user,
          id: session?.user?.name,
          role: 'guest',
        },
      });
    }
    console.log('updated: ' + session?.user);
  }

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    if (isCheckingOut && !pathname.startsWith('/checkout/success')) {
      // Removes user permissions if guest and verified
      handleUpdateUser();
      setIsCheckingOut(false);
    }
    if (
      pathname.startsWith('/checkout/success') &&
      searchParams.get('sessionId')?.startsWith('cs_')
    ) {
      setSuccess('Checkout successful!', 3);
      setIsCheckingOut(true);
    }
  }, [pathname, searchParams]);

  return null;
}
