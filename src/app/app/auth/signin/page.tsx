'use client';

import { useSearchParams } from 'next/navigation';
import SignInWithWorldcoinButton from '@/components/app/SignInWithWorldcoinButton';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  return (
    <div className="flex items-center justify-center h-full">
      <SignInWithWorldcoinButton
        callbackUrl={callbackUrl}
        label="Sign In with Worldcoin"
      />
    </div>
  );
}
