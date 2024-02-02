import EventViewDrawer from '@/components/app/EventViewDrawer';
import InfoViewSheet from '@/components/app/InfoViewSheet';
import ListenViewSheet from '@/components/app/ListenViewSheet';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getApprovedEventsByIds, getHostProfileById, getMediaById } from '@/lib/actions';
import Image from 'next/image';

interface HostPageParams {
  params: {
    hostId: string;
  };
}

export default async function HostPage({ params }: HostPageParams) {
  const hostProfile = await getHostProfileById(params.hostId);
  let events = await getApprovedEventsByIds(hostProfile.events);
  let media;
  if (hostProfile.mediaId) {
    media = await getMediaById(hostProfile.mediaId);
  }

  if (!hostProfile || !events) {
    return <div>Loading...</div>;
  }

  events.sort((a, b) => (new Date(a.datetime) < new Date(b.datetime) ? -1 : 1));

  return (
    <div className="flex flex-col h-full mx-auto w-full items-center">
      <div className="flex w-full justify-evenly flex-1 items-center">
        <div className="flex flex-col w-auto">
          <p className="text-8xl max-w-xl">{hostProfile.name}</p>
        </div>
        <div className="w-[500px] max-h-[700px]">
          <AspectRatio ratio={9 / 12}>
            <Image
              src={media ? media.url : '/placeholder.png'}
              alt={hostProfile.name}
              fill
              className="object-contain"
            />
          </AspectRatio>
        </div>
      </div>
      <div className="flex justify-evenly items-end w-full">
        <div className="mb-16">
          <InfoViewSheet hostProfile={hostProfile} label="More Info" />
        </div>
        <EventViewDrawer hostProfile={hostProfile} events={events} label="Upcoming Events" />
        <div className="mb-16">
          <ListenViewSheet hostProfile={hostProfile} label={`Listen to ${hostProfile.name}`} />
        </div>
      </div>
    </div>
  );
}
