'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Logo() {
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <Image
        alt="logo"
        className="hidden md:block cursor-pointer"
        height="50"
        width="60"
        src="/images/logo.png"
      />
      <p className="text-logo text-black font-medium">WorldHub</p>
    </div>
  );
}
