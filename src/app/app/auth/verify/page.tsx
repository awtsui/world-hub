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

// TODO: add toasts for verification success and any errors

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const router = useRouter();
  const { setError, setSuccess } = useAlertDialog();

  async function verifyProof(proof: any) {
    try {
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
        throw Error(`Failed to verify proof: ${data.code}`);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to verify World ID', 3);
      router.push('/');
    }
  }
  async function onSuccess(data: ISuccessResult) {
    signIn('worldcoinguest', {
      id: data.nullifier_hash,
      verificationLevel: data.verification_level,
      callbackUrl,
    });
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
