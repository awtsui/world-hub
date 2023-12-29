import Link from 'next/link';

export default function NewUserPage() {
  // TODO: Add user details to database

  return (
    <div className="flex flex-col">
      <p>Welcome to WorldHub!</p>
      <Link href="/">
        <button>Continue</button>
      </Link>
    </div>
  );
}
