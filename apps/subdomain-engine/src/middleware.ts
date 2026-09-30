import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. kid.liii.st, germany.liii.st, liii.st)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    .replace('localhost:3000', process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'liii.st');

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  // If we are on the main domain (liii.st or liiist.app), we don't rewrite.
  // The root domain might be handled by apps/web instead, but if it hits here:
  if (
    hostname === 'liii.st' ||
    hostname === 'liiist.app' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.next();
  }

  // Extract the subdomain (e.g. 'kid' from 'kid.liii.st')
  const subdomain = hostname.split('.')[0];

  // Rewrite to the dynamic route `/[subdomain]/[path]`
  // This allows the App Router to handle `app/[subdomain]/page.tsx`
  return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
}
