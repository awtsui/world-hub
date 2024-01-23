'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import WorldcoinButton from '@/components/app/SignInWithWorldcoinButton';
import { Button } from '@/components/ui/button';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const guestCallbackUrl = `/auth/verify?callbackUrl=${callbackUrl}`;

  function handleGuestClick() {
    router.push(guestCallbackUrl);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-5">
        <WorldcoinButton callbackUrl={callbackUrl} label="Sign In with Worldcoin" />
        <p>OR</p>
        <Button onClick={handleGuestClick} className="text-lg px-16 py-6">
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}
