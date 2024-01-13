'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function ReturnButton() {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };
  return (
    <Button variant="outline" onClick={handleClick}>
      <ChevronLeft />
    </Button>
  );
}
