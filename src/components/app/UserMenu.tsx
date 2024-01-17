'use client';
import { usePathname } from 'next/navigation';
import CartButton from './CartButton';
import AppAuthButton from './AppAuthButton';

export default function UserMenu() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <AppAuthButton signInCallbackUrl={pathname} />
      <CartButton />
    </div>
  );
}
