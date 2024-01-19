import { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server';

const allowedOrigins = ['http://localhost:3000'];

export function withCorsMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api')) {
      const { origin } = request.nextUrl;
      const res = await middleware(request, event);

      if (res) {
        if (allowedOrigins.includes(origin)) {
          res.headers.append('Access-Control-Allow-Origin', origin);
        }
        res.headers.append('Access-Control-Allow-Credentials', 'true');
        res.headers.append(
          'Access-Control-Allow-Methods',
          'GET,DELETE,PATCH,POST,PUT'
        );
        res.headers.append(
          'Access-Control-Allow-Headers',
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );
      }
      return res;
    }

    return middleware(request, event);
  };
}
