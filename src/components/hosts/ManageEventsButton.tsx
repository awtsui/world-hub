import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ManageEventsButton() {
  return (
    <Link href="/dashboard/events">
      <Button>Manage my Events</Button>
    </Link>
  );
}
