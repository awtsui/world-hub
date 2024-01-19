import Link from 'next/link';
import AdminLogo from './AdminLogo';

export default function AdminAuthNavbar() {
  return (
    <nav className="border-b fixed w-full top-0 left-0 z-10 bg-white">
      <div className="flex h-16 items-center px-12">
        <Link href="/">
          <AdminLogo />
        </Link>
      </div>
    </nav>
  );
}
