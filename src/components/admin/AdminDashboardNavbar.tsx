import Link from 'next/link';
import AuthLogo from './AuthLogo';
import AdminDashboardMenu from './AdminDashboardMenu';
import AdminDashboardOptionsMenu from './AdminDashboardOptionsMenu';

export default function AdminDashboardNavbar() {
  return (
    <nav className="border-b fixed w-full top-0 left-0 z-10 bg-white">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard">
          <AuthLogo />
        </Link>
        <AdminDashboardOptionsMenu className="mx-6" />
        <div className="ml-auto">
          <AdminDashboardMenu />
        </div>
      </div>
    </nav>
  );
}
