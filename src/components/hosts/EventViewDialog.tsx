'use client';
import { Event, Venue } from '@/lib/types';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { deleteEvent } from '@/lib/actions';
interface EventViewDialogProps {
  event: Event;
}
export default function EventViewDialog({ event }: EventViewDialogProps) {
  async function handleDeleteClick() {
    try {
      await deleteEvent(event.eventId);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
        </DialogHeader>
        <div>Body</div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Save changes
            </Button>
          </DialogClose>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="destructive">
                Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your event and remove your data from our
                servers.
              </DialogDescription>
              <div className="flex justify-evenly">
                <PopoverClose asChild>
                  <Button type="button">No</Button>
                </PopoverClose>
                <DialogClose asChild>
                  <PopoverClose asChild>
                    <Button onClick={() => handleDeleteClick()} type="button" variant="destructive">
                      Yes
                    </Button>
                  </PopoverClose>
                </DialogClose>
              </div>
            </PopoverContent>
          </Popover>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
