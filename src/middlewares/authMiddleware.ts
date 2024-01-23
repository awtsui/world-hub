import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/lib/types';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';

// Endpoint, method, allowed roles
type EndpointCall = [string, string, ('operator' | 'host' | 'user' | 'admin' | '*')[]];

const protectedEndpoints: EndpointCall[] = [
  ['/api/revalidate', 'GET', ['*']],
  ['/api/events/create', 'POST', ['host']],
  ['/api/events', 'DELETE', ['host']],
  ['/api/hosts', 'GET', ['admin']],
  ['/api/hosts/profile', 'POST', ['host']],
  // ['/api/hosts/profile', 'GET', ['host', 'admin']],
  ['/api/venues', 'GET', ['user', 'host', 'admin']],
  ['/api/venues', 'POST', ['admin']],
  ['/api/users', 'POST', ['user']],
  ['/api/users', 'GET', ['admin']],
  ['/api/users/profile', 'GET', ['user', 'admin']],
  ['/api/orders', 'GET', ['user', 'admin']],
  ['/api/stripe/sessions', 'GET', ['user']],
  ['/api/stripe/sessions', 'POST', ['user']],
  ['/api/tickets/generator', 'POST', ['admin']],
  ['/api/tickets/validator', 'POST', ['operator']],
  ['/api/upload', 'GET', ['host']],
];

function isNotAllowedToCall(path: string, method: string, role?: Role) {
  return protectedEndpoints.some(([endpoint, endpointMethod, allowedRoles]) => {
    if (path === endpoint && endpointMethod === method) {
      if (!role) {
        return true;
      }

      if (!allowedRoles.includes('*') && !allowedRoles.includes(role)) {
        return true;
      }
    }
    return false;
  });
}

const allowedDomains = ['locahost:3000'];

// Handle role based authentication and authorization when communicating with api

export function withAuthMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api')) {
      const method = request.method;
      const token = await getToken({ req: request });
      if (isNotAllowedToCall(pathname, method, token?.role)) {
        return NextResponse.json(
          {
            message: 'Not authorized to make this call',
            role: token?.role,
          },
          { status: 401 },
        );
      }

      return NextResponse.next();
    }

    return middleware(request, event);
  };
}
