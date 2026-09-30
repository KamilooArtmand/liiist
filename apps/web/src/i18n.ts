import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fa', 'ar', 'ku'];

export default getRequestConfig(async (params: any) => {
  let locale = params.locale;
  if (!locale && params.requestLocale) {
    locale = await params.requestLocale;
  }
  
  if (!locale || !locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    getMessageFallback({ namespace, key, error }: any) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      if (error.code === 'MISSING_MESSAGE') {
        throw new Error(`[i18n] Missing translation key: ${path} for locale: ${locale}`);
      }
      return path;
    }
  };
});

