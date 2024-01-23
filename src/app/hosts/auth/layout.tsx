import HostAuthNavbar from '@/components/hosts/HostAuthNavbar';

export default async function HostsAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HostAuthNavbar />
      <div className="relative pt-16 h-screen">{children}</div>
    </>
  );
}
