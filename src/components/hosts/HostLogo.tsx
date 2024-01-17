import Image from 'next/image';

export default function HostLogo() {
  return (
    <div className="flex flex-row items-center">
      <div className="relative w-8 h-8 mr-2">
        <Image
          alt="logo"
          className="hidden md:block cursor-pointer"
          fill
          src="/logo.png"
        />
      </div>

      <p className="text-3xl font-bold">WorldHub for Hosts</p>
    </div>
  );
}
