'use client';

import { fetcher } from '@/lib/client/utils';
import { TicketWithHash } from '@/lib/types';
import { useQRCode } from 'next-qrcode';
import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';

interface TicketViewCardProps {
  ticket: TicketWithHash;
}

export default function TicketViewCard({ ticket }: TicketViewCardProps) {
  const { data: event, error: fetchEventError } = useSWR(
    `/api/events?id=${ticket.eventId}`,
    fetcher
  );

  const { Image } = useQRCode();

  return (
    <Card className="w-80 h-auto">
      <CardHeader className=" items-center">
        {event && (
          <>
            <CardTitle>{event[0].title}</CardTitle>
            <CardDescription>{ticket.label}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image
          text={ticket.hash}
          options={{
            type: 'image/jpeg',
            quality: 0.3,
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: '#00000000',
              light: '#FFFFFFFF',
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant={'outline'}>View as PDF</Button>
      </CardFooter>
    </Card>
  );
}
