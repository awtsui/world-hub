import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Event, HostProfile } from '@/lib/types';
import { Button } from '../ui/button';
import EventsCarousel from '../EventsCarousel';
import { ChevronUp, X } from 'lucide-react';

interface EventsViewDrawerProps {
  hostProfile: HostProfile;
  events: Event[];
  label: string;
}

export default function EventViewDrawer({ events, label, hostProfile }: EventsViewDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" className="text-lg items-start h-40 py-4 px-8 rounded-b-none rounded-t-3xl">
          <div className="flex flex-col items-center">
            <ChevronUp className="h-8 w-8 mb-2" />
            <p> {label}</p>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto">
          <DrawerTitle className="text-center">{label}</DrawerTitle>
          <DrawerDescription className="text-center">Browse {hostProfile.name}&apos;s future shows</DrawerDescription>
        </DrawerHeader>
        <div className="px-16 pb-12">
          <EventsCarousel events={events} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
