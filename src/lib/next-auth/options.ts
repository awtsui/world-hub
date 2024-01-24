import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Role } from '@/lib/types';
import { signIn as signInAsHost } from '@/lib/mongodb/utils/hosts';
import { signUpIfNewUser } from '@/lib/mongodb/utils/users';
import { signIn as signInAsAdmin } from '@/lib/mongodb/utils/admins';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET');
}

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      id: 'worldcoinguest',
      name: 'Worldcoin Guest',
      credentials: {
        id: { label: 'ID', type: 'text' },
        verificationLevel: {
          label: 'Verification Level',
          type: 'text',
        },
      },
      async authorize(credentials, req) {
        if (credentials?.id && credentials?.verificationLevel) {
          // Check if user exists. If not, build new user and user profile documents
          const resp = await signUpIfNewUser(credentials.id);

          if (!resp.success) {
            console.error(resp.error);
            return null;
          }

          const user = {
            id: credentials.id,
            name: credentials.id,
            email: resp.email,
            provider: 'worldcoinguest',
            role: Role.user,
            isVerified: resp.isVerified,
            verificationLevel: credentials.verificationLevel,
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
          verificationLevel: profile['https://id.worldcoin.org/v1'].verification_level,
          role: Role.user,
        };
      },
    },
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const accountType = req.query?.['accountType'];

        if (!accountType) {
          throw Error('Include accountType in query when attempting to sign in');
        }

        let resp;
        if (accountType === 'host') {
          resp = await signInAsHost(credentials);
        } else if (accountType === 'admin') {
          resp = await signInAsAdmin(credentials);
        }

        if (!resp) {
          throw Error('Include valid account type when signing in');
        }

        if (!resp.success) {
          throw Error(resp.error);
        }

        return {
          id: resp.id,
          role: accountType,
          provider: 'credentials',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session.user.email) {
        token.email = session.user.email;
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.provider = user.provider;
        token.verificationLevel = user.verificationLevel;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.provider = token.provider;
        session.user.verificationLevel = token.verificationLevel;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url;
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
