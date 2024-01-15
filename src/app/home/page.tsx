import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="w-screen flex items-center justify-between">
      <div className="flex flex-col h-screen items-center justify-center pl-52">
        <p className="w-[500px] text-7xl text-center">
          EXPLORE THE MARKETPLACE FOR HUMANS
        </p>
        <div className="flex">
          <Link href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}>
            <Button>Explore</Button>
          </Link>
          <Link
            href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/auth/signin`}
          >
            <Button variant="secondary">Sign in</Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center h-screen pr-52">Image</div>
    </div>
  );
}
