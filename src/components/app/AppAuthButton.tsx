'use client';

import { Package, User } from 'lucide-react';
import AuthButton from '../AuthButton';

interface AppAuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
}
const menuItems = [
  {
    icon: User,
    label: 'Profile',
    url: '/account?tab=profile',
  },
  {
    icon: Package,
    label: 'Orders',
    url: '/account?tab=orders',
  },
];

export default function AppAuthButton({
  signInCallbackUrl,
  signOutCallbackUrl,
}: AppAuthButtonProps) {
  return (
    <AuthButton
      signInCallbackUrl={signInCallbackUrl}
      signOutCallbackUrl={signOutCallbackUrl}
      menuItems={menuItems}
    />
  );
}
