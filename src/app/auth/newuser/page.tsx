import Link from 'next/link';
import { useEffect } from 'react';

export default function NewUserPage() {
  // Add user details to database

  return (
    <div className="flex flex-col">
      <p>Welcome to WorldHub!</p>
      <Link href="/">
        <button>Continue</button>
      </Link>
    </div>
  );
}
