import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import UpdateUserAccountForm from './UpdateUserAccountForm';
import { User } from 'next-auth';

interface UserProfileTabsProps {
  user: User;
}

export default function UserProfileTabs({ user }: UserProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-1/2">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateUserAccountForm user={user} />
      </TabsContent>
      <TabsContent value="notifications">
        <div>Notifications Tab (Not implemented)</div>
      </TabsContent>
    </Tabs>
  );
}
