import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'fa', 'ar', 'ku'];

export default getRequestConfig(async (params: any) => {
  let locale = params.locale;
  if (!locale && params.requestLocale) {
    try {
      locale = await params.requestLocale;
    } catch (e) {
      locale = 'en';
    }
  }
  
  if (!locale || !locales.includes(locale)) {
    locale = 'en';
  }

  let messages = {};
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (err) {
    try {
      messages = (await import(`../messages/en.json`)).default;
    } catch {
      messages = {};
    }
  }

  return {
    locale,
    messages,
    getMessageFallback({ namespace, key, error }: any) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      if (error?.code === 'MISSING_MESSAGE') {
        return path;
      }
      return path;
    }
  };
});
