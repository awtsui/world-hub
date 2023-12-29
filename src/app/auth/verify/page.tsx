'use client';
import { Button } from '@/components/Button';
import { Role } from '@/types';
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const router = useRouter();

  async function verifyProof(proof: any) {
    const resp = await fetch('/api/worldcoin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...proof,
        action: 'verifytransaction',
        signal: 'value',
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(`Failed to verify proof: ${data.code}`);
    }
  }
  async function onSuccess(data: ISuccessResult) {
    // TODO: Check if user has purchased this event ticket before
    // Send user to checkout page if new
    // Send user to home page with error alert if duplicate
    await signIn('anonymous', {
      credentials: { id: data.nullifier_hash },
      callbackUrl,
    });

    // if (session && session.user) {
    //   await update({
    //     ...session,
    //     user: {
    //       ...session.user,
    //       id: data.nullifier_hash,
    //       role: Role.user,
    //     },
    //   });
    // }
    // router.push(callbackUrl);
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WLD_CLIENT_ID!}
        action="verifytransaction"
        signal="value"
        onSuccess={onSuccess}
        handleVerify={verifyProof}
        enableTelemetry
      >
        {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
      </IDKitWidget>
    </div>
  );
}
