import {
  UserColumnData,
  defaultUserColumns,
} from '@/components/admin/UserColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllUserProfiles, getAllUsers } from '@/lib/actions';

export default async function AdminManageUsersPage() {
  const users = await getAllUsers();
  const userProfiles = await getAllUserProfiles();

  const userData: UserColumnData[] = [];

  for (let i = 0; i < users.length; i++) {
    userData.push({
      id: users[i].userId,
      email: users[i].email,
      isVerified: users[i].isVerified ? 'Yes' : 'No',
      orders: userProfiles.find(
        (profile: any) => profile.userId === users[i].userId
      ).orders,
    });
  }

  return (
    <div className="container mx-auto px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Users</p>
      </div>
      <div className="p-2">
        <DataTable columns={defaultUserColumns} data={userData} />
      </div>
    </div>
  );
}
