'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardOptionsMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      color: 'text-sky-500',
      active: pathname === '/dashboard',
    },
    {
      label: 'Orders',
      href: '/dashboard/orders',
      color: 'text-sky-500',
      active: pathname === '/dashboard/orders',
    },
    {
      label: 'Events',
      href: '/dashboard/events',
      color: 'text-sky-500',
      active: pathname === '/dashboard/events',
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      color: 'text-sky-500',
      active: pathname === '/dashboard/users',
    },
    {
      label: 'Hosts',
      href: '/dashboard/hosts',
      color: 'text-sky-500',
      active: pathname === '/dashboard/hosts',
    },
    {
      label: 'Venues',
      href: '/dashboard/venues',
      color: 'text-gray-500',
      active: pathname === '/dashboard/venues',
    },
  ];
  return (
    <div
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-md font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
}
