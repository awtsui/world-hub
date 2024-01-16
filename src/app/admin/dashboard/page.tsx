// Display any requests being made by users, hosts or venues
// The Admin website is going to provide any tools/analytics to provide real time service

import DashboardRequestSection from '@/components/admin/DashboardRequestSection';
import { getAllEvents } from '@/lib/actions';

export default async function AdminDashboardPage() {
  const events = await getAllEvents();

  return (
    <div className="px-12 py-4 w-full">
      <p className="text-3xl">Admin Dashboard</p>
      <div className="flex flex-col items-center">
        <div className="py-8">
          <DashboardRequestSection events={events} />
        </div>
      </div>
    </div>
  );
}
