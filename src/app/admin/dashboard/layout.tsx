import AdminDashboardNavbar from '@/components/admin/AdminDashboardNavbar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminDashboardNavbar />
      <div className="relative pt-20">{children}</div>
    </>
  );
}
