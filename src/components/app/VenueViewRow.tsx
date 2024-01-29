'use client';

import { Venue } from '@/lib/types';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface VenueViewRowProps {
  venue: Venue;
}

export default function VenueViewRow({ venue }: VenueViewRowProps) {
  const router = useRouter();
  function onClick() {
    router.push(`/venue/${venue.venueId}`);
  }

  return (
    <div className="space-y-3 pt-3">
      <div className="flex w-full items-center px-4 py-2">
        <div className="flex flex-col flex-1 items-start">
          <p className="text-2xl">{venue.name}</p>
          <p className="text-slate-500">
            {venue.city}, {venue.state}
          </p>
        </div>
        <Button className="flex items-center" onClick={onClick}>
          <p>Browse venue</p>
          <ChevronRight className="w-5 h-5 ml-4" />
        </Button>
      </div>
      <hr />
    </div>
  );
}
