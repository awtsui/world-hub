'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Event, Venue } from '@/lib/types';
import { Button } from '../ui/button';
import Image from 'next/image';
import DateFormatter from '../DateFormatter';
import { HTMLAttributes, useEffect, useState } from 'react';
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
import { useAlertDialog } from '@/context/ModalContext';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/client/utils';

interface EventViewCardProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

export default function EventViewCard({ event, ...props }: EventViewCardProps) {
  const { setSuccess, setError } = useAlertDialog();
  const router = useRouter();
  const pathname = usePathname();

  const { data: venueData } = useSWR(
    `/api/venues?id=${event.venueId}`,
    fetcher
  );

  async function handleDeleteClick() {
    try {
      fetch(`/api/events?id=${event.eventId}`, {
        method: 'DELETE',
      })
        .then((resp) => resp.json())
        .then((data) => {
          router.push(pathname);
          router.refresh();
          setSuccess('Event successfully deleted', 3);
        });
    } catch (error) {
      setError(JSON.stringify(error), 3);
    }
  }

  return (
    <Card {...props} className="w-80 h-auto">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        {venueData && (
          <CardDescription>
            {venueData.city}, {venueData.state} - {venueData.name}
          </CardDescription>
        )}
        <CardDescription>
          <DateFormatter date={new Date(event.datetime)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          layout="responsive"
          objectFit="cover"
          className="w-auto h-auto"
          width={1}
          height={1}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <a
          target="_blank"
          href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/event/${event.eventId}`}
          rel="noopener noreferrer"
        >
          <Button variant="outline">View in Marketplace</Button>
        </a>
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
                    This action cannot be undone. This will permanently delete
                    your event and remove your data from our servers.
                  </DialogDescription>
                  <div className="flex justify-evenly">
                    <PopoverClose asChild>
                      <Button type="button">No</Button>
                    </PopoverClose>
                    <DialogClose asChild>
                      <PopoverClose asChild>
                        <Button
                          onClick={() => handleDeleteClick()}
                          type="button"
                          variant="destructive"
                        >
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
      </CardFooter>
    </Card>
  );
}