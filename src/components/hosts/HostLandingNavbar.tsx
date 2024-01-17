import Link from 'next/link';
import HostLogo from './HostLogo';
import HostLandingMenu from './HostLandingMenu';

export default function HostLandingNavbar() {
  return (
    <nav className="border-b fixed w-full top-0 left-0 z-10 bg-white">
      <div className="flex h-16 items-center px-12">
        <Link href="/">
          <HostLogo />
        </Link>
        <div className="ml-auto">
          <HostLandingMenu />
        </div>
      </div>
    </nav>
  );
}
