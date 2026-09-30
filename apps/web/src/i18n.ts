import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fa', 'ar', 'ku'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    // STRICT CONSTRAINT: Throw error if translation is missing (no silent fallback)
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === 'MISSING_MESSAGE') {
        throw new Error(`[i18n] Missing translation key: ${path} for locale: ${locale}`);
      }

      return path;
    }
  };
});
