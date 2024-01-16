'use client';
import { HostProfile } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import UpdateHostProfileForm from './UpdateHostProfileForm';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface HostProfileTabsProps {
  hostProfile: HostProfile;
  tab: string | null;
}

export default function HostProfileTabs({
  hostProfile,
  tab,
}: HostProfileTabsProps) {
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
    <Tabs
      value={tabValue}
      onValueChange={onTabChange}
      defaultValue="profile"
      className="w-1/2"
    >
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
