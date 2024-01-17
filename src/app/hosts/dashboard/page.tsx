'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetcher } from '@/lib/client/utils';
import DashboardAnalyticsSection from '@/components/hosts/DashboardAnalyticsSection';

// TODO: use useSWR to fetch event and profile data

export default function HostDashboardPage() {
  const { data: session } = useSession();
  const { data: profileData } = useSWR(
    session?.user?.id ? `/api/hosts/profile?id=${session.user.id}` : '',
    fetcher
  );

  const fetchEventsUrl =
    profileData && profileData.events.length
      ? `/api/events?${profileData.events
          .map((eventId: any) => `id=${eventId}`)
          .join('&')}`
      : '';

  const { data: events } = useSWR(fetchEventsUrl, fetcher, {
    fallbackData: [],
  });

  return (
    <>
      <div className="px-12 py-4">
        <p className="text-3xl">My Dashboard</p>
        <div className="flex py-10">
          <div className="flex flex-col w-full">
            {/* <UpcomingEventsCarousel events={events} /> */}
            <div>Dashboard Feed</div>
          </div>
          <div className="flex flex-col ml-auto w-1/3">
            <DashboardAnalyticsSection
              hostProfile={profileData}
              events={events}
            />
          </div>
        </div>
      </div>
    </>
  );
}
