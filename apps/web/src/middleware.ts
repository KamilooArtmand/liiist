import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fa', 'ar', 'ku'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Forces strict language boundaries in URLs (e.g., /fa/settings)
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|fa|ar|ku)/:path*']
};
