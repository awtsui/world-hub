import UserMenu from './UserMenu';
import OptionsMenu from './OptionsMenu';
import Link from 'next/link';
import AppLogo from './AppLogo';
import SearchMenu from './SearchMenu';

export default function AppNavbar() {
  return (
    <nav className="border-b fixed w-full z-10 top-0 left-0 bg-white">
      <div className="flex h-16 items-center px-4">
        <Link href="/marketplace">
          <AppLogo />
        </Link>
        <OptionsMenu className="mx-6" />
        <div className="ml-auto flex items-center gap-2">
          <SearchMenu />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
