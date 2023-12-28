import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Role } from '@/types';

// if (!process.env.NEXTAUTH_SECRET) {
//   throw new Error('Please provide process.env.NEXTAUTH_SECRET');
// }

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      name: 'anonymous',
      credentials: {},
      async authorize(credentials, req) {
        return createAnonymousUser();
      },
    }),
    {
      id: 'worldcoin',
      name: 'Worldcoin',
      type: 'oauth',
      wellKnown: 'https://id.worldcoin.org/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid' } },
      clientId: process.env.NEXT_PUBLIC_WLD_CLIENT_ID,
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
    async jwt({ token, trigger, user, session, account }) {
      if (trigger === 'update' && session.user) {
        // TODO:  Note, that `session` can be any arbitrary object, remember to validate it!
        token.role = session.user.role;
        token.id = session.user.id;
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session({ session, token }) {
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
    newUser: '/auth/newuser',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Helper functions

function createAnonymousUser() {
  return {
    id: 'test-id',
    name: 'test-id',
    provider: 'guest',
    role: Role.guest,
  };
}
