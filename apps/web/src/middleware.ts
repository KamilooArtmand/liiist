import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fa', 'ar', 'ku'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for
  // - /api
  // - /_next
  // - /_vercel
  // - all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
