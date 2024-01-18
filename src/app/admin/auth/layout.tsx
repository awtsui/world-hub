import AdminAuthNavbar from '@/components/admin/AdminAuthNavbar';

export default async function HostsAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminAuthNavbar />
      <div className="relative pt-16 h-screen">{children}</div>
    </>
  );
}
