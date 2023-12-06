'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReturnButton() {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };
  return (
    <button onClick={handleClick}>
      <ChevronLeft />
    </button>
  );
}
