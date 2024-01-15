import { getToken } from 'next-auth/jwt';
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';

export function withHostsMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const hostname = request.headers.get('host')!;

    if (hostname == `hosts.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
      const { searchParams, pathname } = request.nextUrl;
      const path = `${pathname}${
        searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''
      }`;

      const token = await getToken({ req: request });

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

    return middleware(request, event);
  };
}
