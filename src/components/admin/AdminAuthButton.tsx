'use client';

import { Settings, User } from 'lucide-react';
import AuthButton from '../AuthButton';

interface AdminAuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
}
const menuItems = [
  {
    icon: User,
    label: 'Profile',
    url: '/dashboard/settings',
  },
  {
    icon: Settings,
    label: 'Settings',
    url: '/dashboard/settings',
  },
];

export default function AdminAuthButton({
  signInCallbackUrl,
  signOutCallbackUrl,
}: AdminAuthButtonProps) {
  return (
    <AuthButton
      signInCallbackUrl={signInCallbackUrl}
      signOutCallbackUrl={signOutCallbackUrl}
      menuItems={menuItems}
    />
  );
}
