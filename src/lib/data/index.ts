import { MainCategory } from '@/lib/types';

export const categoryIdToName: Record<string, string> = {
  '1': 'Concerts',
};

export const subCategoryIdToName: Record<string, string> = {
  '101': 'EDM',
  '102': 'Pop',
  '103': 'Hip-Hop',
  '104': 'R&B',
  '105': 'Country',
  '106': 'Jazz',
  '107': 'Rock',
  '108': 'Reggae',
  '109': 'Classical',
  '110': 'House',
  '111': 'Indie',
};

type CategoryKeyEnum<T> = { [P in keyof Required<T>]: MainCategory };

export const categories: CategoryKeyEnum<typeof categoryIdToName> = {
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
        name: 'Hip Hop',
        id: '103',
      },
      {
        name: 'R&B',
        id: '104',
      },
      {
        name: 'Country',
        id: '105',
      },
      {
        name: 'Jazz',
        id: '106',
      },
      {
        name: 'Rock',
        id: '107',
      },
      {
        name: 'Reggae',
        id: '108',
      },
      {
        name: 'Classical',
        id: '109',
      },
      {
        name: 'House',
        id: '110',
      },
      {
        name: 'Indie',
        id: '111',
      },
    ],
  },
};
