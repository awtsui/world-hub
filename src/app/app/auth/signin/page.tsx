'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  function handleSignInWithWorldId() {
    signIn('worldcoin', {
      callbackUrl: `http://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${callbackUrl}`,
    });
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Button onClick={handleSignInWithWorldId}>
          Sign In with Worldcoin
        </Button>
      </div>
    </div>
  );
}
