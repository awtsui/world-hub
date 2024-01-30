'use client';

import { HostProfile } from '@/lib/types';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HostViewRowProps {
  hostProfile: HostProfile;
}

export default function HostViewRow({ hostProfile }: HostViewRowProps) {
  const router = useRouter();
  function onClick() {
    router.push(`/host/${hostProfile.hostId}`);
  }

  return (
    <div className="space-y-3 pt-3">
      <div className="flex w-full items-center px-4 py-3">
        <p className="flex-1 text-2xl">{hostProfile.name}</p>
        <Button className="flex items-center" onClick={onClick}>
          <p>Visit profile</p>
          <ChevronRight className="w-5 h-5 ml-4" />
        </Button>
      </div>
      <hr />
    </div>
  );
}
