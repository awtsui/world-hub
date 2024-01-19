import { defaultEventColumns } from '@/components/admin/EventColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllEvents } from '@/lib/actions';
import { Event } from '@/lib/types';

export default async function AdminManageEventsPage() {
  const events = await getAllEvents();

  return (
    <div className="px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Events</p>
      </div>

      <div className="p-2">
        <DataTable columns={defaultEventColumns} data={events ?? []} />
      </div>
    </div>
  );
}
