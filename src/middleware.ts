import { chain } from './middlewares/chain';
import { withCorsMiddleware } from './middlewares/corsMiddleware';
import { withAppMiddleware } from './middlewares/appMiddleware';
import { withHostsMiddleware } from './middlewares/hostsMiddleware';
import { withAuthMiddleware } from './middlewares/authMiddleware';
import { withHomeMiddleware } from './middlewares/homeMiddleware';
import { withDefaultMiddleware } from './middlewares/defaultMiddleware';

/*
 * Match all paths except for:
 * 1. /_next (Next.js internals)
 * 2. /_static (inside /public)
 * 3. all root files inside /public (e.g. /favicon.ico)
 */

export const config = {
  matcher: ['/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
};

const middlewares = [
  withCorsMiddleware,
  withAuthMiddleware,
  withAppMiddleware,
  withHostsMiddleware,
  withHomeMiddleware,
  withDefaultMiddleware,
];

export default chain(middlewares);
