import EventsViewDrawer from '@/components/app/EventsViewDrawer';
import InfoViewSheet from '@/components/app/InfoViewSheet';
import ListenViewSheet from '@/components/app/ListenViewSheet';
import { getEventsByIds, getHostProfileById } from '@/lib/actions';
import { Suspense } from 'react';

type HostPageParams = {
  params: {
    hostId: string;
  };
};

export default async function HostPage({ params }: HostPageParams) {
  const hostProfile = await getHostProfileById(params.hostId);
  const events = await getEventsByIds(hostProfile.events);

  if (!hostProfile || !events) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full mx-auto w-full py-4 items-center">
      <div className="flex w-full justify-evenly flex-1 items-center">
        <div className="flex flex-col w-auto">
          <p className="text-8xl">{hostProfile.name}</p>
        </div>
        <div className="w-auto">Host Profile Image</div>
      </div>
      <div className="flex pb-16 justify-evenly w-full">
        <InfoViewSheet hostProfile={hostProfile} label="More Info" />
        <Suspense fallback={null}>
          <EventsViewDrawer
            hostProfile={hostProfile}
            events={events}
            label="Upcoming Events"
          />
        </Suspense>
        <ListenViewSheet
          hostProfile={hostProfile}
          label={`Listen to ${hostProfile.name}`}
        />
      </div>
    </div>
  );
}
