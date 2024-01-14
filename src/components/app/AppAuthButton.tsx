'use client';

import { Settings, User } from 'lucide-react';
import AuthButton from '../AuthButton';

interface AppAuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
}
const menuItems = [
  {
    icon: User,
    label: 'Profile',
    url: '/account',
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
