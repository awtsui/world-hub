import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const hostname = request.headers.get('host')!;

  // Get the pathname of the request
  const path = `${pathname}${
    searchParams.toString().length > 0 ? `?${searchParams}` : ''
  }`;

  const protectedPaths = ['/checkout'];
  const matchesProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (matchesProtectedPath) {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'user') {
      const url = new URL('/auth', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  if (hostname == `app.localhost:3000`) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/marketplace', request.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${path === '/' ? '' : path}`, request.url)
    );
  }

  if (hostname === 'localhost:3000') {
    return NextResponse.rewrite(
      new URL(`/home${path === '/' ? '' : path}`, request.url)
    );
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
}
