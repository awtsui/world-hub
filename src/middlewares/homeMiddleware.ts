import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';

// Handles routing to main domain

export function withHomeMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    let hostname = request.headers.get('host')!.replace('localhost:3000', `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    // special case for Vercel preview deployment URLs
    if (hostname.includes('---') && hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)) {
      hostname = `${hostname.split('---')[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
    }

    if (hostname === `${process.env.NEXT_PUBLIC_URL}`) {
      const { searchParams, pathname } = request.nextUrl;
      const path = `${pathname}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`;

      return NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, request.url));
    }

    return middleware(request, event);
  };
}
