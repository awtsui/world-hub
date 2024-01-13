'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../../../../components/Button';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Button
          onClick={() => signIn('worldcoin', { callbackUrl: callbackUrl })}
        >
          Sign In with Worldcoin
        </Button>
      </div>
    </div>
  );
}
