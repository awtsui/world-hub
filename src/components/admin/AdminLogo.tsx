import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

export default function AdminLogo() {
  return (
    <div className="w-[380px] h-auto">
      <AspectRatio ratio={6 / 1}>
        <Image
          alt="adminlogo"
          className="cursor-pointer object-cover"
          fill
          src="/adminlogo.png"
        />
      </AspectRatio>
    </div>
  );
}
