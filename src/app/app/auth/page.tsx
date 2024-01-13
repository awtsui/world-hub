'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const guestCallbackUrl =
    callbackUrl !== '/'
      ? `/auth/verify?callbackUrl=${callbackUrl}`
      : '/auth/verify';

  function handleGuestClick() {
    router.push(guestCallbackUrl);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Button
          onClick={() => signIn('worldcoin', { callbackUrl: callbackUrl })}
        >
          Sign In with Worldcoin
        </Button>
        <p>OR</p>
        <Button onClick={handleGuestClick}>Continue as Guest</Button>
      </div>
    </div>
  );
}
