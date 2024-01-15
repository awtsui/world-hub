import { getToken } from 'next-auth/jwt';
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';

type ApiCall = [string, string[]];

const protectedApiPaths: ApiCall[] = [['/api/revalidate', ['GET']]];
const protectedHostApiPaths: ApiCall[] = [
  ['/api/events/create', ['POST']],
  ['/api/events', ['DELETE']],
  ['/api/hosts/profile', ['POST']],
  ['/api/upload', ['GET']],
];
const protectedUserApiPaths: ApiCall[] = [
  ['/api/stripe/sessions', ['GET', 'POST']],
  ['/api/users', ['POST']],
  ['/api/users/profile', ['GET']],
];

const protectedAdminApiPaths: ApiCall[] = [
  ['/api/tickets/generator', ['POST']],
];

const protectedOperatorApiPaths: ApiCall[] = [
  ['/api/tickets/validator', ['POST']],
];

function isProtected(
  path: string,
  method: string,
  protectedList: typeof protectedUserApiPaths
) {
  return protectedList.some(
    ([endpoint, calls]) => path.startsWith(endpoint) && calls.includes(method)
  );
}

// TODO: handle role based authentication and authorization when communicating with api

export function withAuthMiddleware(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api')) {
      const method = request.method;
      const token = await getToken({ req: request });

      // Requires caller to be authenticated
      if (isProtected(pathname, method, protectedApiPaths)) {
        if (!token) {
          return NextResponse.json(
            {
              message: 'Not authorized to make this call',
            },
            { status: 401 }
          );
        }
      }

      // Requires caller to possess host credentials
      if (isProtected(pathname, method, protectedHostApiPaths)) {
        if (!token || token.role !== 'host') {
          return NextResponse.json(
            {
              message: 'Not authorized to make this call',
            },
            { status: 401 }
          );
        }
      }

      // Requires caller to possess user credentials
      if (isProtected(pathname, method, protectedUserApiPaths)) {
        if (!token || token.role !== 'user') {
          return NextResponse.json(
            {
              message: 'Not authorized to make this call',
            },
            { status: 401 }
          );
        }
      }

      // Requires caller to possess admin credentials
      if (isProtected(pathname, method, protectedAdminApiPaths)) {
        // TODO: implement if admin portal is added
      }

      // Requires caller to possess operator credentials
      if (isProtected(pathname, method, protectedOperatorApiPaths)) {
        // TODO: implement if operator portal is added
      }

      return NextResponse.next();
    }

    return middleware(request, event);
  };
}
