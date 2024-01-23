import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HostProfile } from '@/lib/types';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

interface ListenViewSheetProps {
  hostProfile: HostProfile;
  label: string;
}

export default function ListenViewSheet({ hostProfile, label }: ListenViewSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} className="hover:underline">
          <div className="flex gap-3 items-center">
            <ChevronLeft className="w-5 h-5" />
            <p>{label}</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side={'right'}>
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription>TODO: List popular songs</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
