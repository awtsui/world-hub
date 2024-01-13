'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlertDialog } from '@/context/ModalContext';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  // const router = useRouter();
  // const { setError } = useAlertDialog();

  function handleSignInWithWorldId() {
    signIn('worldcoin', {
      callbackUrl: 'http:app.localhost:3000/' + callbackUrl,
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
