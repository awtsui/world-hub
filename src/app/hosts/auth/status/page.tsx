'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { fetcher } from '@/lib/client/utils';
import { HostApprovalStatus } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

export default function HostApprovalStatusPage() {
  const searchParams = useSearchParams();
  const hostId = searchParams.get('id');
  const {
    data: accountData,
    isLoading,
    error,
  } = useSWR(hostId ? `/api/hosts/status?id=${hostId}` : '', fetcher);

  if ((accountData && accountData.error) || !accountData) {
    return <div>Account not found</div>;
  }

  return (
    <div className="w-screen h-screen">
      <div className="flex h-full justify-center items-center">
        <Card className="h-auto w-80">
          <CardHeader className="items-center">
            <CardTitle>Account Approval Status</CardTitle>
            <CardDescription>
              Please wait as we review your account request
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Label className="text-5xl">{accountData.approvalStatus}</Label>
          </CardContent>
          <CardFooter>
            <div className="mx-auto">
              {accountData.approvalStatus !== HostApprovalStatus.Approved ? (
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/marketplace`}
                >
                  <Button>Go to Marketplace</Button>
                </a>
              ) : (
                <Link href="/auth/signin">
                  <Button>Sign in</Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
