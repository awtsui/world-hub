'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchDialog } from '@/context/ModalContext';

export default function SearchMenu() {
  const { onSearchOpen } = useSearchDialog();

  return (
    <Button data-testid="search-menu-button" variant="outline" className="flex items-center" onClick={onSearchOpen}>
      <span className="text-md">Search WorldHub...</span>
      <SearchIcon className="h-5 w-5 ml-8" />
    </Button>
  );
}
