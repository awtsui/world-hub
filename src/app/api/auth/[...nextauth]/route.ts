import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Role } from '@/lib/types';
import { signIn } from '@/lib/mongodb/utils/hosts';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET');
}

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
            provider: 'worldcoinguest',
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
      checks: ['none'],
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          provider: 'worldcoin',
          verification_level:
            profile['https://id.worldcoin.org/v1'].verification_level,
          role: Role.user,
        };
      },
    },
    CredentialsProvider({
      id: 'hostcredentials',
      name: 'HostCredentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const { host, error } = await signIn(credentials);

        if (error) return null;

        return host;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.provider = user.provider;
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
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else {
        // TODO: check if url is an allowed subdomain
        return url;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
