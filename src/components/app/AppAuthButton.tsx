'use client';

import { Package, User } from 'lucide-react';
import AuthButton from '../AuthButton';
import { MenuItem } from '@/lib/types';

interface AppAuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
}
const menuItems: MenuItem[] = [
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

export default function AppAuthButton({ signInCallbackUrl, signOutCallbackUrl }: AppAuthButtonProps) {
  return (
    <AuthButton signInCallbackUrl={signInCallbackUrl} signOutCallbackUrl={signOutCallbackUrl} menuItems={menuItems} />
  );
}
