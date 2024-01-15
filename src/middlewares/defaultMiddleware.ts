import { getToken } from 'next-auth/jwt';
import {
  NextRequest,
  NextResponse,
  NextMiddleware,
  NextFetchEvent,
} from 'next/server';

// Note: Handles the default routing if no other middleware is triggered

export function withDefaultMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { searchParams, pathname } = request.nextUrl;
    const hostname = request.headers.get('host')!;
    const path = `${pathname}${
      searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ''
    }`;

    return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
  };
}
