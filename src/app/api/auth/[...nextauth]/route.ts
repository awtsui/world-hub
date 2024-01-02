import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Role } from '@/types';

// if (!process.env.NEXTAUTH_SECRET) {
//   throw new Error('Please provide process.env.NEXTAUTH_SECRET');
// }

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      id: 'anonymous',
      name: 'Anonymous',
      credentials: {
        id: { label: 'ID', type: 'text' },
      },
      async authorize(credentials, req) {
        if (credentials?.id) {
          const user = {
            id: credentials.id,
            name: credentials.id,
            provider: 'worldcoin',
            role: Role.user,
          };
          return user;
        }
        return null;
      },
    }),
    {
      id: 'worldcoin',
      name: 'Worldcoin',
      type: 'oauth',
      wellKnown: 'https://id.worldcoin.org/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid' } },
      clientId: `app_${process.env.NEXT_PUBLIC_WLD_CLIENT_ID}`,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          provider: 'worldcoin',
          credentialType:
            profile['https://id.worldcoin.org/beta'].credential_type,
          role: Role.user,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
