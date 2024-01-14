'use client';

import HostProfileTabs from '@/components/hosts/HostProfileTabs';
import { fetcher } from '@/lib/client/utils';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function HostDashboardSettingsPage() {
  const { data: session } = useSession();

  const { data: profileData } = useSWR(
    session?.user?.id ? `/api/hosts/profile?id=${session.user.id}` : '',
    fetcher
  );

  return (
    <div className="px-12 py-4">
      <p className="text-3xl">My Settings</p>
      <div className="flex justify-center">
        {profileData && <HostProfileTabs hostProfile={profileData} />}
      </div>
    </div>
  );
}
