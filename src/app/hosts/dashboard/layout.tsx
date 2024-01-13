import HostDashboardNavbar from '@/components/hosts/HostDashboardNavbar';

export default async function HostsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HostDashboardNavbar />
      <div className="relative mt-20">{children}</div>
    </>
  );
}
