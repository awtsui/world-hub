import Big from 'big.js';
import { LucideIcon } from 'lucide-react';

export enum EventApprovalStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

export enum HostApprovalStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

export enum Currency {
  USD = 'USD',
}

export enum Role {
  user = 'user',
  admin = 'admin',
  host = 'host',
  operator = 'operator',
}

export enum AlertStatus {
  Success = 'SUCCESS',
  Notif = 'NOTIF',
  Error = 'ERROR',
  None = 'NONE',
}

export enum WorldIdVerificationLevel {
  Orb = 'orb',
  Device = 'device',
}

interface ITier {
  label: string;
  price: string;
  quantity: number;
  ticketsPurchased: number;
}

export interface IEvent {
  eventId: string;
  title: string;
  subTitle: string;
  hostId: string;
  category: string;
  subCategory: string;
  mediaId: string;
  datetime: string;
  currency: string;
  description: string;
  venueId: string;
  lineup: string[];
  purchaseLimit: number;
  ticketTiers: ITier[];
  approvalStatus: EventApprovalStatus;
  totalSold: number;
  verificationLevel: WorldIdVerificationLevel;
}

export interface IVenue {
  venueId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  parking: string[];
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface IUser {
  userId: string;
  email: string;
  isVerified: boolean;
}

export interface IUserProfile {
  userId: string;
  orders: string[];
}

interface ITicket {
  eventId: string;
  label: string;
}

interface ITicketWithData extends ITicket {
  eventTitle: string;
  price: string;
  currency: string;
  unitAmount: number;
}

export interface ITicketWithHash extends ITicket {
  hash: string;
  hasValidated: boolean;
  isExpired: boolean;
}

export interface IOrder {
  userId: string;
  isPaid: boolean;
  amount: number;
  totalPrice: string;
  ticketData: ITicketWithData[];
  email: string;
  timestamp: string;
  tickets: string[];
}
export interface IHost {
  hostId: string;
  name: string;
  email: string;
  password?: string;
  approvalStatus: HostApprovalStatus;
}

export interface IHostProfile {
  hostId: string;
  name: string;
  biography: string;
  mediaId: String;
  events: string[];
}

export interface IMedia {
  description: string;
  type: string;
  fileName: string;
  url: string;
}

export type Event = IEvent;
export type Venue = IVenue;
export type TicketWithData = ITicketWithData;
export type TicketWithHash = ITicketWithHash;
export type Tier = ITier;
export type Host = IHost;
export type HostProfile = IHostProfile;
export type Order = IOrder;
export type Media = IMedia;
export type UserProfile = IUserProfile;

type Category = {
  id: string;
  name: string;
};

export type SubCategory = Category;
export type MainCategory = Category & {
  subCategories: SubCategory[];
};

export type MenuItem = {
  icon: LucideIcon;
  label: string;
  url: string;
};

export type SearchResult = {
  events: Event[];
  venues: Venue[];
  hostProfiles: HostProfile[];
};

export type KeywordSearchResult = {
  resultType: string;
  value: string;
  id: string;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type AppConfig = {
  HOST_HASH_SALT: number;
  TICKET_HASH_SALT: number;
  ADMIN_HASH_SALT: number;
  TRENDING_EVENTS_LIMIT: number;
  TRENDING_EVENTS_BY_CATEGORY_LIMIT: number;
  TRENDING_EVENTS_BY_SUBCATEGORY_LIMIT: number;
  NEAR_DISTANCE_IN_MILES: number;
  HERO_HOST: string;
  CATEGORY_HERO_HOSTS: Record<string, string>;
  SUBCATEGORY_HERO_HOSTS: Record<string, string>;
};
