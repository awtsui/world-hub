import { HostProfile } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import UpdateHostProfileForm from './UpdateHostProfileForm';

interface HostProfileTabsProps {
  hostProfile: HostProfile;
}

export default function HostProfileTabs({ hostProfile }: HostProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-1/2">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateHostProfileForm hostProfile={hostProfile} />
      </TabsContent>
      <TabsContent value="notifications">
        <div>Notifications Tab (Not implemented)</div>
      </TabsContent>
    </Tabs>
  );
}
