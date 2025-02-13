import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({
  requestLocale
}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !['en', 'es', 'fr'].includes(locale)) {
    locale = 'en'; // defaultLocale
  }

  return {
    locale, // Explicitly return the locale
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'America/New_York'
  };
});