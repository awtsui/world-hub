'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <p className="text-2xl">Something went wrong!</p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
