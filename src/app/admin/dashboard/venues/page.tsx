import {
  VenueColumnData,
  defaultVenueColumns,
} from '@/components/admin/VenueColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllVenues } from '@/lib/actions';

export default async function AdminManageVenuesPage() {
  const venues = await getAllVenues();

  const venuesIsFetched: boolean = venues && !!venues.length;
  const venueData: VenueColumnData[] = venuesIsFetched
    ? venues.map((venue: any) => {
        const { venueId, ...rest } = venue;
        return {
          ...rest,
          id: venueId,
        };
      })
    : [];

  return (
    <div className="px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Venues</p>
      </div>

      <div className="p-2">
        <DataTable columns={defaultVenueColumns} data={venueData} />
      </div>
    </div>
  );
}
