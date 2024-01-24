import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse, NextMiddleware, NextFetchEvent } from 'next/server';

// Handles routing to app sub domain

export function withAppMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const hostname = request.headers.get('host')!;

    if (hostname == `app.${process.env.NEXT_PUBLIC_URL}`) {
      const { searchParams, pathname } = request.nextUrl;
      const path = `${pathname}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`;

      const token = await getToken({ req: request });

      const appProtectedPaths = ['/checkout'];
      const matchesAppProtectedPath = appProtectedPaths.some((path) => pathname.startsWith(path));
      if (matchesAppProtectedPath) {
        if (!token) {
          const url = new URL('/auth', request.url);
          url.searchParams.set('callbackUrl', path);
          return NextResponse.redirect(url);
        }
      }

      const matchesAppAuthPath = pathname.startsWith('/auth');

      if (matchesAppAuthPath) {
        if (token) {
          return NextResponse.redirect(new URL('/marketplace', request.url));
        }
      }

      if (pathname === '/') {
        return NextResponse.redirect(new URL('/marketplace', request.url));
      }

      return NextResponse.rewrite(new URL(`/app${path === '/' ? '' : path}`, request.url));
    }

    return middleware(request, event);
  };
}
