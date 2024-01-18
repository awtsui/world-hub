import { defaultVenueColumns } from '@/components/admin/VenueColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllVenues } from '@/lib/actions';

export default async function AdminManageVenuesPage() {
  const venues = await getAllVenues();

  return (
    <div className="px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Venues</p>
      </div>

      <div className="p-2">
        <DataTable columns={defaultVenueColumns} data={venues ?? []} />
      </div>
    </div>
  );
}
