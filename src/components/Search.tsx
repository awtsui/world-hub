'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Button } from './Button';

export default function Search() {
  // TODO: Add search box element
  return (
    <form className="flex items-center justify-center relative p-2.5">
      <input type="text" placeholder="Search for an event..." />
      <Button variant="ghost">
        <SearchIcon />
      </Button>
    </form>
  );
}
