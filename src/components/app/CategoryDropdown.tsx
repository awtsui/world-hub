'use client';
import { categories, categoryIdToName } from '@/lib/data';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type CategoryDropdownProps = {
  categoryId: string;
};

export default function CategoryDropdown({ categoryId }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryInfo = categories[categoryId];

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center gap-1 border-white border-2 bg-slate-900 hover:bg-slate-500 ${
              isOpen && 'bg-slate-500'
            }`}
          >
            <p className="text-lg text-white">Categories</p>
            <ChevronDown color="white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={'start'} className="grid grid-cols-3 gap-3 bg-slate-900">
          {categoryInfo.subCategories.map((subcategory) => (
            <DropdownMenuItem key={subcategory.name} asChild className="text-md">
              <Link
                href={`/marketplace/${categoryId}/${subcategory.id}`}
                key={subcategory.id}
                className="text-white hover:underline"
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
