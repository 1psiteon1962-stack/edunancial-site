import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Prevent infinite middleware loops
  if (req.headers.get('x-edunancial-resolved')) {
    return res;
  }

  res.headers.set('x-edunancial-resolved', '1');
  return res;
}

export const config = {
  matcher: ['/((?!_next|api|assets|favicon.ico).*)'],
};
