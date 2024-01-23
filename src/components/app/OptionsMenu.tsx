'use client';

import Link from 'next/link';
import { categories } from '@/lib/data';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function OptionsMenu({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link
        href="/marketplace"
        className={cn(
          'text-md font-medium transition-colors hover:text-primary',
          pathname === '/marketplace' ? 'text-black dark:text-white' : 'text-muted-foreground',
        )}
      >
        Home
      </Link>
      {Object.values(categories).map((category) => (
        <Link
          key={category.id}
          href={`/marketplace/${category.id}`}
          className={cn(
            'text-md font-medium transition-colors hover:text-primary',
            pathname === `/marketplace/${category.id}` ? 'text-black dark:text-white' : 'text-muted-foreground',
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
