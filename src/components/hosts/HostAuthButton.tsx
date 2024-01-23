'use client';

import { Plus, Settings, User } from 'lucide-react';
import AuthButton from '../AuthButton';
import { HostProfile, Media, MenuItem } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { fetcher } from '@/lib/client/utils';
import useSWR from 'swr';

interface HostAuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
}
const menuItems: MenuItem[] = [
  {
    icon: User,
    label: 'Profile',
    url: '/dashboard/settings?tab=profile',
  },
  {
    icon: Plus,
    label: 'Create new event',
    url: '/dashboard/events/create',
  },
  {
    icon: Settings,
    label: 'Settings',
    url: '/dashboard/settings',
  },
];

export default function HostAuthButton({ signInCallbackUrl, signOutCallbackUrl }: HostAuthButtonProps) {
  const { data: session } = useSession();
  const { data: hostProfile } = useSWR<HostProfile>(
    session && session.user ? `/api/hosts/profile?id=${session.user.id}` : '',
    fetcher,
  );
  const { data: media } = useSWR<Media>(
    hostProfile && hostProfile.mediaId ? `/api/medias?id=${hostProfile.mediaId}` : '',
    fetcher,
  );

  return (
    <AuthButton
      signInCallbackUrl={signInCallbackUrl}
      signOutCallbackUrl={signOutCallbackUrl}
      menuItems={menuItems}
      imageUrl={media ? media.url : ''}
    />
  );
}
