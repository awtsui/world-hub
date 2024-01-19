import AdminAuthButton from './AdminAuthButton';

export const revalidate = 0;

export default function AdminDashboardMenu() {
  return (
    <div className="flex items-center gap-2">
      <AdminAuthButton />
    </div>
  );
}
