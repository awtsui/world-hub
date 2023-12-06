import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './Button';
import Avatar from './Avatar';

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div className="flex">
      {session ? (
        <div>
          <Button variant="ghost" onClick={() => signOut()}>
            <Avatar />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </div>
  );
}
