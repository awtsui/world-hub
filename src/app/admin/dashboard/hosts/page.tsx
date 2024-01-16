import {
  HostColumnData,
  defaultHostColumns,
} from '@/components/admin/HostColumns';
import { DataTable } from '@/components/ui/data-table';
import { getAllHostProfiles, getAllHosts } from '@/lib/actions';

export default async function AdminManageHostsPage() {
  const hosts = await getAllHosts();
  const hostProfiles = await getAllHostProfiles();

  let hostData: HostColumnData[] = [];

  for (let i = 0; i < hosts.length; i++) {
    const corrHostProfile = hostProfiles.find(
      (profile: any) => profile.hostId === hosts[i].hostId
    );
    hostData.push({
      id: hosts[i].hostId,
      name: hosts[i].name,
      email: hosts[i].email,
      biography: corrHostProfile.biography,
      events: corrHostProfile.events,
      approvalStatus: hosts[i].approvalStatus,
    });
  }

  return (
    <div className="px-12 py-4">
      <div className="">
        <p className="text-3xl">Manage Hosts</p>
      </div>

      <div className="p-2">
        <DataTable columns={defaultHostColumns} data={hostData} />
      </div>
    </div>
  );
}
