import { DefaultSession, DefaultUser } from 'next-auth';

enum Role {
  user = 'user',
  admin = 'admin',
}

interface IUser extends DefaultUser {
  role?: Role;
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
