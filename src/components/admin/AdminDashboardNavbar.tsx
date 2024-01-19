import Link from 'next/link';
import AdminDashboardMenu from './AdminDashboardMenu';
import AdminDashboardOptionsMenu from './AdminDashboardOptionsMenu';
import AdminLogo from './AdminLogo';

export default function AdminDashboardNavbar() {
  return (
    <nav className="border-b fixed w-full top-0 left-0 z-10 bg-white">
      <div className="flex h-16 items-center px-12">
        <Link href="/dashboard">
          <AdminLogo />
        </Link>
        <AdminDashboardOptionsMenu className="mx-6" />
        <div className="ml-auto">
          <AdminDashboardMenu />
        </div>
      </div>
    </nav>
  );
}
