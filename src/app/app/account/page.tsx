'use client';

import UserProfileTabs from '@/components/app/UserProfileTabs';
import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="px-12 py-4">
      <p className="text-3xl">My Account</p>
      <div className="flex justify-center">
        {session && session.user && <UserProfileTabs user={session.user} />}
      </div>
    </div>
  );
}
