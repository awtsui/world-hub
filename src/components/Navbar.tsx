import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import OptionsMenu from './OptionsMenu';
import CartButton from './CartButton';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-white w-full flex flex-row items-center justify-between px-12 py-2">
      <div className="flex gap-10">
        <Link href="/">
          <Logo />
        </Link>
        <OptionsMenu />
      </div>

      <div className="flex items-center gap-2">
        <Search />
        <UserMenu />
        <CartButton />
      </div>
    </div>
  );
}
