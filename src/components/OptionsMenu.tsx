import Link from 'next/link';
import { Button } from './Button';

export default function OptionsMenu() {
  return (
    <div className="flex items-center">
      <Link href="/marketplace">
        <Button variant="ghost" className="hover:font-black text-options">
          Marketplace
        </Button>
      </Link>
      <Link href="/vendors">
        <Button variant="ghost" className="hover:font-black text-options">
          Vendors
        </Button>
      </Link>
    </div>
  );
}
