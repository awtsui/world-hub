import ReturnButton from '@/components/ReturnButton';
import EventForm from '@/components/hosts/EventForm';
import { Suspense } from 'react';

export default function CreateEventPage() {
  return (
    <div className="px-12 pt-4 pb-12 h-full">
      <p className="text-3xl">Create new event</p>
      <Suspense fallback={null}>
        <EventForm />
      </Suspense>
    </div>
  );
}
