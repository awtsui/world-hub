import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="w-3/5 h-full mx-auto flex gap-5 md:gap-20 lg:gap-36 justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="w-auto text-7xl text-center max-w-[500px]">
          EXPLORE THE MARKETPLACE FOR HUMANS
        </p>
        <div className="flex gap-2">
          <a href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}>
            <Button className="px-10">Explore</Button>
          </a>
        </div>
      </div>
      <div className="flex items-center w-auto">Image</div>
    </div>
  );
}
