import Image from 'next/image';
import logo from '../../public/static/logo.png';

export default function Logo() {
  return (
    <div className="flex flex-row">
      <Image
        alt="logo"
        className="hidden md:block cursor-pointer"
        height="50"
        width="60"
        src={logo}
      />
      <p className="text-logo text-black font-medium">WorldHub</p>
    </div>
  );
}
