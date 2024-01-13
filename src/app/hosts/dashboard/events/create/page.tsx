import ReturnButton from '@/components/ReturnButton';
import EventForm from '@/components/hosts/EventForm';

export default function CreateEventPage() {
  return (
    <div className="px-12 py-4">
      <ReturnButton />
      <p className="text-3xl">Create an event</p>
      <EventForm />
    </div>
  );
}
