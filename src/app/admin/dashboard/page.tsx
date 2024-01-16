// Display any requests being made by users, hosts or venues
// The Admin website is going to provide any tools/analytics to provide real time service

import DashboardRequestSection from '@/components/admin/DashboardRequestSection';

export default async function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-12 py-4">
      <div className="">
        <p className="text-3xl">Admin Dashboard</p>
      </div>
      <div className="p-2">
        <DashboardRequestSection />
      </div>
    </div>
  );
}
