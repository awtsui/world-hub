'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function LandingOptionsMenu({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Home',
      href: '/',
      color: 'text-sky-500',
      active: pathname === '/',
    },
    {
      label: 'About',
      href: '/about',
      color: 'text-sky-500',
      active: pathname === '/about',
    },
    {
      label: 'Contact',
      href: '/contact',
      color: 'text-sky-500',
      active: pathname === '/contact',
    },
  ];
  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-md font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground',
          )}
        >
          {route.label}
        </Link>
      ))}
      <a href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/auth/signin`}>
        <Button>Sign In</Button>
      </a>
    </div>
  );
}
