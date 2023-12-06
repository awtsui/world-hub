'use client';

import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import OptionsMenu from './OptionsMenu';
import { useState } from 'react';
import ShoppingCartSlider from './ShoppingCartSlider';
import Link from 'next/link';

export default function Navbar() {
  const [cartSliderIsOpen, setCartSliderIsOpen] = useState<boolean>(false);
  return (
    <div className="sticky top-0 z-50 bg-white w-full flex flex-row items-center justify-between px-12 py-2">
      <div className="flex gap-10">
        <Link href="/">
          <Logo />
        </Link>
        <OptionsMenu />
      </div>

      <div className="flex items-center gap-2">
        <Search />
        <UserMenu />
        <ShoppingCartSlider
          open={cartSliderIsOpen}
          setCartSliderIsOpen={setCartSliderIsOpen}
        />
      </div>
    </div>
  );
}
