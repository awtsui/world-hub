'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchDialog } from '@/context/ModalContext';

export default function SearchMenu() {
  const { onSearchOpen } = useSearchDialog();

  return (
    <Button variant="outline" className="gap-5" onClick={onSearchOpen}>
      <span className="text-md">Search WorldHub...</span>
      <SearchIcon />
    </Button>
  );
}
