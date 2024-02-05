import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getHeroHostProfile, getMediaById, getUpcomingEventByHostId, getVenueById } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { formatMonthAndDay } from '@/lib/client/utils';

export default async function MainHeroSection() {
  const hostProfile = await getHeroHostProfile();
  const event = await getUpcomingEventByHostId(hostProfile.hostId);
  const venue = await getVenueById(event.venueId);

  let media;
  if (hostProfile.mediaId) {
    media = await getMediaById(hostProfile.mediaId);
  }

  if (!hostProfile || !event || !venue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-slate-900">
      <div className="w-1/4 flex items-end justify-center">
        <div className="flex flex-col justify-between items-center px-12 pb-8 w-4/5 h-1/2 mb-8">
          <p className="text-white text-5xl">{hostProfile.name}</p>
          <div className="space-y-6">
            <p className="text-white mb-2">
              See you <span className="font-bold text-lg">{formatMonthAndDay(event.datetime)}</span> in{' '}
              <span className="text-lg">
                {venue.city}, {venue.state}
              </span>
            </p>
            <Link href={`/host/${hostProfile.hostId}`} className="text-lg w-full">
              <Button size="lg" variant="secondary" className="w-full">
                Find tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-3/4 py-6 px-3">
        <AspectRatio ratio={5 / 2}>
          <Image src={media ? media.url : '/placeholder.png'} alt="main-hero-image" fill className="object-cover" />
        </AspectRatio>
      </div>
    </div>
  );
}
