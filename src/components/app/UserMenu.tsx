'use client';
import { usePathname } from 'next/navigation';
import AuthButton from '../AuthButton';
import CartButton from './CartButton';

// import SessionPoke from '../SessionPoke';

export default function UserMenu() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <AuthButton signInCallbackUrl={pathname} />
      <CartButton />
      {/* <SessionPoke /> */}
    </div>
  );
}
