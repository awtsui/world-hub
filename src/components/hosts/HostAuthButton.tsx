'use client';

import { Plus, Settings, User } from 'lucide-react';
import AuthButton from '../AuthButton';
import { MenuItem } from '@/lib/types';

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

export default function HostAuthButton({
  signInCallbackUrl,
  signOutCallbackUrl,
}: HostAuthButtonProps) {
  return (
    <AuthButton
      signInCallbackUrl={signInCallbackUrl}
      signOutCallbackUrl={signOutCallbackUrl}
      menuItems={menuItems}
    />
  );
}
