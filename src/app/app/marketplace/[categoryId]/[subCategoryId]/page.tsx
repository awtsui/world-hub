import { categoryIdToName, subCategoryIdToName } from '@/lib/data';
import EventCard from '@/components/app/EventCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';
import { getApprovedEventsBySubCategory } from '@/lib/actions';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

interface SubCategoryPageParams {
  params: {
    categoryId: string;
    subCategoryId: string;
  };
}

export default async function SubCategoryPage({ params }: SubCategoryPageParams) {
  // TODO: Organize events based on subcategory
  // Replace with data fetching
  const categoryName = categoryIdToName[params.categoryId];
  const subCategoryName = subCategoryIdToName[params.subCategoryId];

  let events: Event[] = await getApprovedEventsBySubCategory(subCategoryName);

  if (!events) {
    return <div>Loading...</div>;
  }

  events.sort((a, b) => (new Date(a.datetime) < new Date(b.datetime) ? -1 : 1));

  return (
    <div className="pb-12">
      <div className="relative">
        <AspectRatio ratio={3 / 1} className="w-full">
          <Image src="/homebg2.png" alt="category-bg" fill className="object-cover " />
        </AspectRatio>
        <div className="absolute top-10 left-14">
          <div className="flex items-center gap-3">
            <Link href={`/marketplace/${params.categoryId}`} className="text-3xl text-white">
              {categoryName}
            </Link>
            <ChevronRight color="white" className="w-5 h-5" />
            <p className="text-5xl font-bold text-white">{subCategoryName}</p>
          </div>
        </div>
      </div>
      <div className="px-12 py-8">
        <div className="flex flex-wrap gap-3">
          {events.length ? (
            events.map((event) => (
              <Link key={event.eventId} href={`/event/${event.eventId}`}>
                <EventCard key={event.eventId} event={event}></EventCard>
              </Link>
            ))
          ) : (
            <div>No Events</div>
          )}
        </div>
      </div>
    </div>
  );
}
