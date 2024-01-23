'use client';

import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import UpdateUserAccountForm from './UpdateUserAccountForm';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface UserProfileTabsProps {
  user?: User | null;
  tab: string | null;
}

export default function UserProfileTabs({ user, tab }: UserProfileTabsProps) {
  const [tabValue, setTabValue] = useState(tab ?? 'profile');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (tab) {
      setTabValue(tab);
    }
  }, [tab]);

  const onTabChange = (value: string) => {
    setTabValue(value);
    router.push(`${pathname}?tab=${value}`);
  };

  return (
    <Tabs value={tabValue} onValueChange={onTabChange} defaultValue={tabValue} className="w-1/2">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">{user && <UpdateUserAccountForm user={user} />}</TabsContent>
      <TabsContent value="orders">
        <div>Orders Tab (Not implemented)</div>
      </TabsContent>
      <TabsContent value="notifications">
        <div>Notifications Tab (Not implemented)</div>
      </TabsContent>
    </Tabs>
  );
}
