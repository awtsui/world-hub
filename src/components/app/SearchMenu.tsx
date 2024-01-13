'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchDialog } from '@/context/ModalContext';

export default function SearchMenu() {
  const { onSearchOpen } = useSearchDialog();

  return (
    <Button variant="outline" className="gap-3" onClick={onSearchOpen}>
      <p>Search for an event...</p>
      <SearchIcon />
    </Button>
  );
}
