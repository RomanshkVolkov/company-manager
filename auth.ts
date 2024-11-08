import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { UserSession } from './app/types/types';
import { apiRequest } from './app/lib/server-functions';

async function externalSignIn(username: string, password: string) {
  try {
    const user = await apiRequest<UserSession>(
      '/auth/sign-in',
      'POST',
      undefined,
      {
        username,
        password,
      }
    );

    if (!user?.success) return null;
    return user.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string().min(3),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { username, password } = parsedCredentials.data;
        const authentication = await externalSignIn(username, password);

        if (!authentication) return null;

        return authentication as any as UserSession & User;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
  },
});
