'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

export default function CreateEventButton() {
  const router = useRouter();
  function handleClick() {
    router.push('/dashboard/events/create');
  }
  return (
    <Button onClick={handleClick} className="gap-3">
      <PlusCircle className="h-5 w-5" /> <span>Create new event</span>
    </Button>
  );
}
