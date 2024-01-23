import { NextMiddleware, NextResponse } from 'next/server';

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export function chain(functions: MiddlewareFactory[], index = 0): NextMiddleware {
  const current = functions[index];

  if (!current) {
    return () => NextResponse.next();
  }

  const next = chain(functions, index + 1);
  return current(next);
}
