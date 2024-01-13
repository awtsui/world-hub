import { MainCategory } from '@/types';

export const categories: Record<string, MainCategory> = {
  '1': {
    name: 'Concerts',
    id: '1',
    subCategories: [
      {
        name: 'EDM',
        id: '101',
      },
      {
        name: 'Pop',
        id: '102',
      },
      {
        name: 'Hip-Hop',
        id: '103',
      },
      {
        name: 'R&B',
        id: '104',
      },
    ],
  },
};

export const categoryIdToName: Record<string, string> = {
  '1': 'Concerts',
  '2': 'Sports',
  '3': 'Arts & Theatre',
  '4': 'Family',
};

export const subCategoryIdToName: Record<string, string> = {
  '101': 'EDM',
  '102': 'Pop',
  '103': 'Hip-Hop',
  '104': 'R&B',
};
