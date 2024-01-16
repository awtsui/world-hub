import {
  EventColumnData,
  defaultEventColumns,
} from '@/components/admin/EventColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllEvents } from '@/lib/actions';

export default async function AdminManageEventsPage() {
  const events = await getAllEvents();

  const eventsIsFetched: boolean = events && !!events.length;
  const eventData: EventColumnData[] = eventsIsFetched
    ? events.map((event: any) => {
        const { eventId, ...rest } = event;
        return {
          ...rest,
          id: event.eventId,
        };
      })
    : [];

  return (
    <div className="container mx-auto px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Events</p>
      </div>

      <div className="p-2">
        <DataTable columns={defaultEventColumns} data={eventData} />
      </div>
    </div>
  );
}
