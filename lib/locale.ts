"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/i18n";

const COOKIE_NAME = "NEXT_LOCALE";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale);
}

export async function getLocale(): Promise<Locale | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value as Locale | undefined;
}
