import HostDashboardNavbar from '@/components/hosts/HostDashboardNavbar';

export default async function HostsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HostDashboardNavbar />
      <div className="relative pt-20 h-screen">{children}</div>
    </>
  );
}
