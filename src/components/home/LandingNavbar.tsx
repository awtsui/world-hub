import Link from 'next/link';
import AppLogo from '../app/AppLogo';
import LandingOptionsMenu from './LandingOptionsMenu';

export default function LandingNavbar() {
  return (
    <nav className="border-b fixed w-full top-0 left-0 z-10 bg-white">
      <div className="flex h-16 items-center px-12">
        <Link href="/">
          <AppLogo />
        </Link>
        <LandingOptionsMenu className="ml-auto" />
      </div>
    </nav>
  );
}
