import HostLandingNavbar from '@/components/hosts/HostLandingNavbar';

export default async function HostsLandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HostLandingNavbar />
      <div className="relative pt-16 h-screen">{children}</div>
    </>
  );
}
