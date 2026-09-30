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
  // Handle localhost port 3000 mapping for local development
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'liii.st'}`)
    .replace('localhost:3000', process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'liii.st');

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  // Base domain check
  const isMainDomain = 
    hostname === 'liii.st' ||
    hostname === 'liiist.app' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (isMainDomain) {
    return NextResponse.next();
  }

  // Extract the subdomain (e.g. 'kid' from 'kid.liii.st')
  const subdomain = hostname.split('.')[0];

  // Pass the extracted subdomain as a header so Server Components can easily access it
  // without parsing the URL multiple times.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-subdomain', subdomain);

  // Rewrite to the dynamic route `/[subdomain]/[path]` for App Router structural mapping
  return NextResponse.rewrite(
    new URL(`/${subdomain}${path}`, req.url),
    {
      request: {
        headers: requestHeaders,
      },
    }
  );
}
