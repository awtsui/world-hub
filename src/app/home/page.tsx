import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative w-screen">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="/landingbg.jpg"
          alt="landing-bg"
          fill
          className="object-cover"
        />
      </AspectRatio>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="w-auto text-7xl text-center max-w-[500px]">
            EXPLORE THE MARKETPLACE FOR HUMANS
          </p>
          <a href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}>
            <Button className="px-12 py-5 text-lg">Explore</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
