import AdminAuthNavbar from '@/components/admin/AdminAuthNavbar';

export default async function HostsAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminAuthNavbar />
      <div className="relative mt-20">{children}</div>
    </>
  );
}
