'use client';

import UserProfileTabs from '@/components/app/UserProfileTabs';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function AccountPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab');

  if (!session || !session.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-12 py-4">
      <p className="text-3xl">My Account</p>
      <div className="flex justify-center">
        <UserProfileTabs user={session.user} tab={tab} />
      </div>
    </div>
  );
}
