'use client';
import { categories, categoryIdToName } from '@/data/marketplace';
import { MainCategory } from '@/types';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
      <button
        type="button"
        className="flex items-center"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg">Categories</p>
        <ChevronDown />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {categoryInfo.subCategories.map((subcategory) => (
              <Link
                href={`/marketplace/${categoryId}/${subcategory.id}`}
                key={subcategory.id}
              >
                <button
                  key={subcategory.id}
                  className="block px-4 py-2 text-md whitespace-nowrap text-gray-700 hover:underline hover:text-gray-900"
                  role="menuitem"
                >
                  {subcategory.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
