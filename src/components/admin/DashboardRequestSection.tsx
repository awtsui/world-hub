// Display count of unaddressed requests for new events, new host accounts, new venues, and any bug alerts

import { Event, Host } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import Link from 'next/link';
import { Button } from '../ui/button';

interface DashboardRequestSectionProps {
  events: Event[];
  hosts: Host[];
}

export default function DashboardRequestSection({ events, hosts }: DashboardRequestSectionProps) {
  const eventRequests = events.reduce((total, event) => (event.approvalStatus === 'PENDING' ? total + 1 : total), 0);
  const hostAccountRequests = hosts.reduce((total, host) => (host.approvalStatus === 'PENDING' ? total + 1 : total), 0);
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex gap-5">
        <Card className="w-[250px] h-auto">
          <CardHeader className="items-center">
            <CardTitle>New Events</CardTitle>
            <CardDescription>Approve or reject new events</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Label className="text-6xl text-center">{eventRequests}</Label>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/dashboard/events">
              <Button>Manage Events</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="w-[250px] h-auto">
          <CardHeader className="items-center">
            <CardTitle>New Hosts</CardTitle>
            <CardDescription>Approve or reject new hosts</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Label className="text-6xl text-center">{hostAccountRequests}</Label>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/dashboard/hosts">
              <Button>Manage Hosts</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="flex gap-5">
        <Card className="w-[250px] h-auto">
          <CardHeader className="items-center">
            <CardTitle>New Venues</CardTitle>
            <CardDescription>Approve or reject new venues</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Label className="text-6xl text-center">TODO</Label>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/dashboard/venues">
              <Button>Manage Venues</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="w-[250px] h-auto">
          <CardHeader className="items-center">
            <CardTitle>Unresolved Bugs</CardTitle>
            <CardDescription>List of reported bugs</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Label className="text-6xl text-center">TODO</Label>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/dashboard/events">
              <Button>Manage Bugs</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
