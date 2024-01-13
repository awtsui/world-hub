'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function CreateEventButton() {
  const router = useRouter();
  function handleClick() {
    router.push('/dashboard/events/create');
  }
  return <Button onClick={handleClick}>Create new event</Button>;
}
