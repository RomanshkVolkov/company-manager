import type { NextAuthConfig, User } from 'next-auth';
import { UserSession } from './app/types/types';
import { pagePermissions } from './app/lib/consts';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isOnDashboard = pathname.startsWith('/dashboard');
      const isOnRoot = nextUrl.pathname === '/';

      const profile = (auth?.user?.profile?.slug || '') as any;
      const profileAuthorizations =
        pagePermissions[profile as keyof typeof pagePermissions];

      if (isOnDashboard) {
        if (isLoggedIn) {
          if (pathname === '/change-password') return true;
          if (pathname === '/dashboard') return true;

          /**
           * Check if the user is authorized to access the page
           * use the profileAuthorizations object to check if the user is authorized
           * \ RomanshkVolkov /
           * | pending | change static object to dynamic database definition
           */
          if (Array.isArray(profileAuthorizations)) {
            const isAuthorized = profileAuthorizations.find(
              (p) =>
                p.route === pathname || (pathname.startsWith(p.route) && p.w)
            );

            if (!isAuthorized) {
              return NextResponse.redirect(new URL('/dashboard', nextUrl), 308);
            } else return true;
          } else {
            return profileAuthorizations;
          }
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl), 308);
      } else if (isOnRoot) {
        return NextResponse.redirect(new URL('/login', nextUrl), 308);
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
