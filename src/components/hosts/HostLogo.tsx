import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

export default function HostLogo() {
  return (
    <div className="w-[380px] h-auto">
      <AspectRatio ratio={6 / 1}>
        <Image
          alt="hostlogo"
          className="cursor-pointer object-cover"
          fill
          src="/hostlogo.png"
        />
      </AspectRatio>
    </div>
  );
}
