'use client';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Category = {
  id: string;
  name: string;
};

type CategoryDropdownProps = {
  categories: Category[];
};

export default function CategoryDropdown({
  categories,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="flex justify-center w-full"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          Options
          <ChevronDown />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {categories.map((category) => (
              <Link
                href={`/marketplace/category/${category.id}`}
                key={category.id}
              >
                <button
                  key={category.id}
                  className="block px-4 py-2 text-sm whitespace-nowrap text-gray-700 hover:underline hover:text-gray-900"
                  role="menuitem"
                >
                  {category.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
