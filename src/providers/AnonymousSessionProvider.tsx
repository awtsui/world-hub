import { signIn, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function AnonymousSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('credentials').then((data) => {});
    }
  }, [status]);

  return <>{children}</>;
}
