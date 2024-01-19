import HostLogo from './HostLogo';
import HostDashboardOptionsMenu from './HostDashboardOptionsMenu';
import Link from 'next/link';
import HostDashboardMenu from './HostDashboardMenu';

export default function HostDashboardNavbar() {
  return (
    <nav className="border-b fixed w-full top-0 left-0 z-10 bg-white">
      <div className="flex h-16 items-center px-12">
        <Link href="/dashboard">
          <HostLogo />
        </Link>
        <HostDashboardOptionsMenu className="mx-6" />
        <div className="ml-auto">
          <HostDashboardMenu />
        </div>
      </div>
    </nav>
  );
}
