'use client';
import { HostProfile } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import UpdateHostProfileForm from './UpdateHostProfileForm';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetcher } from '@/lib/client/utils';
import useSWR from 'swr';
import ProfilePictureDropdownMenu from './ProfilePictureDropdownMenu';
import ChangeProfilePictureDialog from './ChangeProfilePictureDialog';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: media } = useSWR(
    `/api/medias?id=${hostProfile.mediaId}`,
    fetcher
  );

  useEffect(() => {
    if (tab) {
      setTabValue(tab);
    }
  }, [tab]);

  const onTabChange = (value: string) => {
    setTabValue(value);
    router.push(`${pathname}?tab=${value}`);
  };

  if (!media) {
    return null;
  }

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
        <div className="pt-6">
          <ProfilePictureDropdownMenu
            media={media}
            setIsDialogOpen={setIsDialogOpen}
          />
          <ChangeProfilePictureDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            hostProfile={hostProfile}
          />
          <UpdateHostProfileForm hostProfile={hostProfile} />
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div>Notifications Tab (Not implemented)</div>
      </TabsContent>
    </Tabs>
  );
}
