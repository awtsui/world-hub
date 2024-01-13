import Big from 'big.js';

// Interfaces for Mongoose

interface ITier {
  label: string;
  price: string;
}

export interface IEvent {
  eventId: string;
  title: string;
  subTitle: string;
  hostId: string;
  category: string;
  subCategory: string;
  thumbnailUrl: string;
  datetime: Date;
  currency: string;
  description: string;
  venueId: string;
  lineup: string[];
  purchaseLimit: number;
  ticketTiers: ITier[];
  ticketsPurchased: number;
  ticketQuantity: number;
}

export interface IVenue {
  venueId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  parking: string[];
}

export interface IUser {
  userId: string;
  worldId: string;
  orders: string[];
}

interface ITicket {
  eventId: string;
  eventTitle: string;
  price: string;
  currency: string;
  label: string;
  unitAmount: number;
}

export interface IOrder {
  userId: string;
  isPaid: boolean;
  amount: number;
  totalPrice: Big;
  tickets: ITicket[];
  email: string;
  timestamp: Date;
}

export interface IHostProfile {
  hostId: string;
  name: string;
  biography: string;
  events: string[];
}

export interface IMedia {
  userId: string;
  eventId: string;
  type: string;
  url: string;
}

// Types

export type Event = IEvent;
export type Venue = IVenue;
export type Ticket = ITicket;
export type Tier = ITier;
export type HostProfile = IHostProfile;
export type Order = IOrder;
export type Media = IMedia;

type Category = {
  id: string;
  name: string;
};

export type SubCategory = Category;
export type MainCategory = Category & {
  subCategories: SubCategory[];
};

// export interface CartItem extends Event {
//   unitAmount: number;
// }

export enum Role {
  user = 'user',
  admin = 'admin',
  host = 'host',
}

export enum AlertStatus {
  Success = 'SUCCESS',
  Notif = 'NOTIF',
  Error = 'ERROR',
  None = 'NONE',
}
