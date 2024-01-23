'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function HostDashboardOptionsMenu({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      color: 'text-sky-500',
      active: pathname === '/dashboard',
    },
    {
      label: 'Events',
      href: '/dashboard/events',
      color: 'text-sky-500',
      active: pathname === '/dashboard/events',
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      color: 'text-sky-500',
      active: pathname === '/dashboard/analytics',
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      color: 'text-gray-500',
      active: pathname === '/dashboard/settings',
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
    </div>
  );
}
