'use client';

import Image from 'next/image';

export default function Avatar() {
  return (
    <Image
      className="rouded-full"
      height="30"
      width="30"
      src="/images/placeholder.png"
      alt="Avatar"
    />
  );
}
