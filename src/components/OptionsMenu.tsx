import { Button } from './Button';

export default function OptionsMenu() {
  return (
    <div className="flex items-center">
      <a href="/marketplace">
        <Button variant="ghost" className="hover:font-black text-options">
          Marketplace
        </Button>
      </a>
      <a href="/vendors">
        <Button variant="ghost" className="hover:font-black text-options">
          Vendors
        </Button>
      </a>
    </div>
  );
}
