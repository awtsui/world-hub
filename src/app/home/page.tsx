import Link from 'next/link';
import { Button } from '../../components/Button';

export default function LandingPage() {
  return (
    <div className="w-screen flex items-center justify-between">
      <div className="flex flex-col h-screen items-center justify-center pl-52">
        <div className="w-[500px] text-hero">
          EXPLORE THE MARKETPLACE FOR HUMANS
        </div>
        <div className="flex">
          <Link href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}>
            <Button className="px-[45px] rounded-lg gap-2.5 bg-neutral-900 justify-center items-center inline-flex">
              <p className="text-white">Explore</p>
            </Button>
          </Link>
          <Link href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/auth`}>
            <Button className="px-[45px] rounded-lg gap-2.5 bg-white justify-center items-center inline-flex">
              <p className="text-black">Register</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center h-screen pr-52">
        Image
      </div>
    </div>
  );
}
