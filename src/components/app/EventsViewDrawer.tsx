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

export default function EventsViewDrawer({
  events,
  label,
  hostProfile,
}: EventsViewDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" className="text-lg" size={'lg'}>
          {label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto">
          <DrawerTitle className="text-center">{label}</DrawerTitle>
          <DrawerDescription className="text-center">
            Explore {hostProfile.name}'s future shows
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-16 pb-12">
          <EventsCarousel events={events} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
