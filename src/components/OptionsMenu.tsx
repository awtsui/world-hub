import Link from 'next/link';
import { Button } from './Button';
import { categories } from '@/data/marketplace';

export default function OptionsMenu() {
  return (
    <div className="flex items-center">
      <Link href="/marketplace">
        <Button variant="ghost" className="hover:font-black text-options">
          Home
        </Button>
      </Link>
      {Object.keys(categories).map((categoryId) => (
        <Link key={categoryId} href={`/marketplace/${categoryId}`}>
          <Button variant="ghost" className="hover:font-black text-options">
            Concerts
          </Button>
        </Link>
      ))}
    </div>
  );
}
