import { getToken } from 'next-auth/jwt';
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';

// Handles routing to admin sub domain

export function withAdminMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const hostname = request.headers.get('host')!;

    if (hostname == `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
      const { searchParams, pathname } = request.nextUrl;
      const path = `${pathname}${
        searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''
      }`;

      const token = await getToken({ req: request });

      const protectedPaths = ['/dashboard'];
      const matchesProtectedPaths = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (matchesProtectedPaths) {
        if (!token) {
          const url = new URL('/auth/signin', request.url);
          url.searchParams.set('callbackUrl', path);
          return NextResponse.redirect(url);
        }
      }
      const matchesAuthPath = pathname.startsWith('/auth');
      if (matchesAuthPath) {
        if (token) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      const matchesHostsLandingPath = pathname === '/';
      if (matchesHostsLandingPath) {
        if (token) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('callbackUrl', '/dashboard');
        return NextResponse.redirect(url);
      }

      return NextResponse.rewrite(
        new URL(`/admin${path === '/' ? '' : path}`, request.url)
      );
    }

    return middleware(request, event);
  };
}
