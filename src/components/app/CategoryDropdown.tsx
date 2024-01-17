'use client';
import { categories, categoryIdToName } from '@/lib/data';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type CategoryDropdownProps = {
  categoryId: string;
};

export default function CategoryDropdown({
  categoryId,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryInfo = categories[categoryId];

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1">
            <p className="text-lg">Categories</p>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="grid grid-cols-3 gap-3">
          {categoryInfo.subCategories.map((subcategory) => (
            <DropdownMenuItem key={subcategory.name} asChild>
              <Link
                href={`/marketplace/${categoryId}/${subcategory.id}`}
                key={subcategory.id}
                className="text-md hover:underline"
              >
                {subcategory.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
