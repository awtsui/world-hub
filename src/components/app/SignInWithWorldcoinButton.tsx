'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';

interface WorldcoinButtonProps {
  callbackUrl: string;
  label: string;
}

export default function WorldcoinButton({
  callbackUrl,
  label,
}: WorldcoinButtonProps) {
  function onClick() {
    signIn('worldcoin', {
      callbackUrl,
    });
  }
  return (
    <Button
      onClick={onClick}
      variant={'outline'}
      className="bg-white text-black text-xl gap-5 py-6 px-6"
    >
      <Image
        src="/wld-logo.png"
        alt="World ID Logo"
        width={30}
        height={30}
        className="object-cover"
      />
      {label}
    </Button>
  );
}
