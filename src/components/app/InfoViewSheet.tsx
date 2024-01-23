import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HostProfile } from '@/lib/types';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface InfoViewSheetProps {
  hostProfile: HostProfile;
  label: string;
}

export default function InfoViewSheet({ hostProfile, label }: InfoViewSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} className="hover:underline">
          <div className="flex gap-3 items-center">
            <p>{label}</p>
            <ChevronRight className="w-5 h-5" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription>{hostProfile.biography}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
