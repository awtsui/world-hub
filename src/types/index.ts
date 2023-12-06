export interface Event {
  eventId: number;
  eventName: string;
  profileId: string;
  category: string;
  subCategory: string;
  thumbnailUrl: string;
  eventDatetime: Date;
  price: string;
  description: string;
}

export type Category = {
  id: string;
  name: string;
};

export interface CartItem extends Event {
  unitAmount: number;
}

export enum Role {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
}

export enum AlertStatus {
  Success = 'SUCCESS',
  Notif = 'NOTIF',
  Error = 'ERROR',
  None = 'NONE',
}
