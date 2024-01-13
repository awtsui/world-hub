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

// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://app.localhost:3000',
//   'http://hosts.localhost:3000',
// ];

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const hostname = request.headers.get('host')!;

  // Get the pathname of the request
  const path = `${pathname}${
    searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''
  }`;

  const token = await getToken({ req: request });

  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const appProtectedPaths = ['/checkout'];
    const matchesAppProtectedPath = appProtectedPaths.some((path) =>
      pathname.startsWith(path)
    );
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
    return NextResponse.rewrite(
      new URL(`/app${path === '/' ? '' : path}`, request.url)
    );
  }

  if (hostname == `hosts.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const hostsProtectedPaths = ['/dashboard'];
    const matchesHostsProtectedPath = hostsProtectedPaths.some((path) =>
      pathname.startsWith(path)
    );
    if (matchesHostsProtectedPath) {
      if (!token) {
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(url);
      }
    }
    const matchesAppAuthPath = pathname.startsWith('/auth');
    if (matchesAppAuthPath) {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    const matchesHostsLandingPath = pathname === '/';
    if (matchesHostsLandingPath) {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.rewrite(
      new URL(`/hosts${path === '/' ? '' : path}`, request.url)
    );
  }

  if (hostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(
      new URL(`/home${path === '/' ? '' : path}`, request.url)
    );
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
}
