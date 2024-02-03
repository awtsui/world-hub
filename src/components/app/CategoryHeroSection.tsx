import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  getCategoryHeroHostProfile,
  getHeroHostProfile,
  getMediaById,
  getUpcomingEventByHostId,
  getVenueById,
} from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

interface CategoryHeroSectionProps {
  categoryId: string;
  subcategoryId?: string;
}

export default async function CategoryHeroSection({ categoryId, subcategoryId }: CategoryHeroSectionProps) {
  const hostProfile = await getCategoryHeroHostProfile({ categoryId, subcategoryId });
  const event = await getUpcomingEventByHostId(hostProfile.hostId);
  const venue = await getVenueById(event.venueId);

  let media;
  if (hostProfile.mediaId) {
    media = await getMediaById(hostProfile.mediaId);
  }

  if (!hostProfile || !event || !venue) {
    return null;
  }

  return (
    <div className="flex bg-slate-900">
      <div className="w-1/4 flex items-end justify-center">
        <div className="flex flex-col items-center px-12 pb-8 mb-8 gap-12 w-4/5">
          <p className="text-white text-5xl whitespace-nowrap">{hostProfile.name}</p>
          <Button size="lg" variant="secondary" className="mt-2 w-full">
            <Link href={`/host/${hostProfile.hostId}`} className="text-lg">
              Find tickets
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-3/4 py-6 pr-3 pl-10">
        <AspectRatio ratio={5 / 2}>
          <Image
            src={media ? media.url : '/placeholder.png'}
            alt="subcategory-hero-image"
            fill
            className="object-cover"
          />
        </AspectRatio>
      </div>
    </div>
  );
}
