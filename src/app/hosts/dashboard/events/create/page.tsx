import ReturnButton from '@/components/ReturnButton';
import EventForm from '@/components/hosts/EventForm';
import { Suspense } from 'react';

export default function CreateEventPage() {
  return (
    <div className="px-12 py-4">
      <p className="text-3xl">Create an event</p>
      <Suspense fallback={null}>
        <EventForm />
      </Suspense>
    </div>
  );
}
