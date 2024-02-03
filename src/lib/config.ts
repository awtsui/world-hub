import { AppConfig } from './types';

export const config: AppConfig = {
  HOST_HASH_SALT: 12,
  TICKET_HASH_SALT: 12,
  ADMIN_HASH_SALT: 12,
  TRENDING_EVENTS_LIMIT: 10,
  TRENDING_EVENTS_BY_CATEGORY_LIMIT: 10,
  TRENDING_EVENTS_BY_SUBCATEGORY_LIMIT: 10,
  NEAR_DISTANCE_IN_MILES: 50,
  HERO_HOST: '1',
  CATEGORY_HERO_HOSTS: {
    '1': '018d33c2-4152-7e7d-9954-ca702acc1e12',
  },
  SUBCATEGORY_HERO_HOSTS: {
    '101': '018d33c2-4152-7e7d-9954-ca702acc1e12',
    '102': '018d33c2-4152-7e7d-9954-ca702acc1e12',
    '103': '1',
    '104': '1',
    '105': '1',
    '106': '018d68bd-15fa-7cdb-8fcf-13126102a1c8',
    '107': '018d68bd-15fa-7cdb-8fcf-13126102a1c8',
    '108': '018d68bd-15fa-7cdb-8fcf-13126102a1c8',
    '109': '018d68bd-15fa-7cdb-8fcf-13126102a1c8',
    '110': '018d33c2-4152-7e7d-9954-ca702acc1e12',
    '111': '018d33c2-4152-7e7d-9954-ca702acc1e12',
  },
};
