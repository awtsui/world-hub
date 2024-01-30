'use client';

import { useSearchDialog } from '@/context/ModalContext';
import { Dialog, DialogContent } from '../ui/dialog';
import SearchSection from './SearchSection';

export default function SearchDialog() {
  const { isSearchOpen, onSearchClose } = useSearchDialog();

  return (
    <Dialog open={isSearchOpen} onOpenChange={onSearchClose} modal defaultOpen={isSearchOpen}>
      <DialogContent className="max-w-fit">
        <SearchSection />
      </DialogContent>
    </Dialog>
  );
}
