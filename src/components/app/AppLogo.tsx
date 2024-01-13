import Image from 'next/image';

export default function AppLogo() {
  return (
    <div className="flex flex-row items-center">
      <div className="relative w-8 h-8 mr-4">
        <Image
          alt="logo"
          className="hidden md:block cursor-pointer"
          fill
          src="/logo.png"
        />
      </div>

      <p className="text-xl font-medium">WorldHub</p>
    </div>
  );
}
