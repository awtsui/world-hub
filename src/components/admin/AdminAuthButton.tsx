'use client';

import { LucideIcon, Settings, User } from 'lucide-react';
import AuthButton from '../AuthButton';
import { MenuItem } from '@/lib/types';

interface AdminAuthButtonProps {
  signInCallbackUrl?: string;
  signOutCallbackUrl?: string;
}

const menuItems: MenuItem[] = [];

export default function AdminAuthButton({ signInCallbackUrl, signOutCallbackUrl }: AdminAuthButtonProps) {
  return (
    <AuthButton signInCallbackUrl={signInCallbackUrl} signOutCallbackUrl={signOutCallbackUrl} menuItems={menuItems} />
  );
}
