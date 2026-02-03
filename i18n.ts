import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = [
  "en",
  "ar",
  "ru",
  "es",
  "fr",
  "da",
  "pt",
  "it",
  "zh",
] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Get locale from cookie (no URL routing)
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  return locale && locales.includes(locale) ? locale : defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
