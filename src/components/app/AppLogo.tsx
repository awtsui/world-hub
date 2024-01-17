import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

export default function AppLogo() {
  return (
    <div className="w-[200px] h-auto">
      <AspectRatio ratio={7 / 2}>
        <Image
          alt="logo"
          className="cursor-pointer object-cover"
          fill
          src="/logo.png"
        />
      </AspectRatio>
    </div>
  );
}
