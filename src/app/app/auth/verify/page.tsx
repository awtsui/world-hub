'use client';
import { Button } from '@/components/ui/button';
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from '@worldcoin/idkit';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAlertDialog } from '@/context/ModalContext';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const router = useRouter();
  const { setError, setSuccess } = useAlertDialog();

  async function verifyProof(proof: any) {
    const resp = await fetch('/api/worldcoin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...proof,
        action: 'verifytransaction',
        signal: 'verify',
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
    try {
      const resp = await signIn('anonymous', {
        redirect: false,
        id: data.nullifier_hash,
      });
      if (!resp) {
        setError('Failed to verify World ID', 3);
      } else {
        if (!resp.ok) {
          setError('Bad verification!', 3);
        }
        setSuccess('Successfully verified with World ID!', 3);
        router.push(callbackUrl);
      }
    } catch (error) {
      setError(JSON.stringify(error), 3);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <IDKitWidget
        app_id={`app_${process.env.NEXT_PUBLIC_WLD_CLIENT_ID!}`}
        action="verifytransaction"
        signal="verify"
        onSuccess={onSuccess}
        handleVerify={verifyProof}
        verification_level={VerificationLevel.Device}
      >
        {({ open }) => <Button onClick={open}>Verify with World ID</Button>}
      </IDKitWidget>
    </div>
  );
}