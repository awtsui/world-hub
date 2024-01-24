import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';

// Handles routing to main domain

export function withHomeMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const hostname = request.headers.get('host')!;

    if (hostname === `${process.env.NEXT_PUBLIC_URL}`) {
      const { searchParams, pathname } = request.nextUrl;
      const path = `${pathname}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''}`;

      return NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, request.url));
    }

    return middleware(request, event);
  };
}
