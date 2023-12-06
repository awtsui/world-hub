import { DefaultSession, DefaultUser } from 'next-auth';

export enum Role {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
}

interface IUser extends DefaultUser {
  role?: Role;
  id: string;
  provider?: string;
}

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
